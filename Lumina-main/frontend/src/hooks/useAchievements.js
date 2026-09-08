import { useState, useCallback } from 'react';
import { useProgress } from '../contexts/ProgressContext';

/**
 * Achievement definitions with thresholds.
 * @type {Array<Object>}
 */
const ACHIEVEMENT_DEFS = [
  // Streak milestones
  { id: 'streak-3',  type: 'streak',     threshold: 3,  name: '3-Day Streak',      icon: '🔥',  desc: 'Maintained a 3-day learning streak' },
  { id: 'streak-5',  type: 'streak',     threshold: 5,  name: '5-Day Streak',      icon: '🔥',  desc: 'Maintained a 5-day learning streak' },
  { id: 'streak-7',  type: 'streak',     threshold: 7,  name: 'Week Warrior',      icon: '⚡',  desc: 'Maintained a 7-day learning streak' },
  { id: 'streak-10', type: 'streak',     threshold: 10, name: '10-Day Champion',   icon: '🏆',  desc: 'Maintained a 10-day learning streak' },
  { id: 'streak-30', type: 'streak',     threshold: 30, name: 'Monthly Master',    icon: '👑',  desc: 'Maintained a 30-day learning streak' },
  // Accuracy milestones
  { id: 'accuracy-70', type: 'accuracy', threshold: 70, name: 'Sharp Shooter',     icon: '🎯',  desc: 'Achieved 70% average accuracy' },
  { id: 'accuracy-80', type: 'accuracy', threshold: 80, name: 'Precision Pro',     icon: '💎',  desc: 'Achieved 80% average accuracy' },
  { id: 'accuracy-90', type: 'accuracy', threshold: 90, name: 'Accuracy Ace',      icon: '🏅',  desc: 'Achieved 90% average accuracy' },
  // Completion milestones
  { id: 'complete-5',  type: 'completion', threshold: 5,  name: 'First Five',      icon: '📖',  desc: 'Completed 5 lessons' },
  { id: 'complete-10', type: 'completion', threshold: 10, name: 'Double Digits',   icon: '📚',  desc: 'Completed 10 lessons' },
  { id: 'complete-25', type: 'completion', threshold: 25, name: 'Quarter Century', icon: '🎯',  desc: 'Completed 25 lessons' },
  { id: 'complete-50', type: 'completion', threshold: 50, name: 'Half Century',    icon: '🌟',  desc: 'Completed 50 lessons' },
  // Special
  { id: 'speed-demon', type: 'speed',    threshold: null, name: 'Speed Demon',     icon: '⚡',  desc: 'Completed a lesson faster than estimated' },
  { id: 'explorer',    type: 'explorer', threshold: 8,    name: 'Game Explorer',   icon: '🗺️', desc: 'Played all 8 learning games' }
];

/**
 * Custom hook that checks and awards achievements after any student activity.
 * Maintains a list of newly earned achievements for display in a popup.
 * @returns {{ checkAchievements: Function, newAchievements: Array, clearNewAchievements: Function, allDefinitions: Array }}
 */
export const useAchievements = () => {
  const { progress, analytics, achievements, checkAndAwardAchievements } = useProgress();
  const [newAchievements, setNewAchievements] = useState([]);

  /**
   * Checks all achievement criteria against latest progress/analytics and awards new ones.
   * @param {Object} [latestActivity] - { timeSpent, estimatedTime, type, ... }
   * @returns {Promise<Array>} Array of newly awarded achievements
   */
  const checkAchievements = useCallback(async (latestActivity = {}) => {
    try {
      const earned = await checkAndAwardAchievements(latestActivity);
      if (earned && earned.length > 0) {
        setNewAchievements(prev => [...prev, ...earned]);
      }
      return earned;
    } catch (err) {
      console.error('[useAchievements] checkAchievements error:', err);
      return [];
    }
  }, [checkAndAwardAchievements]);

  /**
   * Clears the list of newly earned achievements (e.g. after user dismisses popup).
   */
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  return {
    checkAchievements,
    newAchievements,
    clearNewAchievements,
    allDefinitions: ACHIEVEMENT_DEFS
  };
};
