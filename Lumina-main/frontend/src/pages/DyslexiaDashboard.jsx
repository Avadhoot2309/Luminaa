import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { LuminaLogo } from '../components/BrandLogo';

/**
 * DyslexiaDashboard - Optimized for students with dyslexia
 * Features:
 * - OpenDyslexic font throughout (larger, easier to read)
 * - Simplified layout with clear hierarchy
 * - High contrast colors
 * - Extra spacing between elements
 * - Sans-serif fonts for readability
 * - Line spacing adjustments
 */

const C = {
    navy: '#0F172A',
    blue: '#2563EB',
    slate: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    textSoft: '#64748B',
    border: '#E2E8F0',
    amber: '#F59E0B',
    green: '#10B981'
};

const Fonts = {
    heading: "'OpenDyslexic', 'Fraunces', serif",
    body: "'OpenDyslexic', 'Nunito', sans-serif"
};

export default function DyslexiaDashboard({ selectedStudent = null, isEmbedded = false }) {
    const navigate = useNavigate();
    const contextProfile = useProfile() || { profile: null };
    const profile = selectedStudent || contextProfile?.profile; // Use selectedStudent if provided
    const { t } = useTranslation();
    const [currentActivity, setCurrentActivity] = useState('reading_mode'); // 'reading_mode', 'focus', 'games'

    // When embedded from teacher dashboard, don't show navigation back
    const showNavigation = !isEmbedded;

    const mainStyle = {
        minHeight: '100vh',
        backgroundColor: C.slate,
        fontFamily: Fonts.body,
        fontSize: '1.1rem',
        lineHeight: '1.8',
        overflowX: 'hidden'
    };

    const headerStyle = {
        backgroundColor: C.blue,
        color: C.white,
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        flexWrap: 'wrap'
    };

    const logoTextStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer'
    };

    const navStyle = {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    };

    const navButtonStyle = (isActive) => ({
        padding: '12px 24px',
        fontSize: '1rem',
        fontFamily: Fonts.body,
        fontWeight: '700',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isActive ? C.white : 'rgba(255,255,255,0.2)',
        color: isActive ? C.blue : C.white,
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        textDecoration: 'none'
    });

    const contentStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
    };

    const sectionStyle = {
        backgroundColor: C.white,
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: `3px solid ${C.blue}40`
    };

    const sectionTitleStyle = {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: C.navy,
        fontFamily: Fonts.heading,
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `3px solid ${C.blue}`
    };

    const taskItemStyle = {
        backgroundColor: C.slate,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: `2px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '1.1rem'
    };

    const checkboxStyle = {
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        accentColor: C.green
    };

    const buttonGroupStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '32px'
    };

    const largeButtonStyle = {
        padding: '28px 32px',
        fontSize: '1.3rem',
        fontFamily: Fonts.body,
        fontWeight: '800',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        backgroundColor: C.blue,
        color: C.white,
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    };

    const largeButtonHoverStyle = {
        ...largeButtonStyle,
        backgroundColor: C.navy,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)'
    };

    const [tasks] = useState([
        { id: 1, title: 'Reading Practice - Chapter 5', completed: false },
        { id: 2, title: 'Vocabulary Builder', completed: false },
        { id: 3, title: 'Comprehension Quiz', completed: false }
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

    const completedCount = Object.values(completedTasks).filter(Boolean).length;

    return (
        <div style={mainStyle}>
            {/* HEADER */}
            {showNavigation && (
                <header style={headerStyle}>
                    <div style={logoTextStyle} onClick={() => navigate('/dashboard')}>
                        <LuminaLogo size={40} color={C.white} />
                        <h1 style={{ margin: '0', fontSize: '2rem', fontFamily: Fonts.heading, fontWeight: '800' }}>
                            Lumina
                        </h1>
                    </div>

                    <nav style={navStyle}>
                        <button style={navButtonStyle(true)}>📖 Lessons</button>
                        <button style={navButtonStyle(false)}>🎮 Games</button>
                        <button style={navButtonStyle(false)}>⚙️ Settings</button>
                    </nav>

                    <div style={{
                        padding: '12px 24px',
                        backgroundColor: `${C.amber}20`,
                        borderRadius: '8px',
                        color: C.navy,
                        fontWeight: '800',
                        fontSize: '1.1rem'
                    }}>
                        ✨ {profile?.name || 'Reader'}
                    </div>
                </header>
            )}

            {/* MAIN CONTENT */}
            <main style={contentStyle}>
                {/* READING MODE SECTION */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>📖 Today's Reading</h2>

                    <p style={{
                        fontSize: '1.15rem',
                        lineHeight: '1.9',
                        marginBottom: '24px',
                        color: C.text
                    }}>
                        Dyslexia-friendly reading interface with extra spacing and OpenDyslexic font for easier comprehension.
                    </p>

                    <div>
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            marginBottom: '16px',
                            color: C.navy
                        }}>
                            Your Reading Tasks:
                        </h3>

                        {tasks.map(task => (
                            <label key={task.id} style={taskItemStyle}>
                                <input
                                    type="checkbox"
                                    checked={completedTasks[task.id]}
                                    onChange={() => handleTaskToggle(task.id)}
                                    style={checkboxStyle}
                                />
                                <span style={{
                                    textDecoration: completedTasks[task.id] ? 'line-through' : 'none',
                                    opacity: completedTasks[task.id] ? 0.6 : 1
                                }}>
                                    {task.title}
                                </span>
                            </label>
                        ))}

                        <div style={{
                            marginTop: '20px',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: C.green
                        }}>
                            ✓ Progress: {completedCount} / {tasks.length} tasks completed
                        </div>
                    </div>
                </section>

                {/* TEXT SETTINGS SECTION */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>⚙️ Reading Preferences</h2>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: C.slate,
                            borderRadius: '8px',
                            border: `2px solid ${C.border}`
                        }}>
                            <label style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer'
                            }}>
                                <input type="checkbox" defaultChecked style={{ width: '24px', height: '24px' }} />
                                <span>Use OpenDyslexic Font (Enabled)</span>
                            </label>
                        </div>

                        <div style={{
                            padding: '16px',
                            backgroundColor: C.slate,
                            borderRadius: '8px',
                            border: `2px solid ${C.border}`
                        }}>
                            <label style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                display: 'block',
                                marginBottom: '12px'
                            }}>
                                Line Spacing:
                            </label>
                            <select style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '1.1rem',
                                fontFamily: Fonts.body,
                                borderRadius: '6px',
                                border: `2px solid ${C.blue}`,
                                backgroundColor: C.white
                            }}>
                                <option>Normal (1.5x)</option>
                                <option>Wide (1.8x)</option>
                                <option>Extra Wide (2x)</option>
                            </select>
                        </div>

                        <div style={{
                            padding: '16px',
                            backgroundColor: C.slate,
                            borderRadius: '8px',
                            border: `2px solid ${C.border}`
                        }}>
                            <label style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                display: 'block',
                                marginBottom: '12px'
                            }}>
                                Text Color:
                            </label>
                            <select style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '1.1rem',
                                fontFamily: Fonts.body,
                                borderRadius: '6px',
                                border: `2px solid ${C.blue}`,
                                backgroundColor: C.white
                            }}>
                                <option>Black on White</option>
                                <option>Dark on Cream</option>
                                <option>White on Dark</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* ACTION BUTTONS */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>📚 What Would You Like to Do?</h2>

                    <div style={buttonGroupStyle}>
                        <button
                            style={largeButtonStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, largeButtonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, largeButtonStyle)}
                            onClick={() => navigate('/subjects')}
                        >
                            📖 Continue Reading
                        </button>

                        <button
                            style={largeButtonStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, largeButtonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, largeButtonStyle)}
                            onClick={() => navigate('/lessons')}
                        >
                            ✨ New Lesson
                        </button>

                        <button
                            style={largeButtonStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, largeButtonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, largeButtonStyle)}
                            onClick={() => navigate('/games')}
                        >
                            🎮 Word Games
                        </button>
                    </div>
                </section>

                {/* TIPS SECTION */}
                <section style={{
                    ...sectionStyle,
                    backgroundColor: `${C.green}10`,
                    border: `3px solid ${C.green}`
                }}>
                    <h2 style={{
                        ...sectionTitleStyle,
                        color: C.green,
                        borderColor: C.green
                    }}>
                        💡 Dyslexia-Friendly Tips
                    </h2>

                    <ul style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.9',
                        paddingLeft: '24px'
                    }}>
                        <li style={{ marginBottom: '12px' }}>Take regular breaks every 15-20 minutes</li>
                        <li style={{ marginBottom: '12px' }}>Use text-to-speech for longer passages</li>
                        <li style={{ marginBottom: '12px' }}>Focus on one task at a time</li>
                        <li style={{ marginBottom: '12px' }}>Adjust font size and spacing to your preference</li>
                        <li>Read aloud to improve comprehension</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
