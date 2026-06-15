import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, AlertCircle, CheckCircle, Mail, Key } from 'lucide-react';
import { API_URL } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1 = request, 2 = reset
  const [mockOtp, setMockOtp] = useState(''); // Holds OTP for testing demonstration
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error requesting reset code');
      }

      setMockOtp(data.otp); // Store mocked OTP to present on screen
      setSuccessMsg('OTP generated successfully. Enter the code shown in the simulator banner below.');
      setStep(2);
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error resetting password');
      }

      setSuccessMsg('Password has been successfully updated.');
      setStep(3); // Reset complete
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div className="glass-card animate-fade-in" style={styles.card}>
          <div style={styles.brandTitle}>
            <Shield size={36} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
            <h2 style={{ color: '#fff' }}>Identity Recovery</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Restore access to your secure medical profile</p>
          </div>

          {errorMsg && (
            <div style={styles.errorAlert}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={styles.successAlert}>
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Registered Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Requesting Code...' : 'Send Recovery OTP'}
              </button>
            </form>
          )}

          {/* Step 2: Input OTP & Reset Password */}
          {step === 2 && (
            <>
              {mockOtp && (
                <div style={styles.mockMailBanner}>
                  <Mail size={16} color="#0ea5e9" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>[Mock Email Service Delivery]</span>
                    <strong style={{ color: '#0ea5e9' }}>Reset OTP Code: {mockOtp}</strong>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleResetPassword} style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Recovery OTP Code</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">New Password (Min 6 chars)</label>
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
                  <label className="form-label">Confirm New Password</label>
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
                  {loading ? 'Overwriting Credentials...' : 'Save New Password'}
                </button>
              </form>
            </>
          )}

          {/* Step 3: Success Completed */}
          {step === 3 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your credentials have been successfully updated. You can now sign in using your new password.</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Proceed to Login</Link>
            </div>
          )}

          <div style={styles.footerLink}>
            <Link to="/login">Back to Sign In</Link>
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
  card: {
    width: '100%',
    maxWidth: '430px',
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
    marginBottom: '1rem',
  },
  successAlert: {
    background: 'var(--color-success-glow)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--color-success)',
    padding: '0.75rem 1.0rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.88rem',
    marginBottom: '1rem',
  },
  mockMailBanner: {
    background: 'rgba(14, 165, 233, 0.05)',
    border: '1px dashed rgba(14, 165, 233, 0.3)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  footerLink: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.9rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1.5rem',
  },
};

export default ForgotPassword;
