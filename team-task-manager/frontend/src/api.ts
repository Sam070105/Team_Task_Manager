const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function apiRegister(name: string, email: string, password: string, role: string) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function apiLogout() {
  await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
}

export async function apiGetMe() {
  const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function apiGetDashboard() {
  const res = await fetch(`${API}/api/dashboard`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

export async function apiCreateProject(name: string) {
  const res = await fetch(`${API}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function apiDeleteProject(id: string) {
  await fetch(`${API}/api/projects/${id}`, { method: 'DELETE', credentials: 'include' });
}

export async function apiCreateTask(title: string, project_id: string, assignee_id: string, task_status: string) {
  const res = await fetch(`${API}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, project_id, assignee_id, task_status }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function apiUpdateTask(id: string, task_status: string) {
  const res = await fetch(`${API}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ task_status }),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function apiDeleteTask(id: string) {
  await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
}
