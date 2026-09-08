import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import {
  collection, query, where, orderBy, onSnapshot
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import {
  markNotificationRead,
  clearAllNotifications
} from '../services/notificationService';

const NotificationContext = createContext();

/**
 * Hook to consume the NotificationContext.
 * @returns {Object} Notification context value
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

/**
 * Provider that opens a real-time Firestore listener on the user's
 * notification inbox and exposes unread count + actions.
 * @param {{ children: React.ReactNode }} props
 */
export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // onSnapshot listener — live updates
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const itemsRef = collection(db, 'notifications', currentUser.uid, 'items');
    const q = query(
      itemsRef,
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setNotifications(items);
        setLoading(false);
      },
      (err) => {
        console.error('[NotificationContext] onSnapshot error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  /** Number of unread notifications */
  const unreadCount = notifications.length;

  /**
   * Marks a single notification as read.
   * @param {string} notificationDocId - Firestore document ID
   */
  const markAsRead = useCallback(async (notificationDocId) => {
    if (!currentUser) return;
    try {
      await markNotificationRead(currentUser.uid, notificationDocId);
      // onSnapshot will auto-update the list
    } catch (err) {
      console.error('[NotificationContext] markAsRead error:', err);
    }
  }, [currentUser]);

  /**
   * Clears all unread notifications for the current user.
   */
  const clearAll = useCallback(async () => {
    if (!currentUser) return;
    try {
      await clearAllNotifications(currentUser.uid);
    } catch (err) {
      console.error('[NotificationContext] clearAll error:', err);
    }
  }, [currentUser]);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    loading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
