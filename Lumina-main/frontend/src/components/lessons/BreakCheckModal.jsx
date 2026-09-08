import React from 'react';

/**
 * BreakCheckModal - Asks student if they're tired after 3 videos
 * ADHD-friendly: Clear options, visual appeal, encouraging tone
 */
const BreakCheckModal = ({ onContinue, onTakeBreak, videosWatched = 3 }) => {
    const styles = {
        overlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
        },
        modal: {
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.4s ease-out'
        },
        icon: {
            fontSize: '5rem',
            marginBottom: '1.5rem',
            animation: 'bounce 2s infinite'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '900',
            color: '#1A2635',
            marginBottom: '1rem'
        },
        message: {
            fontSize: '1.1rem',
            color: '#64748B',
            marginBottom: '2rem',
            lineHeight: '1.6'
        },
        counter: {
            fontSize: '0.9rem',
            color: '#E59E0B',
            fontWeight: '700',
            marginBottom: '2rem',
            padding: '0.8rem',
            backgroundColor: '#FEF3C7',
            borderRadius: '12px',
            borderLeft: '4px solid #E59E0B'
        },
        buttonGroup: {
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column'
        },
        button: (isPrimary) => ({
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: isPrimary ? '#2563EB' : '#F1F5F9',
            color: isPrimary ? '#FFFFFF' : '#1A2635',
            boxShadow: isPrimary ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isPrimary ? '0 6px 20px rgba(37, 99, 235, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)'
            }
        }),
        encouragement: {
            fontSize: '0.9rem',
            color: '#10B981',
            marginTop: '1.5rem',
            fontWeight: '600'
        }
    };

    return (
        <div style={styles.overlay}>
            <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>

            <div style={styles.modal}>
                <div style={styles.icon}>😊</div>

                <h2 style={styles.title}>Great Progress! 🎉</h2>

                <p style={styles.message}>
                    You've watched <strong>{videosWatched} videos</strong> - that's awesome!
                    <br />
                    <br />
                    But... are you feeling a bit tired? 😴
                </p>

                <div style={styles.counter}>
                    📺 Videos watched: {videosWatched}/3
                </div>

                <div style={styles.buttonGroup}>
                    <button
                        onClick={onTakeBreak}
                        style={{
                            ...styles.button(true),
                            backgroundColor: '#10B981'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }}
                    >
                        ☕ Yes, Let's Take a Break!
                    </button>

                    <button
                        onClick={onContinue}
                        style={styles.button(true)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                        }}
                    >
                        💪 I'm Ready for More!
                    </button>
                </div>

                <div style={styles.encouragement}>
                    {videosWatched >= 3 ? "No pressure! Do what feels right for you. 💙" : "Keep up the great work!"}
                </div>
            </div>
        </div>
    );
};

export default BreakCheckModal;
