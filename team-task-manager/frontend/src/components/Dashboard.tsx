import { useEffect, useState } from 'react';
import {
  apiGetDashboard,
  apiCreateProject,
  apiDeleteProject,
  apiCreateTask,
  apiUpdateTask,
  apiDeleteTask,
  apiLogout,
} from '../api';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  project: { name: string };
  assignee: { name: string };
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form state
  const [projectName, setProjectName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskStatus, setTaskStatus] = useState('TODO');

  const loadData = async () => {
    try {
      const data = await apiGetDashboard();
      setProjects(data.projects);
      setTasks(data.tasks);
      setUsers(data.users);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await apiLogout();
    onLogout();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    await apiCreateProject(projectName);
    setProjectName('');
    loadData();
  };

  const handleDeleteProject = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this project and all its tasks?')) return;
    await apiDeleteProject(id);
    loadData();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskProject || !taskAssignee) return;
    await apiCreateTask(taskTitle, taskProject, taskAssignee, taskStatus);
    setTaskTitle('');
    setTaskProject('');
    setTaskAssignee('');
    setTaskStatus('TODO');
    loadData();
  };

  const handleUpdateTask = async (id: string, newStatus: string) => {
    await apiUpdateTask(id, newStatus);
    loadData();
  };

  const handleDeleteTask = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this task?')) return;
    await apiDeleteTask(id);
    loadData();
  };

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
  const overdueTasks = tasks.filter(t => t.status === 'OVERDUE').length;

  const statusColor = (s: string) => {
    switch (s) {
      case 'DONE': return 'var(--success)';
      case 'IN_PROGRESS': return 'var(--warning)';
      case 'OVERDUE': return 'var(--danger)';
      default: return 'var(--border)';
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', animation: 'fadeInUp 0.4s ease-out' }}>
        <div>
          <h2>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name} ({user.role})</p>
        </div>
        <button className="btn" onClick={handleLogout} style={{ background: 'var(--danger)' }}>Logout</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem', animation: 'fadeInUp 0.5s ease-out' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Tasks</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalTasks}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{completedTasks}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pending</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{pendingTasks}</div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Overdue</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{overdueTasks}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', animation: 'fadeInUp 0.6s ease-out' }}>
        {/* Projects Section */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>Projects</h3>
            {projects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No projects yet.</p>
            ) : (
              <ul style={{ paddingLeft: 0 }}>
                {projects.map(p => (
                  <li key={p.id} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{p.name}</strong>
                    {user.role === 'ADMIN' && (
                      <span onClick={() => handleDeleteProject(p.id)} style={{ color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Delete
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {user.role === 'ADMIN' && (
            <div className="card">
              <h3>Create Project</h3>
              <form onSubmit={handleCreateProject}>
                <input className="input" placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} required />
                <button className="btn" type="submit">Create Project</button>
              </form>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>{user.role === 'ADMIN' ? 'All Tasks' : 'Your Tasks'}</h3>
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No tasks found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.map(t => (
                  <div key={t.id} className="card" style={{ padding: '1rem', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{t.title}</strong>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ background: statusColor(t.status), padding: '2px 8px', borderRadius: 12, fontSize: '0.8rem' }}>
                          {t.status}
                        </span>
                        {user.role === 'ADMIN' && (
                          <span onClick={() => handleDeleteTask(t.id)} style={{ color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}>
                            Delete
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                      Project: {t.project.name} | Assigned to: {t.assignee.name}
                    </p>
                    <select
                      className="input"
                      style={{ marginBottom: 0, padding: '0.3rem' }}
                      value={t.status}
                      onChange={e => handleUpdateTask(t.id, e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                      {user.role === 'ADMIN' && <option value="OVERDUE">OVERDUE</option>}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user.role === 'ADMIN' && projects.length > 0 && (
            <div className="card">
              <h3>Assign New Task</h3>
              <form onSubmit={handleCreateTask}>
                <input className="input" placeholder="Task Title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
                <select className="input" value={taskProject} onChange={e => setTaskProject(e.target.value)} required>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select className="input" value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} required>
                  <option value="">Assign to User</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
                <select className="input" value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
                <button className="btn" type="submit">Assign Task</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
