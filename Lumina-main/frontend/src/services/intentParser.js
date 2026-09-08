/**
 * INTENT PARSER
 * Parses user voice input and extracts actionable intents
 * Uses Claude API to understand natural language commands
 */

/**
 * Intent types Leo can recognize
 */
export const INTENT_TYPES = {
    NAVIGATE_LESSON: 'navigate_lesson',
    NAVIGATE_SUBJECT: 'navigate_subject',
    NAVIGATE_CHAPTER: 'navigate_chapter',
    NEXT_LESSON: 'next_lesson',
    PREVIOUS_LESSON: 'previous_lesson',
    SHOW_PROGRESS: 'show_progress',
    SHOW_SUBJECTS: 'show_subjects',
    PLAY_GAME: 'play_game',
    NAVIGATE_FEATURE: 'navigate_feature',
    HELP: 'help',
    REPEAT: 'repeat',
    UNKNOWN: 'unknown',
};

/**
 * Parse user input with Claude
 * Returns: { intent, target, confidence, explanation }
 */
export const parseUserIntent = async (userInput, context = {}) => {
    const prompt = buildIntentPrompt(userInput, context);

    try {
        // Call backend to parse intent with Claude
        const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/leo/parse-intent`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_input: userInput,
                    context,
                }),
            }
        );

        if (!response.ok) {
            console.error('[intentParser] Parse failed:', response.status);
            return parseIntentFallback(userInput);
        }

        const result = await response.json();
        console.log('[intentParser] Parsed intent:', result);

        return result;
    } catch (error) {
        console.error('[intentParser] Error:', error);
        return parseIntentFallback(userInput);
    }
};

/**
 * Fallback intent parsing (no Claude call)
 * Uses pattern matching for common commands
 */
export const parseIntentFallback = (userInput) => {
    const input = userInput.toLowerCase();

    // Next lesson
    if (input.match(/next|forward|continue|skip/)) {
        return {
            intent: INTENT_TYPES.NEXT_LESSON,
            confidence: 0.8,
            explanation: 'User wants to go to the next lesson',
        };
    }

    // Previous lesson
    if (input.match(/previous|back|go back|last|undo/)) {
        return {
            intent: INTENT_TYPES.PREVIOUS_LESSON,
            confidence: 0.8,
            explanation: 'User wants to go to the previous lesson',
        };
    }

    // Show progress
    if (input.match(/progress|score|how.*doing|my.*score|performance/)) {
        return {
            intent: INTENT_TYPES.SHOW_PROGRESS,
            confidence: 0.8,
            explanation: 'User wants to see their progress',
        };
    }

    // Show subjects
    if (input.match(/subjects|what.*learn|available|all.*lessons|categories/)) {
        return {
            intent: INTENT_TYPES.SHOW_SUBJECTS,
            confidence: 0.7,
            explanation: 'User wants to see available subjects',
        };
    }

    // Help
    if (input.match(/help|what can you do|assist|commands/)) {
        return {
            intent: INTENT_TYPES.HELP,
            confidence: 0.9,
            explanation: 'User is asking for help',
        };
    }

    // Global Feature Navigation
    if (input.match(/login|onboarding|registration|teacher|console|admin|home/)) {
        return {
            intent: INTENT_TYPES.NAVIGATE_FEATURE,
            target: input.includes('teacher') || input.includes('admin') || input.includes('console') 
                    ? 'teacher-dashboard' 
                    : input.includes('login') ? 'login' : 'home',
            confidence: 0.8,
            explanation: 'User wants to go to a app feature',
        };
    }

    // Play game
    if (input.match(/game|play|fun|game.*time/)) {
        return {
            intent: INTENT_TYPES.PLAY_GAME,
            confidence: 0.7,
            explanation: 'User wants to play a game',
        };
    }

    // Navigate to lesson (by name)
    if (input.match(/go.*lesson|take.*lesson|start.*lesson|lesson.*about|tell.*lesson/)) {
        return {
            intent: INTENT_TYPES.NAVIGATE_LESSON,
            target: userInput, // Will need to search for lesson
            confidence: 0.6,
            explanation: 'User wants to go to a specific lesson',
        };
    }

    // Navigate to subject (by name)
    if (
        input.match(/math|science|english|evs|hindi|go.*subject|study/) ||
        input.match(/learn about|teach me/)
    ) {
        return {
            intent: INTENT_TYPES.NAVIGATE_SUBJECT,
            target: userInput,
            confidence: 0.6,
            explanation: 'User wants to go to a subject',
        };
    }

    // Repeat
    if (input.match(/repeat|again|say again|replay/)) {
        return {
            intent: INTENT_TYPES.REPEAT,
            confidence: 0.9,
            explanation: 'User wants to repeat',
        };
    }

    // Unknown
    return {
        intent: INTENT_TYPES.UNKNOWN,
        confidence: 0.3,
        explanation: 'Could not determine user intent',
    };
};

/**
 * Build prompt for Claude to parse intent
 */
const buildIntentPrompt = (userInput, context) => {
    const contextStr = context.currentLesson
        ? `Current lesson: ${context.currentLesson}`
        : 'No current lesson context';

    return `Parse this user voice command and extract the intent.

User said: "${userInput}"
Context: ${contextStr}

Available intent types:
- NAVIGATE_LESSON: User wants to go to a specific lesson
- NAVIGATE_SUBJECT: User wants to go to a subject (math, science, etc)
- NAVIGATE_CHAPTER: User wants to go to a chapter
- NEXT_LESSON: Go to next lesson
- PREVIOUS_LESSON: Go to previous lesson
- SHOW_PROGRESS: Show student progress
- SHOW_SUBJECTS: Show all subjects
- NAVIGATE_FEATURE: Navigate to a global app feature (login, home, teacher-dashboard)
- PLAY_GAME: Play a game
- HELP: Ask for help
- REPEAT: Repeat the last thing
- UNKNOWN: Cannot determine intent

Return JSON only:
{
  "intent": "INTENT_TYPE_HERE",
  "target": "specific_target_if_any",
  "confidence": 0.0-1.0,
  "explanation": "brief explanation"
}`;
};

/**
 * Validate parsed intent
 */
export const validateIntent = (intent) => {
    if (!intent) return false;

    const validIntents = Object.values(INTENT_TYPES);
    return (
        validIntents.includes(intent.intent) &&
        intent.confidence !== undefined &&
        typeof intent.confidence === 'number'
    );
};

export default {
    INTENT_TYPES,
    parseUserIntent,
    parseIntentFallback,
    validateIntent,
};
