import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { LuminaLogo } from '../BrandLogo';

// Luminaa Design Tokens (consistent with StudentDashboard)
const C = {
  navy: '#0A1628',
  amber: '#E8920C',
  teal: '#1A7A62',
  cream: '#F7F6F2',
  white: '#FFFFFF',
  black: '#000000',
  slate400: '#94A3B8',
  slate600: '#475569',
};

const Fonts = {
  heading: 'Fraunces, serif',
  body: 'Nunito, sans-serif',
  dyslexic: 'OpenDyslexic, sans-serif'
};

const Icons = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '20px', height: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Speaker: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '20px', height: '20px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
};

export default function GameContainer({ 
  title, 
  description, 
  type = 'iframe', // 'iframe' or 'component'
  gameSource, 
  background,
  onGameEnd 
}) {
  const navigate = useNavigate();
  const { profile } = useProfile() || { profile: null };
  const [isLoading, setIsLoading] = useState(true);

  // Disability Detection
  const dis = profile?.disabilities || [];
  const rawDisText = (dis.join(' ') || '').toLowerCase();
  const hasDyslexia = rawDisText.includes('dyslexia');
  const hasLowVision = rawDisText.includes('low') || rawDisText.includes('vision');

  const currentFont = hasDyslexia ? Fonts.dyslexic : Fonts.body;
  const isHighContrast = hasLowVision;

  useEffect(() => {
    // Read the game title on load for Low Vision users
    if (hasLowVision && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(`Started game: ${title}. ${description}`);
      window.speechSynthesis.speak(utter);
    }
  }, [title, description, hasLowVision]);

  // ✅ FIX: Set loading to false for component-based games immediately
  useEffect(() => {
    if (type === 'component') {
      setIsLoading(false);
    }
  }, [type]);

  const handleReadScreen = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(`${title}. ${description}`);
      window.speechSynthesis.speak(utter);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: isHighContrast ? C.black : (background || C.cream),
    fontFamily: currentFont,
    overflow: 'hidden',
    color: isHighContrast ? C.white : C.navy,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    height: hasLowVision ? '100px' : '80px',
    backgroundColor: isHighContrast ? C.black : C.white,
    borderBottom: isHighContrast ? `3px solid ${C.white}` : `1px solid rgba(0,0,0,0.05)`,
    boxShadow: isHighContrast ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
    zIndex: 10,
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'none',
    border: isHighContrast ? `2px solid ${C.white}` : 'none',
    color: isHighContrast ? C.white : C.navy,
    cursor: 'pointer',
    fontSize: isHighContrast ? '24px' : '16px',
    fontWeight: 'bold',
    padding: isHighContrast ? '12px 24px' : '8px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  };

  const gameAreaStyle = {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    overflow: 'hidden',
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: isHighContrast ? `4px solid ${C.white}` : 'none',
    borderRadius: isHighContrast ? '0' : '24px',
    boxShadow: isHighContrast ? 'none' : '0 20px 50px rgba(0,0,0,0.1)',
    backgroundColor: C.white,
  };

  return (
    <div style={containerStyle}>
      {/* GAME HEADER */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={backButtonStyle}
            onMouseEnter={(e) => { if(!isHighContrast) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)' }}
            onMouseLeave={(e) => { if(!isHighContrast) e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <Icons.Back /> {hasLowVision ? 'GO BACK' : 'Back'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!hasLowVision && <LuminaLogo size={32} color={C.amber} />}
            <div>
              <h1 style={{ margin: 0, fontSize: hasLowVision ? '28px' : '20px', fontFamily: Fonts.heading, fontWeight: 'bold' }}>
                {title}
              </h1>
              {!hasLowVision && (
                <p style={{ margin: 0, fontSize: '13px', color: C.slate600, fontWeight: 600 }}>{description}</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleReadScreen}
            style={{
              ...backButtonStyle,
              backgroundColor: isHighContrast ? C.amber : 'rgba(74, 144, 217, 0.1)',
              color: isHighContrast ? C.black : '#4A90D9',
              border: isHighContrast ? `2px solid ${C.white}` : 'none',
              padding: isHighContrast ? '12px 24px' : '10px 20px',
            }}
          >
            <Icons.Speaker /> {hasLowVision ? 'READ SCREEN' : 'Help'}
          </button>
        </div>
      </header>

      {/* GAME AREA */}
      <main style={gameAreaStyle}>
        {isLoading && (
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 5 }}>
            <div style={{ width: '60px', height: '60px', border: `6px solid ${C.amber}33`, borderTopColor: C.amber, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontWeight: 'bold', color: isHighContrast ? C.white : C.slate600 }}>Loading Adventure...</p>
          </div>
        )}

        {type === 'iframe' ? (
          <iframe 
            src={gameSource} 
            style={iframeStyle}
            onLoad={() => setIsLoading(false)}
            title={title}
            allow="autoplay; fullscreen"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Component-based games go here */}
             {gameSource}
          </div>
        )}
      </main>

      {/* ACCESSIBILITY OVERLAY (For Dyslexia Reading Support) */}
      {hasDyslexia && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px 24px', borderRadius: '99px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', border: `1px solid ${C.amber}` }}>
           <span style={{ fontSize: '14px', fontWeight: 'bold', color: C.amber }}>OpenDyslexic font active</span>
        </div>
      )}
    </div>
  );
}
