import React, { useState } from 'react';
import './ADHDFeatureModules.css';

const stories = [
    {
        title: 'The Helpful Bird',
        text: 'Mina found a tiny bird near her window. She gave it water, and the bird chirped happily before flying to a tree.',
        question: 'What did Mina give the bird?',
        options: ['A toy', 'Water', 'A book'],
        answer: 'Water'
    },
    {
        title: 'Rocket Lunch',
        text: 'Arun packed an apple, sandwich, and juice before school. He shared his apple with his friend at lunch.',
        question: 'What did Arun share?',
        options: ['Juice', 'Sandwich', 'Apple'],
        answer: 'Apple'
    },
    {
        title: 'Rainy Day Art',
        text: 'It rained all afternoon, so Lila painted colorful umbrellas. She hung her best painting near the door.',
        question: 'What did Lila paint?',
        options: ['Umbrellas', 'Cars', 'Clouds'],
        answer: 'Umbrellas'
    }
];

const ADHDStories = ({ onClose }) => {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const story = stories[index];

    const onAnswer = (option) => {
        const correct = option === story.answer;
        if (correct) setScore((prev) => prev + 1);

        if (index === stories.length - 1) {
            setDone(true);
        } else {
            setIndex((prev) => prev + 1);
        }
    };

    const restart = () => {
        setIndex(0);
        setScore(0);
        setDone(false);
    };

    return (
        <div className="adhd-feature-overlay">
            <div className="adhd-feature-card">
                <div className="adhd-feature-head">
                    <div>
                        <h2 className="adhd-feature-title">📚 Stories</h2>
                        <p className="adhd-feature-subtitle">Read a short story and answer one easy question.</p>
                    </div>
                    <button className="adhd-close-btn" onClick={onClose}>← Back</button>
                </div>

                {!done ? (
                    <>
                        <p className="quiz-pill">Story {index + 1}/{stories.length}</p>
                        <h3>{story.title}</h3>
                        <div className="story-reader">{story.text}</div>
                        <p style={{ marginTop: '14px', fontWeight: 800 }}>{story.question}</p>
                        <div className="option-list">
                            {story.options.map((option) => (
                                <button key={option} className="adhd-option-btn" type="button" onClick={() => onAnswer(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="victory-box">
                        <h3>✨ Story time complete!</h3>
                        <p>Score: <strong>{score}/{stories.length}</strong></p>
                        <button className="adhd-main-btn" type="button" onClick={restart}>Read Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ADHDStories;
