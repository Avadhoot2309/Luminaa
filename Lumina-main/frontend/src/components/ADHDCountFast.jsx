import React, { useMemo, useState } from 'react';
import './ADHDFeatureModules.css';

const roundsTotal = 5;
const emojis = ['⭐', '🍎', '⚽', '🌼', '🎈'];

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildRound = () => {
    const count = randomBetween(2, 9);
    const emoji = emojis[randomBetween(0, emojis.length - 1)];
    const options = Array.from(new Set([
        count,
        Math.max(1, count - randomBetween(1, 2)),
        Math.min(12, count + randomBetween(1, 2))
    ])).sort(() => Math.random() - 0.5);

    while (options.length < 3) {
        const next = randomBetween(1, 12);
        if (!options.includes(next)) options.push(next);
    }

    return { count, emoji, options: options.slice(0, 3) };
};

const ADHDCountFast = ({ onClose }) => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [current, setCurrent] = useState(buildRound);

    const done = round > roundsTotal;
    const progress = useMemo(() => (Math.min(round - 1, roundsTotal) / roundsTotal) * 100, [round]);

    const handleAnswer = (value) => {
        if (done) return;
        const isCorrect = value === current.count;
        if (isCorrect) {
            setScore((prev) => prev + 1);
            setFeedback('✅ Nice! Correct answer.');
        } else {
            setFeedback(`🌟 Good try! Right answer was ${current.count}.`);
        }

        setTimeout(() => {
            setFeedback('');
            setRound((prev) => prev + 1);
            setCurrent(buildRound());
        }, 700);
    };

    const restart = () => {
        setRound(1);
        setScore(0);
        setFeedback('');
        setCurrent(buildRound());
    };

    return (
        <div className="adhd-feature-overlay">
            <div className="adhd-feature-card">
                <div className="adhd-feature-head">
                    <div>
                        <h2 className="adhd-feature-title">🔢 Count Fast</h2>
                        <p className="adhd-feature-subtitle">Count the objects and tap the matching number.</p>
                    </div>
                    <button className="adhd-close-btn" onClick={onClose}>← Back</button>
                </div>

                <div className="adhd-progress-wrap">
                    <p className="adhd-progress-text">Round: {Math.min(round, roundsTotal)}/{roundsTotal}</p>
                    <div className="adhd-progress-bar">
                        <div className="adhd-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {!done ? (
                    <>
                        <div className="count-emoji-box" aria-live="polite">
                            {Array.from({ length: current.count }).map((_, idx) => (
                                <span key={idx}>{current.emoji} </span>
                            ))}
                        </div>

                        <div className="count-options">
                            {current.options.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className="adhd-option-btn"
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className={`feedback-row ${feedback.includes('Correct') ? 'good' : 'bad'}`}>{feedback}</div>
                    </>
                ) : (
                    <div className="victory-box">
                        <h3>🎉 Great counting!</h3>
                        <p>Your score: <strong>{score}/{roundsTotal}</strong></p>
                        <div className="toolbar">
                            <button type="button" className="adhd-main-btn" onClick={restart}>Play Again</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ADHDCountFast;