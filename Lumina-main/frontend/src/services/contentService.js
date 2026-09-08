/**
 * CONTENT SERVICE
 * Clean facade over OCR + AI simplification + Firestore.
 * Teachers upload → AI simplifies → students read.
 *
 * Firestore shape: adaptedContent/{id}
 *  - id, teacherId, studentId (optional), title,
 *    originalText, simplifiedText, createdAt, status
 */

import {
  collection, addDoc, query, where,
  getDocs, serverTimestamp, doc, updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import Tesseract from 'tesseract.js';

const GROQ_ENDPOINT = '/api/groq/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama-3.3-70b-versatile';

// ─── 1. Text Extraction ───────────────────────────────────────────────────────

/**
 * Extract raw text from a File object (image or text).
 * Images → Tesseract OCR.  Plain text files → FileReader.
 * @param {File} file
 * @param {(pct: number) => void} [onProgress]
 * @returns {Promise<string>}
 */
export const extractText = async (file, onProgress) => {
  if (!file) throw new Error('No file provided');

  // Plain text / markdown
  if (file.type === 'text/plain' || file.name.endsWith('.md')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.readAsText(file);
    });
  }

  // Image → Tesseract
  if (file.type.startsWith('image/')) {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });
    return result.data.text;
  }

  // PDF → best-effort via FileReader (renders first page text only)
  if (file.type === 'application/pdf') {
    // Try the existing pdfExtractor util if available
    try {
      const { extractTextFromPDF } = await import('../utils/pdfExtractor');
      const result = await extractTextFromPDF(file, onProgress);
      return result.text;
    } catch {
      throw new Error(
        'PDF text extraction unavailable in this browser. Please paste the text manually.'
      );
    }
  }

  throw new Error(`Unsupported file type: ${file.type}`);
};

// ─── 2. AI Simplification ─────────────────────────────────────────────────────

/**
 * Send raw text to Groq and return a dyslexia-friendly simplified version.
 * @param {string} text
 * @returns {Promise<string>}
 */
export const simplifyText = async (text) => {
  if (!text?.trim()) return '';

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not configured.');

  const systemPrompt =
    'You are an expert learning specialist who adapts educational content for children. ' +
    'Your only job is to simplify text. Return ONLY the rewritten text — ' +
    'no preamble, no explanation, no labels.';

  const userPrompt =
    `Simplify the following text for a 10-13 year old student with dyslexia.\n\n` +
    `Rules:\n` +
    `- Use short sentences\n` +
    `- Use simple words\n` +
    `- Break long paragraphs\n` +
    `- Add line breaks between ideas\n` +
    `- Keep the meaning exactly the same\n` +
    `- Avoid complex vocabulary\n\n` +
    `Text:\n${text}`;

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   }
      ],
      temperature: 0.4,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// ─── 3. Firestore CRUD ────────────────────────────────────────────────────────

/**
 * Save adapted content to `adaptedContent` collection.
 * @param {{ teacherId, studentId?, title, originalText, simplifiedText }} payload
 * @returns {Promise<string>} the new document id
 */
export const saveAdaptedContent = async ({
  teacherId, studentId = null, title,
  originalText, simplifiedText
}) => {
  const docRef = await addDoc(collection(db, 'adaptedContent'), {
    teacherId,
    studentId,
    title,
    originalText,
    simplifiedText,
    createdAt: serverTimestamp(),
    status: 'ready'
  });
  return docRef.id;
};

/**
 * Assign a content piece to a student (update studentId field).
 * @param {string} contentId
 * @param {string} studentId
 */
export const assignToStudent = async (contentId, studentId) => {
  await updateDoc(doc(db, 'adaptedContent', contentId), { studentId });
};

/**
 * Fetch all content created by a teacher.
 * @param {string} teacherId
 * @returns {Promise<Object[]>}
 */
export const fetchTeacherContent = async (teacherId) => {
  // No orderBy — avoids composite index requirement. Sort in JS.
  const q = query(
    collection(db, 'adaptedContent'),
    where('teacherId', '==', teacherId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort newest first using createdAt (Firestore Timestamp or null)
  return docs.sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return tb - ta;
  });
};

/**
 * Fetch all content assigned to a student.
 * @param {string} studentId
 * @returns {Promise<Object[]>}
 */
export const fetchStudentContent = async (studentId) => {
  // No orderBy — avoids composite index requirement. Sort in JS.
  const q = query(
    collection(db, 'adaptedContent'),
    where('studentId', '==', studentId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs.sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return tb - ta;
  });
};
