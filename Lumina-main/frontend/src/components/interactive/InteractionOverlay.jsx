import React, { useState, useEffect } from 'react';
import VoiceInput from './VoiceInput';

/**
 * InteractionOverlay - Shown after each story chunk
 * Asks the child to repeat a key phrase
 * Props:
 *   keywords[]       - words to check
 *   prompt           - e.g. "Can you say 'sun rises'?"
 *   onCorrect()
 *   onWrong()
 *   onSkip()
 *   accentColor
 *   isHighContrast
 *   visible
 */

const InteractionOverlay = ({
  keywords = [],
  prompt = "Can you say that with me?",
  onCorrect,
  onWrong,
  onSkip,
  accentColor = '#E8920C',
  isHighContrast = false,
  visible = false,
  isNudging = false
}) => {
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'

  useEffect(() => {
    if (visible) {
      setAnswered(false);
      setFeedback(null);
    }
  }, [visible]);

  if (!visible) return null;

  const handleResult = ({ keywordMatched, transcript, unsupported }) => {
    if (unsupported) { onSkip && onSkip(); return; }
    setAnswered(true);
    if (keywordMatched) {
      setFeedback('correct');
      setTimeout(() => { onCorrect && onCorrect(transcript); }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setAnswered(false);
        onWrong && onWrong(transcript);
      }, 1500);
    }
  };

  return (
    <>
      <style>{`
        @keyframes overlay-slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes glow-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 ${accentColor}44; }
          50% { transform: scale(1.05); box-shadow: 0 0 30px 10px ${accentColor}88; }
          100% { transform: scale(1); box-shadow: 0 0 0 0 ${accentColor}44; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: '6rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        backgroundColor: isHighContrast ? '#111' : '#FFFFFF',
        border: `2px solid ${accentColor}`,
        borderRadius: '2rem',
        padding: '2rem 2.5rem',
        maxWidth: '480px',
        width: '90vw',
        textAlign: 'center',
        boxShadow: `0 20px 60px rgba(0,0,0,0.15)`,
        animation: isNudging ? 'glow-pulse 1.5s infinite ease-in-out' : 'overlay-slide-up 0.4s ease-out',
        transition: 'all 0.3s'
      }}>
        {/* Prompt */}
        {!answered && (
          <>
            <p style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: isHighContrast ? '#FFF' : '#1A2635',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}>
              {prompt}
            </p>
            <VoiceInput
              keywords={keywords}
              onResult={handleResult}
              isHighContrast={isHighContrast}
              accentColor={accentColor}
            />
            <button
              onClick={() => { onSkip && onSkip(); }}
              style={{
                marginTop: '1.2rem',
                backgroundColor: isHighContrast ? '#333' : '#F1F5F9',
                border: isHighContrast ? '2px solid white' : 'none',
                color: isHighContrast ? '#FFF' : '#64748B',
                padding: '0.8rem 2rem',
                borderRadius: '1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 800,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E2E8F0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = isHighContrast ? '#333' : '#F1F5F9'}
            >
              Skip for now →
            </button>
          </>
        )}

        {/* Feedback */}
        {feedback === 'correct' && (
          <div style={{ fontSize: '3rem' }}>
            🌟<br />
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#22C55E' }}>Amazing!</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div style={{ fontSize: '2rem' }}>
            😊<br />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#E8920C' }}>Let's try together!</span>
          </div>
        )}
      </div>
    </>
  );
};

export default InteractionOverlay;
