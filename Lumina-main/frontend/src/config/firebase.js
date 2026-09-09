/**
 * ============================================================================
 * FIREBASE CLIENT SDK INITIALIZATION (frontend/src/config/firebase.js)
 * ============================================================================
 * 
 * Purpose: Connects the React client application to Google Firebase Cloud Services.
 * 
 * Note for Mentors & Group Members:
 * ----------------------------------------------------------------------------
 * 1. Client Security:
 *    - All keys are loaded from Vite environment variables prefixed with `VITE_`.
 *    - Client-side keys are public identifiers safe to run in the browser because
 *      data access is enforced strictly via `firestore.rules` and `storage.rules`.
 * 
 * 2. Active Cloud Services:
 *    - Firebase Authentication: Powers email/password login for teachers & parents.
 *    - Cloud Firestore: Real-time NoSQL database storing student profiles, lesson
 *      progress, ADHD game metrics, and behavioral history.
 *    - Cloud Storage: Secure bucket hosting lesson assets, audio files, and worksheets.
 * ============================================================================
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Read configuration securely from Vite environment variables (with project defaults fallback)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyClMB4poU2QG4Ph61XXGOtJZAeleeJRxQE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'luminaa-1ffe1.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'luminaa-1ffe1',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'luminaa-1ffe1.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029060325709',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029060325709:web:1fefd17c6b1d1d95a68704'
};

// Initialize the primary Firebase client app safely
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  console.warn('[Firebase] Primary initialization notice:', err.message);
  app = initializeApp(firebaseConfig, 'lumina-app');
}

// Export singleton instances for consumption across the React app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


