import React, { useState, useEffect, useRef } from 'react';
import './ADHDMemoryMatch.css';

const ADHDMemoryMatch = ({ onClose }) => {
    // Card pairs with emoji
    const cardPairs = [
        { id: 1, emoji: '🦁', name: 'Lion' },
        { id: 1, emoji: '🦁', name: 'Lion' },
        { id: 2, emoji: '🐘', name: 'Elephant' },
        { id: 2, emoji: '🐘', name: 'Elephant' },
        { id: 3, emoji: '🦋', name: 'Butterfly' },
        { id: 3, emoji: '🦋', name: 'Butterfly' },
        { id: 4, emoji: '🐢', name: 'Turtle' },
        { id: 4, emoji: '🐢', name: 'Turtle' },
    ];

    // Shuffle cards
    const shuffleCards = (cards) => {
        return [...cards].sort(() => Math.random() - 0.5);
    };

    const [cards, setCards] = useState(shuffleCards(cardPairs));
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [gameWon, setGameWon] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    const timeoutRef = useRef(null);

    // Handle card click
    const handleCardClick = (index) => {
        // Don't allow if already flipped, matched, or already flipping two cards
        if (
            flipped.includes(index) ||
            matched.includes(index) ||
            flipped.length >= 2 ||
            gameWon
        ) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        // Check for match when two cards are flipped
        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].id === cards[second].id) {
                // Match found!
                setCelebrating(true);
                setTimeout(() => setCelebrating(false), 500);

                const newMatched = [...matched, first, second];
                setMatched(newMatched);
                setFlipped([]);

                // Check if game is won
                if (newMatched.length === cards.length) {
                    setTimeout(() => setGameWon(true), 500);
                }
            } else {
                // No match - flip back after delay
                timeoutRef.current = setTimeout(() => {
                    setFlipped([]);
                }, 1200);
            }
        }
    };

    // Reset game
    const handlePlayAgain = () => {
        const newCards = shuffleCards(cardPairs);
        setCards(newCards);
        setFlipped([]);
        setMatched([]);
        setGameWon(false);
    };

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="adhd-memory-container">
            <button
                className="memory-top-back-btn"
                onClick={onClose}
                aria-label="Go back"
            >
                ← Back
            </button>

            {/* Celebration confetti effect */}
            {celebrating && (
                <div className="celebration">
                    <div className="confetti"></div>
                    <div className="confetti"></div>
                    <div className="confetti"></div>
                    <div className="confetti"></div>
                    <div className="confetti"></div>
                </div>
            )}

            {!gameWon ? (
                <>
                    {/* Header */}
                    <div className="memory-header">
                        <h1 className="memory-title">🎮 Memory Match Game</h1>
                        <p className="matches-counter">Matches: {matched.length / 2}/4</p>
                    </div>

                    {/* Game Grid */}
                    <div className="memory-grid">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`memory-card ${flipped.includes(index) || matched.includes(index)
                                    ? 'flipped'
                                    : ''
                                    } ${matched.includes(index) ? 'matched' : ''}`}
                                onClick={() => handleCardClick(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Card ${index + 1}`}
                            >
                                <div className="memory-card-inner">
                                    <div className="memory-card-front">?</div>
                                    <div className="memory-card-back">{card.emoji}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Close button */}
                    <button
                        className="memory-close-btn"
                        onClick={onClose}
                        aria-label="Close game"
                    >
                        ← Back
                    </button>
                </>
            ) : (
                // Victory Screen
                <div className="victory-screen">
                    <div className="victory-content">
                        <h1 className="victory-title">Great Job! 🎉</h1>
                        <p className="victory-message">You matched all 4 pairs!</p>
                        <div className="celebration-large">
                            <span className="star">⭐</span>
                            <span className="star">🎊</span>
                            <span className="star">⭐</span>
                        </div>
                        <button
                            className="play-again-btn"
                            onClick={handlePlayAgain}
                            aria-label="Play again"
                        >
                            Play Again
                        </button>
                        <button
                            className="memory-close-btn"
                            onClick={onClose}
                            aria-label="Close game"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ADHDMemoryMatch;
