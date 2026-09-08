/**
 * LEO SERVICE - Frontend API Client
 * Handles communication with backend Leo API
 * Sends user input + behavior context to /api/leo-assist
 */

import { getLeoAdaptiveState } from './behaviorTracker.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const LEO_ENDPOINT = `${API_BASE}/api/leo-assist`;

/**
 * Send user input to Leo backend
 * @param {Object} params
 * @returns {Promise<Object>} { action, response, ui_changes, voice }
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
