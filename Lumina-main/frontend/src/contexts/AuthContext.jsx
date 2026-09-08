import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getStudentByPIN } from '../services/pinService';
import { parseQRData } from '../services/qrService';
import {
  saveChildSession, getChildSession, isChildSessionValid, clearChildSession,
  saveAdminSession, clearAdminSession
} from '../utils/sessionManager';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase User (Teacher/Parent)

  // ✅ Step 3 Fix: Restore session on refresh (Sync check!)
  const [studentUser, setStudentUser] = useState(() => {
    const stored = localStorage.getItem('studentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Error restoring student session:", err);
      }
    }
    return null;
  });

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new user
  const signup = async (email, password, role, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Fix typo in preferences if exists
      if (additionalData?.preferences?.audioEnables) {
        additionalData.preferences.audioEnabled = additionalData.preferences.audioEnables;
        delete additionalData.preferences.audioEnables;
      }

      const userData = {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      // ✅ Completely purge any lingering student session so it doesn't force redirects
      logoutChild();

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );
      const profile = await fetchUserProfile(userCredential.user.uid);
      if (profile) saveAdminSession(userCredential.user.uid, profile.role);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      clearAdminSession();
      // Also clear any student session that might be lingering
      logoutChild();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // ✅ Step 2: Modify loginWithPIN
  const loginWithPIN = async (pin) => {
    setLoading(true);
    try {
      const profile = await getStudentByPIN(pin);
      if (profile) {
        // Fix typo in saved profile data if necessary
        if (profile.preferences?.audioEnables) {
          profile.preferences.audioEnabled = profile.preferences.audioEnables;
          delete profile.preferences.audioEnables;
        }

        const studentId = profile.studentId;
        saveChildSession(studentId, pin);

        // ✅ SET STUDENT SESSION
        setStudentUser(profile);
        localStorage.setItem('studentUser', JSON.stringify(profile));

        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('loginWithPIN error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // NEW: Child login with QR
  const loginWithQR = async (qrString) => {
    const { pin } = parseQRData(qrString);
    if (pin) return await loginWithPIN(pin);
    return false;
  };

  // NEW: Child logout
  const logoutChild = () => {
    clearChildSession();
    localStorage.removeItem('studentUser');
    setStudentUser(null);
    setUserProfile(null);
  };

  // 🔥 NEW: Session type checks (Step 4 Fallback)
  const isChildSession = () => !!studentUser;
  const isAdminSession = () => !!currentUser;

  // Fetch user profile
  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Fix typo on load for teachers too
        if (data.preferences?.audioEnables) {
          data.preferences.audioEnabled = data.preferences.audioEnables;
          delete data.preferences.audioEnables;
        }
        setUserProfile(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      } else {
        setCurrentUser(null);
      }
      // If we have a studentUser, we aren't loading anymore
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    studentUser, // ✅ Step 1
    userProfile,
    signup,
    login,
    logout,
    loginWithPIN,
    loginWithQR,
    logoutChild,
    isChildSession,
    isAdminSession,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
