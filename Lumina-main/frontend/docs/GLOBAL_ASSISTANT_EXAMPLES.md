# Global Assistant Integration Examples

## Quick Start - Add Victory Celebration to a Game

### Before (Without Assistant)

```jsx
// src/pages/games/ExampleGame.jsx
export default function ExampleGame() {
  const [score, setScore] = useState(0);

  const handleGameComplete = () => {
    setScore(prevScore => prevScore + 100);
    // Game ends, but no celebration or feedback to student
  };

  return <div>{/* game UI */}</div>;
}
```

### After (With Assistant)

```jsx
// src/pages/games/ExampleGame.jsx
import { useGameVictory } from '../../hooks/useGameVictory';  // ← Add this import

export default function ExampleGame() {
  const [score, setScore] = useState(0);
  const { celebrateWin, encourageRetry } = useGameVictory();  // ← Add this hook

  const handleGameComplete = () => {
    setScore(prevScore => prevScore + 100);
    // ← Add celebration (1 line!)
    celebrateWin(`Incredible! You scored ${score + 100} points!`);
  };

  const handleGameFailed = () => {
    // ← Add encouragement (1 line!)
    encourageRetry('Almost there! You can do it!');
  };

  return (
    <div>
      {/* game UI */}
      <button onClick={handleGameComplete}>Finish</button>
      <button onClick={handleGameFailed}>Retry</button>
    </div>
  );
}
```

---

## Real-World Example 1: Integrating with MemoryMatch

### Complete Integration

```jsx
// src/pages/games/MemoryMatch.jsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GameContainer from '../../components/games/GameContainer';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useGameVictory } from '../../hooks/useGameVictory';  // ← NEW

export default function MemoryMatch() {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const { playSuccess, playError, playClick, playVictory } = useSoundEffects();
  const { celebrateWin } = useGameVictory();  // ← NEW
  const [score, setScore] = useState(0);

  // ... existing code ...

  const GameComponent = () => {
    const containerRef = useRef(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const config = { /* ... phaser config ... */ };
      const game = new Phaser.Game(config);

      let gameComplete = false;

      function create() {
        // ... setup code ...

        // When all pairs are matched:
        this.events.on('victory', () => {
          if (!gameComplete) {
            gameComplete = true;
            playVictory();  // ← Play sound effect
            
            // ← NEW: Celebrate with Assistant!
            celebrateWin(
              `You matched all pairs! Final Score: ${score + 500}`
            );
            
            setScore(s => s + 500);
          }
        });
      }

      return () => game.destroy(true);
    }, [score, celebrateWin]);  // ← Add celebrateWin to dependencies

    return <div ref={containerRef} />;
  };

  return (
    <GameContainer
      title={t('games.memory_match')}
      gameSource={<GameComponent />}
    />
  );
}
```

---

## Real-World Example 2: React Component Game (No Phaser)

### Simple Quiz with Celebrations

```jsx
// src/pages/games/SimpleQuiz.jsx
import React, { useState } from 'react';
import { useGameVictory } from '../../hooks/useGameVictory';
import { useAssistantHints } from '../../hooks/useGameVictory';

export default function SimpleQuiz() {
  const { celebrateWin, encourageRetry } = useGameVictory();
  const hints = useAssistantHints('reading');
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const questions = [
    { text: 'What is 2+2?', options: ['3', '4', '5'], correct: '4' },
    { text: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin'], correct: 'Paris' },
  ];

  const handleAnswer = (answer) => {
    const isCorrect = answer === questions[questionIndex].correct;

    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      celebrateWin(`Correct! ${Math.random() > 0.5 ? 'Nice work!' : 'Fantastic!'}`);

      // Move to next question or end game
      if (questionIndex + 1 < questions.length) {
        setTimeout(() => setQuestionIndex(q => q + 1), 2000);
      } else {
        celebrateWin(`Quiz Complete! Final Score: ${newScore}`);
      }
    } else {
      encourageRetry('Try again! You\'ll get it!');
    }
  };

  const handleHintClick = () => {
    setShowHint(!showHint);
    if (!showHint) {
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      alert(randomHint); // Or use assistant voice
    }
  };

  return (
    <div>
      <h2>Question {questionIndex + 1}/{questions.length}</h2>
      <p>{questions[questionIndex].text}</p>
      
      {questions[questionIndex].options.map(option => (
        <button key={option} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
      
      <button onClick={handleHintClick}>💡 Get Hint</button>
      <p>Score: {score}</p>
    </div>
  );
}
```

---

## Real-World Example 3: Phaser Game with Ref Pattern

### For Complex Phaser Games (Like MathRace)

```jsx
// src/pages/games/ComplexPhaserGame.jsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useGameVictory } from '../../hooks/useGameVictory';

export default function ComplexPhaserGame() {
  const { celebrateWin } = useGameVictory();
  
  // Store function references for access inside Phaser scenes
  const gameFunctionsRef = useRef({ celebrateWin });

  useEffect(() => {
    gameFunctionsRef.current = { celebrateWin };
  }, [celebrateWin]);

  useEffect(() => {
    const config = {
      scene: {
        create: (scene) => {
          let finalScore = 0;

          // Your game logic here
          scene.events.on('complete', (score) => {
            finalScore = score;
            // Call celebrateWin from inside Phaser scene
            gameFunctionsRef.current.celebrateWin(
              `Game Complete! Score: ${score}`
            );
          });
        }
      }
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div id="game-container" />;
}
```

---

## Real-World Example 4: Progressive Celebration

### Celebrate Milestones During Game

```jsx
// src/pages/games/MilestoneGame.jsx
import React, { useState, useEffect } from 'react';
import { useGameVictory } from '../../hooks/useGameVictory';

export default function MilestoneGame() {
  const { celebrateProgress, celebrateWin } = useGameVictory();
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  // Celebrate level completion
  useEffect(() => {
    if (level > 1 && level <= 5) {
      celebrateProgress(`Level ${level - 1} completed! Level ${level} unlocked!`);
    }
  }, [level, celebrateProgress]);

  // Celebrate game completion
  useEffect(() => {
    if (level > 5) {
      celebrateWin(`All 5 levels completed! You're a master! 🏆`);
    }
  }, [level, celebrateWin]);

  return (
    <div>
      <h2>Level {level}/5</h2>
      <button onClick={() => setLevel(l => l + 1)}>
        Complete Level
      </button>
      <p>Score: {totalScore}</p>
    </div>
  );
}
```

---

## Integration Checklist for Each Game

### ✅ Checklist

- [ ] Import `useGameVictory` at top
- [ ] Destructure `celebrateWin`, `encourageRetry`, or `celebrateProgress`
- [ ] Call celebration function on game completion
- [ ] Pass appropriate message (include score if relevant)
- [ ] Add hook to dependency array if using Phaser refs
- [ ] Test on desktop and mobile
- [ ] Test with accessibility profile (ASD/ADHD)
- [ ] Verify TTS works with your game's audio

### 🎯 Common Messages

**Victory:**
```jsx
celebrateWin(`Level Complete! Score: ${score}`)
celebrateWin(`Puzzle Solved! Amazing!`)
celebrateWin(`Perfect Match! Well Done!`)
```

**Encouragement:**
```jsx
encourageRetry(`Almost there! Try one more time!`)
encourageRetry(`You're close! Keep going!`)
encourageRetry(`Let's try that again!`)
```

**Progress:**
```jsx
celebrateProgress(`Great progress! Level ${level} unlocked!`)
celebrateProgress(`You're getting better at this!`)
celebrateProgress(`Keep it up! You're amazing!`)
```

---

## Testing the Integration

### Manual Testing

1. **Start Game**: Open any game in browser
2. **Complete Game**: Finish successfully
   - ✅ Confetti should appear (unless accessibility mode)
   - ✅ Character should bounce
   - ✅ Voice should play celebration
3. **Test Hesitation**: Don't click for 45+ seconds
   - ✅ Hint bubble appears (unless accessibility mode)
   - ✅ Voice says "Do you need a little hint?"
4. **Test Sleep Mode**: Click sleep button
   - ✅ Assistant minimizes to 💤
   - ✅ No hesitation detection occurs
5. **Test Accessibility**: Create profile with ASD/ADHD
   - ✅ No confetti on victory
   - ✅ No auto-hint pop-up
   - ✅ Volume is lower
   - ✅ Accessibility badge visible

### Automated Testing (Future)

```jsx
// Example Jest test
import { render, waitFor } from '@testing-library/react';
import { useGameVictory } from '../hooks/useGameVictory';

test('celebrateWin triggers victory celebration', async () => {
  const { celebrateWin } = useGameVictory();
  
  celebrateWin('Test Message');
  
  await waitFor(() => {
    // Verify confetti was called
    // Verify TTS was called
    // Verify animation triggered
  });
});
```

---

## Migration Guide: Adding to Existing Games

### Step 1: Add Import
```jsx
// At top of file
import { useGameVictory } from '../../hooks/useGameVictory';
```

### Step 2: Add Hook
```jsx
// In component body
const { celebrateWin } = useGameVictory();
```

### Step 3: Add Celebration
```jsx
// In completion handler
celebrateWin(`You won! Score: ${score}`);
```

### Step 4: Update Dependencies
```jsx
useEffect(() => {
  // ... your code ...
  return () => cleanup();
}, [celebrateWin]); // ← Add here if using Phaser
```

That's it! 3-4 lines of code to add celebration. 🎉

---

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| TTS plays but sounds robotic | Lower rate to 0.85-0.9 |
| Confetti blocks game UI | Already positioned fixed, shouldn't overlap |
| Celebration doesn't trigger | Check if ProfileProvider wraps app, check console errors |
| Voice too loud/quiet | It auto-adjusts for accessibility, verify profile disabilities |
| Phaser scene refs error | Use `useRef` and `useEffect` pattern from Example 3 |
| Mobile not working | Check touch events are detected (they are by default) |

---

## Advanced: Custom Voice Configuration

```jsx
import { useLearningAssistant } from '../contexts/LearningAssistantContext';
import ttsService from '../services/ttsService';

export const useCustomVoiceVictory = () => {
  const { celebrateVictory } = useLearningAssistant();

  return (message, options = {}) => {
    const defaults = {
      rate: 0.85,  // Slower
      pitch: 1.3,  // Higher
      ...options
    };

    ttsService.speak(message, defaults);
    celebrateVictory(message);
  };
};
```

---

## Advanced: Conditional Celebrations

```jsx
import { useProfile } from '../contexts/ProfileContext';
import { useGameVictory } from '../hooks/useGameVictory';

export const usePropulationalCelebration = () => {
  const { profile } = useProfile();
  const { celebrateWin } = useGameVictory();

  return (score) => {
    let message = '';

    if (score < 50) {
      message = 'Good effort! Keep practicing!';
    } else if (score < 80) {
      message = 'Great work! You\'re getting better!';
    } else if (score < 100) {
      message = 'Fantastic! Almost perfect!';
    } else {
      message = 'Perfect score! You\'re a champion! 🏆';
    }

    celebrateWin(message);
  };
};
```

Perfect! Now you have complete integration patterns. 🎉
