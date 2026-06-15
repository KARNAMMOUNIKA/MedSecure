import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const res = await register(name, email, phone, password);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div className="glass-card animate-fade-in" style={styles.registerCard}>
          <div style={styles.brandTitle}>
            <Shield size={36} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ color: '#fff' }}>Register Medical ID</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create your digital medical identity</p>
          </div>

          {errorMsg && (
            <div style={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password (Min 6 chars)</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Initializing Encrypted Profile...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.footerLink}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have a medical key?</span>{' '}
            <Link to="/login">Sign In</Link>
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
  registerCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '2.5rem',
  },
  brandTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
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
  footerLink: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.9rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1.5rem',
  },
};

export default Register;
