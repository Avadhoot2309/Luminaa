import React, { useEffect, useState } from 'react';

/**
 * src/components/lessons/ReactionEngine.jsx
 * Screen-wide visual feedback for correct/wrong answers and encouragement
 */

const ReactionEngine = ({ trigger = null }) => {
  const [active, setActive] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      setActive(trigger);
      
      // Section 9: Correct → 60-piece confetti fall + Star Burst
      if (trigger === 'correct') {
        const pieces = Array.from({ length: 60 }).map((_, i) => ({
          id: `confetti-${i}`,
          x: Math.random() * 100,
          y: -20 - Math.random() * 50,
          size: 5 + Math.random() * 10,
          color: ['#3FB950', '#58A6FF', '#FFD700', '#FF7EC7'][Math.floor(Math.random() * 4)],
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2,
          rotation: Math.random() * 360,
          type: 'confetti'
        }));
        
        // Star Burst particles exploding from center
        const stars = Array.from({ length: 20 }).map((_, i) => ({
          id: `star-${i}`,
          x: 50,
          y: 50,
          size: 20 + Math.random() * 20,
          color: '#FFD700',
          angle: (i / 20) * 360,
          velocity: 15 + Math.random() * 10,
          type: 'star'
        }));

        setParticles([...pieces, ...stars]);
      }

      // Encouragement → Heart Bubbles
      if (trigger === 'encourage') {
        const hearts = Array.from({ length: 15 }).map((_, i) => ({
          id: `heart-${i}`,
          x: 20 + Math.random() * 60,
          y: 100,
          size: 20 + Math.random() * 15,
          color: '#FF7EC7',
          delay: Math.random() * 1.5,
          duration: 2 + Math.random() * 2,
          type: 'heart'
        }));
        setParticles(hearts);
      }

      // Wrong → Gentle Rain
      if (trigger === 'wrong') {
         const rain = Array.from({ length: 20 }).map((_, i) => ({
          id: `rain-${i}`,
          x: Math.random() * 100,
          y: -10,
          size: 4 + Math.random() * 4,
          color: '#58A6FF',
          delay: Math.random() * 1,
          duration: 1 + Math.random() * 0.5,
          type: 'rain'
        }));
        setParticles(rain);
      }

      const timer = setTimeout(() => {
        setActive(null);
        setParticles([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!active) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 2000,
      overflow: 'hidden'
    },
    glow: {
      position: 'absolute',
      inset: 0,
      boxShadow: 
        active === 'correct' ? 'inset 0 0 120px rgba(76, 175, 80, 0.4)' : 
        active === 'wrong' ? 'inset 0 0 100px rgba(255, 107, 53, 0.3)' : 
        active === 'encourage' ? 'inset 0 0 100px rgba(255, 126, 199, 0.3)' : 'none',
      border: 
        active === 'correct' ? '12px solid #4CAF50' : 
        active === 'wrong' ? '12px solid #FF6B35' : 
        active === 'encourage' ? '12px solid #FF7EC7' : 'none',
      opacity: 0.8,
      animation: 'glowPulse 2s infinite ease-in-out'
    },
    particle: (p) => {
      if (p.type === 'confetti') return {
        position: 'absolute',
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        backgroundColor: p.color,
        borderRadius: Math.random() > 0.5 ? '50%' : '20%',
        transform: `rotate(${p.rotation}deg)`,
        animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      };
      
      if (p.type === 'star') return {
        position: 'absolute',
        left: `${p.x}%`,
        top: `${p.y}%`,
        fontSize: `${p.size}px`,
        color: p.color,
        transform: 'translate(-50%, -50%)',
        animation: `burst-${p.id} 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
        filter: 'drop-shadow(0 0 10px gold)'
      };

      if (p.type === 'heart') return {
        position: 'absolute',
        left: `${p.x}%`,
        top: `${p.y}%`,
        fontSize: `${p.size}px`,
        animation: `float-up ${p.duration}s ease-out ${p.delay}s forwards`,
        opacity: 0
      };

      if (p.type === 'rain') return {
        position: 'absolute',
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: '2px',
        height: `${p.size * 3}px`,
        backgroundColor: p.color,
        borderRadius: '2px',
        animation: `rain-fall ${p.duration}s linear ${p.delay}s forwards`,
        opacity: 0.6
      };
    }
  };

  const renderStarAnimation = (p) => {
    const angleRad = (p.angle * Math.PI) / 180;
    const destX = Math.cos(angleRad) * p.velocity;
    const destY = Math.sin(angleRad) * p.velocity;
    return `
      @keyframes burst-${p.id} {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
        100% { transform: translate(calc(-50% + ${destX}vw), calc(-50% + ${destY}vh)) scale(1.5) rotate(360deg); opacity: 0; }
      }
    `;
  };

  return (
    <div style={styles.overlay} aria-hidden="true">
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
        @keyframes rain-fall {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(110vh); opacity: 0.2; }
        }
        ${particles.filter(p => p.type === 'star').map(renderStarAnimation).join('')}
      `}</style>

      {/* Border Glow */}
      <div style={styles.glow} />

      {/* Particles */}
      {particles.map((p) => (
        <div key={p.id} style={styles.particle(p)}>
          {p.type === 'star' ? '⭐' : p.type === 'heart' ? '💖' : ''}
        </div>
      ))}
    </div>
  );
};

export default ReactionEngine;
