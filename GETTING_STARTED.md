# 🚀 Getting Started Guide

Quick setup guide to get the Team Task Manager running on your machine.

## Prerequisites Check

Before starting, make sure you have:

```bash
# Check Python version (should be 3.12+)
python --version

# Check Node.js version (should be 20.19+)
node --version

# Check npm version
npm --version

# PostgreSQL should be installed and running
psql --version
```

## Step 1: Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database (in psql shell)
CREATE DATABASE task_manager;

# Exit psql
\q
```

Or using command line:
```bash
createdb -U postgres task_manager
```

## Step 2: Backend Setup

### Navigate to backend directory
```bash
cd team-task-manager
```

### Create virtual environment (optional but recommended)
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Configure environment
```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
# - DATABASE_URL: Update with your PostgreSQL credentials
# - JWT_SECRET: Keep it secure, change in production
# - ALGORITHM: Keep as HS256
# - ACCESS_TOKEN_EXPIRE_MINUTES: 1440 = 24 hours
```

Example `.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@127.0.0.1:5432/task_manager
JWT_SECRET=your_super_secret_key_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Start backend server
```bash
python -m uvicorn main:app --reload
```

✅ **Backend running at**: http://localhost:8000

📚 **API Documentation**: http://localhost:8000/docs

## Step 3: Frontend Setup

### In a new terminal window:
```bash
cd team-task-manager/frontend
```

### Install dependencies
```bash
npm install
```

### Configure environment
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env
```

### Start frontend server
```bash
npm start
```

✅ **Frontend running at**: http://localhost:3000

## Step 4: Test the Application

### Create First Account (Admin)
1. Open http://localhost:3000
2. Click "Sign up"
3. Enter:
   - **Name**: John Admin
   - **Email**: admin@example.com
   - **Password**: secure_password_123
   - **Role**: Admin
4. Click "Sign up"
5. Now login with this account

### Features to Test

**As Admin:**
- ✅ Create a project: "Q1 Tasks"
- ✅ Create another account as Member
- ✅ Create task and assign to member
- ✅ Update task status
- ✅ Delete task

**As Member:**
- ✅ View assigned tasks only
- ✅ Update own task status
- ✅ Cannot create projects (no button shows)
- ✅ Cannot delete tasks

## Troubleshooting

### Backend Won't Start

**Error: Database connection failed**
```bash
# Check PostgreSQL is running
# macOS
pg_isready -h localhost -p 5432

# Windows - verify PostgreSQL service is running
# Check Services app or run:
net start postgresql-x64-13  # or your version
```

**Error: Port 8000 already in use**
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>

# Or use different port
uvicorn main:app --reload --port 8001
```

**Error: Module not found**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Won't Start

**Error: npm dependencies issue**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: Node version incompatible**
```bash
node --version  # Check version, should be 20.19+
# Update Node.js from nodejs.org
```

**Error: Can't connect to backend**
```bash
# Verify backend is running at http://localhost:8000/docs
# Check .env has correct REACT_APP_API_URL
# Clear browser cache and restart frontend
```

### Can't Login

**Error: Invalid credentials**
- Verify email and password are correct
- Check database is running
- Check backend has no errors

**Error: Token expired**
- Logout and login again
- Token valid for 24 hours (configurable)

## Accessing the Application

### URLs

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | React app |
| **Backend API** | http://localhost:8000 | FastAPI server |
| **API Docs** | http://localhost:8000/docs | Interactive Swagger UI |
| **Alternative Docs** | http://localhost:8000/redoc | ReDoc documentation |

## File Locations

```
team-task-manager/
├── main.py              # Backend entry point
├── models.py            # Database models
├── auth.py              # Authentication logic
├── database.py          # Database config
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (⚠️ DO NOT commit)
├── .env.example         # Example env file
└── frontend/
    ├── package.json     # npm dependencies
    ├── .env             # Frontend env
    └── src/
        ├── App.tsx      # Main component
        ├── api.ts       # API functions
        └── components/  # Page components
```

## Next Steps

1. ✅ Complete setup
2. ✅ Test with sample accounts
3. 📖 Read full [README.md](README.md)
4. 🔐 Change JWT_SECRET in production
5. 🗄️ Set up your PostgreSQL backup
6. 🚀 Deploy to production

## Common Commands

```bash
# Backend
cd team-task-manager
python -m uvicorn main:app --reload

# Frontend (new terminal)
cd team-task-manager/frontend
npm start

# Stop servers
Ctrl + C  # in each terminal
```

## Environment Checklist

- [ ] Python 3.12+ installed
- [ ] Node.js 20.19+ installed
- [ ] PostgreSQL installed and running
- [ ] Database `task_manager` created
- [ ] `.env` file configured
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server running (`python -m uvicorn main:app --reload`)
- [ ] Frontend server running (`npm start`)
- [ ] Can access http://localhost:3000

## Need Help?

1. Check the full [README.md](README.md)
2. Review [Troubleshooting section](README.md#-troubleshooting)
3. Check terminal output for error messages
4. Verify all prerequisites are installed

---

**Happy coding!** 🎉
