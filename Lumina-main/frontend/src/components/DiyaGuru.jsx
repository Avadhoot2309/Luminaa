import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DiyaGuru = ({ state = 'idle', message = '' }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      left: '32px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))'
    }}>
      {/* Floating Diya */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #E8920C, #C87000)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform: `translateY(${pulse ? '-5px' : '0px'}) scale(${isHovered ? 1.1 : 1})`,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
          boxShadow: `0 0 ${pulse ? '30px' : '15px'} rgba(232, 146, 12, 0.6)`
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M12 2L9 8.5C9 10.4 10.3 12 12 12C13.7 12 15 10.4 15 8.5L12 2Z" fill="#FFD54F" />
          <path d="M3 15C3 15 6 12 12 12C18 12 21 15 21 15C21 18 17 21 12 21C7 21 3 18 3 15Z" fill="#5D4037" />
        </svg>
      </div>

      {/* Message Bubble */}
      <div className="glass-card" style={{
        padding: '16px 24px',
        maxWidth: '300px',
        border: '2px solid var(--amber)',
        borderRadius: '20px 20px 20px 4px',
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--navy)',
        animation: 'fadeUp 0.5s ease-out',
        background: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div style={{ color: 'var(--amber)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
          Diya Guru says:
        </div>
        {message}
      </div>
    </div>
  );
};

export default DiyaGuru;
