import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.branding}>
          <div style={styles.logo}>
            <Shield size={22} color="#0ea5e9" style={{ marginRight: '8px' }} />
            <span style={styles.logoText}>Med<span style={{ color: '#0ea5e9' }}>Secure</span></span>
          </div>
          <p style={styles.desc}>
            Empowering emergency medical access while preserving patient privacy. Scans save lives; encryption guards rights.
          </p>
        </div>

        <div style={styles.linksContainer}>
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Product</h4>
            <Link to="/features" style={styles.link}>Features</Link>
            <Link to="/about" style={styles.link}>Mission</Link>
            <Link to="/contact" style={styles.link}>Help Center</Link>
          </div>
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Security</h4>
            <span style={styles.staticText}>End-to-End JWT</span>
            <span style={styles.staticText}>Encrypted Data</span>
            <span style={styles.staticText}>Audit History</span>
          </div>
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Emergency</h4>
            <span style={styles.staticText}>Instant Scan Lookup</span>
            <span style={styles.staticText}>Responder Portals</span>
            <span style={styles.staticText}>Medical Alerts</span>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        <div className="container" style={styles.bottomContainer}>
          <span>&copy; {new Date().getFullYear()} MedSecure. All emergency medical rights reserved.</span>
          <span>Designed for Healthcare & Ambulance Dispatch Integration.</span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#070a14',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '3.5rem',
    marginTop: 'auto',
    width: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '3rem',
    paddingBottom: '3rem',
  },
  branding: {
    flex: '1 1 300px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  logoText: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff',
  },
  desc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    fontSize: '0.9rem',
    maxWidth: '320px',
  },
  linksContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  colTitle: {
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    transition: 'var(--transition-smooth)',
  },
  staticText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  bottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    padding: '1.5rem 0',
    background: '#05070e',
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  },
};

export default Footer;
