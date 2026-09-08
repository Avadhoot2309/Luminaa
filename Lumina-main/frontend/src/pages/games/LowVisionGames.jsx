import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';

/**
 * LowVisionGames.jsx
 * High-contrast, large-text games screen for users with Low Vision.
 * Features:
 * - Very large fonts (minimum 24px for body, 48px for headers)
 * - Black text on white background (or white on black) for maximum contrast
 * - Simple grid layout with no decorative elements
 * - Large touch targets (buttons)
 * - Audio announcements
 * - Keyboard navigation
 */
export default function LowVisionGames() {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const { t } = useTranslation();
    const speakRef = useRef(null);
    const [selectedGameIndex, setSelectedGameIndex] = useState(null);

    const games = [
        {
            id: 'memory-match',
            name: t('games.memory_match'),
            path: '/game/memory-match',
            desc: t('games.memory_match_desc'),
            number: 1
        },
        {
            id: 'math-race',
            name: t('games.math_race'),
            path: '/game/math-race',
            desc: t('games.math_race_desc'),
            number: 2
        },
        {
            id: 'word-jump',
            name: t('games.word_jump'),
            path: '/game/word-jump',
            desc: t('games.word_jump_desc'),
            number: 3
        },
        {
            id: 'word-search',
            name: t('games.word_search'),
            path: '/game/word-search',
            desc: t('games.word_search_desc'),
            number: 4
        },
        {
            id: 'focus-flash',
            name: t('games.focus_flash'),
            path: '/game/focus-flash',
            desc: t('games.focus_flash_desc'),
            number: 5
        },
        {
            id: 'phonetic-pop',
            name: t('games.phonetic_pop'),
            path: '/game/phonetic-pop',
            desc: t('games.phonetic_pop_desc'),
            number: 6
        },
    ];

    // Initialize speech synthesis
    useEffect(() => {
        if (window.speechSynthesis) {
            const synth = window.speechSynthesis;
            let voices = synth.getVoices();
            if (!voices || voices.length === 0) {
                const handler = () => {
                    voices = synth.getVoices();
                    speakRef.current = voices[0] || null;
                    synth.removeEventListener('voiceschanged', handler);
                };
                synth.addEventListener('voiceschanged', handler);
            } else {
                speakRef.current = voices[0] || null;
            }
        }

        // Announce page on load
        speak('Games screen. Select a game to play.', { rate: 0.95 });
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = selectedGameIndex === null ? 0 : (selectedGameIndex + 1) % games.length;
                setSelectedGameIndex(nextIndex);
                speak(games[nextIndex].name, { rate: 0.95 });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = selectedGameIndex === null ? games.length - 1 : (selectedGameIndex - 1 + games.length) % games.length;
                setSelectedGameIndex(prevIndex);
                speak(games[prevIndex].name, { rate: 0.95 });
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const cols = Math.floor(window.innerWidth / 280);
                const nextIndex = selectedGameIndex === null ? 0 : (selectedGameIndex + cols) % games.length;
                setSelectedGameIndex(nextIndex);
                speak(games[nextIndex].name, { rate: 0.95 });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const cols = Math.floor(window.innerWidth / 280);
                const prevIndex = selectedGameIndex === null ? 0 : (selectedGameIndex - cols + games.length) % games.length;
                setSelectedGameIndex(prevIndex);
                speak(games[prevIndex].name, { rate: 0.95 });
            } else if ((e.key === 'Enter' || e.key === ' ') && selectedGameIndex !== null) {
                e.preventDefault();
                handleGameClick(games[selectedGameIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedGameIndex]);

    const handleGameClick = (game) => {
        speak(`Starting ${game.name}`, { rate: 0.95 });
        setTimeout(() => navigate(game.path), 500);
    };

    const handleBackClick = () => {
        speak('Going back to main menu', { rate: 0.95 });
        setTimeout(() => navigate('/low-vision'), 500);
    };

    const handleKeyPress = (e, gameIndex) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleGameClick(games[gameIndex]);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#FFFFFF',
                padding: '40px 30px',
                fontFamily: "'Arial', 'Helvetica', sans-serif",
                color: '#000000',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '60px',
                    gap: '20px'
                }}
            >
                <button
                    onClick={handleBackClick}
                    onMouseEnter={() => speak('Back button', { rate: 0.95 })}
                    style={{
                        padding: '20px 30px',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        backgroundColor: '#000000',
                        color: '#FFFFFF',
                        border: '3px solid #000000',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        minWidth: '80px',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#333333';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                    }}
                >
                    ← Back
                </button>

                <div>
                    <h1
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            margin: '0 0 10px 0',
                            color: '#000000'
                        }}
                    >
                        Games
                    </h1>
                    <p
                        style={{
                            fontSize: '24px',
                            margin: '0',
                            color: '#333333',
                            fontWeight: 'bold'
                        }}
                    >
                        Select a game to play
                    </p>
                </div>
            </div>

            {/* Games Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    flex: 1
                }}
            >
                {games.map((game, index) => (
                    <button
                        key={game.id}
                        onClick={() => handleGameClick(game)}
                        onMouseEnter={() => handleGameHover(index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        tabIndex={0}
                        style={{
                            padding: '40px 30px',
                            backgroundColor:
                                selectedGameIndex === index ? '#000000' : '#F0F0F0',
                            color: selectedGameIndex === index ? '#FFFFFF' : '#000000',
                            border: '4px solid #000000',
                            borderRadius: '12px',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            minHeight: '200px',
                            outline: 'none'
                        }}
                        onFocus={() => handleGameHover(index)}
                    >
                        <div
                            style={{
                                fontSize: '56px',
                                marginBottom: '8px'
                            }}
                        >
                            {game.id === 'memory-match' && '🧠'}
                            {game.id === 'math-race' && '🏎️'}
                            {game.id === 'word-jump' && '🏃'}
                            {game.id === 'word-search' && '🔍'}
                            {game.id === 'focus-flash' && '⚡'}
                            {game.id === 'phonetic-pop' && '🫧'}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                                {game.number}. {game.name}
                            </div>
                            <div
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 'normal',
                                    opacity: selectedGameIndex === index ? 0.9 : 0.7,
                                    lineHeight: '1.4'
                                }}
                            >
                                {game.desc}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Instructions */}
            <div
                style={{
                    marginTop: '60px',
                    padding: '30px',
                    backgroundColor: '#F0F0F0',
                    border: '3px solid #000000',
                    borderRadius: '8px',
                    fontSize: '20px',
                    lineHeight: '1.8',
                    fontWeight: '500'
                }}
            >
                <strong>Instructions:</strong>
                <ul style={{ margin: '12px 0 0 0', paddingLeft: '24px' }}>
                    <li>Use arrow keys or Tab to navigate between games</li>
                    <li>Press ENTER or SPACE to select a game</li>
                    <li>Click the Back button to return to the main menu</li>
                    <li>Games are designed with large text and high contrast</li>
                    <li>Audio will announce each game as you navigate</li>
                </ul>
            </div>
        </div>
    );
}
