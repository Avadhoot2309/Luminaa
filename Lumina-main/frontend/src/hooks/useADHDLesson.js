import { useState, useCallback } from 'react';

/**
 * useADHDLesson Hook
 * 
 * Simplifies ADHD lesson management and state
 * 
 * Usage:
 * const {
 *   lesson,
 *   progress,
 *   isLoading,
 *   completeLession,
 *   saveProgress,
 *   resumeLession
 * } = useADHDLesson(lessonId);
 */
export function useADHDLesson(lessonId) {
    const [lesson, setLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load lesson data on mount
    React.useEffect(() => {
        loadLesson();
    }, [lessonId]);

    // Load saved progress
    React.useEffect(() => {
        loadSavedProgress();
    }, [lessonId]);

    const loadLesson = useCallback(async () => {
        try {
            setIsLoading(true);
            // Replace with your actual API call
            const response = await fetch(`/api/lessons/${lessonId}`);
            const data = await response.json();
            setLesson(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [lessonId]);

    const loadSavedProgress = useCallback(() => {
        try {
            const saved = localStorage.getItem(`adhd_lesson_${lessonId}`);
            if (saved) {
                setProgress(JSON.parse(saved));
            }
        } catch (err) {
            console.error('Failed to load saved progress:', err);
        }
    }, [lessonId]);

    const saveProgress = useCallback(async (progressData) => {
        try {
            // Save to localStorage
            localStorage.setItem(`adhd_lesson_${lessonId}`, JSON.stringify(progressData));
            setProgress(progressData);

            // Send to backend (optional)
            await fetch(`/api/lessons/${lessonId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(progressData)
            });
        } catch (err) {
            console.error('Failed to save progress:', err);
            setError(err.message);
        }
    }, [lessonId]);

    const completeLession = useCallback(async (results) => {
        try {
            // Save completion to backend
            await fetch(`/api/lessons/${lessonId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(results)
            });

            // Clear saved progress
            localStorage.removeItem(`adhd_lesson_${lessonId}`);
            setProgress(null);
        } catch (err) {
            console.error('Failed to complete lesson:', err);
            setError(err.message);
        }
    }, [lessonId]);

    const resumeLession = useCallback(() => {
        // Simply re-load saved progress
        loadSavedProgress();
    }, [loadSavedProgress]);

    return {
        lesson,
        progress,
        isLoading,
        error,
        saveProgress,
        completeLession,
        resumeLession
    };
}

export default useADHDLesson;
