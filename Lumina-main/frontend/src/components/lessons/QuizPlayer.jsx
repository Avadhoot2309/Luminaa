import React, { useState, useEffect } from 'react';

/**
 * src/components/lessons/QuizPlayer.jsx
 * Phase 6 - Sequential Quiz Player with retry logic and reward attribution
 */

const QuizPlayer = ({ 
  quiz = [], 
  onComplete = null, 
  triggerReaction = null,
  isHighContrast = false 
}) => {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [quizStars, setQuizStars] = useState(0); // 🔴 BUG 8 FIX: Local star tracking

  const current = quiz[index];

  const handleChoice = (option, idx) => {
    if (selectedId !== null) return; // Prevent double tapping

    setSelectedId(idx);
    const correct = option === current.answer;
    
    if (correct) {
      setIsCorrect(true);
      if (triggerReaction) triggerReaction('correct');
      // Section 4 Path 6: Correct first try → +2 stars, retry → +1 star
      const earned = attempts === 0 ? 2 : 1;
      setQuizStars(prev => prev + earned);

      // Auto-advance after 2 seconds
      setTimeout(nextQuestion, 2000);
    } else {
      setIsCorrect(false);
      if (triggerReaction) triggerReaction('wrong');
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      // Section 4 Path 6: Wrong → show "Try again!" once, then reveal correct answer
      if (nextAttempt >= 2) {
        // Reveal correct answer and wait 2 seconds before moving on
        setTimeout(nextQuestion, 2000);
      } else {
        // Clear selection to allow retry after short feedback pause
        setTimeout(() => {
          setSelectedId(null);
        }, 800);
      }
    }
  };

  const nextQuestion = () => {
    if (index < quiz.length - 1) {
      setIndex(p => p + 1);
      setSelectedId(null);
      setIsCorrect(false);
      setAttempts(0);
    } else {
      // 🔴 BUG 4 & 8 FIX: Pass final local count to parent
      onComplete && onComplete(quizStars + (isCorrect ? (attempts === 0 ? 2 : 1) : 0));
    }
  };

  if (!current) return null;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      flex: 1,
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    },
    questionHeader: {
      marginBottom: '2vh',
      textAlign: 'center',
      width: '100%'
    },
    questionText: {
      fontSize: 'clamp(1.2rem, 3.5vh, 2rem)',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      fontFamily: "'Fredoka One', cursive",
      lineHeight: '1.3'
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '45vh',
      overflowY: 'auto',
      padding: '0.5rem',
      boxSizing: 'border-box'
    },
    optionBtn: (isSelected, isCorrectOption, isWrongOption) => ({
      width: '100%',
      padding: '1rem 1.5rem',
      fontSize: 'clamp(1rem, 2.5vh, 1.3rem)',
      fontWeight: '800',
      borderRadius: '1.2rem',
      textAlign: 'left',
      cursor: selectedId !== null ? 'default' : 'pointer',
      border: isHighContrast 
        ? (isSelected ? '4px solid #FFB800' : '4px solid #FFFFFF')
        : (isSelected && isCorrectOption ? '3px solid #4CAF50' : (isSelected && isWrongOption ? '3px solid #FF6B35' : '2px solid #F5F0E8')),
      backgroundColor: isSelected && isCorrectOption ? '#4CAF5015' : (isSelected && isWrongOption ? '#FF6B3515' : (isHighContrast ? '#000000' : '#FFFFFF')),
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      opacity: (selectedId !== null && !isSelected && !isCorrectOption) ? 0.6 : 1
    }),
    badge: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '1rem',
      fontWeight: '900'
    },
    feedbackMsg: {
      marginTop: '2vh',
      fontSize: 'clamp(1.2rem, 3vh, 1.6rem)',
      fontWeight: '900',
      fontFamily: "'Fredoka One', cursive",
      color: isCorrect ? '#4CAF50' : '#FF6B35'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.questionHeader}>
        <div style={{ color: '#8B949E', fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          QUESTION {index + 1} / {quiz.length}
        </div>
        <h2 style={styles.questionText}>{current.question}</h2>
      </div>

      <div style={styles.optionsContainer}>
        {current.options.map((option, i) => {
          const isSelected = selectedId === i;
          const isCorrectOption = option === current.answer;
          const isWrongOption = isSelected && !isCorrectOption;

          return (
            <button 
              key={i} 
              style={styles.optionBtn(isSelected, isCorrectOption, isWrongOption)}
              onClick={() => handleChoice(option, i)}
              disabled={selectedId !== null}
            >
              <div style={styles.badge}>
                {selectedId === i ? (isCorrectOption ? '✓' : '✗') : String.fromCharCode(65 + i)}
              </div>
              {option}
            </button>
          );
        })}
      </div>

      <div style={styles.feedbackMsg}>
        {selectedId !== null && isCorrect && "Correct! 🌟"}
        {selectedId !== null && !isCorrect && attempts < 2 && "Try again! 😊"}
        {attempts >= 2 && !isCorrect && `Correct: ${current.answer}`}
      </div>
    </div>
  );
};

export default QuizPlayer;
