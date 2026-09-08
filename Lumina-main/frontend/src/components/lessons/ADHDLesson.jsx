import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import ADHDLessonProgressBar from './ADHDLessonProgressBar';
import ADHDLessonContentDisplay from './ADHDLessonContentDisplay';
import ADHDLessonInteraction from './ADHDLessonInteraction';
import AudioPlayer from '../AudioPlayer';

/**
 * ADHD-Optimized Lesson Component
 * 
 * Features:
 * - Micro-unit content (2-3 lines per step)
 * - Step-by-step navigation (no free scrolling)
 * - Quick interactions after each step
 * - Audio support with text sync
 * - Progress tracking with step indicator
 * - Pause/resume functionality
 * - Adaptive difficulty based on performance
 * 
 * Props:
 * - lessonId: ID of the lesson
 * - lessonData: Full lesson object from API (title, content, etc.)
 * - onComplete: Callback when lesson completes
 * - onSave: Callback to save progress
 */
export default function ADHDLesson({ lessonId, lessonData, onComplete, onSave }) {
    const { profile } = useProfile() || {};

    // State Management
    const [currentStep, setCurrentStep] = useState(0);
    const [lessonSteps, setLessonSteps] = useState([]);
    const [sessionState, setSessionState] = useState('loading'); // loading, ready, paused, completed
    const [answers, setAnswers] = useState([]);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [pausedAt, setPausedAt] = useState(null);

    // Audio state
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    // Adaptive difficulty tracking
    const mistakeThreshold = 2;
    const [shouldSimplify, setShouldSimplify] = useState(false);

    const audioRef = useRef(null);

    // ============================================================
    // STEP 1: Parse Lesson Data into Micro-Units on Mount
    // ============================================================
    useEffect(() => {
        if (!lessonData) return;

        const steps = parseLessonIntoMicroUnits(lessonData);
        setLessonSteps(steps);
        setSessionState('ready');
        setSessionStartTime(Date.now());

        // Try to load saved progress
        loadProgressFromStorage();
    }, [lessonId, lessonData]);

    // ============================================================
    // STEP 2: Parse Lesson Content into Micro-Units
    // ============================================================
    const parseLessonIntoMicroUnits = (lesson) => {
        const steps = [];

        // Extract title as first step
        if (lesson.title) {
            steps.push({
                id: `title_${lessonId}`,
                type: 'title',
                content: lesson.title,
                interaction: 'tap-to-continue',
                audioUrl: lesson.titleAudio || null,
                timeEstimate: 5
            });
        }

        // Parse main content into chunks
        if (lesson.content) {
            const contentChunks = parseContentChunks(lesson.content);
            contentChunks.forEach((chunk, idx) => {
                steps.push({
                    id: `content_${idx}`,
                    type: 'content',
                    content: chunk.text,
                    imageUrl: chunk.imageUrl || null,
                    audioUrl: chunk.audioUrl || null,
                    interaction: chunk.question || 'tap-to-continue',
                    interactionType: chunk.question ? 'question' : 'continue',
                    options: chunk.options || null,
                    correctAnswer: chunk.correctAnswer || null,
                    explanation: chunk.explanation || null,
                    timeEstimate: 15 // seconds
                });
            });
        }

        // Add summary step
        if (lesson.summary) {
            steps.push({
                id: `summary_${lessonId}`,
                type: 'summary',
                content: lesson.summary,
                interaction: 'tap-to-continue',
                audioUrl: lesson.summaryAudio || null,
                timeEstimate: 10
            });
        }

        // Add completion step
        steps.push({
            id: `completion_${lessonId}`,
            type: 'completion',
            content: `Great job! You've completed "${lesson.title}"`,
            interaction: 'completion',
            timeEstimate: 5
        });

        return steps;
    };

    // ============================================================
    // Parse content into micro-chunks (2-3 lines per chunk)
    // ============================================================
    const parseContentChunks = (content) => {
        // If content is already structured (array), use it
        if (Array.isArray(content)) {
            return content.map(chunk => ({
                text: chunk.text || chunk,
                imageUrl: chunk.imageUrl || null,
                audioUrl: chunk.audioUrl || null,
                question: chunk.question || null,
                options: chunk.options || null,
                correctAnswer: chunk.correctAnswer || null,
                explanation: chunk.explanation || null
            }));
        }

        // If content is string, break into paragraphs and then into chunks
        const paragraphs = content.split('\n\n').filter(p => p.trim());
        const chunks = [];

        paragraphs.forEach(para => {
            const sentences = para.split('. ').filter(s => s.trim());
            let currentChunk = '';

            sentences.forEach((sentence, idx) => {
                currentChunk += sentence + (idx < sentences.length - 1 ? '. ' : '');

                // Create chunk every 2-3 sentences or at para end
                const sentenceCount = currentChunk.split('. ').length;
                if (sentenceCount >= 2 || idx === sentences.length - 1) {
                    chunks.push({
                        text: currentChunk.trim(),
                        imageUrl: null,
                        audioUrl: null,
                        question: null,
                        options: null
                    });
                    currentChunk = '';
                }
            });
        });

        return chunks;
    };

    // ============================================================
    // STEP 3: Navigation & Progress Management
    // ============================================================
    const handleNextStep = async (answerData = null) => {
        const currentStepObj = lessonSteps[currentStep];

        // Record answer if provided
        if (answerData !== null) {
            const isCorrect = answerData === currentStepObj.correctAnswer;

            setAnswers([
                ...answers,
                {
                    stepId: currentStepObj.id,
                    answer: answerData,
                    isCorrect,
                    timestamp: Date.now()
                }
            ]);

            // Track mistakes for adaptive difficulty
            if (!isCorrect) {
                const newMistakeCount = mistakeCount + 1;
                setMistakeCount(newMistakeCount);

                // Trigger simplification after threshold
                if (newMistakeCount >= mistakeThreshold) {
                    setShouldSimplify(true);
                }
            }
        }

        // Save progress
        if (onSave) {
            onSave({
                stepIndex: currentStep + 1,
                timestamp: Date.now(),
                answers,
                mistakes: mistakeCount
            });
        }

        // Move to next step or complete
        if (currentStep < lessonSteps.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleLessonComplete();
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePauseLession = () => {
        setSessionState('paused');
        setPausedAt(Date.now());

        if (onSave) {
            onSave({
                stepIndex: currentStep,
                pausedAt: Date.now(),
                answers,
                mistakes: mistakeCount,
                status: 'paused'
            });
        }
    };

    const handleResumeLession = () => {
        setSessionState('ready');
        setPausedAt(null);
    };

    const handleLessonComplete = () => {
        const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000); // seconds

        setSessionState('completed');

        if (onComplete) {
            onComplete({
                lessonId,
                steps: lessonSteps.length,
                completed: true,
                answers,
                mistakeCount,
                timeSpent,
                accuracy: calculateAccuracy()
            });
        }
    };

    // ============================================================
    // STEP 4: Load and Save Progress from Storage
    // ============================================================
    const loadProgressFromStorage = () => {
        try {
            const saved = localStorage.getItem(`adhd_lesson_${lessonId}`);
            if (saved) {
                const { stepIndex, answers: savedAnswers } = JSON.parse(saved);
                setCurrentStep(stepIndex || 0);
                setAnswers(savedAnswers || []);
            }
        } catch (err) {
            console.error('Failed to load saved progress:', err);
        }
    };

    // ============================================================
    // STEP 5: Utility Functions
    // ============================================================
    const calculateAccuracy = () => {
        if (answers.length === 0) return 100;
        const correct = answers.filter(a => a.isCorrect).length;
        return Math.round((correct / answers.length) * 100);
    };

    const getCurrentStepData = () => lessonSteps[currentStep] || null;

    // ============================================================
    // RENDER
    // ============================================================
    if (sessionState === 'loading' || lessonSteps.length === 0) {
        return (
            <div style={loadingContainerStyle}>
                <div style={spinnerStyle}>⏳</div>
                <p style={loadingTextStyle}>Loading lesson...</p>
            </div>
        );
    }

    const stepData = getCurrentStepData();

    return (
        <div style={containerStyle}>
            {/* PROGRESS BAR */}
            <ADHDLessonProgressBar
                currentStep={currentStep + 1}
                totalSteps={lessonSteps.length}
                accuracy={calculateAccuracy()}
            />

            {/* PAUSE/RESUME INDICATOR */}
            {sessionState === 'paused' && (
                <div style={pausedBannerStyle}>
                    ⏸️ Lesson Paused - Click Resume to Continue
                    <button style={resumeButtonStyle} onClick={handleResumeLession}>
                        ▶️ Resume
                    </button>
                </div>
            )}

            {/* COMPLETION STATE */}
            {sessionState === 'completed' ? (
                <CompletionScreen
                    lessonTitle={lessonData?.title}
                    accuracy={calculateAccuracy()}
                    timeSpent={Math.floor((Date.now() - sessionStartTime) / 1000)}
                    totalSteps={lessonSteps.length}
                />
            ) : (
                <>
                    {/* MAIN CONTENT AREA */}
                    <main style={mainStyle}>
                        <ADHDLessonContentDisplay
                            step={stepData}
                            stepNumber={currentStep + 1}
                            shouldSimplify={shouldSimplify}
                        />

                        {/* AUDIO PLAYER - Optional for each chunk */}
                        {stepData?.audioUrl && (
                            <AudioPlayer
                                url={stepData.audioUrl}
                                onPlayChange={setIsAudioPlaying}
                                highlightText={stepData.content}
                                style={audioPlayerStyle}
                            />
                        )}
                    </main>

                    {/* INTERACTION COMPONENT */}
                    {stepData?.interactionType === 'question' ? (
                        <ADHDLessonInteraction
                            question={stepData.interaction}
                            options={stepData.options}
                            explanation={stepData.explanation}
                            onAnswer={handleNextStep}
                        />
                    ) : (
                        <div style={continueContainerStyle}>
                            <button
                                style={continueButtonStyle}
                                onClick={() => handleNextStep()}
                            >
                                ✓ Got it! Next
                            </button>
                        </div>
                    )}

                    {/* NAVIGATION CONTROLS */}
                    <div style={navigationStyle}>
                        <button
                            style={secondaryButtonStyle}
                            onClick={handlePreviousStep}
                            disabled={currentStep === 0}
                        >
                            ← Back
                        </button>

                        <button
                            style={pauseButtonStyle}
                            onClick={handlePauseLession}
                        >
                            ⏸️ Pause
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================
// COMPLETION SCREEN
// ============================================================
function CompletionScreen({ lessonTitle, accuracy, timeSpent, totalSteps }) {
    const getMotivationalMessage = (accuracy) => {
        if (accuracy >= 90) return '🌟 Excellent work! You mastered this lesson!';
        if (accuracy >= 75) return '🎉 Great job! You understood the key concepts!';
        if (accuracy >= 60) return '👍 Good effort! Review any tricky parts.';
        return '💪 You tried hard! Practice makes perfect!';
    };

    return (
        <div style={completionScreenStyle}>
            <div style={completionCardStyle}>
                <h2 style={completionTitleStyle}>✅ Lesson Complete!</h2>
                <p style={lessonNameStyle}>{lessonTitle}</p>

                <div style={statsGridStyle}>
                    <div style={statBoxStyle}>
                        <div style={statLabelStyle}>Accuracy</div>
                        <div style={statValueStyle}>{accuracy}%</div>
                    </div>
                    <div style={statBoxStyle}>
                        <div style={statLabelStyle}>Steps</div>
                        <div style={statValueStyle}>{totalSteps}</div>
                    </div>
                    <div style={statBoxStyle}>
                        <div style={statLabelStyle}>Time</div>
                        <div style={statValueStyle}>{Math.ceil(timeSpent / 60)}m</div>
                    </div>
                </div>

                <p style={motivationalStyle}>{getMotivationalMessage(accuracy)}</p>

                <div style={actionButtonsStyle}>
                    <button style={primaryButtonStyle}>
                        🏠 Back to Dashboard
                    </button>
                    <button style={secondaryButtonStyle}>
                        🔄 Review Lesson
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// STYLES
// ============================================================
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    fontFamily: "'Nunito', sans-serif"
};

const mainStyle = {
    flex: 1,
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%'
};

const loadingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F8FAFC'
};

const spinnerStyle = {
    fontSize: '48px',
    marginBottom: '16px',
    animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
    color: '#64748B',
    fontSize: '1.1rem',
    fontWeight: '500'
};

const audioPlayerStyle = {
    margin: '24px 0',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const continueContainerStyle = {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '12px'
};

const continueButtonStyle = {
    padding: '14px 32px',
    fontSize: '1.1rem',
    fontWeight: '700',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: '#10B981',
    color: 'white',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    ':hover': {
        backgroundColor: '#059669',
        transform: 'translateY(-2px)'
    }
};

const navigationStyle = {
    padding: '16px 20px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    borderTop: '1px solid #E2E8F0',
    backgroundColor: 'white'
};

const secondaryButtonStyle = {
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    border: '2px solid #CBD5E1',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#475569',
    transition: 'all 0.3s ease',
    ':hover': {
        borderColor: '#94A3B8',
        backgroundColor: '#F1F5F9'
    },
    ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
    }
};

const pauseButtonStyle = {
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#FCA5A5',
    color: '#7F1D1D',
    transition: 'all 0.3s ease',
    ':hover': {
        backgroundColor: '#F87171'
    }
};

const pausedBannerStyle = {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
    borderBottom: '2px solid #FCD34D'
};

const resumeButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#FBBF24',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    color: '#78350F'
};

const primaryButtonStyle = {
    padding: '12px 28px',
    fontSize: '1rem',
    fontWeight: '700',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    backgroundColor: '#2563EB',
    color: 'white',
    transition: 'all 0.3s ease'
};

const completionScreenStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#F8FAFC'
};

const completionCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    textAlign: 'center'
};

const completionTitleStyle = {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#10B981',
    margin: '0 0 8px 0'
};

const lessonNameStyle = {
    fontSize: '1.3rem',
    color: '#475569',
    margin: '8px 0 24px 0',
    fontWeight: '600'
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    margin: '24px 0',
    padding: '20px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px'
};

const statBoxStyle = {
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '2px solid #E2E8F0'
};

const statLabelStyle = {
    fontSize: '0.85rem',
    color: '#64748B',
    fontWeight: '600',
    marginBottom: '8px'
};

const statValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '900',
    color: '#2563EB'
};

const motivationalStyle = {
    fontSize: '1.1rem',
    color: '#475569',
    fontWeight: '600',
    margin: '24px 0'
};

const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
};
