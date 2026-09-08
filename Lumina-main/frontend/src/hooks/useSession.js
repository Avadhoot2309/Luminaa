import { useState, useEffect, useRef, useCallback } from 'react';
import { startSession, endSession, trackFocusBreak as tbTrackFocusBreak, trackInteraction as tbTrackInteraction, initAutoSave } from '../services/behaviorTracker';

/**
 * Custom hook that manages a learning session lifecycle.
 * On mount: starts a session and registers page-level event listeners.
 * On unmount: ends the session and cleans up listeners.
 * @param {string} studentId - The student whose session to track
 * @returns {{ sessionId: string|null, trackInteraction: Function, trackFocusBreak: Function, sessionDuration: number, focusBreakCount: number }}
 */
export const useSession = (studentId) => {
  const [sessionId, setSessionId] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [focusBreakCount, setFocusBreakCount] = useState(0);
  const interactionCountRef = useRef(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start session on mount
  useEffect(() => {
    if (!studentId) return;

    const { sessionId: sid } = startSession(studentId);
    setSessionId(sid);
    startTimeRef.current = Date.now();

    // Start duration timer (updates every second)
    timerRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Init auto-save (flushes behavior buffer every 60s)
    initAutoSave(studentId, sid);

    // Visibility change listener for focus breaks
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tbTrackFocusBreak(sid);
        setFocusBreakCount(prev => prev + 1);
      }
    };

    // Click listener to track interactions
    const handleClick = () => {
      tbTrackInteraction(sid, 'click');
      interactionCountRef.current += 1;
    };

    // Scroll listener
    const handleScroll = () => {
      tbTrackInteraction(sid, 'scroll');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);

      const totalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      endSession(sid, studentId, {
        totalDuration,
        focusBreaks: focusBreakCount,
        interactions: interactionCountRef.current
      }).catch(err => console.error('[useSession] endSession error:', err));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  /**
   * Manually record a specific interaction type.
   * @param {string} interactionType
   */
  const trackInteraction = useCallback((interactionType) => {
    if (!sessionId) return;
    tbTrackInteraction(sessionId, interactionType);
    interactionCountRef.current += 1;
  }, [sessionId]);

  /**
   * Manually record a focus break.
   */
  const trackFocusBreak = useCallback(() => {
    if (!sessionId) return;
    tbTrackFocusBreak(sessionId);
    setFocusBreakCount(prev => prev + 1);
  }, [sessionId]);

  return {
    sessionId,
    trackInteraction,
    trackFocusBreak,
    sessionDuration,
    focusBreakCount
  };
};
