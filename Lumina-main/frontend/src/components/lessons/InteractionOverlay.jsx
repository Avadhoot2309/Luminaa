import React, { useState, useEffect } from 'react';
import VoiceInput from './VoiceInput';

/**
 * src/components/lessons/InteractionOverlay.jsx
 * Phase 3 - Repeat-after-me Voice Interactive Overlay
 */

const InteractionOverlay = ({ 
  visible = false, 
  keywords = [], 
  prompt = "Can you say one of these words?", 
  onCorrect = null, 
  onSkip = null, 
  isHighContrast = false 
}) => {
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setAttempts(0);
      setFeedback("");
      setSuccess(false);
    }
  }, [visible]);

  const handleResult = (result) => {
    if (result.matched) {
      setSuccess(true);
      setFeedback("Amazing! 🌟");
      // Section 4: 1.2s delay before moving to phase "video"
      setTimeout(() => onCorrect && onCorrect(), 1200);
    } else {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      // Section 4: Wrong → gentle retry (max 2 attempts)
      if (nextAttempt >= 2) {
        setFeedback("That's okay! We'll keep going.");
        setTimeout(() => onSkip && onSkip(), 1500);
      } else {
        setFeedback("Let's try that one more time! 🎤");
      }
    }
  };

  if (!visible) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: isHighContrast ? 'rgba(0,0,0,0.95)' : 'rgba(255, 253, 245, 0.98)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1500,
      padding: '1rem',
      boxSizing: 'border-box'
    },
    header: {
      marginBottom: '2vh',
      textAlign: 'center',
      width: '100%'
    },
    promptText: {
      fontSize: 'clamp(1.8rem, 5vh, 2.8rem)',
      fontWeight: '900',
      color: '#FF6B35',
      fontFamily: "'Fredoka One', cursive",
      marginBottom: '1rem'
    },
    keywordsWrapper: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '2vh'
    },
    keywordBadge: {
      padding: '0.6rem 1.4rem',
      borderRadius: '50px',
      backgroundColor: isHighContrast ? '#000000' : 'rgba(255, 107, 53, 0.08)',
      border: isHighContrast ? '3px solid #FFFFFF' : '2px solid #FF6B35',
      color: isHighContrast ? '#FFFFFF' : '#FF6B35',
      fontSize: 'clamp(1rem, 3vh, 1.4rem)',
      fontWeight: '800'
    },
    feedbackText: {
      fontSize: 'clamp(1.5rem, 4vh, 2.2rem)',
      fontWeight: '900',
      color: success ? '#4CAF50' : (isHighContrast ? '#FFFFFF' : '#FF6B35'),
      marginTop: '1.5rem',
      fontFamily: "'Fredoka One', cursive",
      transition: 'all 0.3s'
    },
    skipBtn: {
      position: 'absolute',
      bottom: '3vh',
      right: '3vw',
      background: 'none',
      border: isHighContrast ? '2px solid white' : 'none',
      color: '#6B7280',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      opacity: 0.6,
      transition: 'opacity 0.2s',
      borderRadius: '10px',
      padding: '8px 16px'
    }
  };

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Voice Interaction Phase">
      <div style={styles.header}>
        <h2 style={styles.promptText}>{prompt}</h2>
        <div style={styles.keywordsWrapper}>
          {keywords.map((k, i) => (
            <div key={i} style={styles.keywordBadge}>{k}</div>
          ))}
        </div>
      </div>

      <VoiceInput 
        question="" 
        keywords={keywords} 
        onResult={handleResult} 
        isHighContrast={isHighContrast} 
      />

      {feedback && <div style={styles.feedbackText}>{feedback}</div>}

      <button 
        style={styles.skipBtn} 
        onClick={onSkip} 
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        Skip for now →
      </button>
    </div>
  );
};

export default InteractionOverlay;
