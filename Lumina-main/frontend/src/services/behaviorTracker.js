import { logBehavior } from './firestoreService.js';

// In-memory session state
let _sessionBuffer = [];
let _autoSaveInterval = null;

// ==================== LEO ADAPTIVE TRACKING ====================
// Tracks patterns specific to Leo's adaptive response system
let _leoState = {
  startTime: Date.now(),
  lastInteractionTime: Date.now(),
  idleThreshold: 8000,
  hesitationThreshold: 3000,
  errors: [],
  hesitations: [],
};

/**
 * Initialize Leo behavior tracking
 */
export const initLeoTracking = () => {
  _leoState = {
    startTime: Date.now(),
    lastInteractionTime: Date.now(),
    idleThreshold: 8000,
    hesitationThreshold: 3000,
    errors: [],
    hesitations: [],
  };
};

/**
 * Log an error for Leo to detect patterns
 */
export const logLeoError = (errorType, context = {}) => {
  _leoState.errors.push({
    type: errorType,
    timestamp: Date.now(),
    context,
  });

  // Check for repeated errors (same type within 10 seconds)
  const recentErrors = _leoState.errors.filter(
    (e) => Date.now() - e.timestamp < 10000
  );
  return recentErrors.length >= 2;
};

/**
 * Detect hesitation (long thinking time)
 */
export const detectHesitation = () => {
  const timeSinceLast = Date.now() - _leoState.lastInteractionTime;
  if (timeSinceLast > _leoState.hesitationThreshold) {
    _leoState.hesitations.push({
      timestamp: Date.now(),
      duration: timeSinceLast,
    });
    return true;
  }
  return false;
};

/**
 * Update last interaction time
 */
export const updateLeoInteraction = () => {
  _leoState.lastInteractionTime = Date.now();
};

/**
 * Get Leo behavior state for API call
 */
export const getLeoAdaptiveState = () => {
  const now = Date.now();
  const timeSinceLast = now - _leoState.lastInteractionTime;
  const recentErrors = _leoState.errors.filter((e) => now - e.timestamp < 10000);
  const timeOnTask = now - _leoState.startTime;

  return {
    is_idle: timeSinceLast > _leoState.idleThreshold,
    is_hesitating: timeSinceLast > _leoState.hesitationThreshold,
    time_since_last_action_ms: timeSinceLast,
    time_on_task_ms: timeOnTask,
    recent_error_count: recentErrors.length,
    confidence_level: calculateLeoConfidence(),
    engagement: recentErrors.length > 3 ? "struggling" : timeOnTask > 60000 ? "engaged" : "exploring",
  };
};

/**
 * Calculate confidence (0-1 scale)
 */
const calculateLeoConfidence = () => {
  if (_leoState.errors.length === 0) return 0.8;
  const recentErrors = _leoState.errors.filter(
    (e) => Date.now() - e.timestamp < 30000
  );
  if (recentErrors.length > 3) return 0.3;
  if (recentErrors.length > 1) return 0.5;
  return 0.8;
};

// ==================== END LEO ADAPTIVE TRACKING ====================

/**
 * Starts a new tracking session for a student.
 * @param {string} studentId - The student's ID
 * @returns {{ sessionId: string, startTime: number }} Session metadata
 */
export const startSession = (studentId) => {
  try {
    const sessionId = `session_${studentId}_${Date.now()}`;
    _sessionBuffer = [];
    console.log(`[BehaviorTracker] Session started: ${sessionId}`);
    return { sessionId, startTime: Date.now() };
  } catch (err) {
    console.error('Error in startSession:', err);
    throw err;
  }
};

/**
 * Ends an active session and flushes all buffered logs to Firestore.
 * @param {string} sessionId - The session ID to end
 * @param {string} studentId - The student's ID
 * @param {Object} summaryData - Summary data for the session (e.g. total time, activities)
 * @returns {Promise<void>}
 */
export const endSession = async (sessionId, studentId, summaryData) => {
  try {
    // Stop auto-save
    if (_autoSaveInterval) {
      clearInterval(_autoSaveInterval);
      _autoSaveInterval = null;
    }

    // Flush remaining buffer
    if (_sessionBuffer.length > 0) {
      await logBehavior(studentId, sessionId, {
        events: [..._sessionBuffer],
        type: 'batch'
      });
      _sessionBuffer = [];
    }

    // Log session end summary
    await logBehavior(studentId, sessionId, {
      type: 'session_end',
      endTime: Date.now(),
      ...summaryData
    });

    console.log(`[BehaviorTracker] Session ended: ${sessionId}`);
  } catch (err) {
    console.error('Error in endSession:', err);
    throw err;
  }
};

/**
 * Records a focus break event (e.g. student tabbed away or went idle).
 * @param {string} sessionId - The active session ID
 * @returns {void}
 */
export const trackFocusBreak = (sessionId) => {
  try {
    _sessionBuffer.push({
      type: 'focus_break',
      sessionId,
      timestamp: Date.now()
    });
    console.log(`[BehaviorTracker] Focus break recorded in session: ${sessionId}`);
  } catch (err) {
    console.error('Error in trackFocusBreak:', err);
  }
};

/**
 * Records a generic interaction event.
 * @param {string} sessionId - The active session ID
 * @param {string} interactionType - The type of interaction (e.g. 'click', 'scroll', 'hover')
 * @returns {void}
 */
export const trackInteraction = (sessionId, interactionType) => {
  try {
    _sessionBuffer.push({
      type: 'interaction',
      interactionType,
      sessionId,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Error in trackInteraction:', err);
  }
};

/**
 * Records the start of an activity (lesson, game, assessment, etc.).
 * @param {string} sessionId - The active session ID
 * @param {string} activityType - Type of activity (e.g. 'lesson', 'game', 'assessment')
 * @param {string} activityId - The ID of the activity
 * @returns {void}
 */
export const trackActivityStart = (sessionId, activityType, activityId) => {
  try {
    _sessionBuffer.push({
      type: 'activity_start',
      activityType,
      activityId,
      sessionId,
      timestamp: Date.now()
    });
    console.log(`[BehaviorTracker] Activity started: ${activityType} (${activityId})`);
  } catch (err) {
    console.error('Error in trackActivityStart:', err);
  }
};

/**
 * Records the end of an activity, including score and accuracy.
 * @param {string} sessionId - The active session ID
 * @param {string} activityId - The ID of the activity
 * @param {number} score - The score achieved
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @returns {void}
 */
export const trackActivityEnd = (sessionId, activityId, score, accuracy) => {
  try {
    _sessionBuffer.push({
      type: 'activity_end',
      activityId,
      score,
      accuracy,
      sessionId,
      timestamp: Date.now()
    });
    console.log(`[BehaviorTracker] Activity ended: ${activityId} — Score: ${score}, Accuracy: ${accuracy}%`);
  } catch (err) {
    console.error('Error in trackActivityEnd:', err);
  }
};

/**
 * Initializes automatic periodic saving of buffered behavior logs to Firestore.
 * Flushes every 60 seconds.
 * @param {string} studentId - The student's ID
 * @param {string} sessionId - The active session ID
 * @returns {void}
 */
export const initAutoSave = (studentId, sessionId) => {
  try {
    // Clear any existing interval
    if (_autoSaveInterval) {
      clearInterval(_autoSaveInterval);
    }

    _autoSaveInterval = setInterval(async () => {
      if (_sessionBuffer.length > 0) {
        try {
          const eventsToFlush = [..._sessionBuffer];
          _sessionBuffer = [];
          await logBehavior(studentId, sessionId, {
            events: eventsToFlush,
            type: 'auto_save_batch'
          });
          console.log(`[BehaviorTracker] Auto-saved ${eventsToFlush.length} events`);
        } catch (flushErr) {
          console.error('Error during auto-save flush:', flushErr);
          // Put events back so they aren't lost
          _sessionBuffer.unshift(..._sessionBuffer);
        }
      }
    }, 60000); // 60 seconds

    console.log(`[BehaviorTracker] Auto-save initialized for session: ${sessionId}`);
  } catch (err) {
    console.error('Error in initAutoSave:', err);
  }
};
