import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects, getLessonsBySubject, getFullLesson } from '../services/localLessonService';
import VideoPlayer from '../components/lessons/VideoPlayer';
import ActivityRouter from '../components/lessons/ActivityRouter';

/**
 * LowVisionDashboard.jsx
 * A separate, high-contrast, large-font dashboard for users with low vision.
 * - Separate route (/low-vision)
 * - Sequential lesson modules (one-by-one)
 * - Audio at every step (female voice preferred, speechSynthesis)
 * - Reuses existing activities and video components inline
 * - Does NOT modify ADHD/Dyslexia modules
 */

const LowVisionDashboard = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('home'); // home | subjects | lessons | lesson
    const [subjects] = useState(() => getAllSubjects());
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [steps, setSteps] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [inActivity, setInActivity] = useState(false);
    const femaleVoiceRef = useRef(null);

    // Find a female-sounding voice (best-effort) without touching global TTS service
    const pickFemaleVoice = (voices) => {
        if (!voices || !voices.length) return null;
        const preferred = ['Samantha', 'Fiona', 'Amy', 'Alloy', 'Ivy', 'Joanna', 'Kajal', 'Aditi', 'Karen', 'Nicole', 'Salli', 'Google UK English Female', 'Google US English'];
        for (const name of preferred) {
            const v = voices.find(x => x.name && x.name.includes(name));
            if (v) return v;
        }
        // fallback to english voice
        const en = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
        return en || voices[0];
    };

    useEffect(() => {
        const synth = window.speechSynthesis;
        let voices = synth.getVoices();
        if (!voices || voices.length === 0) {
            const handler = () => {
                voices = synth.getVoices();
                femaleVoiceRef.current = pickFemaleVoice(voices);
                synth.removeEventListener('voiceschanged', handler);
            };
            synth.addEventListener('voiceschanged', handler);
        } else {
            femaleVoiceRef.current = pickFemaleVoice(voices);
        }
    }, []);

    const speak = (text, opts = {}) => {
        if (!text || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            if (femaleVoiceRef.current) utter.voice = femaleVoiceRef.current;
            utter.rate = opts.rate || 0.95;
            utter.pitch = opts.pitch || 1.05;
            utter.volume = 1.0;
            window.speechSynthesis.speak(utter);
        } catch (e) {
            console.warn('LowVision TTS failed', e);
        }
    };

    const openSubjects = () => setMode('subjects');
    const openGames = () => navigate('/low-vision-games');
    const openLibrary = () => navigate('/library');
    const openSettings = () => navigate('/settings');

    const selectSubject = (subject) => {
        setSelectedSubject(subject);
        // Lessons are derived from syllabus local data (fast)
        const ls = getLessonsBySubject(subject.id);
        setLessons(ls);
        setMode('lessons');
        speak(`${subject.name}. Select a lesson.`);
    };

    const openLesson = async (lessonMeta) => {
        // lessonMeta may be a lightweight object; fetch full lesson if needed
        const full = await getFullLesson(lessonMeta.id);
        if (!full) return;
        setSelectedLesson(full.lesson);
        buildSteps(full.lesson);
        setStepIndex(0);
        setMode('lesson');
        speak(`Starting lesson ${full.lesson.title}. Step 1.`);
    };

    const buildSteps = (lesson) => {
        const s = [];
        const storyChunks = lesson.story?.chunks || (lesson.story?.text ? [lesson.story.text] : []);
        storyChunks.forEach((c, i) => s.push({ type: 'story', text: c }));
        if (lesson.video && lesson.video.url) s.push({ type: 'video', title: lesson.video.title, url: lesson.video.url });
        (lesson.activities || []).forEach((act, i) => s.push({ type: 'activity', activity: act }));
        if (lesson.quiz && lesson.quiz.length) s.push({ type: 'quiz', quiz: lesson.quiz });
        setSteps(s);
    };

    useEffect(() => {
        if (mode !== 'lesson' || !steps.length) return;
        const current = steps[stepIndex];
        if (!current) return;
        // Speak for every step automatically
        if (current.type === 'story') speak(current.text);
        else if (current.type === 'video') speak(`Video: ${current.title}. Press play to watch.`);
        else if (current.type === 'activity') speak(`Activity: ${current.activity.type}. ${current.activity.question || ''}`);
        else if (current.type === 'quiz') speak(`Quiz with ${current.quiz.length} questions.`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, stepIndex, steps]);

    const gotoNextStep = () => {
        if (inActivity) return; // wait until activity completes
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
            speak(`Step ${stepIndex + 2} of ${steps.length}`);
        } else {
            speak('You have completed this lesson. Great work!');
            setMode('lessons');
        }
    };

    const gotoPrevStep = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };

    const handleActivityComplete = () => {
        setInActivity(false);
        speak('Activity complete. Moving to next step.');
        gotoNextStep();
    };

    const renderHome = () => (
        <div style={{ padding: 40, minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'Nunito, sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>Lumina — Low Vision Mode</h1>
                <div style={{ textAlign: 'right' }}>
                    <button onClick={openSettings} style={largeBtnStyle}>Settings</button>
                </div>
            </header>

            <section style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                <button onClick={openSubjects} style={primaryCard}>Lessons</button>
                <button onClick={openGames} style={secondaryCard}>Games</button>
                <button onClick={openLibrary} style={secondaryCard}>Library</button>
                <button onClick={openSettings} style={secondaryCard}>Accessibility Settings</button>
            </section>

            <footer style={{ marginTop: 60, fontSize: '1.1rem', color: '#FFD580' }}>
                Tip: Large fonts and audio at every step. Press Lessons to begin one-by-one modules.
            </footer>
        </div>
    );

    const renderSubjects = () => (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Choose Subject</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
                {subjects.map(s => (
                    <button key={s.id} onClick={() => selectSubject(s)} style={subjectCard}>
                        <div style={{ fontSize: '3rem' }}>{s.icon || '📚'}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{s.name}</div>
                        <div style={{ marginTop: 8, fontSize: '1.1rem' }}>{s.chapters?.length || 0} chapters</div>
                    </button>
                ))}
            </div>
            <div style={{ marginTop: 24 }}>
                <button onClick={() => setMode('home')} style={navBtn}>← Back</button>
            </div>
        </div>
    );

    const renderLessons = () => (
        <div style={containerStyle}>
            <h2 style={titleStyle}>{selectedSubject?.name} — Lessons</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lessons.map(l => (
                    <button key={l.id} onClick={() => openLesson(l)} style={lessonCard}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{l.title}</div>
                        <div style={{ fontSize: '1.1rem', marginTop: 6 }}>{l.duration || ''} • {l.difficulty || ''}</div>
                    </button>
                ))}
            </div>
            <div style={{ marginTop: 24 }}>
                <button onClick={() => setMode('subjects')} style={navBtn}>← Back</button>
            </div>
        </div>
    );

    const renderLessonStep = () => {
        const cur = steps[stepIndex];
        if (!cur) return null;

        return (
            <div style={{ padding: 30, minHeight: '100vh', background: '#000', color: '#fff' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '2.2rem', margin: 0 }}>{selectedLesson?.title}</h2>
                    <div style={{ fontSize: '1.1rem' }}>Step {stepIndex + 1} / {steps.length}</div>
                </header>

                <main style={{ marginTop: 36 }}>
                    {cur.type === 'story' && (
                        <div style={{ fontSize: '2rem', lineHeight: 1.4 }}>{cur.text}</div>
                    )}

                    {cur.type === 'video' && (
                        <div>
                            <VideoPlayer video={{ title: cur.title, url: cur.url }} onContinue={() => { /* when continue is pressed, advance */ gotoNextStep(); }} isHighContrast={true} />
                        </div>
                    )}

                    {cur.type === 'activity' && (
                        <div style={{ marginTop: 12 }}>
                            {/* Render the activity inline using ActivityRouter. */}
                            <ActivityRouter
                                activities={[cur.activity]}
                                currentIndex={0}
                                onActivityComplete={() => handleActivityComplete()}
                                triggerReaction={() => { }}
                                isHighContrast={true}
                            />
                        </div>
                    )}

                    {cur.type === 'quiz' && (
                        <div style={{ fontSize: '1.6rem' }}>This lesson has a short quiz. You can complete it later in the normal quiz flow.</div>
                    )}
                </main>

                <nav style={{ display: 'flex', gap: 12, marginTop: 36 }}>
                    <button onClick={gotoPrevStep} style={navBtn}>← Previous</button>
                    <button onClick={gotoNextStep} style={primaryNavBtn}>Next →</button>
                    <button onClick={() => { window.speechSynthesis.cancel(); speak('Pause'); }} style={navBtn}>Pause Audio</button>
                    <button onClick={() => { window.speechSynthesis.cancel(); setMode('lessons'); }} style={navBtn}>Exit Lesson</button>
                </nav>
            </div>
        );
    };

    return (
        <div>
            {mode === 'home' && renderHome()}
            {mode === 'subjects' && renderSubjects()}
            {mode === 'lessons' && renderLessons()}
            {mode === 'lesson' && renderLessonStep()}
        </div>
    );
};

// --- Styles ---
const containerStyle = { padding: 40 };
const titleStyle = { fontSize: '2.4rem', fontWeight: 900, marginBottom: 24 };
const largeBtnStyle = { padding: '12px 20px', fontSize: '1.1rem', borderRadius: 12 };
const primaryCard = { padding: 36, background: '#111827', color: '#fff', borderRadius: 20, fontSize: '2rem', fontWeight: 900, border: '4px solid #2563EB' };
const secondaryCard = { padding: 36, background: '#111827', color: '#fff', borderRadius: 20, fontSize: '1.6rem', fontWeight: 800, border: '2px solid #64748B' };
const subjectCard = { padding: 28, background: '#111827', color: '#fff', borderRadius: 16, textAlign: 'left', border: '2px solid #2563EB' };
const lessonCard = { padding: 20, background: '#000', color: '#FFD580', borderRadius: 12, textAlign: 'left', border: '2px solid #FFD580' };
const navBtn = { padding: '12px 18px', fontSize: '1.1rem', borderRadius: 12, background: '#111827', color: '#fff', border: '2px solid #64748B' };
const primaryNavBtn = { padding: '12px 18px', fontSize: '1.1rem', borderRadius: 12, background: '#10B981', color: '#fff', border: 'none', fontWeight: 800 };

export default LowVisionDashboard;
