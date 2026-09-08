import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

/**
 * Fetches behavior logs and computes learning insights for a student.
 * @param {string} studentId
 * @returns {Promise<Object>} The insights object
 */
export const getStudentInsights = async (studentId) => {
  if (!studentId) return null;

  try {
    const logsRef = collection(db, 'behaviorLogs');
    const q = query(
      logsRef,
      where('studentId', '==', studentId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return {
        avgSessionTime: 0,
        totalSessions: 0,
        audioUsageRate: 0,
        preferredMode: 'text',
        attentionScore: 'medium'
      };
    }

    let totalDuration = 0;
    let audioSessions = 0;
    let validSessions = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.duration > 0) {
        totalDuration += data.duration;
        validSessions++;
        if (data.usedAudio) {
          audioSessions++;
        }
      }
    });

    const avgSessionTime = validSessions > 0 ? Math.round(totalDuration / validSessions) : 0;
    const audioUsageRate = validSessions > 0 ? (audioSessions / validSessions) * 100 : 0;

    let preferredMode = 'text';
    if (audioUsageRate > 60) preferredMode = 'audio';

    let attentionScore = 'medium';
    // Attention logic: under 120s is low, 120-300s is medium, over 300s is high
    if (avgSessionTime < 120) {
      attentionScore = 'low';
    } else if (avgSessionTime > 300) {
      attentionScore = 'high';
    }

    return {
      avgSessionTime,
      totalSessions: snapshot.size,
      audioUsageRate: Math.round(audioUsageRate),
      preferredMode,
      attentionScore
    };
  } catch (error) {
    console.error('Error fetching student insights:', error);
    return null;
  }
};
