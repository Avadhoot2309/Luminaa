/**
 * MESSAGING SERVICE
 * Handles Parent <=> Teacher communication.
 * Path: messages/{messageId}
 */

import { db, storage } from '../config/firebase';
import {
  collection, doc, setDoc, getDocs, updateDoc,
  query, where, orderBy, getDoc, serverTimestamp, or, and
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendMessageNotification } from './notificationService';

/**
 * Generates a unique message ID.
 * @returns {string}
 */
const genMessageId = () =>
  `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Sends a message from one user to another, with optional attachments.
 * @param {string} fromUserId - Sender's UID
 * @param {string} fromName - Sender's display name for notification
 * @param {string} toUserId - Recipient's UID
 * @param {string} content - Text content of the message
 * @param {File[]} [attachments=[]] - Array of File objects to upload
 * @returns {Promise<string>} The created messageId
 */
export const sendMessage = async (fromUserId, fromName, toUserId, content, attachments = []) => {
  try {
    const messageId = genMessageId();
    const uploadedAttachments = [];

    // Upload attachments if any
    for (const file of attachments) {
      const storageRef = ref(storage, `messages/${messageId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedAttachments.push({
        name: file.name,
        url,
        type: file.type
      });
    }

    const messageData = {
      messageId,
      fromUserId,
      toUserId,
      content,
      attachments: uploadedAttachments,
      read: false,
      timestamp: serverTimestamp()
    };

    // Save message to Firestore
    await setDoc(doc(db, 'messages', messageId), messageData);

    // Send notification to recipient
    await sendMessageNotification(toUserId, fromName);

    return messageId;
  } catch (err) {
    console.error('[messagingService] sendMessage error:', err);
    throw err;
  }
};

/**
 * Retrieves all messages involving a specific user (either sent or received).
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getMessages = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages');
    // Using Firestore 'or' query requires composite index, or we fetch both and merge in client
    // For simplicity, we query where participants array contains userId
    // Wait, let's use the standard approach for this. We can query 'fromUserId' and 'toUserId' separately if composite index is an issue, but 'or' query is supported in modern Firestore.
    
    const q = query(
      messagesRef,
      or(
        where('fromUserId', '==', userId),
        where('toUserId', '==', userId)
      ),
      orderBy('timestamp', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // If composite index is missing, fallback to two queries
    console.warn('[messagingService] Single query failed, trying dual queries:', err.message);
    const qSent = query(collection(db, 'messages'), where('fromUserId', '==', userId));
    const qReceived = query(collection(db, 'messages'), where('toUserId', '==', userId));
    
    const [snapSent, snapReceived] = await Promise.all([getDocs(qSent), getDocs(qReceived)]);
    const all = [
      ...snapSent.docs.map(d => ({ id: d.id, ...d.data() })),
      ...snapReceived.docs.map(d => ({ id: d.id, ...d.data() }))
    ];
    
    // Sort descending by timestamp locally
    return all.sort((a, b) => {
      const timeA = a.timestamp?.toMillis() || 0;
      const timeB = b.timestamp?.toMillis() || 0;
      return timeB - timeA;
    });
  }
};

/**
 * Retrieves the message thread between two specific users.
 * @param {string} userId1
 * @param {string} userId2
 * @returns {Promise<Array>}
 */
export const getThread = async (userId1, userId2) => {
  try {
    const messages = await getMessages(userId1); // Get all for user 1
    // Filter locally to match user 2
    return messages.filter(msg => 
      (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
      (msg.fromUserId === userId2 && msg.toUserId === userId1)
    );
  } catch (err) {
    console.error('[messagingService] getThread error:', err);
    throw err;
  }
};

/**
 * Marks a specific message as read.
 * @param {string} messageId 
 * @returns {Promise<void>}
 */
export const markMessageRead = async (messageId) => {
  try {
    const msgRef = doc(db, 'messages', messageId);
    await updateDoc(msgRef, { read: true });
  } catch (err) {
    console.error('[messagingService] markMessageRead error:', err);
    throw err;
  }
};

/**
 * Returns the count of unread messages for a user.
 * @param {string} userId 
 * @returns {Promise<number>}
 */
export const getUnreadCount = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('toUserId', '==', userId),
      where('read', '==', false)
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (err) {
    console.error('[messagingService] getUnreadCount error:', err);
    return 0;
  }
};
