import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Eye, Heart, ShieldAlert } from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1 className="title-gradient" style={styles.title}>About MedSecure</h1>
          <p style={styles.subtitle}>Securing medical identities to save lives in critical moments.</p>
        </div>

        {/* Problem Statement Card */}
        <div style={styles.problemCard} className="glass-card">
          <div style={styles.problemHeader}>
            <ShieldAlert size={28} color="#ef4444" />
            <h2 style={{ color: '#fff', fontSize: '1.5rem' }}>The Healthcare Access Problem</h2>
          </div>
          <p style={styles.problemDesc}>
            In emergency medical situations (such as car accidents, heart attacks, or sudden allergic shocks), every second is critical. Paramedics and emergency responders need immediate access to a patient's medical details. However:
          </p>
          <ul style={styles.problemList}>
            <li>Patients are often unconscious or unable to communicate.</li>
            <li>Important details like blood groups, severe allergies, and chronic diseases are unknown.</li>
            <li>Administering standard treatments without patient history can lead to fatal drug conflicts.</li>
            <li>Existing records are locked behind complex, inaccessible hospital logins.</li>
          </ul>
        </div>

        {/* Mission & Vision Grid */}
        <div style={styles.grid}>
          <div className="glass-card" style={styles.gridCard}>
            <Target size={36} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
            <h3 style={styles.gridTitle}>Our Mission</h3>
            <p style={styles.gridDesc}>
              To bridge the gap between emergency response speed and personal health details. We provide first responders with instantaneous, secure, and limited access to critical medical summaries without exposing private data.
            </p>
          </div>

          <div className="glass-card" style={styles.gridCard}>
            <Eye size={36} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={styles.gridTitle}>Our Vision</h3>
            <p style={styles.gridDesc}>
              We envision a future where every individual carries a digital medical identity. By integrating QR codes into daily accessories and cards, we hope to reduce medical errors and save lives worldwide.
            </p>
          </div>
        </div>

        {/* Medical Importance Section */}
        <div className="glass-card" style={styles.importanceCard}>
          <h3 style={styles.gridTitle}><Heart size={20} color="#ef4444" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Why MedSecure Matters</h3>
          <p style={styles.importanceText}>
            Medical errors are a leading cause of accidental deaths. A simple knowledge of a penicillin allergy or a diabetic condition can completely redirect a first responder's treatment plan. MedSecure provides a zero-latency, secure cloud dashboard that remains completely private until a QR scan triggers emergency logging.
          </p>
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
    padding: '4rem 2rem',
    maxWidth: '900px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: '800',
    marginBottom: '0.75rem',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: 'var(--text-secondary)',
  },
  problemCard: {
    marginBottom: '2rem',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  problemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  problemDesc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  problemList: {
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    paddingLeft: '1.5rem',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  gridCard: {
    padding: '2rem',
  },
  gridTitle: {
    fontSize: '1.3rem',
    color: '#fff',
    marginBottom: '0.75rem',
  },
  gridDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  importanceCard: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  importanceText: {
    color: 'var(--text-secondary)',
    lineHeight: '1.65',
    fontSize: '0.95rem',
  },
};

export default AboutUs;
