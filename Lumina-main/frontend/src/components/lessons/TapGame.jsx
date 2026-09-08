import React, { useState } from 'react';

/**
 * src/components/lessons/TapGame.jsx
 * Bubble-pop choice game for Phase "activities"
 */

const TapGame = ({ 
  question = "Which is the correct one?", 
  options = [], 
  answer = "", 
  onComplete = null, 
  triggerReaction = null,
  isHighContrast = false 
}) => {
  const [wrongId, setWrongId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChoice = (choice, index) => {
    if (isCorrect) return;

    if (choice === answer) {
      setIsCorrect(true);
      if (triggerReaction) triggerReaction('correct');
      // Section 4: 1.5s delay before moving to next activity
      setTimeout(() => onComplete && onComplete(), 1500);
    } else {
      // Wrong choice logic from prompt: Shake and keep trying
      if (triggerReaction) triggerReaction('wrong');
      setWrongId(index);
      setTimeout(() => setWrongId(null), 800);
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
      width: '100%'
    },
    questionText: {
      fontSize: 'clamp(1.5rem, 4vh, 2.8rem)',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      marginBottom: '3vh',
      textAlign: 'center',
      fontFamily: "'Fredoka One', cursive"
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: options.length > 3 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '1.5rem',
      maxWidth: '800px',
      width: '100%',
      padding: '0.5rem'
    },
    bubble: (isCorrectChoice, isWrongChoice) => ({
      backgroundColor: isCorrectChoice ? '#4CAF50' : (isHighContrast ? '#161B22' : '#FFFFFF'),
      color: isCorrectChoice ? '#FFFFFF' : '#2D2D2D',
      fontSize: 'clamp(1rem, 3vh, 1.6rem)',
      fontWeight: '900',
      padding: '1.5rem 1rem',
      borderRadius: '2rem',
      border: isHighContrast ? '4px solid #FFFFFF' : (isWrongChoice ? '4px solid #FF6B35' : (isCorrectChoice ? '4px solid #4CAF50' : '2px solid #F5F0E8')),
      cursor: isCorrect ? 'default' : 'pointer',
      textAlign: 'center',
      boxShadow: isHighContrast ? 'none' : '0 8px 25px rgba(0,0,0,0.05)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: isCorrectChoice ? 'scale(1.1)' : (isWrongChoice ? 'scale(0.95)' : 'scale(1)'),
      animation: isWrongChoice ? 'shake 0.5s ease-in-out' : (isCorrectChoice ? 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none')
    })
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-1deg); }
          75% { transform: translateX(10px) rotate(1deg); }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1.1); }
        }
      `}</style>

      <h2 style={styles.questionText}>{question}</h2>

      <div style={styles.grid}>
        {options.map((choice, i) => (
          <button
            key={i}
            style={styles.bubble(isCorrect && choice === answer, wrongId === i)}
            onClick={() => handleChoice(choice, i)}
            aria-label={`Choice: ${choice}`}
            tabIndex={0}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TapGame;
