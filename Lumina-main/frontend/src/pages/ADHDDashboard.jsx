import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ADHDMemoryMatch from '../components/ADHDMemoryMatch';
import ADHDSortClick from '../components/ADHDSortClick';
import ADHDStoryOrder from '../components/ADHDStoryOrder';
import ADHDCountFast from '../components/ADHDCountFast';
import ADHDFlashcards from '../components/ADHDFlashcards';
import ADHDDrawLearn from '../components/ADHDDrawLearn';
import ADHDStories from '../components/ADHDStories';
import ADHDQuickQuiz from '../components/ADHDQuickQuiz';

const C = {
    slate: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    navy: '#0F172A',
    textSoft: '#64748B',
    blue: '#2563EB',
    green: '#10B981'
};

export default function ADHDDashboard() {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(null);

    const miniGames = [
        { id: 'memory', name: 'Memory Match', emoji: '🧠', color: '#EC4899', desc: 'Match pairs quickly', time: '2 min' },
        { id: 'sort', name: 'Sort & Click', emoji: '📊', color: '#F59E0B', desc: 'Sort by color/size', time: '3 min' },
        { id: 'sequence', name: 'Story Order', emoji: '📖', color: '#3B82F6', desc: 'Arrange story sequence', time: '3 min' },
        { id: 'count', name: 'Count Fast', emoji: '🔢', color: '#10B981', desc: 'Count objects quickly', time: '2 min' }
    ];

    const learningModules = [
        { id: 'flashcards', name: 'Flashcards', emoji: '🗂️', desc: 'Quick vocabulary & math' },
        { id: 'drawing', name: 'Draw & Learn', emoji: '🎨', desc: 'Draw letters & shapes' },
        { id: 'stories', name: 'Stories', emoji: '📚', desc: 'Interactive short stories' },
        { id: 'quiz', name: 'Quick Quiz', emoji: '❓', desc: 'Speed quiz challenges' }
    ];

    const sectionStyle = {
        backgroundColor: C.white,
        padding: '20px',
        borderRadius: '16px',
        border: `2px solid ${C.blue}40`
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
        minHeight: '150px',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: C.text,
        backgroundColor: '#ffffff'
    };

    const openFeature = (id) => setActiveFeature(id);

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

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${C.blue}40`,
                        backgroundColor: C.white,
                        color: C.navy,
                        fontWeight: 800,
                        cursor: 'pointer'
                    }}
                >
                    ← Back
                </button>
            </div>

            <section style={sectionStyle}>
                <div style={{ fontSize: '1.4rem', marginBottom: '10px', color: C.navy, fontWeight: 800 }}>
                    🎮 Quick Mini-Games (No Time Pressure)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {miniGames.map((game) => (
                        <button
                            key={game.id}
                            type="button"
                            onClick={() => openFeature(game.id)}
                            style={{
                                ...cardBaseStyle,
                                backgroundColor: `${game.color}12`,
                                border: `2px solid ${game.color}50`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '1.8rem' }}>{game.emoji}</span>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{game.name}</div>
                            <div style={{ fontSize: '1rem', color: C.textSoft }}>{game.desc}</div>
                            <div style={{ fontSize: '0.95rem', color: C.textSoft }}>⏱️ {game.time}</div>
                        </button>
                    ))}
                </div>
            </section>

            <section
                style={{
                    ...sectionStyle,
                    border: `2px solid ${C.green}40`
                }}
            >
                <div style={{ fontSize: '1.4rem', marginBottom: '10px', color: C.navy, fontWeight: 800 }}>
                    📚 Learning Modules
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {learningModules.map((module) => (
                        <button
                            key={module.id}
                            type="button"
                            onClick={() => openFeature(module.id)}
                            style={{
                                ...cardBaseStyle,
                                backgroundColor: `${C.green}12`,
                                border: `2px solid ${C.green}40`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '1.8rem' }}>{module.emoji}</span>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{module.name}</div>
                            <div style={{ fontSize: '1rem', color: C.textSoft }}>{module.desc}</div>
                        </button>
                    ))}
                </div>
            </section>

            {activeFeature && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
                    {activeFeature === 'memory' && <ADHDMemoryMatch onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'sort' && <ADHDSortClick onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'sequence' && <ADHDStoryOrder onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'count' && <ADHDCountFast onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'flashcards' && <ADHDFlashcards onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'drawing' && <ADHDDrawLearn onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'stories' && <ADHDStories onClose={() => setActiveFeature(null)} />}
                    {activeFeature === 'quiz' && <ADHDQuickQuiz onClose={() => setActiveFeature(null)} />}
                </div>
            )}
        </div>
    );
}
