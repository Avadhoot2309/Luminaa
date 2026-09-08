/**
 * src/services/adaptiveEngine.js
 * Student Profile to UI Body Data Transformation Engine 
 * Handles accessibility injection based on individual student needs
 */

const adaptiveEngine = {
  /**
   * Apply accessibility themes globally via data-attributes on <body>
   * @param {Object} profile - Firestore student record
   */
  applyStudentProfile: (profile = {}) => {
    if (!profile) return;

    const { traits = {} } = profile;
    const body = document.body;

    // Define Boolean Flags from Profile Traits
    const isHighContrast = !!traits.highContrast || traits.impairment === 'visual';
    const isDyslexia = !!traits.dyslexia || traits.learningStyle === 'dyslexic';
    const isADHD = !!traits.adhd || traits.focusMode === 'high';

    // 1. High Contrast Switch [data-hc="true"]
    body.setAttribute('data-hc', isHighContrast ? 'true' : 'false');

    // 2. Dyslexia Mode Switch [data-dyslexia="true"]
    body.setAttribute('data-dyslexia', isDyslexia ? 'true' : 'false');

    // 3. ADHD / Focus Mode Switch [data-adhd="true"]
    body.setAttribute('data-adhd', isADHD ? 'true' : 'false');

    // Return the config for component-level adjustments (e.g., TTS rate)
    return {
      isHighContrast,
      isDyslexia,
      isADHD,
      ttsRate: isADHD ? 0.8 : 1.0,
      pitch: 1.1
    };
  }
};

export default adaptiveEngine;
