import React, { useEffect, useState } from 'react';

/**
 * src/components/lessons/VisualCanvas.jsx
 * Dynamic side-by-side emoji hints for word association during Phase 2 "story"
 */

const VisualCanvas = ({ activeWord = "", hints = {}, fallbackImage = "", subjectId = "", isHighContrast = false }) => {
  const [displayContent, setDisplayContent] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [visible, setVisible] = useState(false);

  // Subject-specific default illustrations
  const subjectDefaults = {
    'evs': '/assets/visuals/evs_default.png',
    'math': '/assets/visuals/math_default.png',
    'english': '/assets/visuals/english_default.png',
    'hindi': '/assets/visuals/hindi_default.png',
    'gk': '/assets/visuals/gk_default.png',
    'art': '/assets/visuals/art_default.png'
  };

  useEffect(() => {
    const findHint = () => {
      // 1. If we have an active word, look for a specific hint
      if (activeWord) {
        const normalizedWord = activeWord.toLowerCase().replace(/[^a-z]/g, '');
        const hint = hints[normalizedWord];
        
        if (hint) {
          const isPath = hint.includes('.') || hint.includes('/');
          return { content: hint, isImg: isPath };
        }
      }

      // 2. If no word hint, use the lesson's fallback illustration
      if (fallbackImage) return { content: fallbackImage, isImg: true };

      // 3. If no lesson illustration, use the subject's default
      const defaultImg = subjectDefaults[subjectId];
      if (defaultImg) return { content: defaultImg, isImg: true };
      
      return null;
    };

    const hintData = findHint();

    if (hintData) {
      if (hintData.content === displayContent) return;
      
      setVisible(false);
      
      const timer = setTimeout(() => {
        setDisplayContent(hintData.content);
        setIsImage(hintData.isImg);
        setVisible(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [activeWord, hints, fallbackImage, displayContent]);

  const styles = {
    container: {
      flex: 1,
      minWidth: '300px', // Slightly wider for illustrations
      height: '350px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: isHighContrast ? 'transparent' : '#FFFFFF', // Clean white
      borderRadius: '40px',
      boxShadow: isHighContrast ? 'none' : '0 20px 40px rgba(0,0,0,0.05)',
      border: isHighContrast ? '3px solid #FFFFFF' : '2px solid #F5F0E8',
      position: 'relative',
      overflow: 'hidden'
    },
    visualWrapper: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emoji: {
      fontSize: '10rem',
      filter: isHighContrast ? 'drop-shadow(0 0 10px white)' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
    },
    image: {
      width: '100%',
      height: '100%',
      maxHeight: '280px',
      objectFit: 'contain',
      borderRadius: '24px'
    },
    label: {
      marginTop: '1rem',
      fontSize: '1.5rem',
      fontWeight: '800',
      color: isHighContrast ? '#FFFFFF' : '#FF6B35', // Use accent color
      backgroundColor: isHighContrast ? 'rgba(0,0,0,0.5)' : '#FFF5F0',
      padding: '4px 16px',
      borderRadius: '20px',
      textTransform: 'capitalize'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.visualWrapper}>
        {isImage ? (
          <img 
            src={displayContent} 
            alt={activeWord || "Lesson Illustration"} 
            style={styles.image} 
          />
        ) : (
          <div style={styles.emoji} role="img" aria-label={`Visual hint for ${activeWord}`}>
            {displayContent}
          </div>
        )}
        
        {activeWord && visible && (
          <span style={styles.label}>{activeWord}</span>
        )}
      </div>
    </div>
  );
};

export default VisualCanvas;
