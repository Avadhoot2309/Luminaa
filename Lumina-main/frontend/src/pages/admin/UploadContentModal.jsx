import React, { useState, useRef, useCallback } from 'react';
import { extractText, simplifyText, saveAdaptedContent } from '../../services/contentService';

// ─── Upload stages for the progress stepper ──────────────────────────────────
const STAGES = ['idle', 'extracting', 'simplifying', 'saving', 'done', 'error'];

export default function UploadContentModal({ isOpen, onClose, teacherId, students = [], onSaved }) {
  const [mode, setMode]           = useState('file');     // 'file' | 'text'
  const [file, setFile]           = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [title, setTitle]         = useState('');
  const [assignTo, setAssignTo]   = useState('');         // studentId or ''
  const [stage, setStage]         = useState('idle');
  const [progress, setProgress]   = useState(0);
  const [errorMsg, setErrorMsg]   = useState('');
  const [result, setResult]       = useState(null);       // { id, simplifiedText }
  const [dragOver, setDragOver]   = useState(false);
  const fileRef = useRef(null);

  const reset = () => {
    setMode('file'); setFile(null); setPastedText(''); setTitle('');
    setAssignTo(''); setStage('idle'); setProgress(0);
    setErrorMsg(''); setResult(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setTitle(dropped.name.replace(/\.[^.]+$/, '')); }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) { setFile(selected); setTitle(selected.name.replace(/\.[^.]+$/, '')); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // 1 — Extract
      let rawText = '';
      if (mode === 'text') {
        rawText = pastedText;
        setStage('simplifying');
      } else {
        setStage('extracting');
        setProgress(0);
        rawText = await extractText(file, setProgress);
        setProgress(100);
        setStage('simplifying');
      }

      if (!rawText.trim()) throw new Error('No text could be extracted. Please paste text manually.');

      // 2 — Simplify
      const simplified = await simplifyText(rawText);

      // 3 — Save
      setStage('saving');
      const id = await saveAdaptedContent({
        teacherId,
        studentId: assignTo || null,
        title: title || 'Untitled Lesson',
        originalText: rawText,
        simplifiedText: simplified
      });

      setResult({ id, simplifiedText: simplified });
      setStage('done');
      if (onSaved) onSaved({ id, title: title || 'Untitled Lesson', simplifiedText: simplified, studentId: assignTo || null });
    } catch (err) {
      console.error('[UploadContentModal]', err);
      setErrorMsg(err.message || 'Something went wrong.');
      setStage('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={s.overlay}>
      <div style={s.sheet} className="fade-up">

        {/* ── HEADER ── */}
        <div style={s.header}>
          <div>
            <h2 style={s.title}>📤 Upload Learning Material</h2>
            <p style={s.sub}>AI will simplify it automatically for your students.</p>
          </div>
          <button onClick={handleClose} style={s.closeBtn} aria-label="Close">✕</button>
        </div>

        {/* ── DONE STATE ── */}
        {stage === 'done' ? (
          <div style={s.doneWrap}>
            <div style={s.doneIcon}>✅</div>
            <h3 style={s.doneTitle}>Content Ready!</h3>
            <p style={s.doneSub}>The simplified lesson has been saved and is now available to the assigned student.</p>
            <div style={s.previewBox}>
              <p style={s.previewLabel}>SIMPLIFIED PREVIEW</p>
              <p style={s.previewText}>{result?.simplifiedText?.slice(0, 400)}…</p>
            </div>
            <button onClick={handleClose} style={s.submitBtn}>🎉 All Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.body}>

            {/* ── MODE SWITCHER ── */}
            <div style={s.modeSwitcher}>
              {['file', 'text'].map(m => (
                <button
                  key={m} type="button"
                  onClick={() => setMode(m)}
                  style={{ ...s.modeBtn, ...(mode === m ? s.modeBtnActive : {}) }}
                >
                  {m === 'file' ? '📁 Upload File' : '✏️ Paste Text'}
                </button>
              ))}
            </div>

            {/* ── TITLE ── */}
            <div style={s.field}>
              <label style={s.label}>LESSON TITLE</label>
              <input
                style={s.input}
                placeholder="e.g. The Water Cycle"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* ── FILE DROP ZONE ── */}
            {mode === 'file' && (
              <div
                style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : {}) }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <input ref={fileRef} type="file" style={{ display: 'none' }}
                  accept="image/*,application/pdf,text/plain"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div style={s.fileChosen}>
                    <span style={s.fileIcon}>📄</span>
                    <span style={s.fileName}>{file.name}</span>
                    <button type="button" style={s.fileRemove}
                      onClick={e => { e.stopPropagation(); setFile(null); }}>✕</button>
                  </div>
                ) : (
                  <>
                    <div style={s.dropIcon}>☁️</div>
                    <p style={s.dropPrimary}>Drag & drop or click to choose</p>
                    <p style={s.dropSecondary}>JPG · PNG · PDF · TXT</p>
                  </>
                )}
              </div>
            )}

            {/* ── TEXT PASTE ── */}
            {mode === 'text' && (
              <div style={s.field}>
                <label style={s.label}>PASTE LESSON TEXT</label>
                <textarea
                  style={s.textarea}
                  rows={8}
                  placeholder="Paste the textbook paragraph or lesson content here…"
                  value={pastedText}
                  onChange={e => setPastedText(e.target.value)}
                  required={mode === 'text'}
                />
              </div>
            )}

            {/* ── ASSIGN TO STUDENT ── */}
            <div style={s.field}>
              <label style={s.label}>ASSIGN TO STUDENT (OPTIONAL)</label>
              <select style={s.select} value={assignTo} onChange={e => setAssignTo(e.target.value)}>
                <option value="">— All / Assign Later —</option>
                {students.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* ── PROGRESS ── */}
            {stage !== 'idle' && stage !== 'error' && (
              <div style={s.progressWrap}>
                <div style={s.progressTrack}>
                  <div style={{
                    ...s.progressFill,
                    width: stage === 'extracting' ? `${progress}%`
                         : stage === 'simplifying' ? '60%'
                         : stage === 'saving'      ? '90%' : '100%'
                  }} />
                </div>
                <p style={s.progressLabel}>
                  {stage === 'extracting'  && `📷 Reading file… ${progress}%`}
                  {stage === 'simplifying' && '🤖 AI is simplifying the content…'}
                  {stage === 'saving'      && '💾 Saving to Firestore…'}
                </p>
              </div>
            )}

            {/* ── ERROR ── */}
            {stage === 'error' && (
              <div style={s.errorBox} role="alert">⚠️ {errorMsg}</div>
            )}

            {/* ── SUBMIT ── */}
            <button
              type="submit"
              style={{ ...s.submitBtn, opacity: stage !== 'idle' && stage !== 'error' ? 0.6 : 1 }}
              disabled={stage !== 'idle' && stage !== 'error'}
            >
              {stage === 'idle' || stage === 'error' ? '✨ Process & Save' : 'Working…'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(10,22,40,0.85)',
    backdropFilter: 'blur(10px)',
    zIndex: 2000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24
  },
  sheet: {
    background: '#fff',
    width: 560, maxWidth: '100%', maxHeight: '90vh',
    borderRadius: 32, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 40px 80px rgba(0,0,0,0.35)'
  },
  header: {
    padding: '32px 36px 24px',
    borderBottom: '1px solid #E8ECF0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    flexShrink: 0
  },
  title: {
    fontFamily: 'Fraunces, serif',
    fontSize: '1.7rem', color: '#0A1628', margin: 0
  },
  sub: { color: '#5A7088', fontSize: 14, marginTop: 4 },
  closeBtn: {
    background: '#F7F6F2', border: 'none',
    width: 32, height: 32, borderRadius: '50%',
    cursor: 'pointer', fontWeight: 800, flexShrink: 0
  },
  body: {
    padding: '28px 36px 36px',
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: 20
  },
  modeSwitcher: { display: 'flex', gap: 10 },
  modeBtn: {
    flex: 1, padding: '11px',
    borderRadius: 12, border: '1.5px solid #E8ECF0',
    background: '#fff', color: '#5A7088',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.18s'
  },
  modeBtnActive: {
    borderColor: '#E8920C', background: '#FFF9F0',
    color: '#E8920C'
  },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontSize: 11, fontWeight: 900,
    color: '#A0AEC0', letterSpacing: '0.1em'
  },
  input: {
    padding: '13px 16px', borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    fontSize: 15, fontFamily: 'Nunito, sans-serif',
    outline: 'none', color: '#0A1628'
  },
  textarea: {
    padding: '13px 16px', borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    fontSize: 15, fontFamily: 'Nunito, sans-serif',
    resize: 'vertical', outline: 'none', color: '#0A1628',
    lineHeight: 1.6
  },
  select: {
    padding: '13px 16px', borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    fontSize: 15, background: '#fff',
    fontFamily: 'Nunito, sans-serif', color: '#0A1628'
  },
  dropZone: {
    border: '2px dashed #D0D8E4',
    borderRadius: 16, padding: '40px 20px',
    textAlign: 'center', cursor: 'pointer',
    transition: 'all 0.2s', background: '#FAFBFC'
  },
  dropZoneActive: {
    borderColor: '#E8920C', background: '#FFF9F0'
  },
  dropIcon: { fontSize: 36, marginBottom: 12 },
  dropPrimary: { fontWeight: 700, color: '#0A1628', fontSize: 15, margin: 0 },
  dropSecondary: { color: '#A0AEC0', fontSize: 12, marginTop: 6 },
  fileChosen: {
    display: 'flex', alignItems: 'center',
    gap: 12, justifyContent: 'center'
  },
  fileIcon: { fontSize: 28 },
  fileName: { fontWeight: 700, color: '#0A1628', fontSize: 15 },
  fileRemove: {
    background: 'none', border: 'none',
    color: '#E53E3E', cursor: 'pointer', fontSize: 16, fontWeight: 800
  },
  progressWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  progressTrack: {
    height: 8, background: '#E8ECF0',
    borderRadius: 100, overflow: 'hidden'
  },
  progressFill: {
    height: '100%', background: '#E8920C',
    borderRadius: 100, transition: 'width 0.4s ease'
  },
  progressLabel: { fontSize: 13, color: '#5A7088', fontWeight: 700, margin: 0 },
  errorBox: {
    background: '#FFF1F0', border: '1px solid #FFA39E',
    borderRadius: 12, padding: '12px 16px',
    color: '#E53E3E', fontSize: 14, fontWeight: 600
  },
  submitBtn: {
    background: '#0A1628', color: '#fff',
    border: 'none', padding: '15px',
    borderRadius: 14, fontSize: 16,
    fontWeight: 900, cursor: 'pointer',
    transition: 'opacity 0.2s', marginTop: 4
  },
  // Done state
  doneWrap: {
    padding: '40px 36px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 16, textAlign: 'center', overflowY: 'auto'
  },
  doneIcon: { fontSize: 56 },
  doneTitle: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2rem', color: '#0A1628', margin: 0
  },
  doneSub: { color: '#5A7088', fontSize: 15, maxWidth: 380, lineHeight: 1.6 },
  previewBox: {
    background: '#F7F9FC', borderRadius: 16,
    padding: 20, width: '100%', textAlign: 'left'
  },
  previewLabel: {
    fontSize: 10, fontWeight: 900,
    color: '#A0AEC0', letterSpacing: '0.12em', marginBottom: 8
  },
  previewText: { fontSize: 14, color: '#0A1628', lineHeight: 1.8 }
};
