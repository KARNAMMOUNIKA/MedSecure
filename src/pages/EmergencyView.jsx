import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, Phone, Activity, Heart, User, Check, AlertTriangle, AlertOctagon } from 'lucide-react';
import { API_URL } from '../context/AuthContext';

const EmergencyView = () => {
  const { qrToken } = useParams();
  const [agreed, setAgreed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch emergency summary after agreement
  useEffect(() => {
    if (agreed && qrToken) {
      setLoading(true);
      setError('');
      
      fetch(`${API_URL}/profile/emergency/${qrToken}`)
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.message || 'Verification failure');
            });
          }
          return res.json();
        })
        .then((resData) => {
          setData(resData.emergencyData);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || 'Deactivated or suspended medical identity.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [agreed, qrToken]);

  // Render Verification Agreement Check Screen
  if (!agreed) {
    return (
      <div style={styles.agreementPage}>
        <div className="glass-card animate-fade-in" style={styles.agreementCard}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <AlertOctagon size={48} color="#ef4444" style={{ animation: 'pulseGlow 2s infinite', borderRadius: '50%' }} />
            <h2 style={{ color: '#fff', marginTop: '1rem', fontSize: '1.4rem' }}>Critical Medical Portal</h2>
            <span className="badge badge-critical" style={{ marginTop: '0.25rem' }}>Authorized Access Required</span>
          </div>

          <p style={styles.warnText}>
            You are attempting to access a secured patient medical history under the MedSecure Emergency Dispatch protocol.
          </p>

          <div style={styles.telemetryBox}>
            <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
              🔒 Security Telemetry Active:
            </strong>
            <ul style={styles.telemetryList}>
              <li>Your device IP Address and browser headers will be recorded.</li>
              <li>A real-time notification will be pushed to the patient's safety settings.</li>
              <li>All scans are legally audited to prevent unauthorized profile snooping.</li>
            </ul>
          </div>

          <button onClick={() => setAgreed(true)} className="btn btn-danger" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}>
            AGREE & DECRYPT PROFILE
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              MedSecure Incident Response & HIPAA Audit Policy
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <Activity size={40} color="#ef4444" style={{ animation: 'rotate 1.5s linear infinite' }} />
        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem' }}>
          DECRYPTING EMERGENCY DATA...
        </span>
      </div>
    );
  }

  // Error / Invalid Code Screen
  if (error) {
    return (
      <div style={styles.loadingPage}>
        <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: '#fff', fontSize: '1.3rem' }}>Access Denied</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', textAlign: 'center', maxWidth: '380px', padding: '0 1rem' }}>
          {error}
        </p>
      </div>
    );
  }

  // Main Emergency Data View
  return (
    <div style={styles.emergencyPage}>
      <div className="container" style={styles.container}>
        {/* Urgent Header Fold */}
        <div style={styles.alertHeader}>
          <div style={styles.headerBranding}>
            <AlertOctagon size={32} color="#fff" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>EMERGENCY MEDICAL ID</h1>
          </div>
          <span style={styles.headerTimestamp}>Scanned: {new Date().toLocaleTimeString()}</span>
        </div>

        {data && (
          <div style={styles.infoGrid}>
            {/* Left Box: Name, Blood, Severity */}
            <div className="glass-card" style={{ ...styles.card, borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={styles.patientName}>{data.name}</h2>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <span className={`badge badge-${data.riskScore.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                    Triage: {data.riskScore}
                  </span>
                  {data.organDonorStatus === 'Yes' && (
                    <span className="badge badge-normal" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                      ORGAN DONOR
                    </span>
                  )}
                </div>
              </div>

              {/* Blood group indicator */}
              <div style={styles.bloodIndicator}>
                <span style={styles.bloodLabel}>BLOOD GROUP</span>
                <div style={styles.bloodCircle}>{data.bloodGroup}</div>
              </div>
            </div>

            {/* Right Box: Allergies, Illnesses, Meds */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.sectionTitle}>
                <ShieldAlert size={20} color="#ef4444" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Allergies
              </h3>
              <div style={styles.bulletList}>
                {data.allergies.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No allergies reported.</p>
                ) : (
                  data.allergies.map((a, i) => (
                    <div key={i} style={styles.bulletItem}>
                      <span className={`badge badge-${a.severity}`} style={{ fontSize: '0.62rem', marginRight: '0.5rem' }}>{a.severity}</span>
                      <strong style={{ color: '#fff' }}>{a.allergen}</strong>
                    </div>
                  ))
                )}
              </div>

              <hr style={styles.cardDivider} />

              <h3 style={styles.sectionTitle}>
                <Activity size={20} color="#0ea5e9" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Chronic Conditions
              </h3>
              <div style={styles.bulletList}>
                {data.chronicDiseases.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No chronic conditions reported.</p>
                ) : (
                  data.chronicDiseases.map((d, i) => (
                    <div key={i} style={styles.bulletItem}>
                      <span className={`badge badge-${d.severity}`} style={{ fontSize: '0.62rem', marginRight: '0.5rem' }}>{d.severity}</span>
                      <strong style={{ color: '#fff' }}>{d.disease}</strong>
                    </div>
                  ))
                )}
              </div>

              <hr style={styles.cardDivider} />

              <h3 style={styles.sectionTitle}>
                <Heart size={20} color="#10b981" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Active Medications
              </h3>
              <div style={styles.medicationsList}>
                {data.currentMedications.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No medications reported.</p>
                ) : (
                  data.currentMedications.map((m, i) => (
                    <div key={i} style={styles.medicationItem}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{m.name}</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                        {m.dosage} - {m.frequency}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Row: Emergency Contacts (Span 2) */}
            <div className="glass-card" style={{ ...styles.card, gridColumn: 'span 2', '@media (max-width: 768px)': { gridColumn: 'span 1' } }}>
              <h3 style={styles.sectionTitle}>
                <Phone size={20} color="#0ea5e9" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Emergency Contacts
              </h3>
              <p style={styles.cardSubtitle}>Call immediately to notify family members of active dispatch:</p>
              
              <div style={styles.contactsGrid}>
                {data.emergencyContacts.map((c, i) => (
                  <div key={i} style={styles.contactCard}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '1.05rem', display: 'block' }}>{c.name}</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{c.relationship}</span>
                    </div>
                    <a href={`tel:${c.phone}`} style={styles.callActionButton}>
                      <Phone size={18} style={{ marginRight: '6px' }} /> Call {c.phone}
                    </a>
                  </div>
                ))}
              </div>

              {data.doctorInfo && (data.doctorInfo.name || data.doctorInfo.phone) && (
                <>
                  <hr style={styles.cardDivider} />
                  <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>Physician Information</h4>
                  <div style={styles.doctorBlock}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{data.doctorInfo.name || 'Primary Doctor'}</strong>
                      {data.doctorInfo.hospital && <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hospital: {data.doctorInfo.hospital}</span>}
                    </div>
                    {data.doctorInfo.phone && (
                      <a href={`tel:${data.doctorInfo.phone}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <Phone size={14} style={{ marginRight: '4px' }} /> Call Doctor
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  agreementPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#070a13',
    padding: '1.5rem',
  },
  agreementCard: {
    maxWidth: '480px',
    width: '100%',
    padding: '2.5rem 2rem',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  warnText: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    textAlign: 'center',
    fontSize: '0.98rem',
    marginBottom: '1.5rem',
  },
  telemetryBox: {
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  telemetryList: {
    color: 'var(--text-muted)',
    fontSize: '0.82rem',
    lineHeight: '1.6',
    paddingLeft: '1.25rem',
    marginTop: '0.25rem',
  },
  loadingPage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#070a13',
  },
  emergencyPage: {
    minHeight: '100vh',
    background: '#0a0f1d',
    paddingBottom: '4rem',
  },
  container: {
    padding: '2rem 1.5rem',
    maxWidth: '960px',
  },
  alertHeader: {
    background: '#ef4444',
    borderRadius: '12px',
    padding: '1.25rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    color: '#fff',
    boxShadow: '0 8px 30px rgba(239, 68, 68, 0.3)',
    marginBottom: '2rem',
  },
  headerBranding: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  headerTimestamp: {
    fontSize: '0.85rem',
    fontWeight: '700',
    background: 'rgba(0, 0, 0, 0.15)',
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  card: {
    padding: '2rem',
  },
  patientName: {
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: '800',
  },
  bloodIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2rem',
  },
  bloodLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  bloodCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '3px solid #ef4444',
    color: '#ef4444',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2.25rem',
    fontWeight: '900',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  cardSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
    marginBottom: '1.5rem',
  },
  bulletList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  bulletItem: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  cardDivider: {
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    margin: '1.5rem 0',
  },
  medicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  medicationItem: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  contactsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem',
    marginTop: '1.25rem',
  },
  contactCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  callActionButton: {
    background: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)',
  },
  doctorBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
  },
};

// Injected styling animation for rotating loading indicator
const animStyleElement = document.createElement('style');
animStyleElement.innerHTML = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(animStyleElement);

export default EmergencyView;
