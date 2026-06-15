import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Users, Activity, History, Search, Lock, Unlock, AlertOctagon } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'scans' | 'security'
  const [stats, setStats] = useState({ totalUsers: 0, totalScans: 0, activeEmergencies: 0, criticalCases: 0 });
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [userQuery, setUserQuery] = useState('');

  // Fetch all admin telemetry
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Stats
      const statsRes = await fetch(`${API_URL}/admin/analytics`, { headers });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // 2. Fetch Users
      const usersRes = await fetch(`${API_URL}/admin/users`, { headers });
      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.users);

      // 3. Fetch Scans
      const scansRes = await fetch(`${API_URL}/admin/scan-logs`, { headers });
      const scansData = await scansRes.json();
      if (scansData.success) setScans(scansData.logs);

      // 4. Fetch Security Logs
      const logsRes = await fetch(`${API_URL}/admin/security-logs`, { headers });
      const logsData = await logsRes.json();
      if (logsData.success) setSecurityLogs(logsData.logs);

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch administrator dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Toggle user suspension
  const handleToggleSuspend = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error updating suspension status');
      }

      // Refresh data
      await fetchAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0ea5e9', fontWeight: 'bold' }}>
          Initializing Admin Dashboard...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Administration Console</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Monitor medical QR analytics, manage active patient registrations, and review safety audit history logs.
          </p>
        </div>

        {errorMsg && (
          <div className="glass-card" style={{ padding: '1rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: '2rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Analytics Grid Counters */}
        <div style={styles.statsGrid}>
          <div className="glass-card" style={styles.statCard}>
            <Users size={28} color="#0ea5e9" />
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Total Patients</span>
              <strong style={styles.statNumber}>{stats.totalUsers}</strong>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <Activity size={28} color="#10b981" />
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>QR Scans Logged</span>
              <strong style={styles.statNumber}>{stats.totalScans}</strong>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <AlertOctagon size={28} color="#ef4444" style={{ animation: stats.criticalCases > 0 ? 'pulseGlow 2s infinite' : 'none', borderRadius: '50%' }} />
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Critical Severity Cases</span>
              <strong style={{ ...styles.statNumber, color: stats.criticalCases > 0 ? '#ef4444' : '#fff' }}>{stats.criticalCases}</strong>
            </div>
          </div>

          <div className="glass-card" style={styles.statCard}>
            <History size={28} color="#f59e0b" />
            <div style={styles.statInfo}>
              <span style={styles.statLabel}>Active Emergencies (24H)</span>
              <strong style={styles.statNumber}>{stats.activeEmergencies}</strong>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tabs-header" style={{ marginTop: '3rem' }}>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Patient Management
          </button>
          <button className={`tab-btn ${activeTab === 'scans' ? 'active' : ''}`} onClick={() => setActiveTab('scans')}>
            <Activity size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> QR Scan Logs
          </button>
          <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Shield size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> System Security Audits
          </button>
        </div>

        {/* TAB 1: User Management */}
        {activeTab === 'users' && (
          <div className="glass-card animate-fade-in" style={styles.tabContent}>
            <div style={styles.searchBarWrapper}>
              <Search size={18} color="var(--text-muted)" style={styles.searchIcon} />
              <input
                type="text"
                className="form-input"
                placeholder="Search patients by name, email, or telephone..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {filteredUsers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No patient accounts found matching your query.</p>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Email Details</th>
                      <th>Telephone</th>
                      <th>Risk Level</th>
                      <th>Created Date</th>
                      <th>Status</th>
                      <th>Administrative Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: '600', color: '#fff' }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <span className={`badge badge-${u.riskScore.toLowerCase().replace(' ', '-')}`}>
                            {u.riskScore}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u.isSuspended ? (
                            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.82rem' }}>SUSPENDED</span>
                          ) : (
                            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.82rem' }}>ACTIVE</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleSuspend(u._id)}
                            className="btn btn-secondary"
                            style={{
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.78rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              borderColor: u.isSuspended ? '#10b981' : '#ef4444',
                              color: u.isSuspended ? '#10b981' : '#ef4444',
                            }}
                          >
                            {u.isSuspended ? (
                              <><Unlock size={12} /> Activate Profile</>
                            ) : (
                              <><Lock size={12} /> Suspend Profile</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Scan Logs */}
        {activeTab === 'scans' && (
          <div className="glass-card animate-fade-in" style={styles.tabContent}>
            {scans.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No emergency QR scans logged in the system.</p>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Scanned Patient</th>
                      <th>Patient Email</th>
                      <th>Scanner Node</th>
                      <th>IP Address</th>
                      <th>Risk Level Shown</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((s, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: '500' }}>{new Date(s.scanTime).toLocaleString()}</td>
                        <td style={{ fontWeight: '600', color: '#fff' }}>{s.user?.name || 'Deleted Patient'}</td>
                        <td>{s.user?.email || 'N/A'}</td>
                        <td>{s.location}</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                        <td>
                          <span className={`badge badge-${s.riskLevelViewed.toLowerCase()}`}>
                            {s.riskLevelViewed}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Security Audits */}
        {activeTab === 'security' && (
          <div className="glass-card animate-fade-in" style={styles.tabContent}>
            {securityLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No safety security audits logged.</p>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Time & Date</th>
                      <th>Trigger User</th>
                      <th>Action Type</th>
                      <th>Safety Audit Details</th>
                      <th>IP Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityLogs.map((l, idx) => (
                      <tr key={idx}>
                        <td>{new Date(l.timestamp).toLocaleString()}</td>
                        <td style={{ fontWeight: '500', color: '#fff' }}>{l.user ? l.user.email : 'System/Guest'}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: l.action.includes('FAILURE') || l.action.includes('SUSPENDED') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: l.action.includes('FAILURE') || l.action.includes('SUSPENDED') ? '#ef4444' : '#10b981',
                              border: l.action.includes('FAILURE') || l.action.includes('SUSPENDED') ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)',
                              fontSize: '0.68rem',
                            }}
                          >
                            {l.action}
                          </span>
                        </td>
                        <td>{l.details}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{l.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#0a0f1d',
  },
  container: {
    padding: '3rem 2rem',
    maxWidth: '1200px',
  },
  header: {
    marginBottom: '2.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.5rem 1.75rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.2',
    marginTop: '0.15rem',
  },
  tabContent: {
    padding: '2rem',
    minHeight: '450px',
  },
  searchBarWrapper: {
    position: 'relative',
    marginBottom: '2.0rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

export default AdminDashboard;
