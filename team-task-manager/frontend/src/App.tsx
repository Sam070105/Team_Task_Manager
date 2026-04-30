import { useEffect, useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { apiGetMe } from './api';
import './index.css';

interface User {
  id: string;
  name: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const me = await apiGetMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={checkAuth} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

export default App;
