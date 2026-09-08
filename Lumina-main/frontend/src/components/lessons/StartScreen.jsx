import React from 'react';

/**
 * src/components/lessons/StartScreen.jsx
 * Phase 1 - High-impact entry screen for user interaction capture
 * 🔴 PR 1, 2, 3, 5 FIX: Restructured for light theme and structured layout.
 */

const StartScreen = ({ 
  lesson = {}, 
  subject = {}, 
  onStart = null, 
  isHighContrast = false 
}) => {
  const styles = {
    container: {
      width: '100vw',
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isHighContrast ? '#000000' : '#FFFDF5',
      padding: '1rem',
      boxSizing: 'border-box',
      textAlign: 'center',
      position: 'relative'
    },
    subjectBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      backgroundColor: isHighContrast ? '#1C2330' : `${subject.color}15`,
      color: isHighContrast ? '#FFFFFF' : subject.color,
      fontSize: '0.8rem',
      fontWeight: '800',
      marginBottom: '1vh',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    },
    heroIllustration: {
      fontSize: 'clamp(4rem, 15vh, 8rem)',
      marginBottom: '0.5vh',
      animation: 'floatIcon 3s infinite ease-in-out',
      filter: isHighContrast ? 'none' : 'drop-shadow(0 15px 30px rgba(0,0,0,0.1))'
    },
    title: {
      fontSize: 'clamp(1.8rem, 6vh, 3.2rem)', 
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      fontFamily: "'Fredoka One', cursive",
      lineHeight: '1.1',
      marginBottom: '1.5vh',
      maxWidth: '90%',
      wordWrap: 'break-word'
    },
    pillsRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '2vh',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    pill: {
      backgroundColor: '#FFFFFF',
      padding: '0.4rem 1rem',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#6B7280',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    startButton: {
      width: '100%',
      maxWidth: '380px',
      minHeight: '60px',
      fontSize: '1.4rem',
      fontWeight: '900',
      color: '#FFFFFF',
      backgroundColor: '#FF6B35',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(255,107,53,0.4)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      animation: 'bounceIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    footerHint: {
      marginTop: '1.5vh',
      fontSize: '0.9rem',
      color: '#A0A0A0',
      fontWeight: '600'
    }
  };

  const getIllustration = () => {
    if (subject.id === 'math') return '🔢';
    if (subject.id === 'evs') return '🌿';
    if (subject.id === 'english') return '📖';
    return subject.icon || '✨';
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* 🟢 TOP: Subject Badge */}
      <div style={styles.subjectBadge}>
        <span>{subject.icon}</span>
        <span>{subject.name}</span>
      </div>

      {/* 🔴 CENTER: Illustration */}
      <div style={styles.heroIllustration}>
        {getIllustration()}
      </div>

      {/* 🔴 CENTER: Lesson Title */}
      <h1 style={styles.title}>{lesson.title}</h1>

      {/* 🔴 CENTER: Duration/Difficulty pills */}
      <div style={styles.pillsRow}>
        <div style={styles.pill}>
          <span>⏱️</span> {lesson.duration || "10 mins"}
        </div>
        <div style={styles.pill}>
          <span>🎖️</span> {lesson.difficulty || "Beginner"}
        </div>
      </div>

      {/* 🔴 BOTTOM: START Button */}
      <button 
        style={styles.startButton} 
        onClick={onStart}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
      >
        START ADVENTURE 🚀
      </button>

      <p style={styles.footerHint}>Ready? Let's go! 🔈</p>
    </div>
  );
};

export default StartScreen;
