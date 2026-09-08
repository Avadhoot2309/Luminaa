import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ebookData } from '../../data/ebookData';
import { useReadAloud } from '../../hooks/useReadAloud';
import { LuminaLogo } from '../../components/BrandLogo';

const C = {
  navy: 'var(--navy)',
  amber: 'var(--amber)',
  teal: 'var(--teal)',
  cream: 'var(--cream)',
  white: 'var(--white)',
  border: 'var(--border)',
  textSoft: 'var(--text-soft)'
};

const Fonts = {
  heading: "'Fraunces', serif",
  body: "'Nunito', sans-serif"
};

export default function EBookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const book = ebookData.find(b => b.id === bookId);

  // ✅ Safety Check: Redirect if book doesn't exist
  useEffect(() => {
    if (!book) navigate('/library');
  }, [book, navigate]);

  // ✅ Safe Language Initialization: 
  // Default to i18n language ONLY if the book supports it, otherwise fallback to the first supported language.
  const [readerLang, setReaderLang] = useState(() => {
    if (!book) return 'en';
    const preferred = i18n.language?.split('-')[0] || 'en';
    return book.languages.includes(preferred) ? preferred : (book.languages[0] || 'en');
  });

  const [speed, setSpeed] = useState(0.9);
  const [focusMode, setFocusMode] = useState(false);
  const [theme, setTheme] = useState('light'); // light, dark, sepia, dyslexia
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  const {
    isPlaying, isPaused, speak, pause, resume, stop,
    startRecording, stopRecording, isRecording, recording
  } = useReadAloud(readerLang, speed);

  const containerRef = useRef(null);

  // Auto-hide controls logic
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      };
    } else {
      setShowControls(true);
    }
  }, [isPlaying, isPaused]);

  // ✅ Reset Progress & Language on Book Change
  useEffect(() => {
    if (book) {
      // 🛑 Critical: Always stop speech before switching books
      stop(); 
      
      // 🔄 Reset state for the new book
      setActiveSentenceIdx(0);
      setActiveWordIdx(-1);
      
      // Ensure the language is supported by the new book
      const preferred = i18n.language?.split('-')[0] || 'en';
      const newLang = book.languages.includes(preferred) ? preferred : (book.languages[0] || 'en');
      setReaderLang(newLang);
    }
  }, [bookId, book, i18n.language]);

  if (!book) return null;

  // ✅ Content & Title Fallbacks
  const content = book.content[readerLang] || book.content.en || Object.values(book.content)[0];
  const bTitle = book.title[readerLang] || book.title.en || Object.values(book.title)[0];

  const handlePlay = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      const currentSentence = content[activeSentenceIdx];
      if (!currentSentence) return;
      
      speak(
        currentSentence, 
        (charIdx) => {
          const words = currentSentence.split(' ');
          let charSum = 0;
          const wordIdx = words.findIndex(w => {
            const start = charSum;
            charSum += w.length + 1;
            return charIdx >= start && charIdx < charSum;
          });
          setActiveWordIdx(wordIdx);
        },
        handleSentenceEnd
      );
    }
  };

  // Re-usable sentence end handler for recursion
  const handleSentenceEnd = () => {
    setActiveSentenceIdx(prev => {
      if (prev < content.length - 1) {
        const nextIdx = prev + 1;
        setTimeout(() => speakRecursive(nextIdx), 600);
        return nextIdx;
      }
      return prev;
    });
  };

  const speakRecursive = (idx) => {
    const text = content[idx];
    speak(
      text,
      (charIdx) => {
        const words = text.split(' ');
        let charSum = 0;
        const wordIdx = words.findIndex(w => {
          const start = charSum;
          charSum += w.length + 1;
          return charIdx >= start && charIdx < charSum;
        });
        setActiveWordIdx(wordIdx);
      },
      handleSentenceEnd
    );
  };

  const handleNext = () => {
    stop();
    if (activeSentenceIdx < content.length - 1) {
      const nextIdx = activeSentenceIdx + 1;
      setActiveSentenceIdx(nextIdx);
      if (isPlaying || isPaused) speakRecursive(nextIdx);
    }
  };

  const handlePrev = () => {
    stop();
    if (activeSentenceIdx > 0) {
      const prevIdx = activeSentenceIdx - 1;
      setActiveSentenceIdx(prevIdx);
      if (isPlaying || isPaused) speakRecursive(prevIdx);
    }
  };

  const handleDownload = () => {
    const text = `TITLE: ${bTitle}\nAUTHOR: ${book.author}\n\nCONTENT:\n${Array.isArray(content) ? content.join('\n') : content}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.id}_lumina_ebook.txt`;
    a.click();
  };

  // Styles based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark': return { bg: '#0A1628', text: '#FFF', card: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
      case 'sepia': return { bg: '#F4ECD8', text: '#5B4636', card: 'rgba(91,70,54,0.05)', border: 'rgba(91,70,54,0.1)' };
      case 'dyslexia': return { bg: '#FFFFCC', text: '#000', card: '#E6E6B8', border: '#B8B894', font: 'OpenDyslexic, sans-serif' };
      default: return { bg: '#FDFCF8', text: '#0A1628', card: '#FFF', border: '#E4F2EE' };
    }
  };

  const ts = getThemeStyles();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: ts.bg,
      color: ts.text,
      fontFamily: ts.font || Fonts.body,
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 40px',
        borderBottom: `1.5px solid ${ts.border}`,
        backgroundColor: ts.card,
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transform: showControls ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s',
        opacity: showControls ? 1 : 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => { stop(); navigate('/library'); }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          <h1 style={{ fontFamily: Fonts.heading, fontSize: '18px', margin: 0, color: ts.text }}>{bTitle}</h1>
          <button onClick={handleDownload} title="Download Offline" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', marginLeft: '10px' }}>💾</button>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Controls Mini */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
            {['light', 'dark', 'sepia', 'dyslexia'].map(tType => (
              <button 
                key={tType}
                onClick={() => setTheme(tType)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px', border: theme === tType ? '2px solid #E8920C' : 'none',
                  background: tType === 'light' ? '#FFF' : (tType === 'dark' ? '#000' : (tType === 'sepia' ? '#F4ECD8' : '#FFFFCC')), cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <select 
            value={readerLang} 
            onChange={(e) => { stop(); setReaderLang(e.target.value); }}
            style={{ padding: '8px 12px', borderRadius: '10px', border: `1px solid ${ts.border}`, background: ts.card, color: ts.text, fontSize: '12px', fontWeight: 800 }}
          >
            {book.languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>
      </header>

      {/* Reading Progress */}
      <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', position: 'relative' }}>
          <div style={{ height: '100%', background: C.amber, width: `${(activeSentenceIdx / content.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Sentence Navigation */}
        <div style={{ maxWidth: '800px', width: '100%', position: 'relative' }}>
          {Array.isArray(content) && content.map((sentence, sIdx) => {
            const isCurrent = sIdx === activeSentenceIdx;
            const isMasked = focusMode && !isCurrent;

            return (
              <div 
                key={sIdx}
                onClick={() => setActiveSentenceIdx(sIdx)}
                style={{
                  fontSize: '28px',
                  lineHeight: '1.8',
                  marginBottom: '32px',
                  padding: '24px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isMasked ? 0.05 : (isCurrent ? 1 : 0.4),
                  filter: isMasked ? 'blur(4px)' : 'none',
                  backgroundColor: isCurrent ? 'rgba(232, 146, 12, 0.05)' : 'transparent',
                  border: isCurrent ? `1.5px solid ${C.amber}22` : '1.5px solid transparent',
                  transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {sentence.split(' ').map((word, wIdx) => {
                  const cleanWord = word.replace(/[^\w\s\u0900-\u097F]/gi, '').toLowerCase();
                  const isHighlighted = isCurrent && isPlaying && wIdx === activeWordIdx;
                  const hasDefinition = book.vocabulary[cleanWord];

                  return (
                    <span 
                      key={wIdx}
                      onClick={(e) => {
                        if (hasDefinition) {
                          e.stopPropagation();
                          setSelectedWord({ word: cleanWord, ...book.vocabulary[cleanWord] });
                        }
                      }}
                      style={{
                        padding: '2px 4px',
                        borderRadius: '4px',
                        background: isHighlighted ? C.amber : 'transparent',
                        color: isHighlighted ? '#FFF' : (hasDefinition ? C.teal : 'inherit'),
                        fontWeight: hasDefinition ? 900 : 'inherit',
                        textDecoration: hasDefinition ? 'underline dotted 2px rgba(0,0,0,0.15)' : 'none',
                        display: 'inline-block',
                        transition: 'all 0.1s'
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Control Bar */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: `translateX(-50%) translateY(${showControls ? '0' : '120px'})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '24px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        zIndex: 1000,
        border: '1.5px solid rgba(255,255,255,0.4)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s',
        opacity: showControls ? 1 : 0,
        width: 'fit-content',
        minWidth: '500px'
      }}>
        {/* Sentence Seeker (Seek Bar) */}
        <div style={{ width: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#999', width: '30px' }}>{activeSentenceIdx + 1}/{content.length}</span>
          <div 
            style={{ flex: 1, height: '6px', background: '#EEE', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = x / rect.width;
              const nextIdx = Math.floor(pct * content.length);
              setActiveSentenceIdx(Math.max(0, Math.min(nextIdx, content.length - 1)));
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: C.amber, width: `${((activeSentenceIdx + 1) / content.length) * 100}%`, borderRadius: '3px', transition: 'width 0.2s' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '100%', justifyContent: 'center', padding: '0 20px 8px 20px' }}>
          <button 
             onClick={() => setFocusMode(!focusMode)} 
             title="Focus Mode" 
             style={{ border: 'none', background: focusMode ? C.amber : 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}>
             {focusMode ? '🎯' : '👁️'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handlePrev} disabled={activeSentenceIdx === 0} style={{ border: 'none', fontSize: '20px', background: 'none', cursor: 'pointer', opacity: activeSentenceIdx === 0 ? 0.2 : 1 }}>⏮</button>
            
            <button onClick={handlePlay} className="btn-premium" style={{
              width: '56px', height: '56px', borderRadius: '50%', background: C.amber, color: '#FFF', border: 'none', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${C.amber}44`
            }}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            <button onClick={handleNext} disabled={activeSentenceIdx === content.length - 1} style={{ border: 'none', fontSize: '20px', background: 'none', cursor: 'pointer', opacity: activeSentenceIdx === content.length - 1 ? 0.2 : 1 }}>⏭</button>
          </div>

          <div style={{ width: '1.5px', height: '24px', background: '#DDD' }} />

          {/* Record Feature */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isRecording ? (
              <button onClick={startRecording} title="Practice Reading" style={{ border: 'none', background: '#FF4757', color: '#FFF', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,71,87,0.3)' }}>🎤</button>
            ) : (
              <button onClick={stopRecording} style={{ border: 'none', background: '#FF4757', color: '#FFF', padding: '8px 16px', borderRadius: '99px', cursor: 'pointer', animation: 'pulse 1s infinite', fontSize: '11px', fontWeight: 800 }}>STOP REC</button>
            )}

            {recording && !isRecording && (
              <button onClick={() => { const a = new Audio(recording); a.play(); }} style={{ border: 'none', background: C.teal, color: '#FFF', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,184,148,0.3)' }}>🔊</button>
            )}
          </div>
        </div>
      </div>

      {/* Word Explainer Popup */}
      {selectedWord && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, backdropFilter: 'blur(5px)'
        }} onClick={() => setSelectedWord(null)}>
          <div className="glass-card" style={{ padding: '40px', maxWidth: '450px', background: '#FFF', color: '#000', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: C.amber, textTransform: 'uppercase', marginBottom: '8px' }}>How to use: {selectedWord.word}</div>
            <h2 style={{ fontFamily: Fonts.heading, fontSize: '32px', margin: '0 0 20px 0' }}>{selectedWord.word}</h2>
            
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Simplified:</div>
              <div style={{ background: '#FDF3DC', padding: '16px', borderRadius: '12px', fontSize: '16px' }}>{selectedWord.simple}</div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '32px', opacity: 0.7 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Dictionary Meaning:</div>
              <div style={{ fontSize: '14px', fontStyle: 'italic' }}>{selectedWord.dictionary}</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(selectedWord.word);
                  utterance.rate = 0.5;
                  window.speechSynthesis.speak(utterance);
                }}
                className="btn-premium" style={{ flex: 1, padding: '12px' }}>Hear Slowly 🐢</button>
              <button onClick={() => setSelectedWord(null)} style={{ padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #EEE', background: '#FFF', fontWeight: 800, cursor: 'pointer' }}>Got it!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
