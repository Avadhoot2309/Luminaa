import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  getStudentProgress,
  updateLessonProgress as fsUpdateLessonProgress,
  updateGameProgress as fsUpdateGameProgress,
  saveAssessmentAttempt as fsSaveAssessmentAttempt,
  getPerformanceAnalytics,
  getRecommendations,
  getAchievements,
  addAchievement
} from '../services/firestoreService';
import { recalculateAnalytics } from '../services/analyticsEngine';

const ProgressContext = createContext();

/**
 * Hook to consume the ProgressContext.
 * @returns {Object} Progress context value
 */
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

/**
 * Provider component that fetches and manages all student progress,
 * analytics, recommendations, and achievements from Firestore.
 * @param {{ children: React.ReactNode }} props
 */
export const ProgressProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [progress, setProgress] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all progress data on mount / user change
  useEffect(() => {
    if (!currentUser) {
      setProgress(null);
      setAnalytics(null);
      setRecommendations(null);
      setAchievements([]);
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prog, anal, recs, achs] = await Promise.all([
          getStudentProgress(currentUser.uid),
          getPerformanceAnalytics(currentUser.uid),
          getRecommendations(currentUser.uid),
          getAchievements(currentUser.uid)
        ]);
        setProgress(prog);
        setAnalytics(anal);
        setRecommendations(recs);
        setAchievements(achs || []);
      } catch (err) {
        console.error('[ProgressContext] Error fetching data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentUser]);

  /**
   * Updates lesson progress in Firestore and local state.
   * @param {string} lessonId
   * @param {Object} progressData - { completed, score, timeSpent, etc. }
   */
  const updateLessonProgress = useCallback(async (lessonId, progressData) => {
    if (!currentUser) return;
    try {
      await fsUpdateLessonProgress(currentUser.uid, lessonId, progressData);
      setProgress(prev => ({
        ...prev,
        lessons: { ...(prev?.lessons || {}), [lessonId]: progressData }
      }));
    } catch (err) {
      console.error('[ProgressContext] updateLessonProgress error:', err);
      throw err;
    }
  }, [currentUser]);

  /**
   * Updates game progress in Firestore and local state.
   * @param {string} gameId
   * @param {Object} progressData - { score, level, timeSpent, etc. }
   */
  const updateGameProgress = useCallback(async (gameId, progressData) => {
    if (!currentUser) return;
    try {
      await fsUpdateGameProgress(currentUser.uid, gameId, progressData);
      setProgress(prev => ({
        ...prev,
        games: { ...(prev?.games || {}), [gameId]: progressData }
      }));
    } catch (err) {
      console.error('[ProgressContext] updateGameProgress error:', err);
      throw err;
    }
  }, [currentUser]);

  /**
   * Saves an assessment result and updates local state.
   * @param {string} assessmentId
   * @param {Object} attemptData - { answers, score, accuracy, timeSpent }
   */
  const saveAssessmentResult = useCallback(async (assessmentId, attemptData) => {
    if (!currentUser) return;
    try {
      await fsSaveAssessmentAttempt(currentUser.uid, assessmentId, attemptData);
      setProgress(prev => ({
        ...prev,
        assessments: {
          ...(prev?.assessments || {}),
          [assessmentId]: [...(prev?.assessments?.[assessmentId] || []), attemptData]
        }
      }));
    } catch (err) {
      console.error('[ProgressContext] saveAssessmentResult error:', err);
      throw err;
    }
  }, [currentUser]);

  /**
   * Triggers a full analytics recalculation and refreshes local state.
   */
  const refreshAnalytics = useCallback(async () => {
    if (!currentUser) return;
    try {
      const updated = await recalculateAnalytics(currentUser.uid);
      setAnalytics(updated);
      return updated;
    } catch (err) {
      console.error('[ProgressContext] refreshAnalytics error:', err);
      throw err;
    }
  }, [currentUser]);

  /**
   * Checks earned achievements and awards any new ones.
   * @param {Object} latestActivity - info about the activity just completed
   * @returns {Array} Newly awarded achievements
   */
  const checkAndAwardAchievements = useCallback(async (latestActivity) => {
    if (!currentUser) return [];
    try {
      const newlyEarned = [];
      const earnedIds = new Set(achievements.map(a => a.achievementId));
      const lessonCount = Object.keys(progress?.lessons || {}).filter(
        k => progress.lessons[k]?.completed
      ).length;

      // Streak achievements
      const streak = analytics?.currentStreak || 0;
      const streakMilestones = [
        { days: 3, id: 'streak-3', name: '3-Day Streak', icon: '🔥' },
        { days: 5, id: 'streak-5', name: '5-Day Streak', icon: '🔥🔥' },
        { days: 7, id: 'streak-7', name: 'Week Warrior', icon: '⚡' },
        { days: 10, id: 'streak-10', name: '10-Day Champion', icon: '🏆' },
        { days: 30, id: 'streak-30', name: 'Monthly Master', icon: '👑' }
      ];
      for (const m of streakMilestones) {
        if (streak >= m.days && !earnedIds.has(m.id)) {
          const ach = { achievementId: m.id, name: m.name, icon: m.icon, type: 'streak', threshold: m.days };
          await addAchievement(currentUser.uid, ach);
          newlyEarned.push(ach);
          earnedIds.add(m.id);
        }
      }

      // Completion achievements
      const completionMilestones = [
        { count: 5, id: 'complete-5', name: 'First Five', icon: '📖' },
        { count: 10, id: 'complete-10', name: 'Double Digits', icon: '📚' },
        { count: 25, id: 'complete-25', name: 'Quarter Century', icon: '🎯' },
        { count: 50, id: 'complete-50', name: 'Half Century', icon: '🌟' }
      ];
      for (const m of completionMilestones) {
        if (lessonCount >= m.count && !earnedIds.has(m.id)) {
          const ach = { achievementId: m.id, name: m.name, icon: m.icon, type: 'completion', threshold: m.count };
          await addAchievement(currentUser.uid, ach);
          newlyEarned.push(ach);
          earnedIds.add(m.id);
        }
      }

      // Accuracy achievements
      const avgAccuracy = analytics?.avgAccuracy || 0;
      const accMilestones = [
        { pct: 70, id: 'accuracy-70', name: 'Sharp Shooter', icon: '🎯' },
        { pct: 80, id: 'accuracy-80', name: 'Precision Pro', icon: '💎' },
        { pct: 90, id: 'accuracy-90', name: 'Accuracy Ace', icon: '🏅' }
      ];
      for (const m of accMilestones) {
        if (avgAccuracy >= m.pct && !earnedIds.has(m.id)) {
          const ach = { achievementId: m.id, name: m.name, icon: m.icon, type: 'accuracy', threshold: m.pct };
          await addAchievement(currentUser.uid, ach);
          newlyEarned.push(ach);
          earnedIds.add(m.id);
        }
      }

      // Speed achievement
      if (latestActivity?.timeSpent && latestActivity?.estimatedTime &&
          latestActivity.timeSpent < latestActivity.estimatedTime && !earnedIds.has('speed-demon')) {
        const ach = { achievementId: 'speed-demon', name: 'Speed Demon', icon: '⚡', type: 'speed' };
        await addAchievement(currentUser.uid, ach);
        newlyEarned.push(ach);
      }

      // Explorer achievement — played all 8 games
      const gamesPlayed = Object.keys(progress?.games || {}).length;
      if (gamesPlayed >= 8 && !earnedIds.has('explorer')) {
        const ach = { achievementId: 'explorer', name: 'Game Explorer', icon: '🗺️', type: 'explorer' };
        await addAchievement(currentUser.uid, ach);
        newlyEarned.push(ach);
      }

      if (newlyEarned.length > 0) {
        setAchievements(prev => [...prev, ...newlyEarned]);
      }
      return newlyEarned;
    } catch (err) {
      console.error('[ProgressContext] checkAndAwardAchievements error:', err);
      return [];
    }
  }, [currentUser, progress, analytics, achievements]);

  const value = useMemo(() => ({
    progress,
    analytics,
    recommendations,
    achievements,
    loading,
    error,
    updateLessonProgress,
    updateGameProgress,
    saveAssessmentResult,
    refreshAnalytics,
    checkAndAwardAchievements
  }), [progress, analytics, recommendations, achievements, loading, error,
       updateLessonProgress, updateGameProgress, saveAssessmentResult,
       refreshAnalytics, checkAndAwardAchievements]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
