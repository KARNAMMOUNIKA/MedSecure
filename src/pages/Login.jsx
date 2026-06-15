import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);

    if (res.success) {
      // Check role to route properly
      const storedUser = JSON.parse(localStorage.getItem('medsecure_user'));
      if (storedUser && storedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div className="glass-card animate-fade-in" style={styles.loginCard}>
          <div style={styles.brandTitle}>
            <Shield size={36} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ color: '#fff' }}>Secure Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Access your encrypted emergency profile</p>
          </div>

          {errorMsg && (
            <div style={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
              </div>
              <input
                type="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={styles.rememberBlock}>
              <label style={styles.checkLabel}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Decrypting Session...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.footerLink}>
            <span style={{ color: 'var(--text-secondary)' }}>Don't have an identity yet?</span>{' '}
            <Link to="/register">Create one here</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'radial-gradient(circle at center, #111a30 0%, #0a0f1d 100%)',
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 1.5rem',
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem',
  },
  brandTitle: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  errorAlert: {
    background: 'var(--color-danger-glow)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--color-danger)',
    padding: '0.75rem 1.0rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.88rem',
  },
  rememberBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  checkbox: {
    accentColor: 'var(--color-primary)',
  },
  footerLink: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.9rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1.5rem',
  },
};

export default Login;
