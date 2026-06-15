import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, QrCode, Heart, Activity, CheckCircle, Smartphone, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [simulatedConditions, setSimulatedConditions] = useState({
    asthma: true,
    penicillin: true,
    diabetes: false,
  });

  const getSimulatedRisk = () => {
    if (simulatedConditions.asthma && simulatedConditions.penicillin) return 'High';
    if (simulatedConditions.asthma || simulatedConditions.diabetes) return 'Moderate';
    return 'Normal';
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      {/* Hero Banner Section */}
      <section style={styles.heroSection}>
        <div className="container animate-fade-in" style={styles.heroContainer}>
          <div style={styles.heroText}>
            <div style={styles.alertBadge}>
              <Shield size={16} color="#0ea5e9" />
              <span>Digital Emergency Medical Identity</span>
            </div>
            <h1 style={styles.heroHeading} className="title-gradient">
              Secure QR Codes That Save Lives In Seconds
            </h1>
            <p style={styles.heroSubheading}>
              MedSecure creates a secure emergency identity. First responders and doctors scan your QR to view critical allergies, blood group, and emergency contacts instantly—while protecting your private accounts.
            </p>
            <div style={styles.heroActions}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                Learn Our Mission
              </Link>
            </div>
          </div>
          
          <div style={styles.heroVisual}>
            <div style={styles.heroCard} className="glass-card">
              <div style={styles.cardHeader}>
                <Shield size={24} color="#ef4444" />
                <span style={{ fontWeight: 'bold', color: '#fff' }}>EMERGENCY ID</span>
                <span style={styles.activePulse}></span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.mockQRWrapper}>
                  <QrCode size={140} color="#0ea5e9" />
                </div>
                <h3 style={{ margin: '1rem 0 0.25rem', color: '#fff' }}>Johnathan Doe</h3>
                <span className="badge badge-high" style={{ marginBottom: '1rem' }}>Risk: High</span>
                <div style={styles.microDetail}>
                  <span>Blood: A+</span>
                  <span>Allergies: Penicillin, Nut Allergy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How MedSecure Works</h2>
          <p style={styles.sectionSubtitle}>Three simple steps to secure health assurance</p>
          
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard} className="glass-card">
              <div style={styles.stepNum}>1</div>
              <Activity size={32} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
              <h3 style={styles.stepTitle}>Setup Profile</h3>
              <p style={styles.stepDesc}>Register and enter blood group, medications, allergies, and emergency contact details securely.</p>
            </div>
            
            <div style={styles.stepCard} className="glass-card">
              <div style={styles.stepNum}>2</div>
              <QrCode size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={styles.stepTitle}>Generate QR Code</h3>
              <p style={styles.stepDesc}>Instantly receive a unique encrypted QR code. Save it on your phone, print it, or wear it on a bracelet.</p>
            </div>
            
            <div style={styles.stepCard} className="glass-card">
              <div style={styles.stepNum}>3</div>
              <Heart size={32} color="#ef4444" style={{ marginBottom: '1rem' }} />
              <h3 style={styles.stepTitle}>Instant Scan Access</h3>
              <p style={styles.stepDesc}>In an emergency, responders scan it. Only vital medical alerts and contacts load instantly on their mobile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live QR Simulator Demo */}
      <section style={styles.demoSection}>
        <div className="container">
          <div style={styles.demoCard} className="glass-card">
            <div style={styles.demoInfo}>
              <h2 style={{ ...styles.sectionTitle, textAlign: 'left', marginTop: 0 }}>Interactive QR Simulator</h2>
              <p style={styles.demoDesc}>
                Toggle different health metrics to see how MedSecure calculates risk level and formats the public responder screen.
              </p>
              
              <div style={styles.toggleGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={simulatedConditions.asthma}
                    onChange={(e) => setSimulatedConditions({ ...simulatedConditions, asthma: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <span>Asthma (Respiratory Condition)</span>
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={simulatedConditions.penicillin}
                    onChange={(e) => setSimulatedConditions({ ...simulatedConditions, penicillin: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <span>Severe Allergy: Penicillin</span>
                </label>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={simulatedConditions.diabetes}
                    onChange={(e) => setSimulatedConditions({ ...simulatedConditions, diabetes: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <span>Diabetes (Mild/Controlled)</span>
                </label>
              </div>
            </div>

            <div style={styles.simulatorPreview}>
              <div style={styles.phoneFrame}>
                <div style={styles.phoneHeader}>
                  <Shield size={14} color="#0ea5e9" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>MedSecure Emergency View</span>
                </div>
                <div style={styles.phoneContent}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: '#fff' }}>Jane Doe (Scanned Profile)</h4>
                    <span className={`badge badge-${getSimulatedRisk().toLowerCase()}`} style={{ marginTop: '0.25rem' }}>
                      Risk: {getSimulatedRisk()}
                    </span>
                  </div>
                  
                  <div style={styles.phoneSection}>
                    <span style={styles.phoneSectionLabel}>Blood Group</span>
                    <strong style={{ color: '#fff' }}>O Positive (O+)</strong>
                  </div>

                  <div style={styles.phoneSection}>
                    <span style={styles.phoneSectionLabel}>Allergies</span>
                    <p style={{ color: '#fff', fontSize: '0.85rem' }}>
                      {simulatedConditions.penicillin ? '⚠️ Penicillin (Severe)' : 'None reported'}
                    </p>
                  </div>

                  <div style={styles.phoneSection}>
                    <span style={styles.phoneSectionLabel}>Major Conditions</span>
                    <p style={{ color: '#fff', fontSize: '0.85rem' }}>
                      {simulatedConditions.asthma ? 'Asthma (Moderate)' : ''}
                      {simulatedConditions.asthma && simulatedConditions.diabetes ? ', ' : ''}
                      {simulatedConditions.diabetes ? 'Diabetes' : ''}
                      {!simulatedConditions.asthma && !simulatedConditions.diabetes ? 'None reported' : ''}
                    </p>
                  </div>

                  <div style={styles.phoneSection}>
                    <span style={styles.phoneSectionLabel}>Emergency Contact</span>
                    <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>Mark Doe (Spouse)</p>
                    <p style={{ color: 'var(--color-primary)', fontSize: '0.8rem' }}>+1 (555) 019-3829</p>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }} disabled>
                    Call Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Scenario Section */}
      <section style={styles.scenarioSection}>
        <div className="container" style={styles.scenarioContainer}>
          <div style={styles.scenarioVisual}>
            <Smartphone size={90} color="#0ea5e9" style={{ opacity: 0.15, position: 'absolute', top: '10%', left: '10%' }} />
            <Clock size={80} color="#ef4444" style={{ opacity: 0.15, position: 'absolute', bottom: '15%', right: '15%' }} />
            <div style={styles.timeline}>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}></div>
                <div>
                  <h4 style={{ color: '#fff' }}>0 seconds: Dispatch</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>First responders arrive at the emergency scene.</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}></div>
                <div>
                  <h4 style={{ color: '#fff' }}>5 seconds: Scan QR</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Paramedic scans the patient's bracelet or card using a phone.</p>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}></div>
                <div>
                  <h4 style={{ color: '#fff' }}>8 seconds: Action</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Critical allergies and medication list allow paramedics to administer safe treatments.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.scenarioText}>
            <h2 style={{ ...styles.sectionTitle, textAlign: 'left', marginTop: 0 }}>Every Second Counts</h2>
            <p style={styles.scenarioDesc}>
              During medical emergencies, patients are often unconscious or unable to speak. Sharing allergies and medications prevents lethal drug interactions. MedSecure provides first responders with life-saving metrics when time is of the essence.
            </p>
            <div style={styles.checkItems}>
              <div style={styles.checkItem}><CheckCircle size={18} color="#10b981" /> <span>Mobile Optimized emergency screen</span></div>
              <div style={styles.checkItem}><CheckCircle size={18} color="#10b981" /> <span>Zero typing required for responders</span></div>
              <div style={styles.checkItem}><CheckCircle size={18} color="#10b981" /> <span>Full scan history audit logs for you</span></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #111a30 0%, #0a0f1d 70%)',
  },
  heroSection: {
    padding: '6rem 0',
    display: 'flex',
    alignItems: 'center',
  },
  heroContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4rem',
    flexWrap: 'wrap',
  },
  heroText: {
    flex: '1 1 500px',
  },
  alertBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(14, 165, 233, 0.1)',
    border: '1px solid rgba(14, 165, 233, 0.25)',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    color: '#0ea5e9',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  heroHeading: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '1.5rem',
  },
  heroSubheading: {
    fontSize: '1.15rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '2.5rem',
  },
  heroActions: {
    display: 'flex',
    gap: '1.25rem',
    flexWrap: 'wrap',
  },
  heroVisual: {
    flex: '1 1 400px',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  heroCard: {
    width: '320px',
    padding: '1.75rem',
    textAlign: 'center',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  activePulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 8px #10b981',
    marginLeft: 'auto',
  },
  mockQRWrapper: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    display: 'inline-block',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
  },
  microDetail: {
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '1rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  howItWorks: {
    padding: '5rem 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  stepCard: {
    position: 'relative',
    padding: '2.5rem 2rem',
    textAlign: 'center',
  },
  stepNum: {
    position: 'absolute',
    top: '1.5rem',
    right: '2rem',
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.04)',
    lineHeight: '1',
  },
  stepTitle: {
    fontSize: '1.25rem',
    color: '#fff',
    marginBottom: '0.75rem',
  },
  stepDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  demoSection: {
    padding: '5rem 0',
  },
  demoCard: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4rem',
    flexWrap: 'wrap',
    padding: '3rem',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 15, 29, 0.9) 100%)',
  },
  demoInfo: {
    flex: '1 1 450px',
  },
  demoDesc: {
    color: 'var(--text-secondary)',
    fontSize: '1.05rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  toggleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  simulatorPreview: {
    flex: '1 1 350px',
    display: 'flex',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: '280px',
    background: '#090d16',
    border: '8px solid #1f2937',
    borderRadius: '32px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
  },
  phoneHeader: {
    background: 'rgba(31, 41, 55, 0.4)',
    padding: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  phoneContent: {
    padding: '1.25rem',
  },
  phoneSection: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  phoneSectionLabel: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.15rem',
    textTransform: 'uppercase',
  },
  scenarioSection: {
    padding: '5rem 0',
    background: 'rgba(0, 0, 0, 0.15)',
  },
  scenarioContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4rem',
    flexWrap: 'wrap-reverse',
  },
  scenarioVisual: {
    flex: '1 1 400px',
    background: 'rgba(17, 24, 39, 0.5)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  timelineItem: {
    display: 'flex',
    gap: '1rem',
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    boxShadow: '0 0 10px var(--color-primary)',
    marginTop: '0.35rem',
    flexShrink: 0,
  },
  scenarioText: {
    flex: '1 1 500px',
  },
  scenarioDesc: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  checkItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
  },
};

export default LandingPage;
