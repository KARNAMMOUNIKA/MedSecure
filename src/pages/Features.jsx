import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QrCode, Shield, Activity, Eye, FileText, CheckCircle } from 'lucide-react';

const Features = () => {
  const featureList = [
    {
      icon: <QrCode size={36} color="#0ea5e9" />,
      title: 'QR Medical Identity',
      desc: 'Generates a unique secure QR code linked to your emergency medical profile. Responders can scan it using any mobile camera—no special hardware or app required.',
    },
    {
      icon: <Activity size={36} color="#10b981" />,
      title: 'Clinical Risk Scoring',
      desc: 'Our intelligent scoring system cross-references chronic diseases, severe allergies, and medications to assign a triage risk score (Normal, Moderate, High, Critical) automatically.',
    },
    {
      icon: <Eye size={36} color="#ef4444" />,
      title: 'Privacy-First Emergency View',
      desc: 'Responders only see vital life-saving markers: blood group, allergies, conditions, and contacts. Your settings, password, and private medical documents remain protected.',
    },
    {
      icon: <Shield size={36} color="#8b5cf6" />,
      title: 'Cloud Security Logs',
      desc: 'Every scan is logged in real-time. You receive alerts containing the date, time, accessing device info, and mock location coordinates to auditing access accountability.',
    },
    {
      icon: <FileText size={36} color="#ec4899" />,
      title: 'Emergency Contacts Dial',
      desc: 'Responders can click a single button to dial your designated emergency contacts immediately, bypassing locks to alert loved ones without delay.',
    },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1 className="title-gradient" style={styles.title}>System Features</h1>
          <p style={styles.subtitle}>Smarter medical emergencies driven by instant data access.</p>
        </div>

        <div style={styles.grid}>
          {featureList.map((f, i) => (
            <div key={i} className="glass-card" style={styles.card}>
              <div style={styles.iconWrapper}>{f.icon}</div>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.banner} className="glass-card">
          <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Integrated Hospital Compatibility</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Designed using international emergency healthcare parameters. Compiles with standard ambulance dispatch workflows to guarantee rapid assessment.
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
  },
  header: {
    textAlign: 'center',
    marginBottom: '4rem',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
    marginBottom: '4rem',
  },
  card: {
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    color: '#fff',
    marginBottom: '0.75rem',
  },
  cardDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  banner: {
    textAlign: 'center',
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
};

export default Features;
