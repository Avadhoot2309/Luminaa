/**
 * ============================================================================
 * LEO ASSISTANT CONTROLLER (api/leo.js)
 * ============================================================================
 * 
 * Project: Lumina Neurodivergent Learning Platform
 * Role: Main orchestration controller for the "Leo the Tiger" AI Companion.
 * 
 * How it works (for Mentors and Team Members):
 * ----------------------------------------------------------------------------
 * 1. Multimodal Context Aggregation:
 *    - The frontend sends the student's text/voice input, student profile (learning
 *      level, neurodivergent needs), real-time behavioral telemetry (idle state,
 *      hesitations, recent error rate), and a snapshot of current interactive elements.
 * 
 * 2. Adaptive AI Reasoning:
 *    - The controller normalizes the payload and delegates to `callGroq`, which queries
 *      the Llama-3.3-70B model via Groq's low-latency inference engine.
 * 
 * 3. Structured Action Dispatch:
 *    - Rather than returning plain text, the response is a structured JSON schema:
 *      {
 *        action: 'respond' | 'highlight_element' | 'click_element' | 'navigate',
 *        response: 'Spoken and text message for student',
 *        element_id: 'DOM ID of the button or card to emphasize',
 *        ui_changes: { font_size, high_contrast, pacing },
 *        confidence: 0.0 - 1.0
 *      }
 *    - This allows Leo to not just "chat", but actively manipulate and adapt
 *      the user interface to help children with ADHD, Dyslexia, and Autism.
 * ============================================================================
 */

const { callGroq: callClaude } = require('./utils/groqClient');
const { generateContextualPrompt } = require('./utils/leoPrompts');

/**
 * Main Leo Assist Endpoint Handler
 * Route: POST /api/leo-assist
 * 
 * @param {import('express').Request} req - Express request containing:
 *   - user_input: {string} Student's spoken or typed question
 *   - content: {Object} Active lesson content or quiz problem
 *   - student_profile: {Object} Name, neurodivergent traits, age, language
 *   - behavior_state: {Object} Real-time metrics (idle, hesitation, error rate)
 *   - lesson_context: {Object} Active chapter, subject, problem index
 *   - available_elements: {Array} Interactive DOM elements on the student's screen
 * @param {import('express').Response} res - Express response returning the structured AI action
 */
async function handleLeoAssist(req, res) {
    try {
        console.log('[leoController] Processing Leo assist request');

        const {
            user_input = '',
            content = {},
            student_profile = {},
            behavior_state = {},
            lesson_context = {},
            available_elements = [],
        } = req.body;

        // Input validation: ensure student input is non-empty
        if (!user_input || user_input.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'user_input is required and cannot be empty',
            });
        }

        // Normalize student profile with sensible defaults
        const studentProfile = {
            id: student_profile.id || 'anonymous',
            name: student_profile.name || 'Student',
            learning_level: student_profile.learning_level || 'intermediate',
            language: student_profile.language || 'en',
        };

        // Normalize real-time behavioral telemetry
        const behaviorState = {
            is_idle: behavior_state.is_idle || false,
            is_hesitating: behavior_state.is_hesitating || false,
            time_since_last_action_ms: behavior_state.time_since_last_action_ms || 0,
            time_on_task_ms: behavior_state.time_on_task_ms || 0,
            recent_error_count: behavior_state.recent_error_count || 0,
            confidence_level: behavior_state.confidence_level || 0.5,
            engagement: behavior_state.engagement || 'exploring',
            // Interactive elements visible to the child (used for visual guidance)
            available_elements: available_elements || [],
        };

        console.log('[leoController] User:', studentProfile.name);
        console.log('[leoController] Input:', user_input.substring(0, 60));
        console.log('[leoController] Available DOM elements:', behaviorState.available_elements.length);

        // Execute LLM inference via Groq
        const claudeResult = await callClaude(user_input, studentProfile, behaviorState);

        // Graceful error fallback if the LLM fails (ensures child is never stuck)
        if (!claudeResult.success) {
            console.error('[leoController] Groq error:', claudeResult.error);
            return res.status(200).json({
                success: false,
                action: 'error',
                response: 'I had a little trouble hearing you. Can you try saying that again?',
                ui_changes: { color_hint: 'warning' },
            });
        }

        const leoResponse = claudeResult.data;

        // Ensure default fallbacks for required response fields
        if (!leoResponse.response) {
            leoResponse.response = 'Let me help you with that!';
        }

        if (!leoResponse.action) {
            leoResponse.action = 'respond';
        }

        // Assemble clean, typed response payload for the React frontend
        const finalResponse = {
            success: true,
            action: leoResponse.action,
            response: leoResponse.response,
            element_id: leoResponse.element_id || null, // Direct DOM target for highlighting or clicking
            ui_changes: leoResponse.ui_changes || {},     // Visual adaptations (font, contrast, animations)
            next_action: leoResponse.next_action || 'await_input',
            confidence: leoResponse.confidence_in_response || 0.5,
            timestamp: new Date().toISOString(),
        };

        console.log('[leoController] Dispatching Leo action:', finalResponse.action, 'Target Element:', finalResponse.element_id);

        res.status(200).json(finalResponse);
    } catch (error) {
        console.error('[leoController] Unhandled error during assist generation:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error in Leo controller',
            message: error.message,
        });
    }
}

/**
 * Get Hint for Activity
 * Route: POST /api/leo/hint
 * 
 * Provides progressive, scaffolded hints so neurodivergent children
 * are guided gently toward the answer rather than given direct solutions.
 * 
 * @param {import('express').Request} req - Request containing activity_id, attempt_context, student_profile
 * @param {import('express').Response} res - Structured hint response
 */
async function handleGetHint(req, res) {
    try {
        const { activity_id, attempt_context, student_profile, behavior_state } = req.body;

        const hintInput = `I need help with ${activity_id}. ${JSON.stringify(attempt_context)}`;

        const result = await callClaude(
            hintInput,
            student_profile,
            { ...behavior_state, is_hesitating: true }
        );

        if (!result.success) {
            return res.status(200).json({
                success: false,
                action: 'error',
                response: 'I could not generate a hint. Would you like to try again?',
            });
        }

        res.status(200).json({
            success: true,
            ...result.data,
        });
    } catch (error) {
        console.error('[leoController] Hint generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Parse Voice / Text Intent using Groq
 * Route: POST /api/leo/parse-intent
 * 
 * Translates free-form student natural language (e.g., "Take me to math fractions",
 * "I want to play memory match", "Can you explain that again?") into a typed action enum
 * that the frontend actionHandler can execute immediately.
 * 
 * @param {import('express').Request} req - Request containing user_input and current navigation context
 * @param {import('express').Response} res - Parsed intent with confidence score
 */
async function handleParseIntent(req, res) {
    try {
        const { user_input = '', context = {} } = req.body;

        if (!user_input || user_input.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'user_input is required for intent parsing',
            });
        }

        const intentPrompt = buildIntentPrompt(user_input, context);

        const claudeResult = await callClaude(
            intentPrompt,
            { id: 'anonymous', name: 'Student' },
            {}
        );

        if (!claudeResult.success) {
            return res.status(200).json({
                success: true,
                intent: 'unknown',
                confidence: 0.3,
                explanation: 'Could not parse intent reliably',
            });
        }

        const intentData = claudeResult.data;

        res.status(200).json({
            success: true,
            intent: intentData.intent || 'unknown',
            target: intentData.target || null,
            confidence: intentData.confidence || 0.5,
            explanation: intentData.explanation || '',
        });
    } catch (error) {
        console.error('[leoController] Parse intent error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * Build prompt for Groq to parse user intent
 * FIXED: added full list of navigation targets and game/module intents
 */
function buildIntentPrompt(userInput, context) {
    const contextStr = context.currentLesson
        ? `Current lesson: ${context.currentLesson}`
        : 'No current lesson';

    return `Parse this voice command and extract the user's intent.

Voice input: "${userInput}"
Context: ${contextStr}

Available intent types:
- navigate_lesson: Go to a specific lesson (e.g., "Go to fractions")
- navigate_subject: Go to a subject (e.g., "Math" or "Science")
- navigate_chapter: Go to a chapter
- next_lesson: Go to the next lesson
- previous_lesson: Go to the previous lesson
- show_progress: Show student progress
- show_subjects: Show all subjects
- navigate_feature: Navigate to a global app feature
  (e.g., login, home, teacher-dashboard, games, flashcards,
   stories, quick-quiz, draw-and-learn, leaderboard, settings)
- play_game: Play a specific mini-game
  (e.g., memory-match, sort-click, story-order, count-fast,
   rhythm-tap, balloon-pop, shape-puzzle, color-trace)
- open_module: Open a learning module
  (e.g., flashcards, stories, draw-and-learn, quick-quiz)
- help: Ask for help or instructions
- repeat: Repeat the last message
- unknown: Cannot determine

Return ONLY valid JSON (no explanation, no backticks):
{
  "intent": "INTENT_TYPE",
  "target": "specific_target_if_any",
  "confidence": 0.0-1.0,
  "explanation": "brief explanation"
}`;
}

module.exports = {
    handleLeoAssist,
    handleGetHint,
    handleParseIntent,
};