import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import { LuminaLogo } from '../components/BrandLogo';

/**
 * VisualImpairedDashboard - Optimized for students with visual impairment
 * Features:
 * - Extra large text (1.5rem base)
 * - High contrast colors (dark background, bright text)
 * - Text-to-speech support
 * - Keyboard navigation friendly
 * - Minimal visual distractions
 * - Focus on audio/voice interactions
 */

const C = {
    navy: '#0F172A',
    darkBg: '#1A1A1A',
    brightYellow: '#FFD700',
    white: '#FFFFFF',
    highContrast: '#FFFF00',
    text: '#FFFFFF',
    border: '#FFD700'
};

const Fonts = {
    heading: "'Arial', 'Helvetica', sans-serif",
    body: "'Arial', 'Helvetica', sans-serif"
};

export default function VisualImpairedDashboard({ selectedStudent = null, isEmbedded = false }) {
    const navigate = useNavigate();
    const contextProfile = useProfile() || { profile: null };
    const profile = selectedStudent || contextProfile?.profile; // Use selectedStudent if provided
    const { t } = useTranslation();
    const [speakMode, setSpeakMode] = useState(true); // Enable text-to-speech
    const [fontSize, setFontSize] = useState('large'); // 'large', 'xlarge', 'xxlarge'

    // When embedded from teacher dashboard, don't show navigation back
    const showNavigation = !isEmbedded;

    const getBaseFontSize = () => {
        switch (fontSize) {
            case 'xlarge': return '1.8rem';
            case 'xxlarge': return '2.2rem';
            default: return '1.5rem';
        }
    };

    const mainStyle = {
        minHeight: '100vh',
        backgroundColor: C.darkBg,
        fontFamily: Fonts.body,
        fontSize: getBaseFontSize(),
        lineHeight: '1.8',
        color: C.text,
        overflowX: 'hidden'
    };

    const headerStyle = {
        backgroundColor: C.navy,
        color: C.brightYellow,
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
        flexWrap: 'wrap',
        border: `4px solid ${C.brightYellow}`
    };

    const navButtonStyle = (isActive) => ({
        padding: '16px 32px',
        fontSize: getBaseFontSize(),
        fontFamily: Fonts.body,
        fontWeight: '700',
        border: `3px solid ${C.brightYellow}`,
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isActive ? C.brightYellow : 'transparent',
        color: isActive ? C.navy : C.brightYellow,
        transition: 'all 0.3s ease'
    });

    const contentStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px'
    };

    const sectionStyle = {
        backgroundColor: C.navy,
        padding: '40px',
        borderRadius: '12px',
        border: `4px solid ${C.brightYellow}`,
        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)'
    };

    const sectionTitleStyle = {
        fontSize: `calc(${getBaseFontSize()} * 1.5)`,
        fontWeight: '900',
        color: C.brightYellow,
        fontFamily: Fonts.heading,
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: `4px solid ${C.brightYellow}`
    };

    const taskItemStyle = {
        backgroundColor: C.darkBg,
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `3px solid ${C.brightYellow}`,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: getBaseFontSize()
    };

    const checkboxStyle = {
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        accentColor: C.brightYellow
    };

    const largeButtonStyle = {
        padding: '40px 48px',
        fontSize: getBaseFontSize(),
        fontFamily: Fonts.body,
        fontWeight: '900',
        border: `4px solid ${C.brightYellow}`,
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: C.brightYellow,
        color: C.navy,
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    };

    const [tasks] = useState([
        { id: 1, title: 'Audio Lesson 1', completed: false },
        { id: 2, title: 'Vocabulary Practice', completed: false },
        { id: 3, title: 'Audio Quiz', completed: false },
        { id: 4, title: 'Assignment 1', completed: false }
    ]);

    const [completedTasks, setCompletedTasks] = useState(
        tasks.reduce((acc, task) => ({ ...acc, [task.id]: false }), {})
    );

    const handleTaskToggle = (taskId) => {
        setCompletedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const speak = (text) => {
        if (speakMode && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        }
    };

    const completedCount = Object.values(completedTasks).filter(Boolean).length;

    return (
        <div style={mainStyle}>
            {/* HEADER */}
            {showNavigation && (
                <header style={headerStyle}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        cursor: 'pointer'
                    }} onClick={() => navigate('/dashboard')}>
                        <LuminaLogo size={48} color={C.brightYellow} />
                        <h1 style={{
                            margin: '0',
                            fontSize: `calc(${getBaseFontSize()} * 1.3)`,
                            fontFamily: Fonts.heading,
                            fontWeight: '900',
                            color: C.brightYellow
                        }}>
                            LUMINA
                        </h1>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <button style={navButtonStyle(true)}>📖 LESSONS</button>
                        <button style={navButtonStyle(false)}>🎮 GAMES</button>
                        <button style={navButtonStyle(false)}>⚙️ SETTINGS</button>
                    </div>

                    <div style={{
                        padding: '16px 32px',
                        backgroundColor: C.brightYellow,
                        color: C.navy,
                        borderRadius: '8px',
                        fontWeight: '900',
                        fontSize: `calc(${getBaseFontSize()} * 0.9)`,
                        border: `3px solid ${C.navy}`
                    }}>
                        ✨ {profile?.name || 'STUDENT'}
                    </div>
                </header>
            )}

            {/* MAIN CONTENT */}
            <main style={contentStyle}>
                {/* CONTROLS SECTION */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>⚙️ ACCESSIBILITY SETTINGS</h2>

                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div style={{
                            padding: '24px',
                            backgroundColor: C.darkBg,
                            borderRadius: '8px',
                            border: `3px solid ${C.brightYellow}`
                        }}>
                            <label style={{
                                fontSize: getBaseFontSize(),
                                fontWeight: '900',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={speakMode}
                                    onChange={(e) => setSpeakMode(e.target.checked)}
                                    style={{ ...checkboxStyle }}
                                />
                                <span>🔊 TEXT-TO-SPEECH: {speakMode ? 'ON' : 'OFF'}</span>
                            </label>
                        </div>

                        <div style={{
                            padding: '24px',
                            backgroundColor: C.darkBg,
                            borderRadius: '8px',
                            border: `3px solid ${C.brightYellow}`
                        }}>
                            <label style={{
                                fontSize: getBaseFontSize(),
                                fontWeight: '900',
                                display: 'block',
                                marginBottom: '16px'
                            }}>
                                📏 TEXT SIZE:
                            </label>
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: getBaseFontSize(),
                                    fontFamily: Fonts.body,
                                    fontWeight: '700',
                                    borderRadius: '6px',
                                    border: `3px solid ${C.brightYellow}`,
                                    backgroundColor: C.navy,
                                    color: C.brightYellow,
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="large">LARGE (1.5x)</option>
                                <option value="xlarge">EXTRA LARGE (1.8x)</option>
                                <option value="xxlarge">EXTRA EXTRA LARGE (2.2x)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* TODAY'S TASKS */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>📋 TODAY'S TASKS</h2>

                    <div>
                        {tasks.map(task => (
                            <label key={task.id} style={taskItemStyle}>
                                <input
                                    type="checkbox"
                                    checked={completedTasks[task.id]}
                                    onChange={() => {
                                        handleTaskToggle(task.id);
                                        speak(`${task.title} ${completedTasks[task.id] ? 'unchecked' : 'checked'}`);
                                    }}
                                    style={checkboxStyle}
                                />
                                <span style={{
                                    textDecoration: completedTasks[task.id] ? 'line-through' : 'none',
                                    opacity: completedTasks[task.id] ? 0.6 : 1,
                                    flex: 1
                                }}>
                                    {task.title}
                                </span>
                                <button
                                    onClick={() => speak(task.title)}
                                    style={{
                                        padding: '12px 20px',
                                        fontSize: `calc(${getBaseFontSize()} * 0.7)`,
                                        backgroundColor: C.brightYellow,
                                        color: C.navy,
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '700'
                                    }}
                                >
                                    🔊 HEAR
                                </button>
                            </label>
                        ))}

                        <div style={{
                            marginTop: '32px',
                            fontSize: `calc(${getBaseFontSize()} * 1.2)`,
                            fontWeight: '900',
                            color: C.brightYellow,
                            padding: '20px',
                            backgroundColor: C.darkBg,
                            borderRadius: '8px',
                            border: `3px solid ${C.brightYellow}`
                        }}>
                            ✓ PROGRESS: {completedCount} / {tasks.length} TASKS
                        </div>
                    </div>
                </section>

                {/* QUICK ACTIONS */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>🎯 WHAT WOULD YOU LIKE TO DO?</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '32px',
                        marginTop: '32px'
                    }}>
                        <button
                            style={largeButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
                            }}
                            onClick={() => {
                                speak('Opening lessons');
                                navigate('/subjects');
                            }}
                        >
                            📖 START LESSON
                        </button>

                        <button
                            style={largeButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
                            }}
                            onClick={() => {
                                speak('Opening games');
                                navigate('/games');
                            }}
                        >
                            🎮 PLAY GAME
                        </button>

                        <button
                            style={largeButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
                            }}
                            onClick={() => {
                                speak('Opening my assignments');
                                navigate('/lessons');
                            }}
                        >
                            ✍️ ASSIGNMENTS
                        </button>
                    </div>
                </section>

                {/* INFO SECTION */}
                <section style={{
                    ...sectionStyle,
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }}>
                    <h2 style={{
                        ...sectionTitleStyle,
                        color: C.brightYellow
                    }}>
                        💡 KEYBOARD SHORTCUTS
                    </h2>

                    <div style={{
                        display: 'grid',
                        gap: '16px',
                        fontSize: getBaseFontSize()
                    }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: C.navy,
                            borderRadius: '6px',
                            border: `2px solid ${C.brightYellow}`
                        }}>
                            <strong>TAB</strong> - Move between buttons
                        </div>
                        <div style={{
                            padding: '16px',
                            backgroundColor: C.navy,
                            borderRadius: '6px',
                            border: `2px solid ${C.brightYellow}`
                        }}>
                            <strong>ENTER</strong> - Click current button
                        </div>
                        <div style={{
                            padding: '16px',
                            backgroundColor: C.navy,
                            borderRadius: '6px',
                            border: `2px solid ${C.brightYellow}`
                        }}>
                            <strong>SPACE</strong> - Check/uncheck task
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
