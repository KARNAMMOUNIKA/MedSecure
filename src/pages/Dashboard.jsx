import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RiskMeter from '../components/RiskMeter';
import { AlertTriangle, QrCode, Phone, History, ArrowRight, UserPlus, Download, Printer } from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Medical Profile
        const profileRes = await fetch(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.profile);
        }

        // Fetch Scans
        const scansRes = await fetch(`${API_URL}/profile/scans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const scansData = await scansRes.json();
        if (scansData.success) {
          setScans(scansData.logs.slice(0, 4)); // Show latest 4 scans
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching dashboard telemetry.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0ea5e9', fontWeight: 'bold' }}>
          Decrypting Healthcare Records...
        </div>
        <Footer />
      </div>
    );
  }

  const emergencyUrl = `${window.location.origin}/emergency/${user?.qrToken}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(emergencyUrl)}&color=0a0f1d&bgcolor=ffffff`;

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        {/* Welcome Section */}
        <div style={styles.welcomeBanner}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '2rem' }}>Welcome, {user?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Identity status: <span style={{ color: '#10b981', fontWeight: '600' }}>Encrypted & Secured</span>
            </p>
          </div>
          {profile && (
            <Link to="/qr-code" className="btn btn-secondary" style={styles.quickQrBtn}>
              <QrCode size={18} /> View Emergency QR
            </Link>
          )}
        </div>

        {/* Profile incomplete Warning */}
        {!profile && (
          <div style={styles.warningBanner}>
            <AlertTriangle size={32} color="var(--color-warning)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Emergency Profile Incomplete</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                You have not configured your medical details yet. Responders will not be able to scan and read vital life-saving indicators.
              </p>
              <Link to="/profile" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <UserPlus size={16} /> Complete Medical Profile
              </Link>
            </div>
          </div>
        )}

        {profile && (
          <div className="dashboard-grid">
            {/* Column 1: Risk Level speed gauge */}
            <div className="glass-card" style={styles.card}>
              <RiskMeter score={profile.riskScore} />
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/risk-analysis" style={styles.learnMoreLink}>
                  Analyze Health Factors <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Column 2: QR Card */}
            <div className="glass-card" style={{ ...styles.card, ...styles.qrCard }}>
              <h3 style={styles.cardTitle}>Emergency QR Card</h3>
              <p style={styles.cardSubtitle}>Responders scan this to view medical status</p>
              
              <div style={styles.qrDisplay}>
                <img src={qrCodeImageUrl} alt="Emergency QR Code" style={styles.qrImage} />
              </div>

              <div style={styles.qrActions}>
                <a href={qrCodeImageUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={styles.qrActionBtn} download="medsecure_qr.png">
                  <Download size={16} /> Download
                </a>
                <Link to="/qr-code" className="btn btn-primary" style={styles.qrActionBtn}>
                  <Printer size={16} /> Print ID
                </Link>
              </div>
            </div>

            {/* Column 3: Quick Contacts */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardTitle}>Emergency Contacts</h3>
              <p style={styles.cardSubtitle}>Notified first in medical dispatch</p>
              
              <div style={styles.contactList}>
                {profile.emergencyContacts.map((c, i) => (
                  <div key={i} style={styles.contactItem}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{c.name}</strong>
                      <span style={styles.relationshipText}>{c.relationship}</span>
                    </div>
                    <a href={`tel:${c.phone}`} style={styles.callIconBtn}>
                      <Phone size={16} color="var(--color-primary)" />
                    </a>
                  </div>
                ))}
              </div>
              <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                Manage Contacts
              </Link>
            </div>
          </div>
        )}

        {/* Scan Log Telemetry */}
        {profile && (
          <div className="glass-card animate-fade-in" style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Recent Emergency Access Logs</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                  Real-time telemetry showing when and where your QR code was scanned
                </p>
              </div>
              <Link to="/history" style={styles.learnMoreLink}>
                View All Audits <History size={16} />
              </Link>
            </div>

            {scans.length === 0 ? (
              <div style={styles.emptyScans}>
                <History size={40} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No emergency scan records found. Your QR code is secure.</p>
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Time & Date</th>
                      <th>Location / Node</th>
                      <th>Risk Level Shown</th>
                      <th>Device IP Address</th>
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
  },
  welcomeBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
  },
  quickQrBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
  },
  warningBanner: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  card: {
    minHeight: '380px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  qrCard: {
    alignItems: 'center',
    textAlign: 'center',
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
    marginBottom: '1.5rem',
  },
  qrDisplay: {
    background: '#fff',
    padding: '0.75rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    margin: 'auto 0',
  },
  qrImage: {
    display: 'block',
    width: '150px',
    height: '150px',
  },
  qrActions: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    marginTop: 'auto',
  },
  qrActionBtn: {
    flex: 1,
    padding: '0.65rem 0.5rem',
    fontSize: '0.88rem',
  },
  learnMoreLink: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--color-primary)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: '1.5rem 0',
    width: '100%',
  },
  contactItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
  },
  relationshipText: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.15rem',
  },
  callIconBtn: {
    background: 'var(--color-primary-glow)',
    border: '1px solid rgba(14, 165, 233, 0.2)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCard: {
    marginTop: '3rem',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  emptyScans: {
    textAlign: 'center',
    padding: '3rem',
  },
};

export default Dashboard;
