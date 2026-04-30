import { useState } from 'react';
import { apiLogin, apiRegister } from '../api';

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await apiLogin(email, password);
        onLogin();
      } else {
        await apiRegister(name, email, password, role);
        setIsLogin(true);
        setError('');
        alert('Account created! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: '10vh' }}>
      <div className="card" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        {error && (
          <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="MEMBER">Member (Assigned Tasks)</option>
                <option value="ADMIN">Admin (Manage Projects)</option>
              </select>
            </div>
          )}
          <button className="btn" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--primary)', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
