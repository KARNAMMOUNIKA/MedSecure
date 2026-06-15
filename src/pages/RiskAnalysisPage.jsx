import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RiskMeter from '../components/RiskMeter';
import { ShieldAlert, HeartPulse, CheckSquare, Eye } from 'lucide-react';

const RiskAnalysisPage = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching clinical metrics.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const getClinicalAdvice = (score) => {
    switch (score) {
      case 'Critical':
        return [
          'Immediate clinical review: Share this dashboard with your primary physician as soon as possible.',
          'Physical alert wear: We strongly recommend wearing a physical metal alert band printed with your MedSecure QR code.',
          'Solitary constraints: Avoid isolated workouts or remote traveling without a companion who understands your heart/allergic triggers.',
          'EpiPen availability: Ensure your adrenaline injector is not expired and remains carried at all times.',
        ];
      case 'High':
        return [
          'Monthly telemetry: Monitor and record blood glucose and blood pressure logs twice daily.',
          'Medication compliance: Ensure prescriptions are pre-packed in dispenser boxes to prevent double-dosages.',
          'Responder coordination: Notify family members of your emergency contacts setup to guarantee fast dispatch responses.',
        ];
      case 'Moderate':
        return [
          'Controlled activity: Aim for 150 minutes of moderate aerobic workouts (like walking/swimming) weekly.',
          'Quarterly review: Visit your local physician for routine blood assays and metric evaluations.',
          'Medication monitoring: Maintain a clean list of drug dosages; immediately log any modifications in your profile.',
        ];
      case 'Normal':
      default:
        return [
          'Active prevention: Maintain clean sleep hygiene (7-8 hours) and eat a whole-food, fiber-rich diet.',
          'Annual physical: Schedule standard annual biometric screenings (cholesterol, glucose, BP).',
          'Profile accuracy: Keep your contacts list updated in the event of accidents.',
        ];
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0ea5e9', fontWeight: 'bold' }}>
          Analyzing Clinical Analytics...
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div className="container" style={{ ...styles.container, textAlign: 'center', padding: '6rem 2rem' }}>
          <ShieldAlert size={48} color="var(--color-warning)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#fff' }}>No Medical Records Detected</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2rem' }}>
            Please fill out your medical profile to generate your diagnostic risk assessment score.
          </p>
          <a href="/profile" className="btn btn-primary">Setup Profile</a>
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
          <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Risk Score Analysis</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            A detailed breakdown of your calculated triage risk score based on recorded medical indicators.
          </p>
        </div>

        <div style={styles.grid}>
          {/* Gauge Widget */}
          <div className="glass-card" style={styles.gaugeCard}>
            <RiskMeter score={profile.riskScore} />
          </div>

          {/* Indicators / Breakdown Warning Flags */}
          <div className="glass-card" style={styles.breakdownCard}>
            <h3 style={styles.sectionTitle}>
              <ShieldAlert size={20} color="#ef4444" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Warning Indicators
            </h3>
            <p style={styles.cardSubtitle}>Key factors that determined your severity score:</p>
            
            <div style={styles.breakdownList}>
              {profile.riskBreakdown && profile.riskBreakdown.length > 0 ? (
                profile.riskBreakdown.map((item, idx) => (
                  <div key={idx} style={styles.warningItem}>
                    <span style={styles.warningDot}></span>
                    <p style={{ color: '#fff', fontSize: '0.92rem', lineHeight: '1.5' }}>{item}</p>
                  </div>
                ))
              ) : (
                <div style={styles.noWarnings}>
                  <span>No severe clinical conditions or allergy combinations detected.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="glass-card animate-fade-in" style={styles.adviceCard}>
          <h3 style={styles.sectionTitle}>
            <HeartPulse size={20} color="#10b981" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Health Recommendations
          </h3>
          <p style={styles.cardSubtitle}>Suggested medical safety actions for your {profile.riskScore} profile:</p>

          <div style={styles.adviceList}>
            {getClinicalAdvice(profile.riskScore).map((adv, idx) => (
              <div key={idx} style={styles.adviceItem}>
                <CheckSquare size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{adv}</p>
              </div>
            ))}
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#0a0f1d',
  },
  container: {
    padding: '3rem 2rem',
    maxWidth: '960px',
  },
  header: {
    marginBottom: '2.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
    marginBottom: '2.5rem',
  },
  gaugeCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2.5rem',
  },
  breakdownCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  cardSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: 'auto 0',
  },
  warningItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(239, 68, 68, 0.03)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
  },
  warningDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#ef4444',
    boxShadow: '0 0 6px #ef4444',
    marginTop: '0.45rem',
    flexShrink: 0,
  },
  noWarnings: {
    background: 'rgba(16, 185, 129, 0.03)',
    border: '1px dashed rgba(16, 185, 129, 0.3)',
    color: 'var(--color-success)',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  adviceCard: {
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  adviceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '1.5rem',
  },
  adviceItem: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  },
};

export default RiskAnalysisPage;
