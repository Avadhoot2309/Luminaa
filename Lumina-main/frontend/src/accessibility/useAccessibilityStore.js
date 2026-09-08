import { useState, useCallback } from 'react';

/**
 * Accessibility presets for the Lumina platform.
 */
const PRESETS = {
  dyslexia: {
    name: 'Dyslexia Mode',
    settings: {
      fontFamily: 'OpenDyslexic',
      backgroundColor: '#FFF9E5', // Cream
      lineSpacing: '1.5',
      audioSupport: true,
    }
  },
  adhd: {
    name: 'ADHD Mode',
    settings: {
      sessionLength: 10,
      breakReminders: true,
      focusMode: true,
      microRewards: true,
    }
  },
  blind: {
    name: 'Blind / VI Mode',
    settings: {
      highContrast: true,
      fontSize: 'large',
      screenReaderOptimized: true,
      audioFirst: true,
    }
  },
  autism: {
    name: 'Low Sensory Mode',
    settings: {
      motionReduction: true,
      mutedColors: true,
      simplifiedLayout: true,
      predictableNavigation: true,
    }
  }
};

/**
 * A basic accessibility store hook.
 * In a real app, this would probably use Context or a state management library.
 */
export const useAccessibilityStore = () => {
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = useCallback((key) => {
    console.log(`Applying accessibility preset: ${key}`, PRESETS[key]);
    setActivePreset(key);
    
    // For the demo, we can toggle some classes on the body
    document.body.className = ''; // Reset
    if (key) {
      document.body.classList.add(`acc-mode-${key}`);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    console.log('Resetting accessibility defaults');
    setActivePreset(null);
    document.body.className = '';
  }, []);

  return {
    activePreset,
    applyPreset,
    resetToDefaults,
  };
};
