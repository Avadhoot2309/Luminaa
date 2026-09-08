import React, { useMemo, useState } from 'react';
import './ADHDFeatureModules.css';

const storySteps = [
    { id: 1, order: 1, text: '🌞 Morning: Wake up and smile.' },
    { id: 2, order: 2, text: '🪥 Brush teeth and get ready.' },
    { id: 3, order: 3, text: '📚 Go to class and learn.' },
    { id: 4, order: 4, text: '🌙 Evening: Read a story and sleep.' }
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ADHDStoryOrder = ({ onClose }) => {
    const [steps, setSteps] = useState(() => shuffle(storySteps));
    const [nextOrder, setNextOrder] = useState(1);
    const [completedIds, setCompletedIds] = useState([]);
    const [shakeId, setShakeId] = useState(null);

    const complete = nextOrder > storySteps.length;
    const progress = useMemo(() => (completedIds.length / storySteps.length) * 100, [completedIds]);

    const onStepClick = (step) => {
        if (complete || completedIds.includes(step.id)) return;
        if (step.order === nextOrder) {
            setCompletedIds((prev) => [...prev, step.id]);
            setNextOrder((prev) => prev + 1);
            return;
        }

        setShakeId(step.id);
        setTimeout(() => setShakeId(null), 450);
    };

    const restart = () => {
        setSteps(shuffle(storySteps));
        setNextOrder(1);
        setCompletedIds([]);
        setShakeId(null);
    };

    return (
        <div className="adhd-feature-overlay">
            <div className="adhd-feature-card">
                <div className="adhd-feature-head">
                    <div>
                        <h2 className="adhd-feature-title">📖 Story Order</h2>
                        <p className="adhd-feature-subtitle">Tap the cards in the right order.</p>
                    </div>
                    <button className="adhd-close-btn" onClick={onClose}>← Back</button>
                </div>

                <div className="adhd-progress-wrap">
                    <p className="adhd-progress-text">Progress: {completedIds.length}/{storySteps.length}</p>
                    <div className="adhd-progress-bar">
                        <div className="adhd-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {!complete ? (
                    <div className="adhd-grid story-grid">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                className={`story-step ${completedIds.includes(step.id) ? 'done' : ''} ${shakeId === step.id ? 'shake' : ''}`}
                                onClick={() => onStepClick(step)}
                                type="button"
                            >
                                <div className="story-step-order">Step ?</div>
                                <div className="story-step-text">{step.text}</div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="victory-box">
                        <h3>🏆 Amazing sequencing!</h3>
                        <p>You completed the story in the perfect order.</p>
                        <button className="adhd-main-btn" onClick={restart} type="button">Play Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ADHDStoryOrder;