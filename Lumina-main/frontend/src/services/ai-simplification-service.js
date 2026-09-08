/**
 * FREE TEXT SIMPLIFICATION SERVICE
 * Uses Groq API (via local Vite Proxy to avoid Network Errors)
 */

class AISimplificationService {
  constructor() {
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    // Uses Vite proxy /api/groq → https://api.groq.com
    this.endpoint = '/api/groq/openai/v1/chat/completions';
  }

  /**
   * Simplify text for dyslexia
   */
  async simplifyText(text) {
    if (!this.groqApiKey) {
      console.warn('❌ GROQ_API_KEY is missing!');
      return text;
    }

    try {
      console.log('✨ Simplification started through local proxy /api/groq...');
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert learning specialist who adapts educational content for children. ' +
                'Your only job is to simplify text. Return ONLY the rewritten text — no preamble, no explanation, no labels.'
            },
            {
              role: 'user',
              content:
                `Simplify the following text for a 10-13 year old student with dyslexia.\n\n` +
                `Rules:\n` +
                `- Use short sentences\n` +
                `- Use simple words\n` +
                `- Break long paragraphs\n` +
                `- Add line breaks\n` +
                `- Keep meaning same\n` +
                `- Avoid complex vocabulary\n\n` +
                `Text:\n${text}`
            }
          ],
          temperature: 0.4,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        // Try to parse error as JSON, if fails, use status code
        let errorMsg;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error?.message || `Error ${response.status}`;
        } catch (e) {
          errorMsg = `HTTP Error ${response.status} - Possible config issue.`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('❌ AI PROXY ERROR:', error.message);
      
      console.info('Using rule-based fallback...');
      return this.basicSimplify(text);
    }
  }

  /**
   * Fallback: Rule-based simplification
   */
  basicSimplify(text) {
    if (!text) return '';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const simplified = sentences.map(sentence => {
      const words = sentence.trim().split(' ');
      if (words.length > 15) {
        const mid = Math.floor(words.length / 2);
        return words.slice(0, mid).join(' ') + '. ' + words.slice(mid).join(' ');
      }
      return sentence;
    });
    return simplified.join(' ');
  }
}

export default new AISimplificationService();
