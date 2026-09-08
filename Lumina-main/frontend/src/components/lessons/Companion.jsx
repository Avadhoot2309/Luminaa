import React from 'react';

/**
 * src/components/lessons/Companion.jsx
 * Owl 🦉 Animated Tutor with Dynamic States and Messaging
 * 🔴 PR 4 FIX: Repositioned to bottom-right fixed, speech bubble above.
 */

const Companion = ({ state = 'idle', message = '', isHighContrast = false }) => {
  // Section 9: Owl States Configuration
  const stateConfig = {
    idle: { emoji: '🦉', animation: 'float' },
    talking: { emoji: '🦉', animation: 'bounce' },
    happy: { emoji: '🥳', animation: 'spin' },
    sad: { emoji: '🦉', animation: 'droop' },
    thinking: { emoji: '🤔', animation: 'pulse' },
    encourage: { emoji: '💪', animation: 'bounce' },
    hint: { emoji: '💡', animation: 'pulse' },
    listen: { emoji: '🎤', animation: 'bounce' }
  };

  const current = stateConfig[state] || stateConfig.idle;

  // Custom static messages based on the state for automated fallback
  const getDisplayMessage = () => {
    if (message) return message;
    switch (state) {
      case 'happy': return "You're amazing! 🌟";
      case 'sad': return "That's okay! Let's try again 😊";
      case 'thinking': return "Hmm let me think... 🤔";
      case 'encourage': return "You can do it! 💪";
      case 'hint': return "Psst! Look above for a clue! 👆";
      case 'listen': return "I'm listening! Speak clearly 🎤";
      default: return "";
    }
  };

  const displayMessage = getDisplayMessage();

  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end', // Align to right
      zIndex: 1000,
      pointerEvents: 'none',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    speechBubble: {
      backgroundColor: isHighContrast ? '#000000' : '#FFFFFF',
      color: '#2D2D2D', // Child-friendly dark text
      padding: '1rem 1.5rem',
      borderRadius: '20px',
      border: isHighContrast ? '4px solid #FFFFFF' : '2px solid #F5F0E8',
      marginBottom: '10px',
      fontSize: '1.1rem',
      fontWeight: '800',
      maxWidth: '200px', // 🔴 PR 4 FIX: Constrained width
      textAlign: 'center',
      position: 'relative',
      opacity: displayMessage ? 1 : 0,
      transform: displayMessage ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
      boxShadow: isHighContrast ? 'none' : '0 10px 30px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease-out',
      marginRight: '10px'
    },
    bubbleArrow: {
      position: 'absolute',
      bottom: '-10px',
      right: '25px',
      width: '0',
      height: '0',
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: `10px solid ${isHighContrast ? '#FFFFFF' : '#FFFFFF'}`,
      display: displayMessage ? 'block' : 'none'
    },
    owlWrapper: {
      fontSize: '5rem', // 🔴 PR 4 FIX: Scale down to approx 80px
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: `${current.animation} 2.5s infinite ease-in-out`,
      filter: isHighContrast ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        @keyframes bounce { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.1) translateY(-5px); } 
        }
        @keyframes spin { 
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); } 
        }
        @keyframes droop { 
          0%, 100% { transform: translateY(0) scale(1); } 
          50% { transform: translateY(10px) scale(0.95) rotate(-5deg); } 
        }
        @keyframes pulse { 
          0%, 100% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.8; transform: scale(1.05); } 
        }
      `}</style>

      {displayMessage && (
        <div style={styles.speechBubble}>
          {displayMessage}
          <div style={styles.bubbleArrow} />
        </div>
      )}

      <div style={styles.owlWrapper} role="img" aria-label={`Companion is ${state}`}>
        {current.emoji}
      </div>
    </div>
  );
};

export default Companion;
