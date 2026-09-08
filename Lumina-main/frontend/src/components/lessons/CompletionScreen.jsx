import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RewardPopup from './RewardPopup';
import { getNextLesson } from '../../data/syllabusData';

/**
 * src/components/lessons/CompletionScreen.jsx
 * Phase 7 - Final celebratory summary of lesson achievement
 */

const CompletionScreen = ({ 
  lesson = {}, 
  stars = 0, 
  onReturn = null, 
  isHighContrast = false 
}) => {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const nextLesson = getNextLesson(lesson.id);

  useEffect(() => {
    // Show the celebratory modal after a short initial delay for impact
    const timer = setTimeout(() => setShowCelebration(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/lessons/${nextLesson.subjectId}/${nextLesson.id}`);
    } else {
      navigate('/subjects');
    }
  };

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: isHighContrast ? '#000000' : 'transparent',
      textAlign: 'center',
      height: '100%',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    },
    heroIcon: {
      fontSize: 'clamp(4rem, 12vh, 7rem)',
      marginBottom: '0.5vh',
      filter: isHighContrast ? 'none' : 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
      animation: 'heroFloat 4s infinite ease-in-out'
    },
    title: {
      fontSize: '0.9rem',
      fontWeight: '800',
      color: '#8B949E',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      marginBottom: '0.5vh'
    },
    lessonName: {
      fontSize: 'clamp(1.8rem, 5vh, 3rem)',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      fontFamily: "'Fredoka One', cursive",
      lineHeight: '1.1',
      marginBottom: '2vh',
      maxWidth: '80% '
    },
    summaryGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '3vh',
      width: '100%',
      maxWidth: '400px'
    },
    statBox: {
      padding: '1.2rem 2rem',
      backgroundColor: isHighContrast ? '#1C2330' : '#FFFFFF',
      borderRadius: '25px',
      border: isHighContrast ? '4px solid #FFFFFF' : '2px solid #F5F0E8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '5px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
    },
    statValue: {
      fontSize: 'clamp(2rem, 5vh, 2.8rem)',
      fontWeight: '900',
      color: '#FFD700',
      fontFamily: "'Fredoka One', cursive"
    },
    statLabel: {
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#8B949E'
    },
    btnGroup: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    primaryButton: {
      padding: '1rem 2.5rem',
      fontSize: 'clamp(1.2rem, 3vh, 1.5rem)',
      fontWeight: '900',
      color: '#FFFFFF',
      backgroundColor: isHighContrast ? '#000000' : '#4CAF50',
      border: isHighContrast ? '4px solid #FFFFFF' : 'none',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      boxShadow: isHighContrast ? 'none' : '0 15px 40px rgba(76, 175, 80, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    secondaryButton: {
      padding: '1rem 2.5rem',
      fontSize: 'clamp(1.2rem, 3vh, 1.4rem)',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#6B7280',
      backgroundColor: 'transparent',
      border: isHighContrast ? '4px solid #8B949E' : '2px solid #F5F0E8',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Reward Popup Modal */}
      <RewardPopup 
        visible={showCelebration} 
        stars={stars} 
        message="ADVENTURE COMPLETE!" 
        isHighContrast={isHighContrast}
      />

      <div style={styles.title}>CHALLENGE MASTERED!</div>
      <div style={styles.heroIcon}>🏆</div>
      <h1 style={styles.lessonName}>{lesson.title}</h1>

      <div style={styles.summaryGrid}>
        <div style={styles.statBox}>
          <div style={styles.statValue}>⭐ {stars}</div>
          <div style={styles.statLabel}>Total Stars Collected</div>
        </div>
      </div>

      <div style={styles.btnGroup}>
        <button 
          style={styles.primaryButton} 
          onClick={handleNext}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
        >
          {nextLesson ? 'NEXT ADVENTURE 🚀' : 'BACK TO SUBJECTS 📚'}
        </button>

        <button 
          style={styles.secondaryButton} 
          onClick={onReturn}
        >
          DASHBOARD 🏠
        </button>
      </div>

      {/* Decorative stars scattered bg */}
      {!isHighContrast && Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
          fontSize: `${2 + Math.random() * 3}rem`,
          opacity: 0.2,
          zIndex: -1
        }}>✨</div>
      ))}
    </div>
  );
};

export default CompletionScreen;
