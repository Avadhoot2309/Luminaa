import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { fetchStudentContent } from '../../services/contentService';
import { useAuth } from '../../contexts/AuthContext';
import { logStudentEvent } from '../../services/behaviorService';
import ttsService from '../../services/tts-service';

// ─── WordHighlighter — splits text into word spans for audio sync ─────────────
function WordHighlighter({ text, activeIndex, onClick, highlightEnabled }) {
  const words = text.split(/(\s+)/);
  let wordCount = 0;
  return (
    <span>
      {words.map((segment, i) => {
        if (/^\s+$/.test(segment)) return <span key={i}>{segment}</span>;
        const isActive = highlightEnabled && idx === activeIndex;
        return (
          <span
            key={i}
            onClick={() => onClick && onClick(idx)}
            style={{
              ...wh.word,
              ...(isActive ? wh.wordActive : {})
            }}
          >
            {segment}
          </span>
        );
      })}
    </span>
  );
}

// ─── ContentCard — shown in student dashboard list ────────────────────────────
export function ContentCard({ item, onClick }) {
  return (
    <div onClick={() => onClick(item)} style={cc.card} className="content-card-hover">
      <div style={cc.badge}>📚 New Lesson</div>
      <h3 style={cc.title}>{item.title}</h3>
      <p style={cc.preview}>
        {item.simplifiedText?.slice(0, 90)}…
      </p>
      <div style={cc.footer}>
        <span style={cc.cta}>Tap to read →</span>
      </div>
    </div>
  );
}

// ─── Main ContentViewer component ─────────────────────────────────────────────
export default function ContentViewer() {
  const { currentUser } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const adaptiveConfig = location.state?.adaptiveConfig || { content: {}, ui: {}, interaction: {} };
  const { content: cConf = {}, ui: uiConf = {}, interaction: iConf = {} } = adaptiveConfig;

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [activeWord, setActiveWord] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [highContrast, setHighContrast] = useState(uiConf.highContrast || false);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [usedAudio, setUsedAudio] = useState(false);

  // For ADHD chunking
  const [chunkIndex, setChunkIndex] = useState(0);

  const utterRef = useRef(null);

  const goBackFromList = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/dashboard');
  };

  useEffect(() => {
    // Sync font size
    if (uiConf.fontSize === 'xlarge') setFontSize(28);
    else if (uiConf.fontSize === 'large') setFontSize(24);
    else if (uiConf.fontSize === 'small') setFontSize(16);
    else setFontSize(20);

    if (uiConf.fontFamily === 'OpenDyslexic') {
      document.documentElement.style.setProperty('--content-font', 'OpenDyslexic, sans-serif');
    }
  }, [uiConf]);

  useEffect(() => {
    if (!currentUser) return;
    const studentId = currentUser.uid ?? currentUser.studentId;
    fetchStudentContent(studentId)
      .then(setLessons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  // ── Audio / TTS ──
  const stopAudio = () => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setActiveWord(-1);
  };

  const playAudio = (textToPlay) => {
    if (!textToPlay) return;
    stopAudio();
    setUsedAudio(true);

    const utter = new SpeechSynthesisUtterance(textToPlay);
    utter.rate = 0.85;
    utter.pitch = 1;
    utter.lang = 'en-IN';

    const words = textToPlay.split(/\s+/);
    let wordIdx = 0;
    utter.onboundary = (e) => {
      if (e.name === 'word') setActiveWord(wordIdx++);
    };
    utter.onend = () => { setIsPlaying(false); setActiveWord(-1); };
    utter.onerror = () => { setIsPlaying(false); setActiveWord(-1); };

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
  };

  const handleSelectLesson = (item) => {
    setSelected(item);
    setSessionStartTime(Date.now());
    setChunkIndex(0);
    setUsedAudio(false);
    if (cConf.audioFirst) {
      setTimeout(() => playAudio(item.simplifiedText), 300);
    }
  };

  const handleCloseLesson = () => {
    if (sessionStartTime > 0) {
      const duration = Math.round((Date.now() - sessionStartTime) / 1000);
      logStudentEvent({
        studentId: profile.studentId,
        type: 'lesson',
        action: 'completed',
        duration,
        usedAudio,
      });
    }
    stopAudio();
    setSelected(null);
  };

  // ── LESSON LIST VIEW ──
  if (!selected) {
    return (
      <div style={{ ...v.page, ...(highContrast ? v.pageHC : {}) }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&display=swap');
          .content-card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        `}</style>

        <header style={v.header}>
          <button onClick={goBackFromList} style={v.listBackBtn}>
            ← Back
          </button>
          <h1 style={{ ...v.heading, ...(highContrast ? v.textHC : {}) }}>Your Lessons 📚</h1>
          <p style={v.sub}>Your teacher has prepared these specially for you.</p>
        </header>

        {loading ? (
          <div style={v.loading}>Loading your lessons…</div>
        ) : lessons.length === 0 ? (
          <div style={v.empty}>
            <span style={{ fontSize: 56 }}>📭</span>
            <p>No lessons yet. Your teacher will add one soon!</p>
          </div>
        ) : (
          <div style={v.grid}>
            {lessons.map(item => (
              <ContentCard key={item.id} item={item} onClick={handleSelectLesson} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── SINGLE LESSON READER ──
  const bg = highContrast ? '#000' : '#FFFDF5';
  const text = highContrast ? '#FFF' : '#0A1628';

  return (
    <div style={{ ...v.reader, background: bg, color: text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600&display=swap');
        .word-highlight { cursor: pointer; border-radius: 4px; padding: 1px 2px; }
        .word-highlight:hover { background: rgba(232,146,12,0.15); }
      `}</style>

      {/* TOP BAR */}
      <div style={v.topBar}>
        <button onClick={handleCloseLesson} style={v.backBtn}>
          ← Back to Lessons
        </button>

        <div style={v.controls}>
          {/* Font size */}
          <button onClick={() => setFontSize(f => Math.max(f - 2, 14))} style={v.ctrl}>A−</button>
          <button onClick={() => setFontSize(f => Math.min(f + 2, 36))} style={v.ctrl}>A+</button>
          {/* Contrast */}
          <button onClick={() => setHighContrast(h => !h)} style={v.ctrl}>
            {highContrast ? '☀️' : '🌙'}
          </button>
          {/* Audio */}
          <button
            onClick={() => isPlaying ? stopAudio() : playAudio(selected.simplifiedText)}
            style={{ ...v.ctrl, ...v.audioBtn, ...(isPlaying ? v.audioBtnActive : {}) }}
          >
            {isPlaying ? '⏹ Stop' : '🔊 Read Aloud'}
          </button>
        </div>
      </div>

      {/* LESSON CONTENT */}
      <article style={{ ...v.article, fontSize }}>
        <h1 style={{ ...v.lessonTitle, color: text }}>{selected.title}</h1>
        <div style={{ ...v.body, lineHeight: profile?.preferences?.lineSpacing || 1.9 }}>
          {(() => {
            const paragraphs = selected.simplifiedText?.split('\n').filter(p => p.trim()) || [];

            // Chunking logic for ADHD
            if (cConf.chunkSize === 'small' && paragraphs.length > 0) {
              const currentPara = paragraphs[chunkIndex];
              return (
                <div style={v.chunkContainer}>
                  <p style={v.para}>
                    <WordHighlighter
                      text={currentPara}
                      activeIndex={activeWord}
                      highlightEnabled={cConf.highlightWords}
                    />
                  </p>
                  <div style={v.chunkNav}>
                    <button
                      disabled={chunkIndex === 0}
                      onClick={() => { setChunkIndex(i => i - 1); stopAudio(); }}
                      style={{ ...v.ctrl, opacity: chunkIndex === 0 ? 0.3 : 1 }}
                    >
                      ← Previous
                    </button>
                    <span style={{ fontSize: 16 }}>Part {chunkIndex + 1} of {paragraphs.length}</span>
                    <button
                      onClick={() => {
                        if (chunkIndex < paragraphs.length - 1) {
                          setChunkIndex(i => i + 1);
                          stopAudio();
                        } else {
                          handleCloseLesson();
                        }
                      }}
                      style={v.ctrl}
                    >
                      {chunkIndex < paragraphs.length - 1 ? 'Next Part →' : 'Done! 🎉'}
                    </button>
                  </div>
                </div>
              );
            }

            // Normal rendering
            return paragraphs.map((para, pi) => (
              <p key={pi} style={v.para}>
                <WordHighlighter
                  text={para}
                  activeIndex={activeWord}
                  highlightEnabled={cConf.highlightWords}
                />
              </p>
            ));
          })()}
        </div>
      </article>

      {iConf.allowDistractions === false && (
        <div style={v.focusFrameOverlay} />
      )}
    </div>
  );
}

// ─── Styles ───
const wh = {
  word: {
    display: 'inline',
    borderRadius: 4,
    padding: '1px 2px',
    cursor: 'pointer',
    transition: 'background 0.15s'
  },
  wordActive: {
    background: '#FFD080',
    color: '#0A1628',
    borderRadius: 4
  }
};

const cc = {
  card: {
    background: '#fff',
    borderRadius: 24, padding: '28px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    border: '1px solid #E8ECF0',
    display: 'flex', flexDirection: 'column', gap: 12,
    fontFamily: 'Nunito, sans-serif'
  },
  badge: {
    background: '#FFF9F0', color: '#E8920C',
    borderRadius: 100, padding: '4px 12px',
    fontSize: 12, fontWeight: 800,
    display: 'inline-block', alignSelf: 'flex-start'
  },
  title: {
    fontFamily: 'Fraunces, serif',
    fontSize: '1.4rem', color: '#0A1628', margin: 0
  },
  preview: {
    fontSize: 14, color: '#5A7088',
    lineHeight: 1.7, margin: 0
  },
  footer: { marginTop: 4 },
  cta: { fontSize: 13, fontWeight: 800, color: '#4A90D9' }
};

const v = {
  page: {
    minHeight: '100vh', fontFamily: 'Nunito, sans-serif',
    background: '#F7F6F2', padding: '60px'
  },
  pageHC: { background: '#000', color: '#fff' },
  header: { marginBottom: 40 },
  listBackBtn: {
    background: '#FFFFFF',
    color: '#0A1628',
    border: '1px solid #E8ECF0',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 800,
    cursor: 'pointer',
    marginBottom: 16,
    fontFamily: 'Nunito, sans-serif'
  },
  heading: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2.4rem', color: '#0A1628', margin: 0
  },
  textHC: { color: '#fff' },
  sub: { color: '#5A7088', fontSize: 16, marginTop: 8 },
  loading: { textAlign: 'center', padding: 80, color: '#A0AEC0', fontSize: 18 },
  empty: {
    textAlign: 'center', padding: 80,
    color: '#A0AEC0', fontSize: 18,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24
  },
  // Reader
  reader: {
    minHeight: '100vh',
    fontFamily: 'Nunito, sans-serif',
    transition: 'background 0.3s, color 0.3s'
  },
  topBar: {
    position: 'sticky', top: 0,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 60px',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #E8ECF0',
    zIndex: 100
  },
  backBtn: {
    background: 'none', border: 'none',
    color: '#5A7088', fontWeight: 800,
    fontSize: 15, cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif'
  },
  controls: { display: 'flex', gap: 10, alignItems: 'center' },
  ctrl: {
    background: '#F7F6F2', border: 'none',
    padding: '8px 14px', borderRadius: 10,
    fontWeight: 700, cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    fontSize: 14
  },
  audioBtn: {
    background: '#0A1628', color: '#fff',
    padding: '10px 20px', borderRadius: 12,
    fontSize: 14
  },
  audioBtnActive: { background: '#E53E3E' },
  article: {
    maxWidth: 720, margin: '0 auto',
    padding: '60px 24px 120px'
  },
  lessonTitle: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2.2rem',
    marginBottom: 40
  },
  body: {},
  para: {
    marginBottom: '1.4em',
    letterSpacing: '0.02em'
  },
  chunkContainer: {
    display: 'flex', flexDirection: 'column', gap: 32,
    background: 'rgba(255,255,255,0.05)', padding: 40, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
  },
  chunkNav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 24, borderTop: '2px dashed rgba(128,128,128,0.2)'
  },
  focusFrameOverlay: {
    position: 'fixed', inset: 0, pointerEvents: 'none', border: '24px solid rgba(0,0,0,0.9)',
    zIndex: 9999
  }
};
