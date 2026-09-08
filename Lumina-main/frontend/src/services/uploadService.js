/**
 * UPLOAD SERVICE
 * Full pipeline: Upload → Extract → Transform → Save
 * Firebase Storage + Firestore + AI transforms
 */

import { storage, db } from '../config/firebase';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';
import {
  doc, setDoc, updateDoc, getDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import ocrService from './ocr-service';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { transformContent } from './contentTransformService';
import { sendAssignmentNotification } from './notificationService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates a unique content ID.
 * @returns {string}
 */
const generateContentId = () =>
  `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * Determines file category from MIME type.
 * @param {File} file
 * @returns {"image"|"pdf"|"unsupported"}
 */
const getFileType = (file) => {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  return 'unsupported';
};

// ─── Upload Service ───────────────────────────────────────────────────────────

/**
 * Uploads a file through the full pipeline:
 * upload → extract text → AI transform → save to Firestore.
 *
 * @param {File} file - The file to upload
 * @param {string} uploadedBy - UID of the uploader (parent/teacher)
 * @param {string[]} targetStudents - Array of student UIDs
 * @param {Object[]} studentProfiles - Array of student profile objects (each has `disabilities`)
 * @param {Function} [onProgress] - Progress callback: ({ stage, percent }) => void
 * @returns {Promise<string>} The generated contentId
 */
export const uploadFile = async (file, uploadedBy, targetStudents, studentProfiles, onProgress = null) => {
  const contentId = generateContentId();
  const fileType = getFileType(file);

  if (fileType === 'unsupported') {
    throw new Error(`Unsupported file type: ${file.type}. Use PDF or image files.`);
  }

  const report = (stage, percent) => {
    if (onProgress) onProgress({ stage, percent });
  };

  try {
    // ── Step 1: Create initial Firestore record ───────────────────────────────
    const docRef = doc(db, 'uploadedContent', contentId);
    await setDoc(docRef, {
      contentId,
      uploadedBy,
      targetStudents,
      title: file.name,
      fileType,
      status: 'uploading',
      uploadedAt: serverTimestamp()
    });

    // ── Step 2: Upload file to Firebase Storage ───────────────────────────────
    report('uploading', 0);
    const storageRef = ref(storage, `uploads/${contentId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const originalFileUrl = await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          report('uploading', pct);
        },
        (err) => reject(new Error(`Storage upload failed: ${err.message}`)),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });

    await updateDoc(docRef, { originalFile_url: originalFileUrl, status: 'extracting' });
    report('extracting', 0);

    // ── Step 3: Extract text ──────────────────────────────────────────────────
    let extractedText = '';
    try {
      if (fileType === 'pdf') {
        const result = await extractTextFromPDF(file, (pct) => report('extracting', pct));
        extractedText = result.text;
      } else {
        const result = await ocrService.extractText(file);
        extractedText = result.text || '';
        report('extracting', 100);
      }
    } catch (extractErr) {
      console.error('[uploadService] Text extraction failed:', extractErr);
      extractedText = '';
    }

    await updateDoc(docRef, { extractedText, status: 'transforming' });
    report('transforming', 0);

    // ── Step 4: Merge disability profiles from all target students ────────────
    const allDisabilities = new Set();
    for (const profile of (studentProfiles || [])) {
      (profile.disabilities || []).forEach(d => allDisabilities.add(d));
    }

    // ── Step 5: AI transform content ──────────────────────────────────────────
    let adaptiveVersions = {
      dyslexia_text: null,
      chunked_lessons: null,
      high_contrast_text: null,
      audio_script: ''
    };

    if (extractedText.trim().length > 0) {
      try {
        const transformed = await transformContent(extractedText, [...allDisabilities]);
        adaptiveVersions = {
          dyslexia_text: transformed.dyslexia_text,
          chunked_lessons: transformed.chunked_lessons,
          high_contrast_text: transformed.high_contrast_text,
          audio_script: transformed.audio_script
        };
      } catch (transformErr) {
        console.error('[uploadService] Transform failed:', transformErr);
      }
    }

    report('transforming', 100);

    // ── Step 6: Save complete record to Firestore ─────────────────────────────
    await updateDoc(docRef, {
      adaptiveVersions,
      status: 'ready',
      deadline: null,
      completedAt: serverTimestamp()
    });

    report('ready', 100);
    return contentId;
  } catch (err) {
    console.error('[uploadService] Pipeline failed for', contentId, err);
    // Mark failed in Firestore
    try {
      await updateDoc(doc(db, 'uploadedContent', contentId), {
        status: 'failed',
        errorMessage: err.message
      });
    } catch { /* best-effort */ }
    throw err;
  }
};

/**
 * Returns the real-time status of an upload.
 * @param {string} contentId
 * @returns {Promise<"uploading"|"extracting"|"transforming"|"ready"|"failed"|"not_found">}
 */
export const getUploadProgress = async (contentId) => {
  try {
    const snap = await getDoc(doc(db, 'uploadedContent', contentId));
    if (!snap.exists()) return 'not_found';
    return snap.data().status || 'unknown';
  } catch (err) {
    console.error('[uploadService] getUploadProgress error:', err);
    throw err;
  }
};

/**
 * Deletes uploaded content from both Firebase Storage and Firestore.
 * @param {string} contentId - The content ID to delete
 * @returns {Promise<void>}
 */
export const deleteUploadedContent = async (contentId) => {
  try {
    const snap = await getDoc(doc(db, 'uploadedContent', contentId));
    if (!snap.exists()) throw new Error(`Content ${contentId} not found`);

    const data = snap.data();

    // Delete from Storage
    if (data.originalFile_url) {
      try {
        const fileRef = ref(storage, `uploads/${contentId}/${data.title}`);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.warn('[uploadService] Storage delete failed (file may already be gone):', storageErr);
      }
    }

    // Delete Firestore document
    await deleteDoc(doc(db, 'uploadedContent', contentId));
    console.log(`[uploadService] Deleted content: ${contentId}`);
  } catch (err) {
    console.error('[uploadService] deleteUploadedContent error:', err);
    throw err;
  }
};

/**
 * Assigns uploaded content to a student with a deadline and sends a notification.
 * @param {string} contentId - The content ID
 * @param {string} studentId - The student's UID
 * @param {string|null} deadline - ISO date string or null
 * @returns {Promise<void>}
 */
export const assignContentToStudent = async (contentId, studentId, deadline = null) => {
  try {
    const docRef = doc(db, 'uploadedContent', contentId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error(`Content ${contentId} not found`);

    const data = snap.data();

    // Add studentId to targetStudents if not already present
    const existingStudents = data.targetStudents || [];
    const updatedStudents = [...new Set([...existingStudents, studentId])];

    await updateDoc(docRef, {
      targetStudents: updatedStudents,
      deadline: deadline || null,
      updatedAt: serverTimestamp()
    });

    // Send assignment notification to student
    await sendAssignmentNotification(studentId, data.title || 'New Content', deadline);

    console.log(`[uploadService] Assigned ${contentId} to student ${studentId}`);
  } catch (err) {
    console.error('[uploadService] assignContentToStudent error:', err);
    throw err;
  }
};
