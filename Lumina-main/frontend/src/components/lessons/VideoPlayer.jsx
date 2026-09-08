import React, { useState, useEffect } from 'react';

/**
 * src/components/lessons/VideoPlayer.jsx
 * Phase 4 - YouTube nocookie embed for educational lesson videos
 * Includes Section 7 Bug 2 Fix (Autoplay and Encrypted Media flags)
 */

const VideoPlayer = ({ 
  video = { title: "", url: "" }, 
  onContinue = null, 
  isHighContrast = false 
}) => {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Section 4: After 10 seconds show "Continue to Games →" button
    const timer = setTimeout(() => setShowContinue(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Section 7 BUG 2 FIX: URL parameters for seamless autoplay
  // 🚀 FIXED: Added mute=1 to ensure autoplay works in modern browsers and forced -nocookie for privacy.
  const enhancedUrl = video.url 
    ? `${video.url.replace('youtube.com', 'youtube-nocookie.com')}${video.url.includes('?') ? '&' : '?'}autoplay=1&mute=1&rel=0&modestbranding=1` 
    : "";

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: isHighContrast ? '#000000' : '#FFFFFF', // 🔴 FIXED: White card
      borderRadius: '3rem',
      overflow: 'hidden',
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%',
      boxShadow: isHighContrast ? 'none' : '0 20px 60px rgba(0,0,0,0.05)' // 🔴 FIXED: Soft shadow
    },
    videoWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '800px', // Slightly narrower for better height control
      paddingTop: 'min(56.25%, 50vh)', // Adaptive aspect ratio or max-height
      maxHeight: '50vh', // Strict cap
      borderRadius: '2rem',
      overflow: 'hidden',
      border: isHighContrast ? '4px solid #FFFFFF' : '4px solid #F5F0E8',
      backgroundColor: '#000000',
      boxShadow: isHighContrast ? 'none' : '0 10px 30px rgba(0,0,0,0.1)'
    },
    // Since we use absolute positioning for iframe inside padding-top, 
    // we need to handle the case where padding-top is capped.
    innerWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none'
    },
    button: {
      marginTop: '2.5rem',
      padding: '1.2rem 3rem',
      fontSize: '1.8rem',
      fontWeight: '900',
      color: '#FFFFFF',
      backgroundColor: isHighContrast ? '#000000' : '#FF6B35', // 🔴 FIXED: Accent Orange
      border: isHighContrast ? '4px solid #FFFFFF' : 'none',
      borderRadius: '2rem',
      cursor: 'pointer',
      opacity: showContinue ? 1 : 0,
      transform: showContinue ? 'translateY(0)' : 'translateY(20px)',
      pointerEvents: showContinue ? 'auto' : 'none',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '0 8px 20px rgba(255,107,53,0.3)'
    },
    caption: {
      marginTop: '1.5rem',
      color: '#6B7280', // 🔴 FIXED: Darker muted text
      fontSize: '1.2rem',
      fontWeight: '800'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoWrapper}>
        <div style={styles.innerWrapper}>
          <iframe
            src={enhancedUrl}
            title={video.title || "Lesson Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={styles.iframe}
          />
        </div>
      </div>

      {video.title && <p style={styles.caption}>{video.title}</p>}

      <button 
        style={styles.button} 
        onClick={onContinue}
        aria-hidden={!showContinue}
      >
        Continue to Games →
      </button>
    </div>
  );
};

export default VideoPlayer;
