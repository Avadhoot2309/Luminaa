/**
 * NOTIFICATION SERVICE
 * In-app notification system backed by Firestore.
 * Path: notifications/{userId}/items/{notificationId}
 */

import { db } from '../config/firebase';
import {
  collection, doc, addDoc, getDocs, updateDoc, writeBatch,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';

/**
 * Generates a safe notification ID.
 * @returns {string}
 */
const genNotifId = () =>
  `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Sends a notification to a user's notification inbox.
 * @param {string} toUserId - Recipient user ID
 * @param {{ type: string, title: string, body: string, actionUrl?: string }} notification
 * @returns {Promise<string>} The created notificationId
 */
export const sendNotification = async (toUserId, notification) => {
  try {
    const notifId = genNotifId();
    const itemsRef = collection(db, 'notifications', toUserId, 'items');
    await addDoc(itemsRef, {
      notificationId: notifId,
      type: notification.type || 'general',
      title: notification.title || '',
      body: notification.body || '',
      read: false,
      actionUrl: notification.actionUrl || '/',
      createdAt: serverTimestamp()
    });
    return notifId;
  } catch (err) {
    console.error('[notificationService] sendNotification error:', err);
    throw err;
  }
};

/**
 * Retrieves all unread notifications for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getNotifications = async (userId) => {
  try {
    const itemsRef = collection(db, 'notifications', userId, 'items');
    const q = query(itemsRef, where('read', '==', false), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[notificationService] getNotifications error:', err);
    throw err;
  }
};

/**
 * Marks a specific notification as read.
 * @param {string} userId
 * @param {string} notificationId - Firestore document ID
 * @returns {Promise<void>}
 */
export const markNotificationRead = async (userId, notificationId) => {
  try {
    const notifRef = doc(db, 'notifications', userId, 'items', notificationId);
    await updateDoc(notifRef, { read: true, readAt: serverTimestamp() });
  } catch (err) {
    console.error('[notificationService] markNotificationRead error:', err);
    throw err;
  }
};

/**
 * Clears (marks as read) all notifications for a user in a batched write.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const clearAllNotifications = async (userId) => {
  try {
    const itemsRef = collection(db, 'notifications', userId, 'items');
    const q = query(itemsRef, where('read', '==', false));
    const snap = await getDocs(q);
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach(d => {
      batch.update(d.ref, { read: true, readAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (err) {
    console.error('[notificationService] clearAllNotifications error:', err);
    throw err;
  }
};

// ─── Specialist notifiers ─────────────────────────────────────────────────────

/**
 * Notifies a student about a new content assignment with an optional deadline.
 * @param {string} studentId
 * @param {string} contentTitle - Title of the assigned content
 * @param {string|null} deadline - ISO date string or null
 * @returns {Promise<string>}
 */
export const sendAssignmentNotification = async (studentId, contentTitle, deadline = null) => {
  const deadlineStr = deadline
    ? ` Due: ${new Date(deadline).toLocaleDateString('en-IN')}.`
    : '';
  return sendNotification(studentId, {
    type: 'assignment',
    title: '📚 New Assignment',
    body: `You have been assigned "${contentTitle}".${deadlineStr}`,
    actionUrl: '/dashboard'
  });
};

/**
 * Notifies a student about a newly earned achievement.
 * @param {string} studentId
 * @param {string} achievementTitle - Name of the achievement
 * @returns {Promise<string>}
 */
export const sendAchievementNotification = async (studentId, achievementTitle) => {
  return sendNotification(studentId, {
    type: 'achievement',
    title: '🏅 Achievement Unlocked!',
    body: `You earned the "${achievementTitle}" badge. Keep it up!`,
    actionUrl: '/dashboard'
  });
};

/**
 * Notifies a user about a new message from another user.
 * @param {string} toUserId
 * @param {string} fromName - Display name of the sender
 * @returns {Promise<string>}
 */
export const sendMessageNotification = async (toUserId, fromName) => {
  return sendNotification(toUserId, {
    type: 'message',
    title: '💬 New Message',
    body: `You have a new message from ${fromName}.`,
    actionUrl: '/messages'
  });
};

/**
 * Sends a gentle break reminder to a student.
 * @param {string} studentId
 * @returns {Promise<string>}
 */
export const sendBreakReminder = async (studentId) => {
  return sendNotification(studentId, {
    type: 'reminder',
    title: '⏸️ Time for a Break!',
    body: 'You have been studying for a while. Take a 5-minute break and come back refreshed!',
    actionUrl: '/dashboard'
  });
};
