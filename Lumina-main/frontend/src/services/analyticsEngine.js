import { db } from '../config/firebase.js';
import {
  collection, doc, getDocs, setDoc, addDoc, query, where,
  orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { updatePerformanceAnalytics } from './firestoreService';

/**
 * Recalculates comprehensive analytics for a student from all behavior logs
 * and progress data, then persists results to Firestore.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Object>} Updated analytics object
 */
export const recalculateAnalytics = async (studentId) => {
  try {
    // Fetch behavior logs
    const logsQuery = query(
      collection(db, 'behaviorLogs'),
      where('studentId', '==', studentId),
      orderBy('timestamp', 'desc'),
      limit(500)
    );
    const logsSnap = await getDocs(logsQuery);
    const logs = logsSnap.docs.map(d => d.data());

    // Fetch lesson progress
    const lessonProgressSnap = await getDocs(
      collection(db, 'studentProgress', studentId, 'lessons')
    );
    const lessonProgress = lessonProgressSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch assessment attempts
    const assessSnap = await getDocs(
      collection(db, 'studentProgress', studentId, 'assessmentAttempts')
    );
    const assessments = assessSnap.docs.map(d => d.data());

    // Fetch game progress
    const gamesSnap = await getDocs(
      collection(db, 'studentProgress', studentId, 'games')
    );
    const gameProgress = gamesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // --- Calculate avg accuracy per subject ---
    const subjectAccuracies = {};
    for (const attempt of assessments) {
      const subj = attempt.subjectId || 'unknown';
      if (!subjectAccuracies[subj]) subjectAccuracies[subj] = [];
      if (typeof attempt.accuracy === 'number') {
        subjectAccuracies[subj].push(attempt.accuracy);
      }
    }
    const avgAccuracyPerSubject = {};
    for (const [subj, accs] of Object.entries(subjectAccuracies)) {
      avgAccuracyPerSubject[subj] = Math.round(accs.reduce((s, v) => s + v, 0) / accs.length);
    }

    // Overall avg accuracy
    const allAccuracies = assessments
      .filter(a => typeof a.accuracy === 'number')
      .map(a => a.accuracy);
    const avgAccuracy = allAccuracies.length > 0
      ? Math.round(allAccuracies.reduce((s, v) => s + v, 0) / allAccuracies.length)
      : 0;

    // Recent accuracies (last 10)
    const recentAccuracies = allAccuracies.slice(0, 10);

    // --- Strong and weak topics ---
    const strongTopics = [];
    const weakTopics = [];
    for (const [subj, avg] of Object.entries(avgAccuracyPerSubject)) {
      if (avg >= 75) strongTopics.push(subj);
      else if (avg < 50) weakTopics.push(subj);
    }

    // --- Best time of day ---
    const hourBuckets = { morning: 0, afternoon: 0, evening: 0 };
    for (const log of logs) {
      if (log.timestamp?.toDate) {
        const hour = log.timestamp.toDate().getHours();
        if (hour >= 5 && hour < 12) hourBuckets.morning++;
        else if (hour >= 12 && hour < 17) hourBuckets.afternoon++;
        else hourBuckets.evening++;
      }
    }
    const bestTimeOfDay = Object.entries(hourBuckets)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'morning';

    // --- Preferred format ---
    const formatCounts = { audio: 0, video: 0, game: 0, text: 0 };
    for (const log of logs) {
      const fmt = log.interactionType || log.activityType;
      if (fmt && formatCounts[fmt] !== undefined) {
        formatCounts[fmt]++;
      }
    }
    if (gameProgress.length > 0) formatCounts.game += gameProgress.length;
    const preferredFormat = Object.entries(formatCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'text';

    // --- Focus duration ---
    const focusDurations = [];
    const sessionEndLogs = logs.filter(l => l.type === 'session_end');
    for (const s of sessionEndLogs) {
      if (s.totalDuration) focusDurations.push(Math.round(s.totalDuration / 60));
    }
    const avgFocusDuration = focusDurations.length > 0
      ? Math.round(focusDurations.reduce((s, v) => s + v, 0) / focusDurations.length)
      : 15;

    // --- Optimal session length ---
    let optimalSessionLength = Math.round(avgFocusDuration / 5) * 5;
    if (optimalSessionLength < 5) optimalSessionLength = 5;
    if (optimalSessionLength > 45) optimalSessionLength = 45;

    // --- Streak ---
    const completedDates = lessonProgress
      .filter(l => l.completed && l.updatedAt?.toDate)
      .map(l => l.updatedAt.toDate().toDateString());
    const uniqueDates = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (uniqueDates[i] === expected.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    const analyticsObj = {
      studentId,
      avgAccuracy,
      recentAccuracies,
      avgAccuracyPerSubject,
      strongTopics,
      weakTopics,
      bestTimeOfDay,
      preferredFormat,
      avgFocusDuration,
      focusDurations,
      optimalSessionLength,
      currentStreak,
      totalLessonsCompleted: lessonProgress.filter(l => l.completed).length,
      totalGamesPlayed: gameProgress.length,
      totalAssessmentsTaken: assessments.length,
      behaviorLogs: logs.slice(0, 50) // keep recent subset for adaptive engine
    };

    await updatePerformanceAnalytics(studentId, analyticsObj);
    return analyticsObj;
  } catch (err) {
    console.error('[analyticsEngine] recalculateAnalytics error:', err);
    throw err;
  }
};

/**
 * Generates a weekly report from the last 7 days of behavior and progress data.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Object>} The generated report object
 */
export const generateWeeklyReport = async (studentId) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch recent behavior logs
    const logsQuery = query(
      collection(db, 'behaviorLogs'),
      where('studentId', '==', studentId),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );
    const logsSnap = await getDocs(logsQuery);
    const allLogs = logsSnap.docs.map(d => d.data());
    const weekLogs = allLogs.filter(l => {
      if (!l.timestamp?.toDate) return false;
      return l.timestamp.toDate() >= sevenDaysAgo;
    });

    // Fetch lesson progress
    const lessonSnap = await getDocs(collection(db, 'studentProgress', studentId, 'lessons'));
    const allLessons = lessonSnap.docs.map(d => d.data());
    const weekLessons = allLessons.filter(l => {
      if (!l.updatedAt?.toDate) return false;
      return l.updatedAt.toDate() >= sevenDaysAgo;
    });

    // Fetch assessment attempts
    const assessSnap = await getDocs(collection(db, 'studentProgress', studentId, 'assessmentAttempts'));
    const weekAssessments = assessSnap.docs.map(d => d.data()).filter(a => {
      if (!a.timestamp?.toDate) return false;
      return a.timestamp.toDate() >= sevenDaysAgo;
    });

    // Calculate metrics
    const sessionLogs = weekLogs.filter(l => l.type === 'session_end');
    const totalTimeSpent = sessionLogs.reduce((sum, l) => sum + (l.totalDuration || 0), 0);
    const lessonsCompleted = weekLessons.filter(l => l.completed).length;
    const gamesPlayed = weekLogs.filter(l => l.activityType === 'game' && l.type === 'activity_end').length;
    const weekAccuracies = weekAssessments.filter(a => typeof a.accuracy === 'number').map(a => a.accuracy);
    const avgAccuracy = weekAccuracies.length > 0
      ? Math.round(weekAccuracies.reduce((s, v) => s + v, 0) / weekAccuracies.length)
      : 0;

    // Subject breakdown
    const subjectBreakdown = {};
    for (const lesson of weekLessons) {
      const subj = lesson.subjectId || 'unknown';
      if (!subjectBreakdown[subj]) subjectBreakdown[subj] = { completed: 0, timeSpent: 0 };
      if (lesson.completed) subjectBreakdown[subj].completed++;
      subjectBreakdown[subj].timeSpent += (lesson.timeSpent || 0);
    }

    // Generate insights
    const insights = generateInsights({
      avgAccuracy, lessonsCompleted, gamesPlayed, totalTimeSpent, subjectBreakdown
    });

    // Generate recommendations
    const recs = [];
    if (avgAccuracy < 60) recs.push('Review recent topics with audio-enabled lessons for better comprehension.');
    if (lessonsCompleted < 3) recs.push('Try to complete at least 3 lessons this week for consistent progress.');
    if (gamesPlayed < 2) recs.push('Play learning games to reinforce concepts in a fun way.');
    if (recs.length === 0) recs.push('Keep up the great work! Try a new subject area this week.');

    const report = {
      studentId,
      weekStarting: sevenDaysAgo.toISOString(),
      weekEnding: new Date().toISOString(),
      totalTimeSpent,
      lessonsCompleted,
      gamesPlayed,
      avgAccuracy,
      subjectBreakdown,
      streakMaintained: lessonsCompleted > 0,
      insights,
      recommendations: recs,
      generatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await addDoc(collection(db, 'weeklyReports'), {
      ...report,
      timestamp: serverTimestamp()
    });

    return report;
  } catch (err) {
    console.error('[analyticsEngine] generateWeeklyReport error:', err);
    throw err;
  }
};

/**
 * Generates human-readable insight strings from analytics data.
 * @param {Object} analytics - Analytics object with accuracy, counts, etc.
 * @returns {string[]} Array of 3-5 insight strings
 */
export const generateInsights = (analytics) => {
  const insights = [];
  try {
    if (analytics.avgAccuracy >= 80) {
      insights.push(`Great accuracy at ${analytics.avgAccuracy}%! You're mastering the material.`);
    } else if (analytics.avgAccuracy >= 60) {
      insights.push(`Your accuracy is ${analytics.avgAccuracy}%. A bit more practice will push you higher!`);
    } else if (analytics.avgAccuracy > 0) {
      insights.push(`Your accuracy is ${analytics.avgAccuracy}%. Let's review some topics together.`);
    }

    if (analytics.bestTimeOfDay) {
      insights.push(`You learn best in the ${analytics.bestTimeOfDay}. Try scheduling study sessions then.`);
    }

    if (analytics.preferredFormat) {
      const fmtNames = { audio: 'Audio lessons', video: 'Video lessons', game: 'Learning games', text: 'Text lessons' };
      insights.push(`${fmtNames[analytics.preferredFormat] || 'Text lessons'} increase your engagement the most.`);
    }

    if (analytics.strongTopics && analytics.strongTopics.length > 0) {
      insights.push(`${analytics.strongTopics[0]} is your strongest subject — keep it up!`);
    }

    if (analytics.lessonsCompleted >= 5) {
      insights.push(`You completed ${analytics.lessonsCompleted} lessons this period — impressive!`);
    }

    // Always return 3-5
    if (insights.length < 3) {
      insights.push('Consistent daily practice is the key to long-term retention.');
    }
    return insights.slice(0, 5);
  } catch (err) {
    console.error('[analyticsEngine] generateInsights error:', err);
    return ['Keep learning every day!'];
  }
};

export const recalculateStudentAnalytics = recalculateAnalytics;
