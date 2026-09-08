# Global AI Learning Assistant - Integration Guide

## Overview

The Global AI Learning Assistant is a context-aware, persistent companion that follows students through every page of the Luminaa platform. It provides encouragement, celebrates victories, and respects accessibility needs.

## Architecture

### Components

1. **LearningAssistantContext** (`src/contexts/LearningAssistantContext.jsx`)
   - Manages global assistant state
   - Tracks user inactivity (hesitation detection)
   - Handles victory celebrations
   - Manages sleep mode

2. **GlobalAssistant** (`src/components/GlobalAssistant.jsx`)
   - Renders the persistent character UI
   - Displays hint bubbles on hesitation (45+ seconds inactivity)
   - Triggers victory celebrations with confetti
   - Integrates with ttsService for voice feedback
   - Respects accessibility settings (ASD/ADHD)

3. **useGameVictory Hook** (`src/hooks/useGameVictory.js`)
   - Simplified API for games to trigger celebrations
   - Provides contextual encouragement messages

## Features

### 1. Hesitation Detection ⏱️

- **Trigger**: 45 seconds of inactivity (no clicks, key presses, or touches)
- **Action**: Assistant softly suggests help via voice + hint bubble
- **Safe for Accessibility**: Disabled for users with ASD/ADHD (sensory protection)
- **Example**: "Do you need a little hint?"

### 2. Victory Celebrations 🎉

- **Trigger**: Game/activity completion
- **Actions**:
  - Voice celebration with warm, encouraging tone
  - Confetti animation (disabled for accessibility users)
  - Character bounce animation
- **Example**: `celebrateVictory("You did it! Amazing job!")`

### 3. Warm Voice Integration 🎤

- **Pitch**: 1.2 (higher, friendlier)
- **Rate**: 0.9 (slower, more natural)
- **Voice**: Female English voice preferred
- **Volume**: Reduced by 50% for ASD/ADHD users

### 4. Accessibility Safety 🛡️

For students with **Autism (ASD)** or **ADHD**:
- ❌ No sudden pop-ups (hint bubble disabled)
- ❌ No confetti animations
- ❌ Reduced volume (50%)
- ✅ Sleep mode button always visible
- ✅ Accessible badge shows sensory-friendly mode

### 5. Sleep Mode 💤

- Large, easy-to-click button to hide assistant
- Allows sensory breaks
- One click to restore

## Usage Examples

### Example 1: Game Victory Celebration

```jsx
import { useGameVictory } from '../hooks/useGameVictory';

export default function MyGame() {
  const { celebrateWin, encourageRetry } = useGameVictory();

  const handleGameComplete = () => {
    celebrateWin('You solved the puzzle! Fantastic!');
  };

  const handleGameFailed = () => {
    encourageRetry('Almost there! Try one more time!');
  };

  return (
    <div>
      {/* Game UI */}
      <button onClick={handleGameComplete}>Complete Game</button>
      <button onClick={handleGameFailed}>Try Again</button>
    </div>
  );
}
```

### Example 2: Direct Context Usage

```jsx
import { useLearningAssistant } from '../contexts/LearningAssistantContext';

export default function ActivityScreen() {
  const { celebrateVictory, triggerEncouragement } = useLearningAssistant();

  const handleLessonComplete = () => {
    celebrateVictory('Lesson completed! You're amazing!');
  };

  return (
    <div>
      {/* Content */}
      <button onClick={handleLessonComplete}>Finish Lesson</button>
    </div>
  );
}
```

### Example 3: Contextual Hints

```jsx
import { useAssistantHints } from '../hooks/useGameVictory';

export default function MathGame() {
  const hints = useAssistantHints('math');
  // Returns: ['Check if your numbers add up...', 'Try breaking down...', ...]

  return (
    <div>
      {hints.map((hint, i) => <p key={i}>{hint}</p>)}
    </div>
  );
}
```

### Example 4: Integrating with Phaser Games

```jsx
import { useRef, useEffect } from 'react';
import { useGameVictory } from '../hooks/useGameVictory';

export default function PhaserGame() {
  const { celebrateWin } = useGameVictory();
  const soundFunctionsRef = useRef({ celebrateWin });

  useEffect(() => {
    soundFunctionsRef.current = { celebrateWin };
  }, [celebrateWin]);

  useEffect(() => {
    const config = {
      scene: {
        create: (scene) => {
          // In your Phaser scene:
          scene.events.on('complete', () => {
            soundFunctionsRef.current.celebrateWin('Level completed!');
          });
        }
      }
    };
    // ... rest of Phaser setup
  }, []);

  return <div id="phaser-container" />;
}
```

## Integration Checklist

### For Game Developers

- [ ] Import `useGameVictory` hook
- [ ] Call `celebrateWin()` when game completes successfully
- [ ] Call `encourageRetry()` when player makes mistakes
- [ ] Test with accessibility profile (ASD/ADHD) to ensure smooth UX
- [ ] Verify voice feedback works without breaking game audio

### For Page Developers

- [ ] Import `useLearningAssistant` if custom celebrations needed
- [ ] Wrap victory/completion logic with `celebrateVictory()`
- [ ] Test hesitation detection doesn't interfere with page functionality
- [ ] Ensure all interactive elements are clickable (helps inactivity detection)

## Customization

### Modifying Hints

Edit `hints` array in `GlobalAssistant.jsx`:

```jsx
const hints = [
  "Do you need a little hint?",
  "I'm here to help! Want to try again?",
  // Add your custom hints...
];
```

### Modifying Celebration Messages

Edit `celebrations` array in `GlobalAssistant.jsx`:

```jsx
const celebrations = [
  "You did it! Amazing job! 🌟",
  "Wow, you are doing amazing! 🎉",
  // Add your custom messages...
];
```

### Adjusting Hesitation Timeout

In `LearningAssistantContext.jsx`, change the timeout value (currently 45000ms):

```jsx
hesitationTimeoutRef.current = setTimeout(() => {
  setIsHesitating(true);
}, 45000); // Change this value (in milliseconds)
```

### Changing Voice Settings

In `GlobalAssistant.jsx`, modify TTS options:

```jsx
ttsService.speak(message, {
  rate: 0.9,      // 0.1 (slow) to 1.0+ (fast)
  pitch: 1.2,     // 0.5 (low) to 2.0 (high)
  onEnd: callback,
});
```

## Accessibility Features

### For Students with ASD (Autism Spectrum Disorder)

- 🛡️ **Sensory Protection**: No sudden animations or pop-ups
- 🔇 **Reduced Audio**: Volume lowered by 50%
- 🎯 **Predictable**: Assistant stays in fixed location
- ❌ **No Confetti**: Visual stimulation minimized

**Profile Setting**: Ensure `disabilities` includes `'Autism'` or `'ASD'`

### For Students with ADHD

- 📍 **Fixed Position**: No random movements (only in sleep mode area)
- ⏱️ **No Auto Pop-ups**: Hesitation hints disabled
- 🔇 **Reduced Stimulation**: Lower volume, no confetti
- 💤 **Easy Sleep Mode**: Quickly hide if overwhelmed

**Profile Setting**: Ensure `disabilities` includes `'ADHD'`

## Troubleshooting

### Assistant Not Appearing

1. Check that `LearningAssistantProvider` wraps your app in `App.jsx`
2. Verify `GlobalAssistant` component is imported and rendered
3. Check browser console for errors

### Voice Not Playing

1. Verify `ttsService.js` is properly imported
2. Check browser speech synthesis support: `window.speechSynthesis`
3. Ensure user hasn't muted browser audio
4. Check if sleep mode is active

### Hesitation Not Triggering

1. Verify 45+ seconds has passed with zero interactions
2. Check if accessibility mode is enabled (disables auto hints)
3. Confirm sleep mode is off
4. Check if user clicked something (resets hesitation timer)

### Accessibility Mode Not Working

1. Verify profile has `disabilities` array with `'Autism'` or `'ADHD'`
2. Check accessibility badge is visible (⚙️ Accessible)
3. Confirm confetti is not appearing on victories
4. Verify volume is reduced (should sound quieter)

## Browser Compatibility

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (touch support enabled)

## Performance Considerations

- **Memory**: Lightweight (context + CSS animations)
- **CPU**: Minimal during idle (only hint bubble animations)
- **Network**: No external API calls (local synthesis)
- **Battery**: Confetti effect has minimal impact (GPU accelerated)

## Future Enhancements

- [ ] Customizable character avatars (Lottie animations)
- [ ] Multi-language support for voice
- [ ] Integration with Analytics for hesitation patterns
- [ ] Adjustable sensitivity levels
- [ ] Mini-games with assistant interaction
- [ ] Progress celebration milestones
- [ ] Teacher dashboard to configure messages

## API Reference

### useLearningAssistant()

```jsx
const {
  isSleeping,                    // boolean
  isHesitating,                  // boolean
  victoryTrigger,                // { id, message } | null
  encouragementTrigger,          // { id, message } | null
  celebrateVictory,              // (message) => void
  triggerEncouragement,          // (message) => void
  toggleSleepMode,               // () => void
  resetHesitation,               // () => void
} = useLearningAssistant();
```

### useGameVictory()

```jsx
const {
  celebrateWin,                  // (message?) => void
  encourageRetry,                // (message?) => void
  celebrateProgress,             // (message?) => void
} = useGameVictory();
```

## Support

For issues or feature requests, check:
- [LearningAssistantContext.jsx](../contexts/LearningAssistantContext.jsx)
- [GlobalAssistant.jsx](../components/GlobalAssistant.jsx)
- [useGameVictory.js](../hooks/useGameVictory.js)
