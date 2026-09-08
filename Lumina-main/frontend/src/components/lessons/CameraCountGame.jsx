import React, { useEffect, useRef, useState } from 'react';
import cameraService from '../../services/cameraService';

/**
 * src/components/lessons/CameraCountGame.jsx
 * Physical counting engagement using circular video feed
 */

const CameraCountGame = ({ 
  expectedCount = 1, 
  onResult = null, 
  isHighContrast = false 
}) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState("Waking up camera... 📷");
  const [detected, setDetected] = useState(0);

  useEffect(() => {
    let active = true;

    const setup = async () => {
      try {
        const stream = await cameraService.start();
        if (videoRef.current && active) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
          setStatus(`Show me ${expectedCount} fingers! 🤩`);
          
          // Simulation of computer vision detection from Section 3/7
          const count = await cameraService.detectFingers(expectedCount);
          if (active) {
            setDetected(count);
            // Wait 1.5s then trigger result if it matches
            if (count === expectedCount) {
              setStatus("I see it! Amazing! 🌟");
              setTimeout(() => onResult && onResult(), 1500);
            }
          }
        }
      } catch (err) {
        if (active) setStatus("Camera error. Please allow access! ❌");
      }
    };

    setup();

    // 🚨 BUG 3 FIX: Explicitly stop camera stream on unmount to prevent memory leaks
    return () => {
      active = false;
      cameraService.stop();
    };
  }, [expectedCount, onResult]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      width: '100%',
      height: '100%'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D', // 🔴 FIXED
      marginBottom: '3rem',
      textAlign: 'center',
      fontFamily: "'Fredoka One', cursive"
    },
    videoContainer: {
      position: 'relative',
      width: '320px',
      height: '320px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: isHighContrast ? '8px solid #FFFFFF' : '8px solid #D6BCFF', // 🔴 FIXED
      backgroundColor: isHighContrast ? '#000000' : '#FFFFFF', // 🔴 FIXED
      boxShadow: isHighContrast ? 'none' : '0 20px 50px rgba(188, 140, 255, 0.15)', // 🔴 FIXED
      marginBottom: '2rem'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scaleX(-1)' // Mirroring for natural feel
    },
    statusText: {
      fontSize: '2rem',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#9061F9', // 🔴 FIXED
      textAlign: 'center',
      fontFamily: "'Fredoka One', cursive"
    },
    targetOverlay: {
      position: 'absolute',
      bottom: '15px',
      right: '15px',
      backgroundColor: '#FFB800', // 🔴 FIXED: Star Gold
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.2rem',
      fontWeight: '900',
      color: '#FFFFFF',
      border: '4px solid white',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Camera Challenge! 🤚</h2>

      <div style={styles.videoContainer}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={styles.video} 
        />
        {isReady && <div style={styles.targetOverlay}>{expectedCount}</div>}
      </div>

      <p style={styles.statusText}>{status}</p>
    </div>
  );
};

export default CameraCountGame;
