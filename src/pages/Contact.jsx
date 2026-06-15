import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const faqs = [
    {
      q: 'Who can scan my QR code?',
      a: 'Anyone with a mobile camera can scan the QR code. However, the scanned page only exposes a limited, read-only emergency medical summary. Responders must agree to our access logs agreement before viewing details, and a scan record containing device location telemetry is logged to your account immediately.',
    },
    {
      q: 'Is my personal information secure?',
      a: 'Yes. All data transmissions are encrypted using standard TLS protocols, and passwords are encrypted using bcrypt hashing. Financial, administrative, and password settings are never shown on the public emergency view.',
    },
    {
      q: 'Can I deactivate my QR code?',
      a: 'Absolutely. Inside your Settings screen, you can toggle privacy sharing controls or completely delete your profile, which instantly deactivates the scanned emergency view.',
    },
    {
      q: 'How does the Risk Scoring engine calculate severity?',
      a: 'The backend automatically analyzes your chronic illnesses, allergies, and medications. For instance, having a severe allergy combined with asthma or heart conditions escalates your profile to "Critical" because standard medications (like beta-blockers) could trigger anaphylaxis.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1 className="title-gradient" style={styles.title}>Contact & FAQ</h1>
          <p style={styles.subtitle}>Find immediate answers or reach out to our emergency support desk.</p>
        </div>

        <div style={styles.grid}>
          {/* Support Ticket Form */}
          <div className="glass-card" style={styles.formCard}>
            <h2 style={styles.sectionTitle}><Mail size={20} color="#0ea5e9" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Submit Support Ticket</h2>
            {submitted && (
              <div style={styles.successAlert}>
                <CheckCircle size={18} />
                <span>Ticket submitted successfully! Our emergency response developers will review it.</span>
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Inquiry</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Request</button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div style={styles.faqCol}>
            <h2 style={styles.sectionTitle}><HelpCircle size={20} color="#10b981" style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Frequently Asked Questions</h2>
            <div style={styles.faqList}>
              {faqs.map((f, i) => (
                <div key={i} className="glass-card" style={styles.faqItem}>
                  <strong style={styles.faqQ}>{f.q}</strong>
                  <p style={styles.faqA}>{f.a}</p>
                </div>
              ))}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '3rem',
    alignItems: 'start',
  },
  formCard: {
    padding: '2.5rem',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '1.4rem',
    marginBottom: '1.5rem',
  },
  successAlert: {
    background: 'var(--color-success-glow)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--color-success)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  faqCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  faqItem: {
    padding: '1.5rem',
  },
  faqQ: {
    color: '#fff',
    fontSize: '1.05rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  faqA: {
    color: 'var(--text-secondary)',
    fontSize: '0.92rem',
    lineHeight: '1.5',
  },
};

export default Contact;
