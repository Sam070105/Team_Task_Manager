# Team Task Manager - Full Stack Application

A robust, full-stack project and task management system with a **React (TypeScript)** frontend and a **Python (FastAPI)** backend, connected to a **PostgreSQL** database.

## 📋 Project Structure

```
team-task-manager/
├── main.py                     # FastAPI application with all routes
├── models.py                   # SQLAlchemy database models
├── database.py                 # Database configuration
├── auth.py                     # JWT authentication & password hashing
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (DO NOT commit)
├── .env.example                # Example environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.tsx    # Login & Registration page
│   │   │   └── Dashboard.tsx   # Main dashboard with projects & tasks
│   │   ├── api.ts              # API client functions
│   │   ├── App.tsx             # Main app component
│   │   ├── index.tsx           # Entry point
│   │   └── index.css           # Global styling (Glassmorphism)
│   ├── public/                 # Static assets
│   ├── package.json            # npm dependencies
│   ├── .env                    # Frontend environment variables
│   └── tsconfig.json           # TypeScript configuration
│
└── README.md                   # This file
```

## 🚀 Key Features

- **Authentication**: Secure Signup/Login with JWT (HTTP-only cookies) and Bcrypt password hashing
- **Project Management**: Admins can create and delete project workspaces
- **Task Orchestration**: Admins can create, assign, and delete tasks with real-time status tracking
- **Role-Based Access Control (RBAC)**:
  - **Admins**: Full control over projects, users, and all team tasks (including OVERDUE status)
  - **Members**: Privacy-focused view restricted to their own assigned tasks
- **Beautiful UI**: Modern glassmorphism design with dark theme and smooth animations
- **Real-Time Updates**: Dashboard refreshes instantly after actions
- **Task Statistics**: See total, completed, pending, and overdue tasks at a glance

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19 (TypeScript) + Create React App |
| Styling    | Vanilla CSS (Glassmorphism + Dark Mode) |
| Backend    | Python + FastAPI (REST API)             |
| Database   | PostgreSQL + SQLAlchemy ORM             |
| Auth       | JWT (python-jose) + Bcrypt              |

## 📦 Prerequisites

- **Python 3.12+** (for backend)
- **Node.js 20.19+** (for frontend)
- **PostgreSQL 12+** (database)
- **npm or yarn** (package manager)

## 🔧 Installation & Setup

### 1. Backend Setup

```bash
cd team-task-manager

# Install Python dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your database credentials and JWT secret
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/task_manager
# JWT_SECRET=your_super_secret_key_change_this
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Start backend server
python -m uvicorn main:app --reload
```

**Backend API**: http://localhost:8000

**Interactive API Docs**: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd team-task-manager/frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm start
```

**Frontend**: http://localhost:3000

## 🔐 Environment Variables

### Backend `.env.example`
```env
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/task_manager
JWT_SECRET=supersecretpythonkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:8000
```

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |
| POST | `/api/auth/logout` | Logout and clear token | Yes |
| GET | `/api/auth/me` | Get current user info | Yes |

### Dashboard Endpoint

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/dashboard` | Get projects, tasks, and users | Yes |

### Project Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/projects` | Create project | Admin Only |
| DELETE | `/api/projects/{id}` | Delete project | Admin Only |

### Task Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/tasks` | Create and assign task | Admin Only |
| PATCH | `/api/tasks/{id}` | Update task status | Admin or Assignee |
| DELETE | `/api/tasks/{id}` | Delete task | Admin Only |

## 👥 User Roles & Permissions

### Admin User
- ✅ Create projects
- ✅ Delete projects
- ✅ Create tasks
- ✅ Assign tasks to team members
- ✅ Update any task status
- ✅ Delete tasks
- ✅ Mark tasks as OVERDUE
- ✅ View all tasks in the system
- ✅ View all team members

### Member User
- ✅ View assigned tasks
- ✅ Update their own task status (TODO → IN_PROGRESS → DONE)
- ✅ View project names
- ✅ See task statistics
- ❌ Cannot create/delete projects
- ❌ Cannot create/assign/delete tasks
- ❌ Cannot mark tasks as OVERDUE

## 🎯 Task Status Values

| Status | Description | Who Can Set |
|--------|-------------|-----------|
| TODO | Task not yet started | Admin, Assignee |
| IN_PROGRESS | Task is currently being worked on | Admin, Assignee |
| DONE | Task completed successfully | Admin, Assignee |
| OVERDUE | Task has missed deadline | Admin Only |

## 🚀 Running the Application

### Terminal Setup

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd team-task-manager
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd team-task-manager/frontend
npm start
```

Then open: http://localhost:3000

## 📝 Testing the Application

### 1. Create Account
- Go to http://localhost:3000
- Click "Sign up"
- Enter name, email, password
- Choose role: **ADMIN** or **MEMBER**
- Submit

### 2. Test as Admin
- Login with admin account
- **Create Project**: Enter project name → Click "Create Project"
- **Create Task**: 
  - Select project from dropdown
  - Select team member to assign
  - Enter task title
  - Click "Assign Task"
- **Manage Tasks**:
  - Change status from dropdown
  - Click "Delete" to remove task
  - Mark as OVERDUE (option only for admins)

### 3. Test as Member
- Create member account or use existing
- Login with member account
- View only your assigned tasks
- Update task status (cannot mark OVERDUE)

## 🔐 Security Features

- **JWT Tokens**: Stateless authentication with short-lived tokens
- **HTTP-Only Cookies**: Tokens stored securely, not accessible via JavaScript
- **Bcrypt Hashing**: Passwords hashed with strong salt (10 rounds)
- **CORS Configuration**: Restricted to localhost for development
- **Role-Based Authorization**: Backend enforces all permission checks
- **Secure Password Requirements**: Recommended strong passwords
- **Token Expiration**: Automatic logout after 24 hours (configurable)

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env is correct
# Create database if needed: createdb task_manager
```

**Module not found errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Dependencies installation failed:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Node version incompatibility:**
```bash
node --version  # Should be 20.19 or higher
npm install -g n  # Node version manager
n latest
```

**API connection refused:**
- Ensure backend is running: `http://localhost:8000/docs`
- Check `.env` has correct `REACT_APP_API_URL`
- Clear browser cache and restart frontend

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (String: ADMIN, MEMBER)
- `created_at` (DateTime)

### Projects Table
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text, Optional)
- `owner_id` (UUID, Foreign Key → Users)
- `created_at` (DateTime)

### Tasks Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text, Optional)
- `status` (String: TODO, IN_PROGRESS, DONE, OVERDUE)
- `due_date` (DateTime, Optional)
- `project_id` (UUID, Foreign Key → Projects)
- `assignee_id` (UUID, Foreign Key → Users)
- `created_at` (DateTime)

## 🎨 UI Design System

### Color Palette
- **Primary**: #8b5cf6 (Purple)
- **Secondary**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Orange)
- **Danger**: #f43f5e (Red)
- **Background**: Dark mesh gradient
- **Card**: Glassmorphism with blur effect

### Typography
- **Font Family**: Plus Jakarta Sans
- **Headings**: Bold (700 weight)
- **Body**: Regular (400 weight)
- **UI**: Medium (600 weight)

## 🚀 Deployment Guide

### Production Backend (Heroku, Railway, etc.)
```bash
# Use production ASGI server
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Production Frontend (Vercel, Netlify, etc.)
```bash
cd team-task-manager/frontend
npm run build
# Upload 'build' folder to hosting service
```

### Environment Variables (Production)
- Change `JWT_SECRET` to a strong random key
- Update `DATABASE_URL` to production database
- Set `REACT_APP_API_URL` to production backend URL
- Enable HTTPS only

## 📚 Additional Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - Feel free to use for learning and development.

## 🆘 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the API documentation at `/docs`
3. Check browser console for frontend errors
4. Verify database connectivity

---

**Happy Task Managing!** 🎉

Built with ❤️ using React, FastAPI, and PostgreSQL
