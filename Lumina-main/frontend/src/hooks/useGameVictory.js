import { useLearningAssistant } from '../contexts/LearningAssistantContext';

/**
 * useGameVictory Hook
 * 
 * Simplifies victory celebration integration in games
 * 
 * Usage:
 * const { celebrateWin } = useGameVictory();
 * 
 * // In your game completion logic:
 * celebrateWin('You completed the puzzle! Amazing!');
 */
export const useGameVictory = () => {
    const { celebrateVictory, triggerEncouragement } = useLearningAssistant();

    return {
        celebrateWin: (message = 'Congratulations! You did it!') => {
            celebrateVictory(message);
        },
        encourageRetry: (message = "You're doing great! Let's try again!") => {
            triggerEncouragement(message);
        },
        celebrateProgress: (message = 'Great progress! Keep going!') => {
            triggerEncouragement(message);
        },
    };
};

/**
 * useAssistantHints Hook
 * 
 * Provides contextual hints for different activities
 * 
 * Usage:
 * const hints = useAssistantHints('math');
 * // Returns array of math-specific hints
 */
export const useAssistantHints = (category = 'general') => {
    const hints = {
        math: [
            'Check if your numbers add up correctly',
            'Try breaking down the problem into smaller parts',
            'Look at the question again carefully',
            'Double-check your calculation',
            'Remember to follow the order of operations',
        ],
        reading: [
            'Read the question one more time carefully',
            'Think about what the text means',
            'Look for clues in the passage',
            'Read more slowly and focus on each word',
        ],
        phonetics: [
            'Listen carefully to the sound',
            'Break the word into syllables',
            'Say each sound out loud',
            'Think about words that sound similar',
        ],
        general: [
            'Take a deep breath and try again',
            'Look at the example carefully',
            'You can do this!',
            'No rush—I believe in you!',
        ],
    };

    return hints[category] || hints.general;
};

export default useGameVictory;
