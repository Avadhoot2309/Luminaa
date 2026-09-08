import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from "../../services/localLessonService";
import { useProfile } from "../../contexts/ProfileContext";
import { getAdaptiveConfig } from "../../utils/adaptiveEngine";
import { LuminaBrand } from "../../components/BrandLogo";

/**
 * ChaptersScreen - Transformed into a Journey Trail
 */
const ChaptersScreen = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  const subject = getSubjectById(subjectId);
  const adaptiveConfig = getAdaptiveConfig(profile);

  if (!subject) return <div style={{ padding: '2rem', color: 'white' }}>Subject not found!</div>;

  const isHighContrast = adaptiveConfig.ui.highContrast;
  const isDyslexicFont = adaptiveConfig.ui.fontFamily === 'OpenDyslexic';
  
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: isHighContrast ? '#000000' : '#F5F7F6',
      color: isHighContrast ? '#FFFFFF' : '#1A2E2A',
      fontFamily: isDyslexicFont ? 'OpenDyslexic, sans-serif' : 'Nunito, sans-serif',
      padding: '2rem 4rem',
      backgroundImage: isHighContrast ? 'none' : 'radial-gradient(circle at 10% 20%, rgba(31, 122, 107, 0.03) 0%, transparent 80%)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '4rem',
    },
    backButton: {
      background: '#FFFFFF',
      border: isHighContrast ? '2px solid #FFFFFF' : '1px solid #E2E8F0',
      color: '#1A2E2A',
      padding: '10px 20px',
      borderRadius: '15px',
      cursor: 'pointer',
      fontWeight: 800,
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    },
    trailContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      padding: '2rem 0',
    },
    pathLine: {
      position: 'absolute',
      top: 0,
      left: '50%',
      width: '8px',
      height: '100%',
      backgroundColor: subject.color + (isHighContrast ? '' : '22'),
      transform: 'translateX(-50%)',
      borderRadius: '4px',
      zIndex: 0,
    },
    chapterNode: (index) => ({
      position: 'relative',
      display: 'flex',
      flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '6rem',
      zIndex: 1,
      width: '100%',
    }),
    nodeCircle: (isHovered) => ({
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: isHovered ? subject.color : (isHighContrast ? '#111' : '#FFFFFF'),
      border: `4px solid ${subject.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: isHovered ? `0 20px 40px ${subject.color}44` : '0 10px 20px rgba(0,0,0,0.05)',
      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    }),
    card: (index) => ({
      backgroundColor: isHighContrast ? '#111' : '#FFFFFF',
      padding: '2rem',
      borderRadius: '2rem',
      boxShadow: '0 15px 40px rgba(0,0,0,0.05)',
      maxWidth: '300px',
      width: '100%',
      margin: index % 2 === 0 ? '0 0 0 3rem' : '0 3rem 0 0',
      textAlign: index % 2 === 0 ? 'left' : 'right',
      border: isHighContrast ? '2px solid white' : 'none',
    }),
    chapterTitle: {
      fontSize: '1.4rem',
      fontWeight: '900',
      margin: '0 0 0.5rem 0',
      color: isHighContrast ? 'white' : '#1A2E2A',
    },
    lessonCount: {
      fontSize: '1rem',
      fontWeight: '700',
      opacity: 0.7,
      color: subject.color,
    }
  };

  const handleNodeClick = (chapter) => {
    if (chapter.lessons && chapter.lessons.length > 0) {
      navigate(`/lesson/${chapter.lessons[0].id}`);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/subjects')}>← Back</button>
        <LuminaBrand size={36} />
        <div style={{ width: 80 }} />
      </header>

      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: subject.color }}>{subject.name} Journey</h1>
        <p style={{ fontSize: '1.4rem', opacity: 0.7 }}>Follow the path to learn more!</p>
      </div>

      <div style={styles.trailContainer}>
        <div style={styles.pathLine} />
        
        {subject.chapters.map((chapter, idx) => (
          <div key={chapter.id} style={styles.chapterNode(idx)} className="trail-node">
            <div 
              style={styles.nodeCircle(false)} 
              onClick={() => handleNodeClick(chapter)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.backgroundColor = subject.color; e.currentTarget.style.color = '#FFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = isHighContrast ? '#111' : '#FFF'; e.currentTarget.style.color = 'inherit'; }}
            >
              {chapter.chapterNumber}
            </div>
            
            <div style={styles.card(idx)}>
              <h3 style={styles.chapterTitle}>{chapter.title}</h3>
              <div style={styles.lessonCount}>{chapter.lessons.length} Lessons</div>
            </div>
          </div>
        ))}
        
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '5rem', opacity: 0.2 }}>🏁</div>
          <p style={{ fontWeight: 800, opacity: 0.3 }}>More adventures coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ChaptersScreen;
