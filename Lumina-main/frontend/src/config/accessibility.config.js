/**
 * ACCESSIBILITY CONFIGURATION
 * Disability-specific UI adaptations
 */

export const ACCESSIBILITY_PROFILES = {
  dyslexia: {
    fontFamily: 'OpenDyslexic, sans-serif',
    fontSize: {
      base: 18,
      min: 16,
      max: 48
    },
    lineHeight: 1.8,
    letterSpacing: '0.15em',
    wordSpacing: '0.3em',
    backgroundColor: '#FFFACD',
    textColor: '#2C2C2C',
    highlightColor: '#FFD700',
    audioEnabled: true,
    audioSpeed: 0.9,
    syllableHighlight: true
  },

  adhd: {
    focusMode: true,
    timerEnabled: true,
    defaultSessionDuration: 7,
    breakReminderInterval: 25,
    minimalUI: true,
    quickRewards: true,
    streakCounter: true,
    distractionFilter: true,
    progressBarVisible: true
  },

  low_vision: {
    fontSize: {
      base: 24,
      min: 20,
      max: 64
    },
    highContrast: true,
    colorScheme: 'highContrast',
    zoomEnabled: true,
    zoomLevels: [100, 125, 150, 200, 300],
    audioDescriptions: true,
    cursorHighlight: true,
    screenReaderOptimized: true
  }
};

export default ACCESSIBILITY_PROFILES;
