import React from 'react';

const RiskMeter = ({ score = 'Normal' }) => {
  // Map score to angle and color details
  const scoreConfig = {
    Normal: {
      angle: -60,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      description: 'Patient is stable with normal indicators. Standard care procedures apply.',
    },
    Moderate: {
      angle: -20,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      description: 'Controlled chronic conditions. Active medication management required.',
    },
    High: {
      angle: 20,
      color: '#f97316',
      bgGlow: 'rgba(249, 115, 22, 0.15)',
      description: 'High clinical oversight required. Severe individual chronic conditions detected.',
    },
    Critical: {
      angle: 60,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
      description: 'CRITICAL: Severe allergies combined with cardiac/asthmatic conditions. Immediate attention.',
    },
  };

  const active = scoreConfig[score] || scoreConfig.Normal;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Severity Indicator</h3>

      {/* SVG Speedometer Gauge */}
      <div style={styles.gaugeWrapper}>
        <svg width="220" height="130" viewBox="0 0 220 130" style={styles.svg}>
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="#1f2937"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Color Gradient Track */}
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Anchor Center Pin */}
          <circle cx="110" cy="110" r="8" fill="#fff" />
          <circle cx="110" cy="110" r="4" fill={active.color} />

          {/* Needle Pointer */}
          <g transform={`rotate(${active.angle} 110 110)`}>
            <polygon
              points="108,110 112,110 110,25"
              fill={active.color}
              filter="url(#glow)"
              style={{
                transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: '110px 110px'
              }}
            />
          </g>
        </svg>

        <div style={{ ...styles.scoreDisplay, textShadow: `0 0 10px ${active.color}50` }}>
          <span style={{ color: active.color }}>{score}</span>
        </div>
      </div>

      <div style={{ ...styles.cardInfo, background: active.bgGlow, borderColor: `${active.color}30` }}>
        <p style={{ ...styles.descText, color: active.color }}>{active.description}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  gaugeWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '140px',
  },
  svg: {
    display: 'block',
  },
  scoreDisplay: {
    position: 'absolute',
    bottom: '0px',
    fontSize: '1.6rem',
    fontFamily: 'var(--font-headings)',
    fontWeight: '800',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  cardInfo: {
    marginTop: '1.25rem',
    padding: '0.85rem 1rem',
    borderRadius: 'var(--border-radius-sm)',
    borderWidth: '1px',
    borderStyle: 'solid',
    width: '100%',
    textAlign: 'center',
  },
  descText: {
    fontSize: '0.85rem',
    fontWeight: '500',
    lineHeight: '1.45',
  },
};

export default RiskMeter;
