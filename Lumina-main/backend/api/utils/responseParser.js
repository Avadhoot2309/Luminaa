/**
 * RESPONSE PARSER
 * Validates and sanitizes Claude/Groq responses
 */

/**
 * Validate Leo response structure
 */
function validateLeoResponse(response) {
    const errors = [];

    // Check required fields
    if (!response.action) {
        errors.push('Missing "action" field');
    }

    if (!response.response) {
        errors.push('Missing "response" field');
    }

    // Validate action type — FIXED: added navigation/game actions
    const validActions = [
        'hint',
        'simplify',
        'encourage',
        're_engage',
        'support',
        'correct',
        'error_recover',
        'respond',
        'click_element',     // NEW
        'navigate_feature',  // NEW
        'play_game',         // NEW
        'open_module',       // NEW
    ];

    if (response.action && !validActions.includes(response.action)) {
        // Instead of erroring, downgrade to respond so it still works
        console.warn(`[responseParser] Unknown action "${response.action}", downgrading to "respond"`);
        response.action = 'respond';
    }

    // Validate response length
    if (response.response && response.response.length > 500) {
        errors.push('Response too long (max 500 chars)');
    }

    // Validate UI changes if present
    if (response.ui_changes) {
        const validFontSizes = ['normal', 'large', 'extra_large'];
        const validFonts = ['default', 'open_dyslexic'];
        const validSpacings = ['normal', 'wide'];
        const validColors = ['neutral', 'warning', 'success', 'error'];

        if (
            response.ui_changes.font_size &&
            !validFontSizes.includes(response.ui_changes.font_size)
        ) {
            errors.push(`Invalid font_size: ${response.ui_changes.font_size}`);
        }

        if (
            response.ui_changes.font_family &&
            !validFonts.includes(response.ui_changes.font_family)
        ) {
            errors.push(`Invalid font_family: ${response.ui_changes.font_family}`);
        }

        if (
            response.ui_changes.spacing &&
            !validSpacings.includes(response.ui_changes.spacing)
        ) {
            errors.push(`Invalid spacing: ${response.ui_changes.spacing}`);
        }

        if (
            response.ui_changes.color_hint &&
            !validColors.includes(response.ui_changes.color_hint)
        ) {
            errors.push(`Invalid color_hint: ${response.ui_changes.color_hint}`);
        }
    }

    // For click_element action, warn if element_id is missing
    if (response.action === 'click_element' && !response.element_id) {
        console.warn('[responseParser] click_element action missing element_id');
        errors.push('click_element action requires element_id');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Sanitize response text
 * FIXED: removed aggressive regex that was stripping element IDs and hyphens
 */
function sanitizeResponse(text) {
    return text
        .replace(/<[^>]*>/g, '')  // Remove HTML tags only
        .substring(0, 500)
        .trim();
}

/**
 * Fix common Groq response issues
 * FIXED: added navigation/click intent inference
 */
function fixCommonIssues(response) {
    // If action is missing, infer from response text
    if (!response.action) {
        const text = (response.response || '').toLowerCase();

        if (text.includes('hint') || text.includes('think about')) {
            response.action = 'hint';
        } else if (text.includes('break') || text.includes('well done')) {
            response.action = 'encourage';
        } else if (
            text.includes('opening') ||
            text.includes('taking you to') ||
            text.includes("let's play") ||
            text.includes('navigating')
        ) {
            response.action = 'click_element';  // NEW
        } else {
            response.action = 'respond';
        }
    }

    // Ensure response is under 500 chars
    if (response.response && response.response.length > 500) {
        response.response = response.response.substring(0, 497) + '...';
    }

    // Set confidence if missing
    if (!response.confidence_in_response) {
        response.confidence_in_response = 0.7;
    }

    // Ensure ui_changes exists
    if (!response.ui_changes) {
        response.ui_changes = {};
    }

    // Ensure next_action exists
    if (!response.next_action) {
        response.next_action = 'await_input';
    }

    return response;
}

/**
 * Create fallback response
 */
function createFallbackResponse(error) {
    return {
        action: 'error_recover',
        response: 'I had a little trouble. Can you try that again?',
        ui_changes: {},
        next_action: 'await_input',
        confidence_in_response: 0.3,
        error: error.message,
    };
}

module.exports = {
    validateLeoResponse,
    sanitizeResponse,
    fixCommonIssues,
    createFallbackResponse,
};