import { useMemo, useCallback } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useProgress } from '../contexts/ProgressContext';
import {
  calculateNextDifficulty,
  recommendContentFormat,
  getOptimalSessionLength,
  generateRecommendations,
  applyAccessibilitySettings
} from '../services/adaptiveEngine';

/**
 * Custom hook that reads the student's profile and analytics to produce
 * adaptive difficulty, content format, session length, break signals,
 * and exposes a function to apply accessibility CSS.
 * @param {number} currentSessionSeconds - Current session duration in seconds (from useSession)
 * @returns {{ difficulty: string, contentFormat: string, optimalDuration: number, shouldTakeBreak: boolean, nextRecommendations: Array, applySettings: Function }}
 */
export const useAdaptive = (currentSessionSeconds = 0) => {
  const { profile } = useProfile();
  const { analytics, recommendations } = useProgress();

  /** @type {"beginner"|"intermediate"|"advanced"} */
  const difficulty = useMemo(() => {
    const recentAccuracies = analytics?.recentAccuracies || [];
    return calculateNextDifficulty(recentAccuracies);
  }, [analytics]);

  /** @type {"audio"|"video"|"game"|"text"} */
  const contentFormat = useMemo(() => {
    const logs = analytics?.behaviorLogs || [];
    return recommendContentFormat(logs);
  }, [analytics]);

  /** Optimal session duration in minutes */
  const optimalDuration = useMemo(() => {
    const focusDurations = analytics?.focusDurations || [];
    return getOptimalSessionLength(focusDurations);
  }, [analytics]);

  /** Whether the student has exceeded their optimal session length */
  const shouldTakeBreak = useMemo(() => {
    const sessionMinutes = currentSessionSeconds / 60;
    return sessionMinutes >= optimalDuration;
  }, [currentSessionSeconds, optimalDuration]);

  /** Top 3 recommended lessons/games */
  const nextRecommendations = useMemo(() => {
    if (recommendations?.items && recommendations.items.length > 0) {
      return recommendations.items.slice(0, 3);
    }
    // Fallback: generate from profile + analytics
    const generated = generateRecommendations(profile, analytics);
    return generated.slice(0, 3);
  }, [recommendations, profile, analytics]);

  /**
   * Applies the student's accessibility preferences to the DOM as CSS variables.
   */
  const applySettings = useCallback(() => {
    if (profile?.preferences) {
      applyAccessibilitySettings(profile.preferences);
    }
  }, [profile]);

  return {
    difficulty,
    contentFormat,
    optimalDuration,
    shouldTakeBreak,
    nextRecommendations,
    applySettings
  };
};
