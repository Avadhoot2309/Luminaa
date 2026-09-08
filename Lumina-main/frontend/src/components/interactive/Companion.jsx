import React, { useState, useEffect } from 'react';

/**
 * Companion - Animated floating tutor character (Owl 🦉)
 * States: idle | talking | happy | sad | thinking
 * Props: state, message, isHighContrast
 */

const COMPANION_MESSAGES = {
  idle: '',
  talking: '',
  happy: "You're doing great! 🌟",
  sad: "That's okay! Let's try again 😊",
  thinking: "Hmm, let me think... 🤔",
  encourage: "You can do it! I believe in you! 💪",
  hint: "Psst! Look for the answer in the sentence above! 👆",
  listen: "I'm listening! Speak clearly 🎤",
};

const Companion = ({ state = 'idle', message, isHighContrast = false, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [displayMsg, setDisplayMsg] = useState('');

  useEffect(() => {
    const msg = message || COMPANION_MESSAGES[state] || '';
    if (msg) {
      setDisplayMsg(msg);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [state, message]);

  // Emoji + color per state
  const stateConfig = {
    idle:      { emoji: '🦉', bg: '#1A7A62', glow: 'rgba(26, 122, 98, 0.4)', anim: 'float' },
    talking:   { emoji: '🦉', bg: '#4A90D9', glow: 'rgba(74, 144, 217, 0.5)', anim: 'bounce' },
    happy:     { emoji: '🦉', bg: '#E8920C', glow: 'rgba(232, 146, 12, 0.6)', anim: 'happy-flip' },
    sad:       { emoji: '🦉', bg: '#64748B', glow: 'rgba(100, 116, 139, 0.3)', anim: 'shake' },
    thinking:  { emoji: '💭', bg: '#9333EA', glow: 'rgba(147, 51, 234, 0.4)', anim: 'pulse' },
    encourage: { emoji: '🦉', bg: '#1A7A62', glow: 'rgba(26, 122, 98, 0.5)', anim: 'wave' },
    hint:      { emoji: '💡', bg: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)', anim: 'pulse' },
    listen:    { emoji: '🎤', bg: '#E8920C', glow: 'rgba(232, 146, 12, 0.6)', anim: 'bounce' },
  };

  const cfg = stateConfig[state] || stateConfig.idle;

  return (
    <>
      <style>{`
        @keyframes companion-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes companion-bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          30% { transform: scale(1.1) rotate(-5deg); }
          60% { transform: scale(0.95) rotate(5deg); }
        }
        @keyframes companion-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(15deg) scale(1.15); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes companion-happy-flip {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.4) rotate(180deg) translateY(-20px); }
          100% { transform: scale(1) rotate(360deg); }
        }
        @keyframes companion-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }
        @keyframes companion-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes companion-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes companion-droop {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-5deg) translateY(4px); }
        }
        @keyframes bubble-in {
          0% { opacity: 0; transform: scale(0.7) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.7rem',
        pointerEvents: 'none',
      }}>
        {/* Speech Bubble */}
        {visible && displayMsg && (
          <div style={{
            backgroundColor: isHighContrast ? '#1a1a1a' : '#FFFFFF',
            color: isHighContrast ? '#FFFFFF' : '#1A2635',
            border: `2px solid ${cfg.bg}`,
            borderRadius: '1.2rem',
            borderBottomRightRadius: '0.3rem',
            padding: '0.8rem 1.2rem',
            fontSize: '1rem',
            fontWeight: 700,
            maxWidth: '220px',
            boxShadow: `0 4px 20px ${cfg.glow}`,
            animation: 'bubble-in 0.3s ease-out',
            pointerEvents: 'auto',
            position: 'relative',
          }}>
            {displayMsg}
            {onDismiss && (
              <button
                onClick={onDismiss}
                style={{
                  position: 'absolute', top: '4px', right: '6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.75rem', opacity: 0.5, lineHeight: 1,
                }}
              >✕</button>
            )}
          </div>
        )}

        {/* Character */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: cfg.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: `0 6px 25px ${cfg.glow}`,
          animation: `companion-${cfg.anim} 2s ease-in-out infinite`,
          cursor: 'default',
          border: isHighContrast ? '3px solid white' : 'none',
          pointerEvents: 'auto',
        }}>
          {cfg.emoji}
        </div>
      </div>
    </>
  );
};

export default Companion;
