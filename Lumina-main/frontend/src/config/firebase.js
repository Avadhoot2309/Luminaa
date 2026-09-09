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

// Read configuration securely from Vite environment variables ONLY (No hardcoded credentials)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Initialize the primary Firebase client app safely
let app;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn('[Firebase] Warning: VITE_FIREBASE_API_KEY is not set in environment variables.');
    app = initializeApp({ apiKey: 'UNSET_API_KEY', projectId: 'lumina-unconfigured' }, 'placeholder');
  }
} catch (err) {
  console.warn('[Firebase] Primary initialization notice:', err.message);
  try {
    app = initializeApp(firebaseConfig, 'lumina-app');
  } catch (e) {
    // Fallback if app already exists
  }
}

// Export singleton instances for consumption across the React app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


