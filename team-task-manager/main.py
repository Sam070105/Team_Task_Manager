from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from database import engine, get_db
from auth import get_password_hash, verify_password, create_access_token, get_current_user

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "MEMBER"

class UserLogin(BaseModel):
    email: str
    password: str

class ProjectCreate(BaseModel):
    name: str

class TaskCreate(BaseModel):
    title: str
    project_id: str
    assignee_id: str
    task_status: str = "TODO"

class TaskUpdate(BaseModel):
    task_status: str

# --- Auth Routes ---
@app.post("/api/auth/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_data.password)
    new_user = models.User(name=user_data.name, email=user_data.email, password=hashed_pw, role=user_data.role)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/api/auth/login")
async def login(response: Response, user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"user_id": user.id, "role": user.role})
    response.set_cookie(key="token", value=access_token, httponly=True, samesite="lax")
    return {"message": "Login successful", "user": {"id": user.id, "name": user.name, "role": user.role}}

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}

@app.get("/api/auth/me")
async def get_me(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    current_user_obj = db.query(models.User).filter(models.User.id == user["user_id"]).first()
    if not current_user_obj:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": current_user_obj.id, "name": current_user_obj.name, "role": current_user_obj.role}

# --- Dashboard Routes ---
@app.get("/api/dashboard")
async def get_dashboard(user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    projects = db.query(models.Project).all()
    all_users = db.query(models.User).all()
    
    if user["role"] == "ADMIN":
        tasks = db.query(models.Task).order_by(models.Task.created_at.desc()).all()
    else:
        tasks = db.query(models.Task).filter(models.Task.assignee_id == user["user_id"]).order_by(models.Task.created_at.desc()).all()
    
    # Format data for JSON
    projects_data = [{"id": p.id, "name": p.name} for p in projects]
    users_data = [{"id": u.id, "name": u.name, "role": u.role} for u in all_users]
    tasks_data = [{
        "id": t.id, 
        "title": t.title, 
        "status": t.status, 
        "project": {"name": t.project.name if t.project else "Unknown"},
        "assignee": {"name": t.assignee.name if t.assignee else "Unassigned"}
    } for t in tasks]

    return {
        "projects": projects_data,
        "tasks": tasks_data,
        "users": users_data
    }

# --- Project Routes ---
@app.post("/api/projects")
async def create_project(project_data: ProjectCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user or user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admins only")
    
    new_project = models.Project(name=project_data.name, owner_id=user["user_id"])
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return {"id": new_project.id, "name": new_project.name}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user or user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admins only")
    
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

# --- Task Routes ---
@app.post("/api/tasks")
async def create_task(task_data: TaskCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user or user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admins only")
    
    new_task = models.Task(
        title=task_data.title,
        project_id=task_data.project_id,
        assignee_id=task_data.assignee_id,
        status=task_data.task_status
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {"id": new_task.id, "title": new_task.title}

@app.patch("/api/tasks/{task_id}")
async def update_task_status(task_id: str, task_update: TaskUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Admin can update any task, Member can only update their own
    if user["role"] != "ADMIN" and task.assignee_id != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
        
    task.status = task_update.task_status
    db.commit()
    db.refresh(task)
    return {"id": task.id, "status": task.status}

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not user or user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admins only")
    
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
