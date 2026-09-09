/**
 * ============================================================================
 * FIREBASE ADMIN SDK CONFIGURATION
 * ============================================================================
 * 
 * Purpose: Privileged server-side Firebase operations (Firestore admin access,
 * user token verification, storage management, database seeding).
 * 
 * Note for Mentors & Group Members:
 * ----------------------------------------------------------------------------
 * Difference between Client SDK and Admin SDK:
 * - Frontend uses Client SDK (restricted by Firebase Security Rules).
 * - Backend uses Admin SDK (has full privileged access to bypass rules for
 *   admin tasks, database seeding, or system-level actions).
 * 
 * Cloud Deployment Support:
 * - On platforms like Render or Railway, uploading a `serviceAccountKey.json`
 *   file is often insecure or ephemeral. Instead, set the environment variable
 *   `FIREBASE_SERVICE_ACCOUNT_KEY` containing the entire JSON string.
 * - If running on Google Cloud Platform or Firebase Functions, default credentials
 *   are automatically discovered.
 * ============================================================================
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount = null;

// 1. Check for JSON string in environment variable (Render / Railway / Cloud best practice)
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('[Firebase Admin] Successfully parsed service account from FIREBASE_SERVICE_ACCOUNT_KEY env variable.');
  } catch (err) {
    console.error('[Firebase Admin] Error parsing FIREBASE_SERVICE_ACCOUNT_KEY JSON:', err.message);
  }
}

// 2. Fallback to local file path if JSON string was not provided
if (!serviceAccount) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../serviceAccountKey.json');
  const resolvedPath = path.resolve(serviceAccountPath);

  if (fs.existsSync(resolvedPath)) {
    try {
      serviceAccount = require(resolvedPath);
      console.log(`[Firebase Admin] Loaded service account from file: ${resolvedPath}`);
    } catch (err) {
      console.error(`[Firebase Admin] Failed reading ${resolvedPath}:`, err.message);
    }
  }
}

// 3. Initialize Firebase Admin SDK safely
if (!admin.apps.length) {
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'luminaa-1ffe1.firebasestorage.app';

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket
    });
    console.log('[Firebase Admin] Initialized with Service Account Certificate.');
  } else {
    try {
      // Attempt Application Default Credentials (standard in Firebase Cloud Functions / GCP)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: storageBucket
      });
      console.log('[Firebase Admin] Initialized with Application Default Credentials.');
    } catch (fallbackErr) {
      console.warn('[Firebase Admin] Warning: No service account credentials found. Admin database operations will be limited until credentials are provided.');
    }
  }
}

// Export references to core Firebase admin services
let db = null;
let auth = null;
let storage = null;

if (admin.apps.length) {
  try {
    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
  } catch (serviceInitErr) {
    console.warn('[Firebase Admin] Notice: Services deferred until credentials available:', serviceInitErr.message);
  }
}

module.exports = {
  admin,
  db,
  auth,
  storage
};

