import React, { useState, useEffect } from 'react';

/**
 * VoiceInput - Mic button with animated ring and live transcript
 * Props:
 *   onResult({ transcript, keywordMatched })
 *   keywords[]  - for keyword highlighting
 *   disabled
 *   isHighContrast
 *   accentColor
 */

const VoiceInput = ({ onResult, keywords = [], disabled = false, isHighContrast = false, accentColor = '#E8920C' }) => {
  const [status, setStatus] = useState('idle'); // idle | listening | success | error
  const [transcript, setTranscript] = useState('');

  const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = () => {
    if (disabled || status === 'listening') return;

    const SpeechRecog = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecog) {
      onResult && onResult({ transcript: '', keywordMatched: false, unsupported: true });
      return;
    }

    const rec = new SpeechRecog();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    setStatus('listening');
    setTranscript('');

    rec.onresult = (e) => {
      const interim = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setTranscript(interim);
    };

    rec.onend = () => {
      const SpeechRecog2 = window.SpeechRecognition || window.webkitSpeechRecognition;
      // Final result — evaluate
      const finalTranscript = transcript.toLowerCase();
      const keywordMatched = keywords.length === 0 || keywords.some(k => finalTranscript.includes(k.toLowerCase()));
      setStatus(keywordMatched ? 'success' : 'error');
      setTimeout(() => setStatus('idle'), 2000);
      onResult && onResult({ transcript: finalTranscript, keywordMatched });
    };

    rec.onerror = () => {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
      onResult && onResult({ transcript: '', keywordMatched: false, error: true });
    };

    rec.start();
  };

  const statusConfig = {
    idle:      { icon: '🎤', label: 'Tap to Speak', border: `3px solid ${accentColor}`, bg: 'transparent' },
    listening: { icon: '👂', label: 'Listening...', border: `3px solid ${accentColor}`, bg: `${accentColor}22` },
    success:   { icon: '✅', label: 'Got it!', border: '3px solid #22C55E', bg: '#EBF9F1' },
    error:     { icon: '🔄', label: 'Try again', border: '3px solid #FF6B6B', bg: '#FFF5F5' },
  };

  const cfg = statusConfig[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <style>{`
        @keyframes ring-pulse {
          0% { box-shadow: 0 0 0 0 ${accentColor}66; }
          70% { box-shadow: 0 0 0 20px ${accentColor}00; }
          100% { box-shadow: 0 0 0 0 ${accentColor}00; }
        }
      `}</style>

      <button
        onClick={startListening}
        disabled={disabled || !isSupported}
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: cfg.border,
          backgroundColor: isHighContrast ? '#111' : cfg.bg,
          fontSize: '2.5rem',
          cursor: disabled || !isSupported ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          animation: status === 'listening' ? 'ring-pulse 1.2s ease-out infinite' : 'none',
          opacity: disabled ? 0.5 : 1,
        }}
        aria-label={cfg.label}
      >
        {cfg.icon}
      </button>

      <div style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: isHighContrast ? '#FFF' : '#64748B',
        minHeight: '24px',
      }}>
        {transcript
          ? <span style={{ color: isHighContrast ? '#FFF' : '#1A2635' }}>"{transcript}"</span>
          : cfg.label}
      </div>

      {!isSupported && (
        <div style={{ fontSize: '0.85rem', color: '#FF6B6B', fontWeight: 600 }}>
          Voice not supported in this browser
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
