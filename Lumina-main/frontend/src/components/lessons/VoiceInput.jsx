import React, { useState, useEffect, useRef } from 'react';

/**
 * src/components/lessons/VoiceInput.jsx
 * Speech Recognition Component with MIC visualization and Match Logic
 */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceInput = ({ 
  question = "Say something!", 
  phrase = "", 
  keywords = [], 
  onResult = null, 
  isHighContrast = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Tap the mic to start! 🎤");
  const [unsupported, setUnsupported] = useState(!SR);
  
  // 🚨 BUG 1 FIX: Store latest transcript in a Ref to avoid stale closure in onend
  const transcriptRef = useRef('');
  const timeoutRef = useRef(null);

  // Auto-listen on mount for phase "interact" flow
  useEffect(() => {
    if (!unsupported) {
      const autoStartTimer = setTimeout(startListening, 1000);
      return () => {
        clearTimeout(autoStartTimer);
        stopListening();
      };
    } else {
      onResult && onResult({ unsupported: true });
    }
  }, [unsupported]);

  const startListening = () => {
    if (unsupported) return;

    transcriptRef.current = '';
    setStatus("I'm listening! Speak clearly... 🎤");
    setIsListening(true);

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e) => {
      // Logic for building transcript
      const current = Array.from(e.results)
        .map(res => res[0])
        .map(res => res.transcript)
        .join('');
      
      transcriptRef.current = current;
    };

    rec.onerror = (e) => {
      console.warn("STT Error:", e.error);
      if (e.error === 'no-speech') {
        setStatus("I didn't hear anything. Try again? 😊");
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      // Read latest transcript from Ref (BUG 1 FIX)
      const transcript = transcriptRef.current.toLowerCase().trim();
      
      if (!transcript) {
        setStatus("Let's try that one more time! 🎤");
      } else {
        const isMatch = keywords.length > 0 
          ? keywords.some(k => transcript.includes(k.toLowerCase()))
          : (phrase && transcript.includes(phrase.toLowerCase()));

        onResult && onResult({ transcript, matched: isMatch });
      }
    };

    rec.start();

    // Max listen window to prevent infinite hanging
    timeoutRef.current = setTimeout(() => {
      try { rec.stop(); } catch(e) {}
    }, 6000);
  };

  const stopListening = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsListening(false);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      width: '100%'
    },
    questionText: {
      fontSize: '2.5rem',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D', // 🔴 FIXED
      marginBottom: '3rem',
      textAlign: 'center',
      fontFamily: "'Fredoka One', cursive"
    },
    micContainer: {
      position: 'relative',
      width: '180px',
      height: '180px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    pulse: (delay) => ({
      position: 'absolute',
      inset: 0,
      backgroundColor: isHighContrast ? 'transparent' : 'rgba(255, 107, 53, 0.2)', // 🔴 FIXED
      border: isHighContrast ? '8px solid #FFFFFF' : 'none',
      borderRadius: '50%',
      animation: isListening ? `pulseMic 2s infinite ${delay}s` : 'none',
      opacity: isListening ? 1 : 0,
      transition: 'opacity 0.3s'
    }),
    micButton: {
      position: 'relative',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: isListening ? '#FFB800' : (isHighContrast ? '#FFFFFF' : '#FF6B35'), // 🔴 FIXED: Orange -> Gold
      border: 'none',
      fontSize: '3.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: isHighContrast ? 'none' : '0 15px 40px rgba(255, 107, 53, 0.3)', // 🔴 FIXED
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    statusText: {
      fontSize: '1.6rem',
      fontWeight: '900',
      color: isListening ? '#FFB800' : (isHighContrast ? '#FFFFFF' : '#6B7280'), // 🔴 FIXED
      textAlign: 'center',
      fontFamily: "'Fredoka One', cursive"
    }
  };

  if (unsupported) return (
    <div style={styles.container}>
      <h2 style={styles.questionText}>Voice not supported</h2>
      <button onClick={() => onResult({ skipped: true })} style={{ padding: '1rem 2rem', fontSize: '1.5rem', borderRadius: '15px', background: '#58A6FF', color: 'white', border: 'none' }}>Continue →</button>
    </div>
  )

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulseMic {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <h2 style={styles.questionText}>{question}</h2>

      <div style={styles.micContainer}>
        {isListening && <div style={styles.pulse(0)} />}
        {isListening && <div style={styles.pulse(1)} />}
        
        <button 
          style={styles.micButton} 
          onClick={isListening ? stopListening : startListening}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? '⏹️' : '🎤'}
        </button>
      </div>

      <p style={styles.statusText}>{status}</p>
    </div>
  );
};

export default VoiceInput;
