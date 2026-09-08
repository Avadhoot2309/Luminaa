import React from 'react';

/**
 * ─── Lumina Logo ──────────────────────────────────────────────────────────────
 * The primary brand mark for the platform, as seen on the landing page.
 * It is a hybrid "Light / Lotus" emblem with a Diya-like glow.
 */
export const LuminaLogo = ({ size = 36, color = '#4A90D9' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 34C20 34 7 28 7 13L7 9C7 9 13 10 20 16C27 10 33 9 33 9L33 13C33 28 20 34 20 34Z" fill={color} opacity="0.15"/>
    <path d="M20 32C20 32 8 26.5 8 12.5L8 10C8 10 13.5 11 20 17L20 32Z" fill={color} opacity="0.9"/>
    <path d="M20 32C20 32 32 26.5 32 12.5L32 10C32 10 26.5 11 20 17L20 32Z" fill={color} opacity="0.65"/>
    <rect x="19.2" y="17" width="1.6" height="15" rx="0.8" fill={color}/>
    <circle cx="20" cy="7" r="4" fill="#F5A623" opacity="0.95"/>
    <line x1="20" y1="2" x2="20" y2="0.5" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24.8" y1="3.5" x2="26.2" y2="2.2" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="15.2" y1="3.5" x2="13.8" y2="2.2" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="27" y1="7" x2="29" y2="7" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="13" y1="7" x2="11" y2="7" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const LuminaBrand = ({ size = 36, color = '#0A1628', light = false }) => {
  const textColor = light ? '#FFFFFF' : color;
  const logoColor = light ? '#93C6FF' : '#4A90D9';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <LuminaLogo size={size} color={logoColor} />
      <span style={{ 
        fontFamily: 'Fraunces, serif', 
        fontWeight: 700, 
        fontSize: size * 0.6, 
        color: textColor,
        letterSpacing: '-0.015em'
      }}>Lumina</span>
    </div>
  );
};

export default LuminaLogo;
