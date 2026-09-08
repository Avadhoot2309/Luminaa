import React, { useMemo, useState } from 'react';
import './ADHDFeatureModules.css';

const cards = [
    { prompt: 'What is 3 + 2?', answer: '5', category: 'Math' },
    { prompt: 'Word: Happy', answer: 'Feeling joyful', category: 'Vocabulary' },
    { prompt: 'What color is the sky?', answer: 'Blue', category: 'General' },
    { prompt: 'What is 7 - 4?', answer: '3', category: 'Math' },
    { prompt: 'Word: Tiny', answer: 'Very small', category: 'Vocabulary' }
];

const ADHDFlashcards = ({ onClose }) => {
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [known, setKnown] = useState([]);

    const card = cards[index];
    const knownCount = useMemo(() => known.length, [known]);

    const nextCard = () => {
        setIndex((prev) => (prev + 1) % cards.length);
        setShowAnswer(false);
    };

    const prevCard = () => {
        setIndex((prev) => (prev - 1 + cards.length) % cards.length);
        setShowAnswer(false);
    };

    const markKnown = () => {
        if (known.includes(index)) return;
        setKnown((prev) => [...prev, index]);
    };

    return (
        <div className="adhd-feature-overlay">
            <div className="adhd-feature-card">
                <div className="adhd-feature-head">
                    <div>
                        <h2 className="adhd-feature-title">🗂️ Flashcards</h2>
                        <p className="adhd-feature-subtitle">Tap card to flip and learn quickly.</p>
                    </div>
                    <button className="adhd-close-btn" onClick={onClose}>← Back</button>
                </div>

                <p className="quiz-pill">Card {index + 1}/{cards.length} • Known {knownCount}</p>

                <button type="button" className="flashcard" onClick={() => setShowAnswer((prev) => !prev)}>
                    <div className="flash-label">{card.category}</div>
                    <div className="flash-main">{showAnswer ? card.answer : card.prompt}</div>
                    <p className="adhd-feature-subtitle" style={{ marginTop: '14px' }}>
                        {showAnswer ? 'Tap to see question' : 'Tap to see answer'}
                    </p>
                </button>

                <div className="toolbar">
                    <button type="button" className="adhd-soft-btn" onClick={prevCard}>← Previous</button>
                    <button type="button" className="adhd-main-btn" onClick={markKnown}>✅ I Know This</button>
                    <button type="button" className="adhd-soft-btn" onClick={nextCard}>Next →</button>
                </div>
            </div>
        </div>
    );
};

export default ADHDFlashcards;