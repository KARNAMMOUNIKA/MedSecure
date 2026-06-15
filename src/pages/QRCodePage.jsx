import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Download, Printer, Share2, Shield, Check, Copy } from 'lucide-react';

const QRCodePage = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const emergencyUrl = `${window.location.origin}/emergency/${user?.qrToken}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(emergencyUrl)}&color=0a0f1d&bgcolor=ffffff`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(emergencyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header} className="no-print">
          <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Your Emergency QR Identity</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Responders scan this QR code to access your critical health factors during an emergency.
          </p>
        </div>

        <div style={styles.contentGrid}>
          {/* QR Card - Printable Area */}
          <div className="glass-card printable-id-card" style={styles.qrCard}>
            <div style={styles.cardHeader}>
              <Shield size={24} color="#ef4444" />
              <div>
                <span style={styles.cardHeaderTitle}>MEDSECURE EMERGENCY ID</span>
                <span style={styles.cardHeaderSubtitle}>Scan in case of Medical Emergency</span>
              </div>
            </div>

            <div style={styles.qrWrapper}>
              <img src={qrCodeImageUrl} alt="MedSecure Emergency QR Code" style={styles.qrImage} />
            </div>

            <div style={styles.cardBody}>
              <h2 style={styles.userName}>{user?.name}</h2>
              <div style={styles.statusBadge}>
                <span style={styles.activeDot}></span>
                <span>SYSTEM ACTIVE</span>
              </div>
            </div>
            
            <div style={styles.cardFooter}>
              <span>Powered by MedSecure Healthcare Networks</span>
            </div>
          </div>

          {/* Guidelines and Controls */}
          <div style={styles.guidelinesPanel} className="no-print">
            <div className="glass-card" style={{ height: '100%' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Emergency Instructions</h3>
              <ul style={styles.instructionsList}>
                <li><strong>Lock Screen:</strong> Download this QR code and save it as your mobile lock screen wallpaper for instant paramedic access.</li>
                <li><strong>Print Wallet Card:</strong> Click Print to create a credit-card-sized medical profile card. Keep it in your physical wallet.</li>
                <li><strong>Wearable Tags:</strong> Engrave this QR code on alert bracelets or medical tags.</li>
                <li><strong>Shared Identity:</strong> Responders can scan this using any standard QR code scanner or phone camera.</li>
              </ul>

              <div style={styles.actionBlock}>
                <a href={qrCodeImageUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={styles.actionBtn} download="medsecure_qr.png">
                  <Download size={18} /> Download Code
                </a>
                <button onClick={handlePrint} className="btn btn-secondary" style={styles.actionBtn}>
                  <Printer size={18} /> Print Wallet Card
                </button>
                <button onClick={handleShare} className="btn btn-primary" style={styles.actionBtn}>
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  {copied ? 'Copied Emergency Link' : 'Copy Responders Link'}
                </button>
              </div>
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
    padding: '3rem 2rem',
    maxWidth: '960px',
  },
  header: {
    marginBottom: '3rem',
  },
  contentGrid: {
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  qrCard: {
    width: '340px',
    padding: '2rem 1.5rem',
    background: 'linear-gradient(135deg, #111827 0%, #0c111c 100%)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    borderRadius: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textAlign: 'left',
    width: '100%',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  cardHeaderTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: '0.9rem',
    display: 'block',
    letterSpacing: '0.05em',
  },
  cardHeaderSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.7rem',
    display: 'block',
  },
  qrWrapper: {
    background: '#fff',
    padding: '1.25rem',
    borderRadius: '12px',
    display: 'inline-block',
    marginBottom: '1.5rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  qrImage: {
    display: 'block',
    width: '180px',
    height: '180px',
  },
  cardBody: {
    width: '100%',
    marginBottom: '1.5rem',
  },
  userName: {
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--color-success)',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '0.25rem 0.65rem',
    borderRadius: '9999px',
    letterSpacing: '0.05em',
  },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--color-success)',
    boxShadow: '0 0 6px var(--color-success)',
  },
  cardFooter: {
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.75rem',
    color: 'var(--text-muted)',
    fontSize: '0.65rem',
  },
  guidelinesPanel: {
    flex: '1 1 400px',
  },
  instructionsList: {
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    fontSize: '0.92rem',
    paddingLeft: '1.25rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  actionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  actionBtn: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
  },
};

// Injection of printable styles sheet
const printStyleElement = document.createElement('style');
printStyleElement.innerHTML = `
  @media print {
    body {
      background: #fff !important;
      color: #000 !important;
    }
    .no-print {
      display: none !important;
    }
    nav, footer {
      display: none !important;
    }
    .printable-id-card {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) !important;
      border: 2px solid #000 !important;
      background: #fff !important;
      box-shadow: none !important;
      color: #000 !important;
      width: 320px !important;
      padding: 1.5rem !important;
    }
    .printable-id-card span, .printable-id-card h2 {
      color: #000 !important;
    }
    .printable-id-card img {
      border: 1px solid #ccc !important;
    }
  }
`;
document.head.appendChild(printStyleElement);

export default QRCodePage;
