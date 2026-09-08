/**
 * src/services/speechService.js
 * Web Speech API Recognition (STT) wrapper for Luminaa
 */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

const speechService = {
  /**
   * Listen for speech and return a promise that resolves with the result
   * @param {Object} options 
   * @param {string[]} options.keywords - Keywords to match against transcript
   * @param {number} options.timeoutMs - Time to wait before settling (default 5000)
   */
  listen: ({ keywords = [], timeoutMs = 5000, lang = 'en-IN' } = {}) => {
    return new Promise((resolve) => {
      if (!SR) {
        console.warn('❌ Speech Recognition NOT supported in this browser.');
        return resolve({ transcript: '', matched: false, unsupported: true });
      }

      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.continuous = false;

      // 🚨 BUG 1 FIX: Store the transcript in a mutable object (conceptual "ref") 
      // to avoid closure staleness during the session lifecycle.
      const state = {
        transcript: '',
        isSettled: false
      };

      const settle = (result) => {
        if (state.isSettled) return;
        state.isSettled = true;
        clearTimeout(timer);
        try { rec.stop(); } catch (e) {}
        resolve(result);
      };

      // Auto-fallback timeout
      const timer = setTimeout(() => {
        settle({ transcript: state.transcript, matched: false, timeout: true });
      }, timeoutMs);

      rec.onresult = (event) => {
        const results = event.results[0];
        const transcripts = [];
        for (let i = 0; i < results.length; i++) {
          transcripts.push(results[i].transcript.toLowerCase().trim());
        }
        
        // Update the live state ref
        state.transcript = transcripts[0] || '';
        
        // Optional: Pre-check for match
        const matched = keywords.length > 0 && 
          keywords.some(k => state.transcript.includes(k.toLowerCase()));

        // We can settle early on a successful result or wait for onend
        // Section 7 Bug 2 suggests reading the latest ref in onend is safer.
      };

      rec.onerror = (event) => {
        console.warn('STT Error:', event.error);
        settle({ transcript: '', matched: false, error: event.error });
      };

      rec.onend = () => {
        // Read the latest value from our "ref" object to avoid stale closure
        const matched = keywords.length > 0 && 
          keywords.some(k => state.transcript.toLowerCase().includes(k.toLowerCase()));

        settle({ 
          transcript: state.transcript, 
          matched,
          final: true
        });
      };

      try {
        rec.start();
      } catch (e) {
        settle({ transcript: '', matched: false, error: 'busy' });
      }
    });
  }
};

export default speechService;
