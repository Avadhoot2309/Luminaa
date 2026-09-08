import React, { useState } from 'react';

/**
 * ADHD Lesson Interaction Component
 * 
 * Features:
 * - Quick question handling
 * - Multiple choice options
 * - Feedback and explanation
 * - Encouragement
 */
export default function ADHDLessonInteraction({ question, options, explanation, onAnswer }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        const correct = answer === selectedAnswer; // Compare with correct answer passed in props
        setIsCorrect(correct);
        setShowFeedback(true);

        // Auto-advance after 2 seconds for correct answers
        if (correct) {
            setTimeout(() => onAnswer(answer), 2000);
        }
    };

    const handleContinueAfterWrong = () => {
        // Allow retry or move to next after wrong answer
        setShowFeedback(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    return (
        <div style={containerStyle}>
            {/* QUESTION */}
            <div style={questionContainerStyle}>
                <h3 style={questionTextStyle}>❓ {question}</h3>
            </div>

            {/* OPTIONS */}
            {!showFeedback && (
                <div style={optionsContainerStyle}>
                    {options && options.map((option, idx) => (
                        <button
                            key={idx}
                            style={getOptionButtonStyle(idx, selectedAnswer === option)}
                            onClick={() => handleAnswerClick(option)}
                        >
                            <span style={optionLetterStyle}>
                                {String.fromCharCode(65 + idx)}.
                            </span>
                            <span style={optionTextStyle}>{option}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* FEEDBACK */}
            {showFeedback && (
                <div style={isCorrect ? feedbackCorrectStyle : feedbackWrongStyle}>
                    <p style={feedbackMessageStyle}>
                        {isCorrect ? '✅ Correct! Great job!' : '❌ Not quite right.'}
                    </p>

                    {explanation && (
                        <p style={explanationStyle}>
                            💡 {explanation}
                        </p>
                    )}

                    {!isCorrect && (
                        <button
                            style={retryButtonStyle}
                            onClick={handleContinueAfterWrong}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getOptionButtonStyle = (index, isSelected) => {
    const baseStyle = {
        ...optionButtonStyle,
        animation: `slideIn 0.3s ease-out ${index * 100}ms both`
    };

    if (isSelected) {
        return {
            ...baseStyle,
            backgroundColor: '#DBEAFE',
            borderColor: '#2563EB',
            borderWidth: '3px'
        };
    }

    return baseStyle;
};

// ============================================================
// STYLES
// ============================================================
const containerStyle = {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '20px'
};

const questionContainerStyle = {
    marginBottom: '24px'
};

const questionTextStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0',
    lineHeight: '1.6'
};

const optionsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const optionButtonStyle = {
    padding: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    border: '2px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'left',
    ':hover': {
        backgroundColor: '#F8FAFC',
        borderColor: '#CBD5E1'
    }
};

const optionLetterStyle = {
    fontWeight: '700',
    color: '#2563EB',
    minWidth: '24px'
};

const optionTextStyle = {
    flex: 1
};

const feedbackCorrectStyle = {
    padding: '16px',
    backgroundColor: '#ECFDF5',
    border: '2px solid #10B981',
    borderRadius: '8px',
    animation: 'slideUp 0.3s ease'
};

const feedbackWrongStyle = {
    padding: '16px',
    backgroundColor: '#FEF2F2',
    border: '2px solid #EF4444',
    borderRadius: '8px',
    animation: 'slideUp 0.3s ease'
};

const feedbackMessageStyle = {
    margin: '0 0 12px 0',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1E293B'
};

const explanationStyle = {
    margin: '0 0 12px 0',
    fontSize: '0.95rem',
    color: '#475569',
    lineHeight: '1.6'
};

const retryButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#FCA5A5',
    color: '#7F1D1D',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
    ':hover': {
        backgroundColor: '#F87171'
    }
};
