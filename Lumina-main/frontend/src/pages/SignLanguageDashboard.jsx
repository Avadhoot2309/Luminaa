import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const C = {
    slate: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    navy: '#0F172A',
    textSoft: '#64748B',
    blue: '#2563EB',
    purple: '#8B5CF6'
};

export default function SignLanguageDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeFeature, setActiveFeature] = useState(null);

    const courses = [
        {
            id: 'basics',
            name: 'Sign Basics',
            emoji: '👋',
            color: '#EC4899',
            desc: 'Learn fundamental signs and hand shapes',
            time: '10 min'
        },
        {
            id: 'numbers',
            name: 'Numbers & Letters',
            emoji: '🔢',
            color: '#F59E0B',
            desc: 'Practice signing numbers 0-100 and alphabet',
            time: '8 min'
        },
        {
            id: 'daily',
            name: 'Daily Vocabulary',
            emoji: '🌍',
            color: '#3B82F6',
            desc: 'Common words for everyday communication',
            time: '12 min'
        },
        {
            id: 'game',
            name: 'Sign Match Game',
            emoji: '🎮',
            color: '#8B5CF6',
            desc: 'Practice sign recognition with webcam feedback',
            time: 'Interactive'
        }
    ];

    const sectionStyle = {
        backgroundColor: C.white,
        padding: '20px',
        borderRadius: '16px',
        border: `2px solid ${C.purple}40`
    };

    const cardBaseStyle = {
        padding: '22px 16px',
        borderRadius: '14px',
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        minHeight: '140px',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        color: C.text,
        backgroundColor: '#ffffff',
        border: '2px solid transparent'
    };

    const handleCourseClick = (id) => {
        if (id === 'game') {
            navigate('/game/sign-match');
        } else {
            setActiveFeature(id);
        }
    };

    return (
        <div
            className="dyslexia-forced"
            style={{
                minHeight: '100vh',
                backgroundColor: C.slate,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
            }}
        >
            <style>{`
                .dyslexia-forced, .dyslexia-forced * {
                    font-family: 'Open-Dyslexic', sans-serif !important;
                }
            `}</style>

            {/* BACK BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${C.purple}40`,
                        backgroundColor: C.white,
                        color: C.navy,
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = C.purple;
                        e.target.style.color = C.white;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = C.white;
                        e.target.style.color = C.navy;
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h1 style={{ color: C.navy, fontSize: '2.5rem', margin: '10px 0', fontWeight: 900 }}>
                    🤟 Sign Language Learning
                </h1>
                <p style={{ color: C.textSoft, fontSize: '16px', margin: 0 }}>
                    Master sign language through interactive lessons and live practice
                </p>
            </div>

            {/* COURSES SECTION */}
            <section style={sectionStyle}>
                <div style={{ fontSize: '1.4rem', marginBottom: '15px', color: C.navy, fontWeight: 800 }}>
                    📚 Learning Courses
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course.id)}
                            style={{
                                ...cardBaseStyle,
                                backgroundColor: course.color + '08',
                                borderColor: course.color + '40'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = course.color + '20';
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = `0 8px 16px ${course.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = course.color + '08';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ fontSize: '2.5rem' }}>{course.emoji}</div>
                            <div style={{ fontWeight: 800, fontSize: '15px', color: C.text }}>
                                {course.name}
                            </div>
                            <div style={{ fontSize: '13px', color: C.textSoft, marginTop: 'auto' }}>
                                {course.desc}
                            </div>
                            <div style={{ fontSize: '12px', color: course.color, fontWeight: 700, marginTop: '8px' }}>
                                ⏱️ {course.time}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* INFO SECTION */}
            <section style={sectionStyle}>
                <h3 style={{ fontSize: '1.2rem', color: C.navy, fontWeight: 800, marginTop: 0 }}>
                    💡 Tips for Success
                </h3>
                <ul style={{ color: C.text, lineHeight: 1.8, fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                    <li>Use a well-lit space for the camera to capture your signs clearly</li>
                    <li>Practice each sign multiple times to build muscle memory</li>
                    <li>Watch your hand placement and make sure the camera can see your movements</li>
                    <li>Take breaks between sessions to avoid fatigue</li>
                    <li>Celebrate your progress! Sign language is a beautiful skill 🌟</li>
                </ul>
            </section>

            {/* FEATURE MODALS */}
            {activeFeature && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}
                    onClick={() => setActiveFeature(null)}
                >
                    <div style={{
                        backgroundColor: C.white,
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ color: C.navy, fontWeight: 800, margin: 0 }}>
                                {courses.find(c => c.id === activeFeature)?.name}
                            </h2>
                            <button
                                onClick={() => setActiveFeature(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    padding: '0'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <p style={{ color: C.textSoft, lineHeight: 1.6 }}>
                            This course will help you master {courses.find(c => c.id === activeFeature)?.name.toLowerCase()}.
                            Click the button below to start learning!
                        </p>
                        <button
                            onClick={() => {
                                setActiveFeature(null);
                                // Can add specific course routes here when ready
                            }}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: C.purple,
                                color: C.white,
                                fontWeight: 800,
                                cursor: 'pointer',
                                fontSize: '15px',
                                marginTop: '20px'
                            }}
                        >
                            Start Course →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
