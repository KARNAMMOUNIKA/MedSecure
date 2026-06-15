import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Activity, User, QrCode, History, Settings, LogOut, Menu, X, Lock } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={() => setIsOpen(false)}>
          <Shield size={26} color="#0ea5e9" style={styles.logoIcon} />
          <span style={styles.logoText}>Med<span style={{ color: '#0ea5e9' }}>Secure</span></span>
        </Link>

        {/* Mobile Menu Icon */}
        <div style={styles.mobileToggle} onClick={toggleMenu}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </div>

        {/* Navigation Links */}
        <div 
          className={isOpen ? 'open' : ''}
          style={{
            ...styles.navMenu,
            ...(isOpen ? styles.navMenuOpen : {})
          }}
        >
          {!user ? (
            <>
              <Link to="/about" style={isActive('/about') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>About Us</Link>
              <Link to="/features" style={isActive('/features') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>Features</Link>
              <Link to="/contact" style={isActive('/contact') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>Contact</Link>
              <Link to="/login" style={styles.loginBtn} onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={styles.signUpBtn} onClick={() => setIsOpen(false)}>Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" style={isActive('/admin') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                    <Lock size={16} style={styles.navIcon} /> Admin Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" style={isActive('/dashboard') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                    <Activity size={16} style={styles.navIcon} /> Dashboard
                  </Link>
                  <Link to="/profile" style={isActive('/profile') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                    <User size={16} style={styles.navIcon} /> Profile
                  </Link>
                  <Link to="/qr-code" style={isActive('/qr-code') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                    <QrCode size={16} style={styles.navIcon} /> QR Code
                  </Link>
                  <Link to="/risk-analysis" style={isActive('/risk-analysis') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                    <Activity size={16} style={styles.navIcon} /> Risk Report
                  </Link>
                  <Link to="/history" style={isActive('/history') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                    <History size={16} style={styles.navIcon} /> Audit Logs
                  </Link>
                </>
              )}
              <Link to="/settings" style={isActive('/settings') ? styles.activeLink : styles.link} onClick={() => setIsOpen(false)}>
                <Settings size={16} style={styles.navIcon} /> Settings
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: '70px',
    background: 'rgba(10, 15, 29, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoIcon: {
    marginRight: '8px',
  },
  logoText: {
    fontFamily: 'var(--font-headings)',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  mobileToggle: {
    display: 'none',
    color: '#fff',
    cursor: 'pointer',
    '@media (max-width: 991px)': {
      display: 'block',
    }
  },
  navMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'var(--transition-smooth)',
  },
  activeLink: {
    color: 'var(--color-primary)',
    fontSize: '0.95rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  },
  navIcon: {
    marginRight: '6px',
  },
  loginBtn: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  signUpBtn: {
    padding: '0.55rem 1.2rem',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    padding: '0.55rem 1.2rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'var(--transition-smooth)',
  },
  // Responsive overrides are injected dynamically in CSS or handled via styles + media queries
};

// Injection of media query styling rules
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  @media (max-width: 991px) {
    nav > div > div:nth-child(2) {
      display: block !important;
    }
    nav > div > div:nth-child(3) {
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      background: #0a0f1d;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: 1.5rem;
      display: none;
    }
    nav > div > div:nth-child(3).open {
      display: flex !important;
    }
    nav > div > div:nth-child(3) > a, nav > div > div:nth-child(3) > button {
      padding: 1rem 0 !important;
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    nav > div > div:nth-child(3) > button {
      border: none;
      background: none;
      color: #ef4444;
      text-align: left;
    }
  }
`;
document.head.appendChild(styleElement);

export default Navbar;
