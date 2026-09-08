import React, { useMemo, useState } from 'react';
import './ADHDFeatureModules.css';

const questions = [
    {
        q: 'Which number is bigger?',
        options: ['4', '9', '2'],
        answer: '9'
    },
    {
        q: 'What comes after B?',
        options: ['D', 'A', 'C'],
        answer: 'C'
    },
    {
        q: 'How many days are in a week?',
        options: ['7', '5', '9'],
        answer: '7'
    },
    {
        q: 'What color do you get from blue + yellow?',
        options: ['Green', 'Red', 'Purple'],
        answer: 'Green'
    },
    {
        q: '10 - 6 = ?',
        options: ['2', '4', '5'],
        answer: '4'
    }
];

const ADHDQuickQuiz = ({ onClose }) => {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    const finished = index >= questions.length;
    const progress = useMemo(() => (index / questions.length) * 100, [index]);

    const onOptionClick = (option) => {
        if (finished) return;
        const current = questions[index];
        const correct = option === current.answer;
        if (correct) {
            setScore((prev) => prev + 1);
            setFeedback('✅ Great answer!');
        } else {
            setFeedback(`💛 Nice try! Correct is ${current.answer}.`);
        }

        setTimeout(() => {
            setFeedback('');
            setIndex((prev) => prev + 1);
        }, 650);
    };

    const restart = () => {
        setIndex(0);
        setScore(0);
        setFeedback('');
    };

    return (
        <div className="adhd-feature-overlay">
            <div className="adhd-feature-card">
                <div className="adhd-feature-head">
                    <div>
                        <h2 className="adhd-feature-title">❓ Quick Quiz</h2>
                        <p className="adhd-feature-subtitle">Short, friendly questions with instant feedback.</p>
                    </div>
                    <button className="adhd-close-btn" onClick={onClose}>← Back</button>
                </div>

                {!finished ? (
                    <>
                        <div className="adhd-progress-wrap">
                            <p className="adhd-progress-text">Question {index + 1}/{questions.length}</p>
                            <div className="adhd-progress-bar">
                                <div className="adhd-progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <h3>{questions[index].q}</h3>
                        <div className="option-list">
                            {questions[index].options.map((option) => (
                                <button key={option} type="button" className="adhd-option-btn" onClick={() => onOptionClick(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className={`feedback-row ${feedback.includes('Great') ? 'good' : 'bad'}`}>{feedback}</div>
                    </>
                ) : (
                    <div className="victory-box">
                        <h3>🏆 Quiz complete!</h3>
                        <p>You scored <strong>{score}/{questions.length}</strong>.</p>
                        <button className="adhd-main-btn" type="button" onClick={restart}>Play Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ADHDQuickQuiz;