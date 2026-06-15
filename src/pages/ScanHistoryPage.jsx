import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { History, Eye, ShieldAlert } from 'lucide-react';

const ScanHistoryPage = () => {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScanLogs = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/scans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setScans(data.logs);
        }
      } catch (err) {
        console.error(err);
        setError('Could not decrypt audit records.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchScanLogs();
    }
  }, [token]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0ea5e9', fontWeight: 'bold' }}>
          Decrypting Security Audit Logs...
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
          <h1 className="title-gradient" style={{ fontSize: '2rem' }}>QR Security Audit History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            A complete historical audit trail logging every scan of your emergency medical identity.
          </p>
        </div>

        {error && (
          <div className="glass-card" style={{ padding: '1rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <div className="glass-card">
          <div style={styles.cardHeader}>
            <History size={20} color="#0ea5e9" />
            <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>Emergency Scan Audits</h3>
            <span style={styles.recordCount}>{scans.length} Scan{scans.length !== 1 ? 's' : ''} Logged</span>
          </div>

          {scans.length === 0 ? (
            <div style={styles.emptyLogs}>
              <Eye size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#fff', marginBottom: '0.25rem' }}>Zero QR Activity</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Your emergency QR code has not been scanned. All data remains sealed.
              </p>
            </div>
          ) : (
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Time & Date</th>
                    <th>Emergency Scanner Node</th>
                    <th>Risk Level Shown</th>
                    <th>IP Address</th>
                    <th>Accessing Device Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '500' }}>{new Date(s.scanTime).toLocaleString()}</td>
                      <td>{s.location}</td>
                      <td>
                        <span className={`badge badge-${s.riskLevelViewed.toLowerCase()}`}>
                          {s.riskLevelViewed}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{s.ipAddress}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.userAgent}>
                        {s.userAgent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  loadingContainer: {
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  recordCount: {
    marginLeft: 'auto',
    background: 'rgba(14, 165, 233, 0.1)',
    color: '#0ea5e9',
    fontSize: '0.78rem',
    fontWeight: '700',
    padding: '0.3rem 0.75rem',
    borderRadius: '9999px',
  },
  emptyLogs: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
};

export default ScanHistoryPage;
