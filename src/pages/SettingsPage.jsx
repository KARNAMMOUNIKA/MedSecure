import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Settings, Shield, ToggleLeft, ToggleRight, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');

  // Privacy toggles
  const [shareQrActive, setShareQrActive] = useState(true);
  const [shareDonor, setShareDonor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }

    // In a mock setup, simulate change password success
    setPwSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // Delete account logic. Simply logout user to return to home
    logout();
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Identity Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage password parameters, emergency privacy rules, and data sharing controls.
          </p>
        </div>

        <div style={styles.grid}>
          {/* Left Column: Password & Privacy */}
          <div style={styles.leftCol}>
            {/* Password Change Card */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardTitle}>
                <Shield size={18} color="#0ea5e9" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Change Password
              </h3>
              
              {pwSuccess && (
                <div style={styles.successAlert}>
                  <CheckCircle size={16} />
                  <span>Password updated successfully!</span>
                </div>
              )}

              {pwError && (
                <div style={styles.errorAlert}>
                  <AlertTriangle size={16} />
                  <span>{pwError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} style={{ marginTop: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
              </form>
            </div>

            {/* Privacy Controls Card */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardTitle}>
                <Settings size={18} color="#10b981" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Privacy & Sharing
              </h3>
              <p style={{ ...styles.cardSubtitle, marginBottom: '1.5rem' }}>Determine what data is shared during an emergency scan</p>

              <div style={styles.toggleRow}>
                <div>
                  <strong style={styles.toggleLabel}>Emergency QR Scans Active</strong>
                  <p style={styles.toggleDesc}>Allows emergency personnel to read limited medical summary from QR scan.</p>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => setShareQrActive(!shareQrActive)}>
                  {shareQrActive ? <ToggleRight size={38} color="#0ea5e9" /> : <ToggleLeft size={38} color="var(--text-muted)" />}
                </div>
              </div>

              <div style={styles.toggleRow}>
                <div>
                  <strong style={styles.toggleLabel}>Show Organ Donor Status</strong>
                  <p style={styles.toggleDesc}>Exposes your donor status badge on the public responder dashboard.</p>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => setShareDonor(!shareDonor)}>
                  {shareDonor ? <ToggleRight size={38} color="#0ea5e9" /> : <ToggleLeft size={38} color="var(--text-muted)" />}
                </div>
              </div>

              <div style={styles.toggleRow}>
                <div>
                  <strong style={styles.toggleLabel}>Audit Email Alerts</strong>
                  <p style={styles.toggleDesc}>Receive an automatic notification when your medical QR code is accessed.</p>
                </div>
                <div style={{ cursor: 'pointer' }} onClick={() => setEmailAlerts(!emailAlerts)}>
                  {emailAlerts ? <ToggleRight size={38} color="#0ea5e9" /> : <ToggleLeft size={38} color="var(--text-muted)" />}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dangerous Operations */}
          <div style={styles.rightCol}>
            <div className="glass-card" style={{ ...styles.card, borderColor: 'rgba(239, 68, 68, 0.25)' }}>
              <h3 style={{ ...styles.cardTitle, color: '#ef4444' }}>
                <Trash2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Danger Zone
              </h3>
              <p style={styles.cardSubtitle}>Irreversible security operations</p>
              
              {!showDeleteConfirm ? (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Deactivating your medical identity will completely wipe your medical history, delete access logs, and render your emergency QR code invalid.
                  </p>
                  <button type="button" onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger" style={{ width: '100%' }}>
                    Deactivate Identity
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={16} color="#ef4444" /> Are you absolutely sure?
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                    This action is permanent and cannot be undone. All clinical record scores and audit history will be deleted.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={handleDeleteAccount} className="btn btn-danger" style={{ flex: 1, fontSize: '0.85rem', padding: '0.55rem' }}>
                      Yes, Deactivate
                    </button>
                    <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.55rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
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
    background: '#0a0f1d',
  },
  container: {
    padding: '3rem 2rem',
    maxWidth: '1080px',
  },
  header: {
    marginBottom: '2.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2.5rem',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    gridColumn: 'span 2',
    '@media (max-width: 991px)': {
      gridColumn: 'span 1',
    }
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    padding: '2rem',
  },
  cardTitle: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  cardSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
  },
  successAlert: {
    background: 'var(--color-success-glow)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--color-success)',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
  errorAlert: {
    background: 'var(--color-danger-glow)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--color-danger)',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    padding: '1.25rem 0',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: '0.95rem',
    display: 'block',
  },
  toggleDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
    marginTop: '0.15rem',
    maxWidth: '480px',
    lineHeight: '1.4',
  },
};

export default SettingsPage;
