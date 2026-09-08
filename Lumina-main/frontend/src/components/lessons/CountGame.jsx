import React, { useState, useEffect } from 'react';

/**
 * src/components/lessons/CountGame.jsx
 * Tap-to-count activity for physical engagement and arithmetic basics
 */

const CountGame = ({ 
  question = "How many can you count?", 
  count = 1, 
  emoji = "🍎", 
  onComplete = null, 
  triggerReaction = null,
  isHighContrast = false 
}) => {
  // Track which unique emoji indices have been 'tapped' or 'collected'
  const [tappedIndices, setTappedIndices] = useState(new Set());
  const [complete, setComplete] = useState(false);

  // Auto-complete logic when the set size reaches the target count
  useEffect(() => {
    if (tappedIndices.size === count && !complete) {
      setComplete(true);
      // Section 4: 1.5s delay before moving to next activity
      const timer = setTimeout(() => onComplete && onComplete(), 1500);
      return () => clearTimeout(timer);
    }
  }, [tappedIndices, count, complete, onComplete]);

  const handleTap = (index) => {
    if (complete || tappedIndices.has(index)) return;

    // Trigger individual click sound
    if (triggerReaction) triggerReaction('click');

    // Create a new set to trigger re-render
    const nextTapped = new Set(tappedIndices);
    nextTapped.add(index);
    setTappedIndices(nextTapped);

    // If this tap completes the count, trigger celebration
    if (nextTapped.size === count) {
      if (triggerReaction) triggerReaction('correct');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      height: '100%',
      width: '100%',
      textAlign: 'center'
    },
    questionText: {
      fontSize: 'clamp(1.5rem, 4vh, 2.8rem)',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      marginBottom: '2vh',
      textAlign: 'center',
      fontFamily: "'Fredoka One', cursive"
    },
    itemsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      marginBottom: '3vh',
      maxWidth: '800px',
      maxHeight: '40vh',
      overflowY: 'auto',
      padding: '1rem'
    },
    item: {
      fontSize: 'clamp(3rem, 10vh, 5rem)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      userSelect: 'none',
      filter: isHighContrast ? 'none' : 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))'
    },
    counter: {
      fontSize: 'clamp(2rem, 6vh, 4rem)',
      fontWeight: '900',
      color: '#FF6B35',
      fontFamily: "'Fredoka One', cursive",
      marginBottom: '2vh'
    },
    confirmBtn: (active) => ({
      padding: '1rem 2.5rem',
      fontSize: '1.4rem',
      fontWeight: '950',
      backgroundColor: active ? '#4CAF50' : '#E5E7EB',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '2rem',
      cursor: active ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s',
      opacity: active ? 1 : 0.5,
      boxShadow: active ? '0 8px 25px rgba(76,175,80,0.3)' : 'none'
    }),
    emojiBubble: (isTapped) => ({
      fontSize: '5rem',
      width: '130px',
      height: '130px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      backgroundColor: isTapped ? '#4CAF50' : '#FFFFFF', // 🔴 FIXED
      border: isHighContrast 
        ? (isTapped ? '4px solid #4CAF50' : '4px solid #FFFFFF') 
        : (isTapped ? '4px solid #4CAF50' : '4px solid #F5F0E8'), // 🔴 FIXED
      cursor: isTapped ? 'default' : 'pointer',
      opacity: isTapped ? 0.3 : 1,
      color: isTapped ? '#FFFFFF' : 'inherit',
      transform: isTapped ? 'scale(0.8) rotate(15deg)' : 'scale(1) rotate(0)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: isTapped ? 'none' : '0 10px 30px rgba(0,0,0,0.05)',
      animation: isTapped ? 'none' : 'float 3s infinite ease-in-out alternate'
    })
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-15px); }
        }
      `}</style>

      <h2 style={styles.questionText}>{question}</h2>

      <div style={styles.counter}>
        Count: {tappedIndices.size} / {count} {complete && '✅'}
      </div>

      <div style={styles.itemsContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            style={styles.emojiBubble(tappedIndices.has(i))}
            onClick={() => handleTap(i)}
            aria-label={`Target ${i + 1}`}
            tabIndex={0}
            disabled={complete || tappedIndices.has(i)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountGame;
