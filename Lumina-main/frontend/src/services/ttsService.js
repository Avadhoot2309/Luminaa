/**
 * src/services/ttsService.js
 * Web Speech API TTS wrapper for Luminaa
 */

// Force voices to load by creating a dummy utterance
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const synth = window.speechSynthesis;

  // Try to get voices immediately
  synth.getVoices();

  // Also set up onvoiceschanged in case voices load later
  synth.onvoiceschanged = () => {
    console.log('[ttsService] Voices changed, available:', synth.getVoices().length);
  };
}

const ttsService = {
  /**
   * Speak text with specific options for rate, pitch, and events
   */
  speak: (text, { rate = 1, pitch = 1.1, onWord, onEnd } = {}) => {
    console.log('[ttsService] speak() called:', text.substring(0, 40));

    try {
      const synth = window.speechSynthesis;

      // Cancel any previous speech
      synth.cancel();

      // Create utterance
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = rate;
      utter.pitch = pitch;
      utter.lang = 'en-US';  // Changed from en-IN to en-US for better compatibility
      utter.volume = 1.0;

      // Add event listeners
      utter.onstart = () => console.log('[ttsService] Speech started');
      utter.onend = () => {
        console.log('[ttsService] Speech ended');
        if (onEnd) onEnd();
      };
      utter.onerror = (event) => console.error('[ttsService] Speech error:', event.error);

      // Function to handle speaking
      const speakWhenReady = () => {
        const voices = synth.getVoices();
        console.log('[ttsService] Available voices:', voices.length);

        if (voices.length === 0) {
          console.log('[ttsService] Waiting for voices to load...');
          setTimeout(speakWhenReady, 100);
          return;
        }

        // Select voice (prefer English)
        const voice = voices.find(v => v.lang.includes('en-US')) ||
          voices.find(v => v.lang.includes('en')) ||
          voices[0];

        console.log('[ttsService] Selected voice:', voice?.name);
        utter.voice = voice;

        // Speak
        console.log('[ttsService] Calling speak()...');
        synth.speak(utter);
      };

      speakWhenReady();
    } catch (error) {
      console.error('[ttsService] Error:', error);
    }
  },

  /**
   * Stop speech
   */
  stop: () => {
    window.speechSynthesis?.cancel();
  },

  /**
   * Check if speaking
   */
  isSpeaking: () => {
    return window.speechSynthesis?.speaking || false;
  },
};

export default ttsService;
