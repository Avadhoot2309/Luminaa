import React from 'react';
import rewardService from '../../services/rewardService';

/**
 * RewardPopup - High-impact reward visual for big achievements
 */
const RewardPopup = ({ stars, message = "You're Amazing!", onDismiss }) => {
  if (!stars) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      color: 'white',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin-grow {
          0% { transform: rotate(0) scale(0); }
          100% { transform: rotate(720deg) scale(1); }
        }
        @keyframes bounce-msg {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div style={{
        fontSize: '8rem',
        marginBottom: '1rem',
        animation: 'spin-grow 1s ease-out'
      }}>
        🌟
      </div>

      <h1 style={{
        fontSize: '4rem',
        fontWeight: 900,
        marginBottom: '0.5rem',
        color: '#FFD700',
        textShadow: '0 0 30px rgba(255,215,0,0.5)',
        animation: 'bounce-msg 2s infinite ease-in-out'
      }}>
        +{stars} Stars!
      </h1>

      <p style={{
        fontSize: '2rem',
        fontWeight: 700,
        opacity: 0.9,
        marginBottom: '3rem'
      }}>
        {message}
      </p>

      <button
        onClick={onDismiss}
        style={{
          padding: '1.5rem 5rem',
          fontSize: '1.8rem',
          fontWeight: 900,
          backgroundColor: '#4A90D9',
          color: 'white',
          border: 'none',
          borderRadius: '2.5rem',
          cursor: 'pointer',
          boxShadow: '0 10px 40px rgba(74,144,217,0.4)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Keep Going! →
      </button>
    </div>
  );
};

export default RewardPopup;
