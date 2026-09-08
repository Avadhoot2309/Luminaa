import React, { useState, useEffect, useRef } from 'react';
import ttsService from '../../services/ttsService';
import VisualCanvas from './VisualCanvas';

/**
 * src/components/lessons/StoryPlayer.jsx
 * Phase 2 - Narrative Storytelling with TTS, Highlighting, and Visual Aids
 */

const StoryPlayer = ({ 
  chunks = [], 
  hints = {}, 
  fallbackImage = "", 
  subjectId = "",
  onComplete = null, 
  isADHD = false, 
  isHighContrast = false 
}) => {
  const [index, setIndex] = useState(0);
  const [activeWordCharIndex, setActiveWordCharIndex] = useState(-1);
  const [activeWord, setActiveWord] = useState('');
  
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Section 4 Path 2: Auto-start on mount or chunk index change
    if (index >= chunks.length) {
      onComplete && onComplete();
      return;
    }

    const playChunk = () => {
      if (isPlayingRef.current) return;
      isPlayingRef.current = true;

      const text = chunks[index];
      
      // Section 4/6: Call ttsService with onWord highlighting logic
      ttsService.speak(text, {
        rate: isADHD ? 0.8 : 1.0, // Section 2 ADHD Focus Mode
        pitch: 1.1,
        onWord: (event) => {
          // Boundary fired: event.charIndex is location in text
          setActiveWordCharIndex(event.charIndex);
          
          // Helper to find the current word string for VisualCanvas hint
          const part = text.substring(event.charIndex).split(' ')[0];
          setActiveWord(part.replace(/[^a-zA-Z]/g, ''));
        },
        onEnd: () => {
          isPlayingRef.current = false;
          setActiveWordCharIndex(-1);
          setActiveWord('');
          
          // Section 4: 500ms delay then move to next chunk or complete
          setTimeout(() => {
            setIndex(prev => prev + 1);
          }, 500);
        }
      });
    };

    playChunk();

    // Cleanup on unmount/skip
    return () => {
      ttsService.stop();
      isPlayingRef.current = false;
    };
  }, [index, chunks, isADHD, onComplete]); // 🔴 BUG 10 FIX: Added onComplete

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2.5rem',
      padding: '1rem',
      flex: 1,
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      flexDirection: 'row',
      boxSizing: 'border-box'
    },
    textContainer: {
      flex: 1.2, // Balanced with illustration
      textAlign: 'left',
      maxHeight: '100%',
      overflowY: 'auto',
      padding: '0.5rem'
    },
    text: {
      fontSize: 'clamp(1.5rem, 4vh, 2.5rem)',
      fontWeight: '800',
      lineHeight: isHighContrast ? '1.6' : '1.4',
      letterSpacing: '0.01em',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      fontFamily: isHighContrast ? 'inherit' : "'Nunito', sans-serif"
    },
    word: (isHighlighted) => ({
      display: 'inline-block',
      padding: '0 4px',
      backgroundColor: isHighlighted ? '#FFEECC' : 'transparent',
      color: isHighlighted ? '#1C2330' : (isHighContrast ? '#FFFFFF' : '#2D2D2D'), // 🔴 FIXED
      borderRadius: '8px',
      transition: 'all 0.1s',
      transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
      fontWeight: isHighlighted ? '900' : '400'
    })
  };

  // Helper to render text with highlighting based on charIndex
  const renderHighlightedText = (text) => {
    // Basic splitting into words and checking if current word matches the index
    let totalCharCount = 0;
    return text.split(' ').map((word, i) => {
      const isMatch = totalCharCount === activeWordCharIndex;
      totalCharCount += word.length + 1; // +1 for the space
      
      return (
        <span key={i} style={styles.word(isMatch)}>
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div style={styles.container}>
      {/* Visual Indicator (Step 15 component) */}
      <VisualCanvas 
        activeWord={activeWord} 
        hints={hints} 
        fallbackImage={fallbackImage}
        subjectId={subjectId}
        isHighContrast={isHighContrast} 
      />

      <div style={styles.textContainer}>
        <div style={styles.text}>
          {renderHighlightedText(chunks[index] || "")}
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;
