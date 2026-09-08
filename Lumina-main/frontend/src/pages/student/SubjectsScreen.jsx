import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects } from "../../services/localLessonService";
import { useProfile } from "../../contexts/ProfileContext";
import { getAdaptiveConfig } from "../../utils/adaptiveEngine";
import TTS from "../../services/tts-service";
import reactionService from "../../services/reactionService";
import { LuminaBrand } from "../../components/BrandLogo";

/**
 * SubjectsScreen - High-impact, interactive subject selection
 */
const SubjectsScreen = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const subjects = getAllSubjects();
  const adaptiveConfig = getAdaptiveConfig(profile);
  const [hoveredId, setHoveredId] = useState(null);

  const isHighContrast = adaptiveConfig.ui.highContrast;
  const isDyslexicFont = adaptiveConfig.ui.fontFamily === 'OpenDyslexic';

  const sizeMap = { small: '0.9rem', normal: '1rem', medium: '1.2rem', large: '1.5rem', xlarge: '2rem' };
  const baseFontSize = sizeMap[adaptiveConfig.ui.fontSize] || '1.2rem';

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: isHighContrast ? '#FFFFFF' : '#F8FAFC', // Light slate background
      color: isHighContrast ? '#000000' : '#1A2635',
      fontFamily: isDyslexicFont ? 'OpenDyslexic, sans-serif' : 'Nunito, sans-serif',
      padding: '2rem 4rem',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '4rem',
      gap: '1.5rem',
    },
    backButton: {
      background: 'rgba(74, 144, 217, 0.1)',
      border: isHighContrast ? '2px solid #000000' : '2px solid #4A90D9',
      color: isHighContrast ? '#000000' : '#4A90D9',
      padding: '12px 24px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 800,
      transition: 'all 0.2s',
      gap: '8px'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '900',
      color: isHighContrast ? '#000000' : '#2563EB',
      margin: 0,
      textAlign: 'center',
      flex: 1
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: (color, isHovered) => ({
      backgroundColor: isHighContrast ? '#F0F0F0' : '#FFFFFF',
      borderRadius: '3rem',
      padding: '3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: isHovered ? `0 20px 60px ${color}33` : '0 4px 12px rgba(10, 22, 40, 0.08)',
      border: isHovered ? `2px solid ${color}` : '2px solid rgba(74, 144, 217, 0.2)',
      minHeight: '380px',
      position: 'relative',
      transform: isHovered ? 'translateY(-15px) scale(1.05)' : 'translateY(0) scale(1)',
    }),
    iconWrapper: (isHovered) => ({
      fontSize: '7rem',
      marginBottom: '2rem',
      filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.1))',
      transition: 'transform 0.4s ease',
      transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0)',
    }),
    subjectName: {
      fontSize: '2.2rem',
      fontWeight: '900',
      color: isHighContrast ? '#000000' : '#1A2635',
      margin: '0.5rem 0',
      letterSpacing: '-0.5px',
    },
    chapterCount: {
      fontSize: '1.1rem',
      fontWeight: '700',
      opacity: 0.8,
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: '0.6rem 2rem',
      borderRadius: '99px',
      marginTop: '1.5rem',
    },
    bgCircle: {
      position: 'absolute',
      top: '-10%',
      right: '-10%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(74, 144, 217, 0.05) 0%, transparent 70%)',
      zIndex: -1
    }
  };

  const handleHover = (id, name) => {
    setHoveredId(id);
    if (id) {
      reactionService.playClick();
      // Optional: TTS reminder after a delay
      // setTimeout(() => { if (hoveredId === id) TTS.speak(name); }, 1000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgCircle} />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .back-btn:hover { background: rgba(255, 255, 255, 0.2); transform: translateX(-5px); }
      `}</style>

      <header style={styles.header}>
        <button
          className="back-btn"
          style={styles.backButton}
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Den
        </button>
        <LuminaBrand size={40} light />
        <div style={{ width: 120 }} /> {/* Spacer */}
      </header>

      <h1 style={styles.title}>What's our next adventure?</h1>

      <main style={styles.grid}>
        {subjects.map((subject) => {
          const isHovered = hoveredId === subject.id;
          return (
            <div
              key={subject.id}
              style={styles.card(subject.color, isHovered)}
              onMouseEnter={() => handleHover(subject.id, subject.name)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/chapters/${subject.id}`)}
            >
              <div style={styles.iconWrapper(isHovered)}>{subject.icon}</div>
              <h2 style={styles.subjectName}>{subject.name}</h2>
              <div style={styles.chapterCount}>
                {subject.chapters.length} Adventures
              </div>

              {/* Decorative sparkles on hover */}
              {isHovered && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', animation: 'pulse 1s infinite' }}>
                  <span style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '1.5rem' }}>✨</span>
                  <span style={{ position: 'absolute', bottom: '10%', right: '10%', fontSize: '1.5rem' }}>⭐</span>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default SubjectsScreen;
