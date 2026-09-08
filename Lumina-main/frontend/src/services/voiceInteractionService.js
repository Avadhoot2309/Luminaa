/**
 * Voice Interaction Service
 * Wraps the Web Speech API (SpeechRecognition) in a clean, promise-based API.
 * Supports keyword matching and graceful fallback for unsupported browsers.
 */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class VoiceInteractionService {
  constructor() {
    this.isSupported = !!SpeechRecognition;
    this.isListening = false;
    this._recognition = null;
  }

  /**
   * Listen for any speech and return the transcript.
   * @param {Object} options
   * @param {number} options.timeoutMs - Max time to wait (default 8000ms)
   * @param {string} options.lang - Language code (default 'en-IN')
   * @returns {Promise<{ transcript: string, matched: boolean }>}
   */
  listen({ timeoutMs = 8000, lang = 'en-IN' } = {}) {
    if (!this.isSupported) {
      return Promise.resolve({ transcript: '', matched: false, unsupported: true });
    }
    if (this.isListening) {
      this.stop();
    }

    return new Promise((resolve) => {
      const rec = new SpeechRecognition();
      this._recognition = rec;
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 3;

      let settled = false;
      const done = (result) => {
        if (!settled) {
          settled = true;
          this.isListening = false;
          this._recognition = null;
          resolve(result);
        }
      };

      const timer = setTimeout(() => done({ transcript: '', matched: false, timedOut: true }), timeoutMs);

      rec.onresult = (e) => {
        clearTimeout(timer);
        // Collect all alternatives
        const transcripts = [];
        for (let i = 0; i < e.results[0].length; i++) {
          transcripts.push(e.results[0][i].transcript.toLowerCase().trim());
        }
        const transcript = transcripts[0] || '';
        done({ transcript, transcripts, matched: true });
      };

      rec.onerror = () => {
        clearTimeout(timer);
        done({ transcript: '', matched: false, error: true });
      };

      rec.onend = () => {
        clearTimeout(timer);
        if (!settled) done({ transcript: '', matched: false });
      };

      this.isListening = true;
      rec.start();
    });
  }

  /**
   * Listen and check if any of the given keywords appear in the result.
   * @param {string[]} keywords - List of keywords to match
   * @param {Object} options - Same as listen()
   * @returns {Promise<{ matched: boolean, transcript: string }>}
   */
  async listenForKeyword(keywords = [], options = {}) {
    const result = await this.listen(options);
    if (!result.transcript) return { ...result, keywordMatched: false };

    const normalizedTranscript = result.transcript.toLowerCase();
    const keywordMatched = keywords.some(k => normalizedTranscript.includes(k.toLowerCase()));
    return { ...result, keywordMatched };
  }

  /**
   * Stop any active listening session.
   */
  stop() {
    if (this._recognition) {
      try { this._recognition.abort(); } catch (e) {}
      this._recognition = null;
    }
    this.isListening = false;
  }

  /**
   * Extract keywords from a text string (simple: words > 3 chars, non-stopwords)
   * @param {string} text
   * @returns {string[]}
   */
  extractKeywords(text) {
    const stopwords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'too', 'use']);
    return text
      .split(/\s+/)
      .map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
      .filter(w => w.length > 3 && !stopwords.has(w))
      .slice(0, 4); // Top 4 meaningful words
  }
}

export default new VoiceInteractionService();
