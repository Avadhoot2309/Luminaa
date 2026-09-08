/**
 * ADHD LESSONS MODULE - IMPLEMENTATION EXAMPLES
 * 
 * This file shows how to integrate the ADHD Lessons module
 * into your existing application with minimal changes.
 */

// ============================================================
// EXAMPLE 1: Simple Integration in Lesson Page
// ============================================================

import React from 'react';
import ADHDLesson from '@components/lessons/ADHDLesson';
import useADHDLesson from '@hooks/useADHDLesson';

/**
 * LessonPage - Render ADHD lesson if student has ADHD condition
 */
export function LessonPage({ lessonId }) {
    const { profile } = useProfile();
    const { lesson, isLoading, saveProgress, completeLession } = useADHDLesson(lessonId);

    if (isLoading) {
        return <div>Loading lesson...</div>;
    }

    // ADHD student: Use ADHD lesson component
    if (profile?.condition === 'ADHD') {
        return (
            <ADHDLesson
                lessonId={lessonId}
                lessonData={lesson}
                onComplete={(results) => {
                    console.log('Lesson completed:', results);
                    completeLession(results);
                    // Redirect to dashboard or next lesson
                }}
                onSave={(progress) => {
                    console.log('Progress saved:', progress);
                    saveProgress(progress);
                }}
            />
        );
    }

    // Other students: Use existing lesson component
    return <StandardLessonComponent lesson={lesson} />;
}

// ============================================================
// EXAMPLE 2: Lessons List with ADHD Support
// ============================================================

import { useNavigate } from 'react-router-dom';

/**
 * LessonsList - Show lessons with ADHD badge
 */
export function LessonsList({ lessons, userCondition }) {
    const navigate = useNavigate();

    const handleLessonClick = (lesson) => {
        if (userCondition === 'ADHD') {
            navigate(`/lessons/${lesson.id}/adhd`);
        } else {
            navigate(`/lessons/${lesson.id}`);
        }
    };

    return (
        <div style={containerStyle}>
            {lessons.map(lesson => (
                <div key={lesson.id} style={lessonCardStyle}>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>

                    {/* Show ADHD optimized badge if available */}
                    {lesson.hasADHDVersion && userCondition === 'ADHD' && (
                        <span style={adhdBadgeStyle}>🧠 ADHD Optimized</span>
                    )}

                    <button
                        onClick={() => handleLessonClick(lesson)}
                        style={buttonStyle}
                    >
                        Start Lesson
                    </button>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// EXAMPLE 3: Dashboard with Lesson Progress
// ============================================================

/**
 * LessonProgressDashboard - Show progress across all lessons
 */
export function LessonProgressDashboard({ userId }) {
    const [progress, setProgress] = React.useState([]);

    React.useEffect(() => {
        loadProgressData();
    }, [userId]);

    const loadProgressData = async () => {
        const response = await fetch(`/api/users/${userId}/lesson-progress`);
        const data = await response.json();
        setProgress(data);
    };

    return (
        <div style={dashboardStyle}>
            <h2>📚 Your Lessons</h2>

            {progress.map(lesson => (
                <div key={lesson.id} style={lessonProgressStyle}>
                    <div style={progressInfoStyle}>
                        <h4>{lesson.title}</h4>
                        <div style={progressBarStyle}>
                            <div
                                style={{
                                    ...progressFillStyle,
                                    width: `${lesson.stepIndex / lesson.totalSteps * 100}%`
                                }}
                            />
                        </div>
                        <span style={progressTextStyle}>
                            Step {lesson.stepIndex} of {lesson.totalSteps}
                        </span>
                    </div>

                    <button
                        onClick={() => resumeLesson(lesson.id)}
                        style={resumeButtonStyle}
                    >
                        {lesson.isCompleted ? '✓ Review' : '▶️ Resume'}
                    </button>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// EXAMPLE 4: Teacher Dashboard - Create ADHD Lesson
// ============================================================

/**
 * CreateADHDLesson - Teacher tool to structure content for ADHD
 */
export function CreateADHDLesson() {
    const [lessonData, setLessonData] = React.useState({
        title: '',
        content: [],
        summary: '',
        hasADHDVersion: true
    });

    const addContentChunk = () => {
        setLessonData({
            ...lessonData,
            content: [
                ...lessonData.content,
                {
                    text: '',
                    question: '',
                    options: [],
                    correctAnswer: '',
                    explanation: ''
                }
            ]
        });
    };

    const handleSave = async () => {
        const response = await fetch('/api/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lessonData)
        });
        console.log('Lesson created:', await response.json());
    };

    return (
        <div style={formStyle}>
            <h2>Create ADHD Lesson</h2>

            <div>
                <label>Lesson Title</label>
                <input
                    value={lessonData.title}
                    onChange={e => setLessonData({ ...lessonData, title: e.target.value })}
                    placeholder="Enter lesson title"
                    style={inputStyle}
                />
            </div>

            <div>
                <h3>Content Chunks (Micro-units)</h3>
                {lessonData.content.map((chunk, idx) => (
                    <div key={idx} style={chunkStyle}>
                        <h4>Chunk {idx + 1}</h4>

                        <label>Content (2-3 lines)</label>
                        <textarea
                            value={chunk.text}
                            onChange={e =>
                                updateChunk(idx, { ...chunk, text: e.target.value })
                            }
                            placeholder="Enter content..."
                            style={textareaStyle}
                        />

                        <label>Question (Optional)</label>
                        <input
                            value={chunk.question}
                            onChange={e =>
                                updateChunk(idx, { ...chunk, question: e.target.value })
                            }
                            placeholder="What do you want to ask?"
                            style={inputStyle}
                        />

                        {chunk.question && (
                            <>
                                <label>Options (comma-separated)</label>
                                <input
                                    value={chunk.options.join(', ')}
                                    onChange={e =>
                                        updateChunk(idx, {
                                            ...chunk,
                                            options: e.target.value.split(', ')
                                        })
                                    }
                                    style={inputStyle}
                                />

                                <label>Correct Answer</label>
                                <input
                                    value={chunk.correctAnswer}
                                    onChange={e =>
                                        updateChunk(idx, { ...chunk, correctAnswer: e.target.value })
                                    }
                                    style={inputStyle}
                                />

                                <label>Explanation</label>
                                <textarea
                                    value={chunk.explanation}
                                    onChange={e =>
                                        updateChunk(idx, { ...chunk, explanation: e.target.value })
                                    }
                                    style={textareaStyle}
                                />
                            </>
                        )}
                    </div>
                ))}

                <button onClick={addContentChunk} style={addButtonStyle}>
                    + Add Content Chunk
                </button>
            </div>

            <div>
                <label>Summary</label>
                <textarea
                    value={lessonData.summary}
                    onChange={e => setLessonData({ ...lessonData, summary: e.target.value })}
                    placeholder="Brief lesson summary..."
                    style={textareaStyle}
                />
            </div>

            <button onClick={handleSave} style={submitButtonStyle}>
                Create Lesson
            </button>
        </div>
    );
}

// ============================================================
// EXAMPLE 5: Custom Hook for ADHD-Specific Logic
// ============================================================

/**
 * useADHDLessonWithAnalytics - Track ADHD-specific metrics
 */
export function useADHDLessonWithAnalytics(lessonId) {
    const [analytics, setAnalytics] = React.useState({
        totalTime: 0,
        pauseCount: 0,
        mistakePattern: [],
        focusLosses: 0
    });

    const recordAnalytics = React.useCallback((event, data) => {
        switch (event) {
            case 'pause':
                setAnalytics(prev => ({
                    ...prev,
                    pauseCount: prev.pauseCount + 1
                }));
                break;
            case 'mistake':
                setAnalytics(prev => ({
                    ...prev,
                    mistakePattern: [...prev.mistakePattern, data.stepId]
                }));
                break;
            case 'focus_loss':
                setAnalytics(prev => ({
                    ...prev,
                    focusLosses: prev.focusLosses + 1
                }));
                break;
            default:
                break;
        }
    }, []);

    return { analytics, recordAnalytics };
}

// ============================================================
// EXAMPLE 6: Route Integration
// ============================================================

/**
 * Add to your Router configuration:
 */

const routes = [
    {
        path: '/lessons/:lessonId',
        element: <LessonPage />,
        description: 'Standard lesson (all conditions)'
    },
    {
        path: '/lessons/:lessonId/adhd',
        element: <ADHDLesson />,
        description: 'ADHD-optimized lesson'
    },
    {
        path: '/lessons/list',
        element: <LessonsList />,
        description: 'All lessons'
    },
    {
        path: '/dashboard/progress',
        element: <LessonProgressDashboard />,
        description: 'Student progress tracking'
    },
    {
        path: '/admin/create-lesson',
        element: <CreateADHDLesson />,
        description: 'Teacher: Create ADHD lesson'
    }
];

// ============================================================
// STYLES
// ============================================================

const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
};

const lessonCardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #E2E8F0'
};

const adhdBadgeStyle = {
    display: 'inline-block',
    backgroundColor: '#DBEAFE',
    color: '#0C4A6E',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '12px'
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2563EB',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
};

const dashboardStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
};

const lessonProgressStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '12px',
    border: '1px solid #E2E8F0'
};

const progressInfoStyle = {
    flex: 1
};

const progressBarStyle = {
    height: '6px',
    backgroundColor: '#E2E8F0',
    borderRadius: '3px',
    overflow: 'hidden',
    margin: '8px 0'
};

const progressFillStyle = {
    height: '100%',
    backgroundColor: '#10B981',
    transition: 'width 0.3s ease'
};

const progressTextStyle = {
    fontSize: '0.85rem',
    color: '#64748B'
};

const resumeButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
};

const formStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '1rem'
};

const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    fontFamily: 'monospace'
};

const chunkStyle = {
    backgroundColor: '#F8FAFC',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #E2E8F0'
};

const addButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '20px'
};

const submitButtonStyle = {
    padding: '12px 30px',
    backgroundColor: '#2563EB',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem'
};
