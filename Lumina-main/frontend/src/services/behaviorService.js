import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Logs a student interaction or behavior event.
 * @param {Object} eventData
 * @param {string} eventData.studentId
 * @param {string} eventData.type - "lesson" | "game"
 * @param {string} eventData.action - e.g., "completed", "started", "abandoned"
 * @param {number} eventData.duration - Total time spent in seconds
 * @param {boolean} eventData.usedAudio - Whether TTS or audio aids were used
 * @param {Object} eventData.metadata - Any additional data
 */
export const logStudentEvent = async ({ studentId, type, action, duration, usedAudio = false, metadata = {} }) => {
  if (!studentId) return;

  try {
    await addDoc(collection(db, 'behaviorLogs'), {
      studentId,
      type,
      action,
      duration,
      usedAudio,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log student event:', error);
  }
};
