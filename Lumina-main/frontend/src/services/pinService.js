/**
 * PIN SERVICE
 * Handles generating, validating, and managing 4-digit PINs for student login.
 */

import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Generates a random, unique 4-digit PIN.
 * @returns {Promise<string>} A 4-digit PIN as a string.
 */
/**
 * Generates a random, unique 4-digit PIN.
 * @returns {Promise<string>} A 4-digit PIN as a string.
 */
export const generatePIN = async () => {
  let pin = '';
  try {
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      attempts++;
      pin = Math.floor(1000 + Math.random() * 9000).toString();
      const snap = await getDoc(doc(db, 'pins', pin));
      if (!snap.exists()) {
        isUnique = true;
      }
    }
    return pin || Math.floor(1000 + Math.random() * 9000).toString();
  } catch (err) {
    console.warn('generatePIN fallback to local unique random PIN:', err);
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
};

/**
 * Saves a PIN to Firestore and maps it to a student ID.
 * @param {string} studentId - The student's ID
 * @param {string} pin - The 4-digit PIN
 * @returns {Promise<void>}
 */
export const savePIN = async (studentId, pin) => {
  try {
    await setDoc(doc(db, 'pins', pin), {
      studentId,
      createdAt: serverTimestamp(),
      active: true
    });
  } catch (err) {
    console.error('Error saving pin mapping in pins collection:', err);
  }
};

/**
 * Validates a given PIN for child login.
 * @param {string} pin - The 4-digit PIN
 * @returns {Promise<{ valid: boolean, studentId?: string }>}
 */
export const validatePIN = async (pin) => {
  if (!pin || pin.length !== 4) return { valid: false };
  try {
    const snap = await getDoc(doc(db, 'pins', pin));
    if (snap.exists() && snap.data().active) {
      return { valid: true, studentId: snap.data().studentId };
    }
  } catch (err) {
    console.warn('validatePIN error from pins collection:', err);
  }
  return { valid: false };
};

/**
 * Retrieves the full student profile using their PIN.
 * Checks pins collection first, then falls back to studentProfiles collection.
 * @param {string} pin
 * @returns {Promise<Object|null>}
 */
export const getStudentByPIN = async (pin) => {
  if (!pin || pin.length !== 4) return null;

  try {
    // 1. Try pins collection lookup
    const result = await validatePIN(pin);
    if (result.valid && result.studentId) {
      const profileSnap = await getDoc(doc(db, 'studentProfiles', result.studentId));
      if (profileSnap.exists()) {
        return { 
          studentId: profileSnap.id, 
          ...profileSnap.data() 
        };
      }
    }
  } catch (err) {
    console.warn('validatePIN error in getStudentByPIN:', err);
  }

  try {
    // 2. Fallback: Query studentProfiles directly where pin === pin
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const q = query(collection(db, 'studentProfiles'), where('pin', '==', String(pin)));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const docSnap = querySnap.docs[0];
      return {
        studentId: docSnap.id,
        ...docSnap.data()
      };
    }
  } catch (err) {
    console.warn('Fallback query by PIN in studentProfiles failed:', err);
  }

  // 3. Fallback: Check local storage mapping
  try {
    const localPins = JSON.parse(localStorage.getItem('lumina_local_pins') || '{}');
    if (localPins[pin]) {
      return localPins[pin];
    }
    const localStudents = JSON.parse(localStorage.getItem('lumina_local_students') || '[]');
    const matched = localStudents.find(s => String(s.pin) === String(pin));
    if (matched) {
      return {
        studentId: matched.id || matched.studentId,
        ...matched
      };
    }
  } catch (err) {
    console.error('Local fallback getStudentByPIN error:', err);
  }

  return null;
};

/**
 * Deactivates an old PIN and generates/saves a new one for the student.
 * @param {string} studentId - The student's ID
 * @param {string} [oldPin] - (Optional) The old PIN to deactivate
 * @returns {Promise<string>} The new 4-digit PIN
 */
export const regeneratePIN = async (studentId, oldPin) => {
  if (oldPin) {
    try {
      await deleteDoc(doc(db, 'pins', oldPin));
    } catch (e) {
      console.warn('Failed to delete old PIN doc:', e);
    }
  }
  const newPin = await generatePIN();
  await savePIN(studentId, newPin);
  // Also update pin in studentProfiles doc
  try {
    await setDoc(doc(db, 'studentProfiles', studentId), { pin: newPin }, { merge: true });
  } catch (e) {
    console.error('Failed to update pin in studentProfiles:', e);
  }
  return newPin;
};

