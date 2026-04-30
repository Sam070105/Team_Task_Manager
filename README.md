# Team Task Manager - Full Stack Application

> A modern full-stack project and task management system built with React, FastAPI, and PostgreSQL.

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.12+-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.19+-green)

## 📋 Quick Overview

**Team Task Manager** is a complete full-stack application for managing projects and tasks with role-based access control. Built with modern technologies:

- **Frontend**: React 19 with TypeScript and Create React App
- **Backend**: Python FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with HTTP-only cookies and Bcrypt hashing

## 🎯 Key Features

✨ **Authentication & Security**
- Secure user registration and login
- JWT token-based authentication
- Bcrypt password hashing
- HTTP-only cookie storage
- Token expiration management

👥 **Role-Based Access Control**
- **Admin**: Full system control (projects, tasks, users)
- **Member**: Limited access (assigned tasks only)

📊 **Project & Task Management**
- Create and manage projects
- Assign tasks to team members
- Track task status (TODO, IN_PROGRESS, DONE, OVERDUE)
- View task statistics and analytics

🎨 **Modern UI/UX**
- Beautiful glassmorphism design
- Dark theme with smooth animations
- Responsive layout
- Real-time updates

## 🚀 Quick Start

### 1️⃣ Prerequisites
```bash
✓ Python 3.12+
✓ Node.js 20.19+
✓ PostgreSQL 12+
```

### 2️⃣ Backend Setup
```bash
cd team-task-manager
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
python -m uvicorn main:app --reload
```

### 3️⃣ Frontend Setup
```bash
cd team-task-manager/frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

### 4️⃣ Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Project Structure

```
PROJECT/
├── team-task-manager/          # Main application
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Database models
│   ├── auth.py                 # Authentication utilities
│   ├── database.py             # Database configuration
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   ├── README.md               # Backend documentation
│   └── frontend/               # React application
│       ├── src/
│       │   ├── components/     # Page components
│       │   ├── api.ts          # API client
│       │   └── index.css       # Global styles
│       ├── package.json        # npm dependencies
│       ├── tsconfig.json       # TypeScript config
│       └── README.md           # Frontend documentation
├── GETTING_STARTED.md          # Quick setup guide
└── README.md                   # This file
```

## 📚 Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Step-by-step setup guide
- **[team-task-manager/README.md](team-task-manager/README.md)** - Complete backend & architecture docs
- **[team-task-manager/frontend/README.md](team-task-manager/frontend/README.md)** - Frontend documentation

## 🔧 Tech Stack

### Backend
- **Framework**: FastAPI (async Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Auth**: JWT (python-jose) + Bcrypt
- **Server**: Uvicorn

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build**: Create React App (Webpack)
- **Styling**: Vanilla CSS with Glassmorphism
- **HTTP**: Fetch API

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           React Frontend (Port 3000)            │
│  • Login/Registration Page                      │
│  • Dashboard (Projects & Tasks)                 │
│  • Statistics & Analytics                       │
└────────────────┬────────────────────────────────┘
                 │ REST API (JSON)
                 ↓ HTTP Requests with JWT
┌─────────────────────────────────────────────────┐
│        FastAPI Backend (Port 8000)              │
│  • Authentication Routes                        │
│  • Project Management                           │
│  • Task Management                              │
│  • Role-Based Authorization                     │
└────────────────┬────────────────────────────────┘
                 │ SQLAlchemy ORM
                 ↓
┌─────────────────────────────────────────────────┐
│    PostgreSQL Database (Port 5432)              │
│  • Users Table (with roles)                     │
│  • Projects Table                               │
│  • Tasks Table                                  │
└─────────────────────────────────────────────────┘
```

## 📖 API Endpoints

### Authentication
```
POST   /api/auth/register         - Create account
POST   /api/auth/login            - Login user
POST   /api/auth/logout           - Logout user
GET    /api/auth/me               - Get current user
```

### Dashboard
```
GET    /api/dashboard             - Get all projects, tasks, users
```

### Projects
```
POST   /api/projects              - Create project (Admin only)
DELETE /api/projects/{id}         - Delete project (Admin only)
```

### Tasks
```
POST   /api/tasks                 - Create task (Admin only)
PATCH  /api/tasks/{id}            - Update task status
DELETE /api/tasks/{id}            - Delete task (Admin only)
```

## 👤 User Roles

### Admin
- Create and delete projects
- Create tasks and assign to team members
- Update any task status
- Mark tasks as OVERDUE
- View all data

### Member
- View only assigned tasks
- Update assigned task status (not OVERDUE)
- View project names

## 🔐 Security Features

- **JWT Authentication**: Stateless, secure token-based auth
- **HTTP-Only Cookies**: Tokens inaccessible to JavaScript
- **Password Hashing**: Bcrypt with salt (10 rounds)
- **CORS Protection**: Restricted to configured origins
- **Role-Based Access**: Server-side authorization checks
- **Token Expiration**: Automatic logout after 24 hours

## 🧪 Testing the App

1. **Create Admin Account**
   - Email: admin@example.com
   - Password: SecurePass123
   - Role: Admin

2. **Create Member Account**
   - Email: member@example.com
   - Password: SecurePass123
   - Role: Member

3. **Test Admin Features**
   - Create project
   - Create task and assign to member

4. **Test Member Features**
   - Login as member
   - View assigned tasks
   - Update task status

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Ensure PostgreSQL is running
psql -U postgres -d postgres -c "SELECT version();"

# Create database if needed
createdb -U postgres task_manager
```

### Port Already in Use
```bash
# Backend (8000)
lsof -i :8000
kill -9 <PID>

# Frontend (3000)
lsof -i :3000
kill -9 <PID>
```

### Dependencies Issue
```bash
# Backend
pip install -r requirements.txt --force-reinstall

# Frontend
rm -rf node_modules package-lock.json
npm install
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for more troubleshooting.

## 🚀 Deployment

### Backend (e.g., Railway, Heroku)
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend (e.g., Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy 'build' folder
```

## 📊 Database Schema

**Users**
- id, name, email, password (hashed), role, created_at

**Projects**
- id, name, description, owner_id, created_at

**Tasks**
- id, title, description, status, due_date, project_id, assignee_id, created_at

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing`
5. Submit Pull Request

## 📄 License

MIT License - Feel free to use for learning and development.

See [LICENSE](LICENSE) file for details.

## 📞 Support

For help:
1. Check [GETTING_STARTED.md](GETTING_STARTED.md)
2. Review [team-task-manager/README.md](team-task-manager/README.md)
3. Check browser console for errors
4. Review FastAPI docs at http://localhost:8000/docs

## 🎓 Learning Resources

- [React 19 Docs](https://react.dev/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 📝 Changelog

### Version 1.0.0
- ✅ Full authentication system
- ✅ Project management (CRUD)
- ✅ Task management (CRUD)
- ✅ Role-based access control
- ✅ Beautiful React UI
- ✅ PostgreSQL backend
- ✅ Comprehensive documentation

---

<div align="center">

**Built with ❤️ using React, FastAPI, and PostgreSQL**

⭐ If you find this useful, please consider giving it a star!

</div>
