/**
 * GROQ CLIENT
 * Wrapper for Groq API with Leo-specific prompt engineering
 * Using Llama 3 for high-speed adaptive responses
 */

const Groq = require('groq-sdk');
const { generateContextualPrompt } = require('./leoPrompts');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Call Groq API with student context
 * @param {string} userInput - Student's input
 * @param {Object} studentProfile - Student info
 * @param {Object} behaviorState - Observed behavior
 * @returns {Promise<Object>} - Parsed AI response
 */
async function callGroq(userInput, studentProfile, behaviorState) {
    try {
        console.log('[groqClient] Calling Groq with input:', userInput.substring(0, 50));

        // Build contextual system prompt
        const systemPrompt = generateContextualPrompt(studentProfile, behaviorState);

        // Make API call to Llama 3
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userInput,
                },
            ],
            model: 'llama-3.3-70b-versatile', // High performance model
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            response_format: { type: 'json_object' } // Enforce JSON
        });

        // Extract response
        const responseText = completion.choices[0].message.content;
        console.log('[groqClient] Raw response:', responseText);

        // Parse JSON response
        try {
            const parsed = JSON.parse(responseText);
            return {
                success: true,
                data: parsed,
                raw: responseText,
            };
        } catch (parseError) {
            console.error('[groqClient] Failed to parse JSON:', parseError);
            
            // Fallback: Try to extract JSON from response using regex
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return {
                        success: true,
                        data: parsed,
                        raw: responseText,
                    };
                } catch (e) {
                    console.error('[groqClient] Inner parse failed');
                }
            }

            return {
                success: false,
                error: 'Invalid JSON response from AI',
                raw: responseText,
            };
        }
    } catch (error) {
        console.error('[groqClient] Error calling Groq:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Generate a hint for a given activity
 */
async function generateHint(activityId, attemptContext, studentProfile) {
    const userInput = `Help with activity: ${activityId}\nContext: ${JSON.stringify(attemptContext)}`;
    return callGroq(userInput, studentProfile, { is_hesitating: true, recent_error_count: 1 });
}

/**
 * Simplify content for the student
 */
async function simplifyContent(contentText, studentProfile) {
    const userInput = `Simplify this content:\n${contentText}`;
    return callGroq(userInput, studentProfile, { confidence_level: 0.4 });
}

module.exports = {
    callGroq,
    generateHint,
    simplifyContent,
};
