/**
 * ============================================================================
 * LEO FRONTEND SERVICE (frontend/src/services/leoService.js)
 * ============================================================================
 * 
 * Purpose: Client-side HTTP bridge communicating with the Leo AI backend.
 * 
 * How it works (for Mentors & Group Members):
 * ----------------------------------------------------------------------------
 * 1. Automatic Context Enrichment:
 *    When a student speaks or types, this service doesn't just send raw text.
 *    It queries `behaviorTracker.js` via `getLeoAdaptiveState()` to bundle:
 *    - Idle time, hesitation flags, and recent error counts.
 *    - Active screen DOM buttons and interactive cards (`available_elements`).
 *    - Student neurodivergent profile and grade level.
 * 
 * 2. Cloud & Local Environment Agnostic:
 *    - In development: Defaults to http://localhost:5001.
 *    - In production: Dynamically targets `import.meta.env.VITE_API_URL` (e.g. Render / Railway).
 * 
 * 3. Offline & Error Resiliency:
 *    If network connectivity drops or the server is warming up, it gracefully
 *    returns an empathetic fallback response so the child is never left stranded.
 * ============================================================================
 */

import { getLeoAdaptiveState } from './behaviorTracker.js';

// Determine backend API host based on build environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const LEO_ENDPOINT = `${API_BASE}/api/leo-assist`;

/**
 * Dispatch student input and multimodal context to the Leo AI backend
 * 
 * @param {Object} params
 * @param {string} [params.user_input] - Spoken transcript or typed query
 * @param {Object} [params.content] - Current lesson or quiz metadata
 * @param {Object} [params.student_profile] - Student neurodivergent type, age, preferences
 * @param {Object} [params.lesson_context] - Current chapter, problem index, subject
 * @param {Array}  [params.available_elements] - Identifiers of clickable UI elements on screen
 * @returns {Promise<{action: string, response: string, ui_changes: Object, element_id?: string}>}
 */
export const sendToLeo = async ({
    user_input = '',
    content = {},
    student_profile = {},
    lesson_context = {},
    available_elements = [],
}) => {

    try {
        // Get current behavior state
        const behavior_state = getLeoAdaptiveState();

        // Build request payload
        const payload = {
            user_input,
            content,
            student_profile: {
                id: student_profile.id || 'anonymous',
                name: student_profile.name || 'Student',
                language: student_profile.language || 'en',
                learning_level: student_profile.learning_level || 'beginner',
                ...student_profile,
            },
            lesson_context,
            behavior_state,
            available_elements,
            timestamp: new Date().toISOString(),
        };

        console.log('[leoService] Sending to Leo:', payload);

        const response = await fetch(LEO_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Leo API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('[leoService] Response from Leo:', result);

        return {
            action: result.action || 'respond',
            response: result.response || 'I could not process that.',
            ui_changes: result.ui_changes || {},
            voice: result.voice || { text: result.response || 'I could not process that.', speed: 1.0 },
            success: true,
        };
    } catch (error) {
        console.error('[leoService] Error:', error);
        return {
            action: 'error',
            response: 'Sorry, I encountered an error. Can you try again?',
            ui_changes: {},
            voice: { text: 'Sorry, I encountered an error. Can you try again?' },
            success: false,
            error: error.message,
        };
    }
};

/**
 * Send a quick acknowledgment (no heavy processing)
 */
export const acknowledgeUser = async (text) => {
    return sendToLeo({
        user_input: text,
        content: { type: 'acknowledgment' },
    });
};

/**
 * Get help hint for current activity
 */
export const getHint = async (activity_id, student_profile = {}) => {
    return sendToLeo({
        user_input: 'I need a hint',
        content: {
            type: 'hint',
            activity_id,
        },
        student_profile,
    });
};

/**
 * Request simplification of content
 */
export const simplifyContent = async (content_text, student_profile = {}) => {
    return sendToLeo({
        user_input: 'Can you simplify this?',
        content: {
            type: 'simplification',
            text: content_text,
        },
        student_profile,
    });
};

/**
 * Report an error/struggle to Leo
 */
export const reportStruggle = async (error_context, student_profile = {}) => {
    return sendToLeo({
        user_input: 'I need help, I made an error',
        content: {
            type: 'error_recovery',
            ...error_context,
        },
        student_profile,
    });
};

export default {
    sendToLeo,
    acknowledgeUser,
    getHint,
    simplifyContent,
    reportStruggle,
};
