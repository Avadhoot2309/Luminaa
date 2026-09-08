import { db } from '../config/firebase.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  query, where, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { generatePIN, regeneratePIN as doRegeneratePIN } from './pinService';
import { generateQRCode } from './qrService';

/**
 * Retrieves the student profile by user ID.
 * @param {string} userId - The user's ID
 * @returns {Promise<Object|null>}
 */
export const getStudentProfile = async (userId) => {
  try {
    const docRef = doc(db, 'studentProfiles', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error('Error in getStudentProfile:', e);
    throw e;
  }
};

/**
 * Creates a new student profile in Firestore.
 * @param {string} userId - The user's ID
 * @param {Object} profileData - Data for the profile
 * @returns {Promise<void>}
 */
export const createStudentProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, 'studentProfiles', userId), {
      userId,
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in createStudentProfile:', e);
    throw e;
  }
};

/**
 * Updates an existing student profile.
 * @param {string} userId - The user's ID
 * @param {Object} updates - Data to update
 * @returns {Promise<void>}
 */
export const updateStudentProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, 'studentProfiles', userId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in updateStudentProfile:', e);
    throw e;
  }
};

/**
 * Retrieves all subjects from Firestore.
 * @returns {Promise<Array>}
 */
export const getAllSubjects = async () => {
  try {
    const snap = await getDocs(collection(db, 'subjects'));
    return snap.docs.map(doc => doc.data());
  } catch (e) {
    console.error('Error in getAllSubjects:', e);
    throw e;
  }
};

/**
 * Retrieves chapters by subject and grade.
 * @param {string} subjectId - The subject ID
 * @param {number} grade - The grade level
 * @returns {Promise<Array>}
 */
export const getChaptersBySubject = async (subjectId, grade) => {
  try {
    const q = query(
      collection(db, 'chapters'), 
      where('subjectId', '==', subjectId),
      where('grade', '==', grade)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data()).sort((a, b) => (a.ncertChapterNumber || 0) - (b.ncertChapterNumber || 0));
  } catch (e) {
    console.error('Error in getChaptersBySubject:', e);
    throw e;
  }
};

/**
 * Retrieves lessons by chapter ID.
 * @param {string} chapterId - The chapter ID
 * @returns {Promise<Array>}
 */
export const getLessonsByChapter = async (chapterId) => {
  try {
    console.log(`[firestoreService] Executing query: getLessonsByChapter for where("chapterId", "==", "${chapterId}")`);
    const q = query(collection(db, 'lessons'), where('chapterId', '==', chapterId));
    const snap = await getDocs(q);
    let lessons = snap.docs.map(doc => doc.data());

    if (lessons.length === 0) {
      console.warn(`[firestoreService] No lessons found for chapterId ${chapterId}. Fallback: fetching ALL lessons and filtering client-side...`);
      const allSnap = await getDocs(collection(db, 'lessons'));
      lessons = allSnap.docs.map(doc => doc.data()).filter(doc => doc.chapterId === chapterId);
      console.log(`[firestoreService] Fallback yielded ${lessons.length} lessons`);
    }

    return lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (e) {
    console.error('Error in getLessonsByChapter:', e);
    throw e;
  }
};

/**
 * Retrieves a lesson by its ID.
 * @param {string} lessonId - The lesson ID
 * @returns {Promise<Object|null>}
 */
export const getLessonById = async (lessonId) => {
  try {
    const q = query(collection(db, 'lessons'), where('lessonId', '==', lessonId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data();
    }
    return null;
  } catch (e) {
    console.error('Error in getLessonById:', e);
    throw e;
  }
};

/**
 * Retrieves an assessment for a specific lesson.
 * @param {string} lessonId - The lesson ID
 * @returns {Promise<Object|null>}
 */
export const getAssessmentByLesson = async (lessonId) => {
  try {
    const q = query(collection(db, 'assessments'), where('lessonId', '==', lessonId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data();
    }
    return null;
  } catch (e) {
    console.error('Error in getAssessmentByLesson:', e);
    throw e;
  }
};

/**
 * Retrieves overall student progress.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Object>}
 */
export const getStudentProgress = async (studentId) => {
  try {
    const docRef = doc(db, 'studentProgress', studentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error('Error in getStudentProgress:', e);
    throw e;
  }
};

/**
 * Updates progress for a specific lesson.
 * @param {string} studentId - The student's ID
 * @param {string} lessonId - The lesson ID
 * @param {Object} progressData - Data to update
 * @returns {Promise<void>}
 */
export const updateLessonProgress = async (studentId, lessonId, progressData) => {
  try {
    const progressRef = doc(db, 'studentProgress', studentId, 'lessons', lessonId);
    await setDoc(progressRef, {
      ...progressData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('Error in updateLessonProgress:', e);
    throw e;
  }
};

/**
 * Updates progress for a specific game.
 * @param {string} studentId - The student's ID
 * @param {string} gameId - The game ID
 * @param {Object} progressData - Data to update
 * @returns {Promise<void>}
 */
export const updateGameProgress = async (studentId, gameId, progressData) => {
  try {
    const progressRef = doc(db, 'studentProgress', studentId, 'games', gameId);
    await setDoc(progressRef, {
      ...progressData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('Error in updateGameProgress:', e);
    throw e;
  }
};

/**
 * Saves an attempt at an assessment.
 * @param {string} studentId - The student's ID
 * @param {string} assessmentId - The assessment ID
 * @param {Object} attemptData - Data of the attempt
 * @returns {Promise<void>}
 */
export const saveAssessmentAttempt = async (studentId, assessmentId, attemptData) => {
  try {
    const attemptCol = collection(db, 'studentProgress', studentId, 'assessmentAttempts');
    await addDoc(attemptCol, {
      assessmentId,
      ...attemptData,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in saveAssessmentAttempt:', e);
    throw e;
  }
};

/**
 * Logs a behavior event for a student.
 * @param {string} studentId - The student's ID
 * @param {string} sessionId - The session ID
 * @param {Object} logData - Data to log
 * @returns {Promise<void>}
 */
export const logBehavior = async (studentId, sessionId, logData) => {
  try {
    const logRef = collection(db, 'behaviorLogs');
    await addDoc(logRef, {
      studentId,
      sessionId,
      ...logData,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in logBehavior:', e);
    throw e;
  }
};

/**
 * Retrieves achievements for a student.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Array>}
 */
export const getAchievements = async (studentId) => {
  try {
    const q = query(collection(db, 'studentProgress', studentId, 'achievements'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  } catch (e) {
    console.error('Error in getAchievements:', e);
    throw e;
  }
};

/**
 * Adds an achievement for a student.
 * @param {string} studentId - The student's ID
 * @param {Object} achievementData - Data of the achievement
 * @returns {Promise<void>}
 */
export const addAchievement = async (studentId, achievementData) => {
  try {
    const achCol = collection(db, 'studentProgress', studentId, 'achievements');
    await addDoc(achCol, {
      ...achievementData,
      awardedAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in addAchievement:', e);
    throw e;
  }
};

/**
 * Retrieves performance analytics for a student.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Object|null>}
 */
export const getPerformanceAnalytics = async (studentId) => {
  try {
    const docRef = doc(db, 'performanceAnalytics', studentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error('Error in getPerformanceAnalytics:', e);
    throw e;
  }
};

/**
 * Updates performance analytics data.
 * @param {string} studentId - The student's ID
 * @param {Object} data - Analytics data to update
 * @returns {Promise<void>}
 */
export const updatePerformanceAnalytics = async (studentId, data) => {
  try {
    const docRef = doc(db, 'performanceAnalytics', studentId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('Error in updatePerformanceAnalytics:', e);
    throw e;
  }
};

/**
 * Retrieves AI recommendations for a student.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Object|null>}
 */
export const getRecommendations = async (studentId) => {
  try {
    const docRef = doc(db, 'recommendations', studentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) {
    console.error('Error in getRecommendations:', e);
    throw e;
  }
};

/**
 * Updates AI recommendations based on performance.
 * @param {string} studentId - The student's ID
 * @param {Object} data - Recommendation data
 * @returns {Promise<void>}
 */
export const updateRecommendations = async (studentId, data) => {
  try {
    const docRef = doc(db, 'recommendations', studentId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('Error in updateRecommendations:', e);
    throw e;
  }
};

/**
 * Retrieves weekly reports for a student.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Array>}
 */
export const getWeeklyReports = async (studentId) => {
  try {
    const q = query(collection(db, 'weeklyReports'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  } catch (e) {
    console.error('Error in getWeeklyReports:', e);
    throw e;
  }
};

/**
 * Triggers the generation of a weekly report.
 * @param {string} studentId - The student's ID
 * @returns {Promise<void>}
 */
export const generateWeeklyReport = async (studentId) => {
  try {
    const reportCol = collection(db, 'weeklyReportRequests');
    await addDoc(reportCol, {
      studentId,
      requestedAt: serverTimestamp(),
      status: 'pending'
    });
  } catch (e) {
    console.error('Error in generateWeeklyReport:', e);
    throw e;
  }
};

/**
 * Retrieves messages for a specific user ID.
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>}
 */
export const getMessages = async (userId) => {
  try {
    const q = query(collection(db, 'messages'), where('toUserId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Error in getMessages:', e);
    throw e;
  }
};

/**
 * Sends a message from one user to another.
 * @param {string} fromUserId - The sender's ID
 * @param {string} toUserId - The recipient's ID
 * @param {Object} content - Message content
 * @returns {Promise<void>}
 */
export const sendMessage = async (fromUserId, toUserId, content) => {
  try {
    await addDoc(collection(db, 'messages'), {
      fromUserId,
      toUserId,
      ...content,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in sendMessage:', e);
    throw e;
  }
};

/**
 * Marks a message as read.
 * @param {string} messageId - The message ID
 * @returns {Promise<void>}
 */
export const markMessageRead = async (messageId) => {
  try {
    const msgRef = doc(db, 'messages', messageId);
    await updateDoc(msgRef, {
      read: true,
      readAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in markMessageRead:', e);
    throw e;
  }
};

/**
 * Retrieves uploaded content for a student.
 * @param {string} studentId - The student's ID
 * @returns {Promise<Array>}
 */
export const getUploadedContent = async (studentId) => {
  try {
    const q = query(collection(db, 'uploadedContent'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Error in getUploadedContent:', e);
    throw e;
  }
};

/**
 * Saves a new uploaded content entry.
 * @param {Object} contentData - Data representing the uploaded content
 * @returns {Promise<void>}
 */
export const saveUploadedContent = async (contentData) => {
  try {
    await addDoc(collection(db, 'uploadedContent'), {
      ...contentData,
      status: 'processing',
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in saveUploadedContent:', e);
    throw e;
  }
};

/**
 * Updates the status of an uploaded content document.
 * @param {string} contentId - The content ID
 * @param {string} status - New status string
 * @returns {Promise<void>}
 */
export const updateContentStatus = async (contentId, status) => {
  try {
    await updateDoc(doc(db, 'uploadedContent', contentId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in updateContentStatus:', e);
    throw e;
  }
};

// ─── TEACHER MANAGEMENT ─────────────────────────────────────────────

/**
 * Creates a new student profile, assigns a PIN, generates QR, and links to teacher.
 * @param {string} teacherId
 * @param {Object} studentData
 * @returns {Promise<{ studentId: string, pin: string, qrCode: string }>}
 */
export const createStudentAccount = async (teacherId, studentData) => {
  try {
    const studentRef = doc(collection(db, 'studentProfiles'));
    const studentId = studentRef.id;
    
    // Generate and save PIN
    const pin = await generatePIN();
    await setDoc(doc(db, 'pins', pin), { studentId, createdAt: serverTimestamp(), active: true });
    
    // Create Profile
    const profile = {
      userId: studentId,
      studentId: studentId,
      teacherId,
      ...studentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(studentRef, profile);
    
    // Update teacher's managedStudents list
    await setDoc(doc(db, 'users', teacherId), {
      managedStudents: { [studentId]: true }
    }, { merge: true });

    // Generate QR
    const qrCode = await generateQRCode(studentId, pin);
    
    return { studentId, pin, qrCode };
  } catch (e) {
    console.error('Error in createStudentAccount:', e);
    throw e;
  }
};

/**
 * Retrieves all students linked to a teacher, sorted by name.
 * @param {string} teacherId 
 * @returns {Promise<Array>}
 */
export const getTeacherStudents = async (teacherId) => {
  try {
    const q = query(
      collection(db, 'studentProfiles'),
      where('teacherId', '==', teacherId)
    );
    const snap = await getDocs(q);
    const students = snap.docs.map(doc => doc.data());
    return students.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));
  } catch (e) {
    console.error('Error in getTeacherStudents:', e);
    throw e;
  }
};

/**
 * Retrieves aggregated analytics for a teacher's class.
 * @param {string} teacherId 
 * @returns {Promise<Object>}
 */
export const getClassAnalytics = async (teacherId) => {
  try {
    const students = await getTeacherStudents(teacherId);
    let totalAccuracy = 0;
    let studentsWithData = 0;
    const strugglingStudents = [];
    const topPerformers = [];

    for (const st of students) {
      const perfRef = doc(db, 'performanceAnalytics', st.studentId || st.userId);
      const perfSnap = await getDoc(perfRef);
      if (perfSnap.exists()) {
        const perf = perfSnap.data();
        if (perf.avgAccuracy !== undefined) {
          totalAccuracy += perf.avgAccuracy;
          studentsWithData++;
          
          if (perf.avgAccuracy > 85) topPerformers.push({ studentId: st.studentId || st.userId, name: st.firstName, accuracy: perf.avgAccuracy });
          if (perf.avgAccuracy < 60) strugglingStudents.push({ studentId: st.studentId || st.userId, name: st.firstName, accuracy: perf.avgAccuracy });
        }
      }
    }

    return {
      averageAccuracy: studentsWithData > 0 ? Math.round(totalAccuracy / studentsWithData) : 0,
      totalStudents: students.length,
      strugglingStudents: strugglingStudents.sort((a, b) => a.accuracy - b.accuracy),
      topPerformers: topPerformers.sort((a, b) => b.accuracy - a.accuracy)
    };
  } catch (e) {
    console.error('Error in getClassAnalytics:', e);
    throw e;
  }
};

/**
 * Retrieves students filtered by a specific disability type.
 * @param {string} teacherId 
 * @param {string} disabilityType 
 * @returns {Promise<Array>}
 */
export const getStudentsByDisability = async (teacherId, disabilityType) => {
  try {
    const q = query(
      collection(db, 'studentProfiles'),
      where('teacherId', '==', teacherId),
      where('disabilities', 'array-contains', disabilityType)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  } catch (e) {
    console.error('Error in getStudentsByDisability:', e);
    throw e;
  }
};

/**
 * Assigns a lesson to a specific student and creates an assignment notification.
 * @param {string} teacherId 
 * @param {string} studentId 
 * @param {string} lessonId 
 * @param {string|null} deadline 
 * @returns {Promise<void>}
 */
export const assignLessonToStudent = async (teacherId, studentId, lessonId, deadline = null) => {
  try {
    await addDoc(collection(db, 'assignments'), {
      teacherId,
      studentId,
      lessonId,
      deadline,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    await addDoc(collection(db, 'notifications', studentId, 'items'), {
      type: 'assignment',
      title: 'New Assignment',
      body: 'Your teacher has assigned a new lesson for you.',
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error('Error in assignLessonToStudent:', e);
    throw e;
  }
};

/**
 * Assigns a lesson to all students of a teacher.
 * @param {string} teacherId 
 * @param {string} lessonId 
 * @param {string|null} deadline 
 * @returns {Promise<void>}
 */
export const assignLessonToClass = async (teacherId, lessonId, deadline = null) => {
  try {
    const students = await getTeacherStudents(teacherId);
    const promises = students.map(st => assignLessonToStudent(teacherId, st.studentId || st.userId, lessonId, deadline));
    await Promise.allSettled(promises);
  } catch (e) {
    console.error('Error in assignLessonToClass:', e);
    throw e;
  }
};

/**
 * Retrieves overall progress status for entire class.
 * @param {string} teacherId 
 * @returns {Promise<Array>}
 */
export const getClassProgress = async (teacherId) => {
  try {
    const students = await getTeacherStudents(teacherId);
    const classProgress = [];

    for (const st of students) {
      const q = query(collection(db, 'studentProgress', st.studentId || st.userId, 'lessons'));
      const lsSnap = await getDocs(q);
      const lessons = lsSnap.docs.map(d => d.data());
      const completed = lessons.filter(l => l.completed).length;

      const userRef = doc(db, 'users', st.studentId || st.userId);
      const userSnap = await getDoc(userRef);
      const lastLogin = userSnap.exists() ? userSnap.data().lastLogin : null;

      classProgress.push({
        studentId: st.studentId || st.userId,
        name: st.firstName,
        progressPercent: completed > 0 ? Math.round((completed / 10) * 100) : 0, 
        lastActive: lastLogin,
        status: completed > 0 ? 'Active' : 'Not Started'
      });
    }
    return classProgress;
  } catch (e) {
    console.error('Error in getClassProgress:', e);
    throw e;
  }
};

/**
 * Teacher updating a student's profile manually.
 * (Mapped from requested updateStudentProfile to avoid shadowing existing)
 * @param {string} teacherId 
 * @param {string} studentId 
 * @param {Object} updates 
 * @returns {Promise<void>}
 */
export const updateStudentProfileByTeacher = async (teacherId, studentId, updates) => {
  try {
    const profileRef = doc(db, 'studentProfiles', studentId);
    const snap = await getDoc(profileRef);
    if (snap.exists() && snap.data().teacherId === teacherId) {
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } else {
      throw new Error('Unauthorized or student not found');
    }
  } catch (e) {
    console.error('Error in updateStudentProfileByTeacher:', e);
    throw e;
  }
};

/**
 * Regenerates a child's PIN securely by the teacher.
 * @param {string} teacherId 
 * @param {string} studentId 
 * @returns {Promise<{ newPin: string, qrCode: string }>}
 */
export const regenerateStudentPIN = async (teacherId, studentId) => {
  try {
    const profileRef = doc(db, 'studentProfiles', studentId);
    const snap = await getDoc(profileRef);
    if (!snap.exists() || snap.data().teacherId !== teacherId) {
       throw new Error('Unauthorized or student not found');
    }
    
    const newPin = await doRegeneratePIN(studentId);
    const qrCode = await generateQRCode(studentId, newPin);

    return { newPin, qrCode };
  } catch (e) {
    console.error('Error in regenerateStudentPIN:', e);
    throw e;
  }
};
