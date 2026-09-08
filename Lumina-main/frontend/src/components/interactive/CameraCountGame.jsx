import React, { useEffect, useRef, useState } from 'react';
import cameraService from '../../services/cameraService';

/**
 * CameraCountGame - Interaction where child shows fingers to the AI
 * No buttons, just showing hands and waiting for the AI's "Aha!" moment.
 */
const CameraCountGame = ({ expectedCount, onResult, accentColor = '#E8920C', isHighContrast = false }) => {
  const videoRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let stream;
    const start = async () => {
      stream = await cameraService.startCamera();
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        
        // Start detection countdown
        let count = 3;
        const timer = setInterval(async () => {
          count--;
          setCountdown(count);
          if (count === 0) {
            clearInterval(timer);
            const result = await cameraService.detectFingers(expectedCount);
            setSuccess(result);
            setIsDetecting(false);
            if (result) {
              setTimeout(() => onResult && onResult(true), 2000);
            } else {
              // Reset for a retry after 2s
              setTimeout(() => { 
                setCountdown(3); 
                setIsDetecting(true); 
                setSuccess(false); 
              }, 2000);
            }
          }
        }, 1000);
      }
    };
    start();
    return () => cameraService.stopCamera();
  }, [expectedCount, onResult]);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem',
      animation: 'pop-in 0.5s ease-out'
    }}>
      <style>{`
        @keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(300px); } }
      `}</style>
      
      <div style={{
        position: 'relative', width: '640px', height: '480px', borderRadius: '3rem', overflow: 'hidden',
        border: `8px solid ${success ? '#22C55E' : (isDetecting ? accentColor : '#FF6B6B')}`,
        boxShadow: `0 30px 60px rgba(0,0,0,0.2), 0 0 40px ${isDetecting ? accentColor + "33" : "transparent"}`,
        backgroundColor: '#000'
      }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} // Mirror view
        />
        
        {/* Detection Overlay */}
        {isDetecting && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor, 
            boxShadow: `0 0 20px ${accentColor}`, animation: 'scan 2s infinite ease-in-out'
          }} />
        )}
        
        {/* Helper Instructions */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.7)', padding: '1rem 3rem', borderRadius: '99px',
          color: 'white', fontWeight: 900, fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {success ? "I SEE IT! 🌟" : (isDetecting ? `SHOW ME ${expectedCount} FINGERS IN ${countdown}` : "TRY AGAIN! 😊")}
        </div>

        {/* Success Checkmark */}
        {success && (
          <div style={{
            position: 'absolute', inset: 0, backgroundColor: 'rgba(34, 197, 94, 0.2)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', fontSize: '12rem'
          }}>
            ✅
          </div>
        )}
      </div>
      
      <p style={{ fontSize: '1.8rem', fontWeight: 700, color: isHighContrast ? 'white' : '#64748B' }}>
        Hold your hand up to the camera! ✋✨
      </p>
    </div>
  );
};

export default CameraCountGame;
