import React, { useEffect, useState } from 'react';

/**
 * src/components/lessons/RewardPopup.jsx
 * Full-screen celebration for activity/lesson completion
 */

const RewardPopup = ({ visible = false, stars = 0, message = "Amazing!", isHighContrast = false }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 500); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show && !visible) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: isHighContrast ? 'rgba(0,0,0,0.95)' : 'rgba(255, 253, 245, 0.95)', // 🔴 FIXED
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: 'auto'
    },
    container: {
      textAlign: 'center',
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    starsWrapper: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      justifyContent: 'center'
    },
    star: (i) => ({
      fontSize: '6rem',
      animation: `popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5) ${i * 0.2}s forwards`,
      opacity: 0,
      transform: 'scale(0)',
      filter: isHighContrast ? 'none' : 'drop-shadow(0 10px 15px rgba(255, 184, 0, 0.4))' // 🔴 FIXED
    }),
    messageText: {
      fontSize: '4.5rem',
      fontWeight: '950',
      color: '#FFB800', // 🔴 FIXED: Star Gold
      fontFamily: "'Fredoka One', cursive",
      marginBottom: '1rem',
      animation: 'slideUp 0.8s ease-out 0.8s forwards',
      opacity: 0,
      textShadow: '0 4px 20px rgba(255, 184, 0, 0.3)'
    },
    starCount: {
      fontSize: '2.5rem',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D', // 🔴 FIXED
      animation: 'fadeIn 1s ease-out 1.2s forwards',
      opacity: 0,
      fontFamily: "'Fredoka One', cursive"
    },
    // Floating confetti for the celebration from Section 9
    confetti: Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${5 + Math.random() * 10}px`,
      color: ['#58A6FF', '#3FB950', '#F78166', '#BC8CFF'][Math.floor(Math.random() * 4)],
      delay: Math.random() * 2
    }))
  };

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Reward Celebration">
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatConfetti {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(180deg); }
        }
      `}</style>

      {/* Scattered background celebratory shapes */}
      {!isHighContrast && styles.confetti.map((p) => (
        <div 
          key={p.id} 
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            opacity: 0.4,
            animation: `floatConfetti 4s infinite ease-in-out ${p.delay}s`,
            zIndex: -1
          }}
        />
      ))}

      <div style={styles.container}>
        <div style={styles.starsWrapper}>
          {/* Show up to 3 stars visually */}
          {Array.from({ length: Math.min(stars, 3) }).map((_, i) => (
            <div key={i} style={styles.star(i)}>⭐</div>
          ))}
        </div>

        <h2 style={styles.messageText}>{message}</h2>
        <div style={styles.starCount}>+ {stars} {stars === 1 ? 'Star' : 'Stars'} Earned!</div>
      </div>
    </div>
  );
};

export default RewardPopup;
