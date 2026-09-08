/**
 * FREE TEXT-TO-SPEECH SERVICE
 * Enhanced with full language and accessibility controls.
 */

class TTSService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.defaultVoice = null;
    this.currentSpeed = 1.0;
    
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
  }

  /**
   * Translates readingSpeed from profile into numerical rate
   */
  _getSpeedForProfile(speedString) {
    if (speedString === 'slow') return 0.7;
    if (speedString === 'fast') return 1.1;
    return 0.9;
  }

  /**
   * Fetches correct localized voice for the profile language
   */
  _getVoiceForLanguage(langPref) {
    let targetLocales = [];
    if (langPref === 'hindi') targetLocales = ['hi-IN', 'hi_IN'];
    else if (langPref === 'marathi') targetLocales = ['mr-IN', 'mr_IN'];
    else targetLocales = ['en-IN', 'en-US', 'en-GB'];

    for (const locale of targetLocales) {
      const voice = this.voices.find(v => !!v.lang && (v.lang.includes(locale) || v.lang.replace('-', '_') === locale.replace('-', '_')));
      if (voice) return voice;
    }
    
    // Fallback
    return this.voices.find(v => !!v.lang && v.lang.startsWith(targetLocales[0].split('-')[0])) || this.voices[0];
  }

  /**
   * Speak logic dynamically pulling from Profile traits
   */
  speakWithProfile(text, studentProfile) {
    this.stopSpeech();
    return new Promise((resolve, reject) => {
      if (!this.synth) return reject(new Error('Speech unsupported'));

      const utterance = new SpeechSynthesisUtterance(text);
      
      const langConf = studentProfile?.preferences?.language || 'english';
      utterance.voice = this._getVoiceForLanguage(langConf);
      
      const speedConf = studentProfile?.preferences?.readingSpeed || 'medium';
      utterance.rate = this._getSpeedForProfile(speedConf) * this.currentSpeed;
      utterance.pitch = 1.1;

      utterance.onend = () => resolve({ status: 'success' });
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.warn('TTS Error:', e);
        }
        resolve({ status: 'interrupted' });
      };
      
      this.synth.speak(utterance);
    });
  }

  /**
   * Word-by-word chunking and speaking for Dyslexia highlighting
   */
  speakWithHighlight(text, onWordCallback, studentProfile) {
    this.stopSpeech();
    return new Promise((resolve, reject) => {
      if (!this.synth) return reject(new Error('Speech unsupported'));

      const utterance = new SpeechSynthesisUtterance(text);
      
      const langConf = studentProfile?.preferences?.language || 'english';
      utterance.voice = this._getVoiceForLanguage(langConf);
      
      const speedConf = studentProfile?.preferences?.readingSpeed || 'medium';
      utterance.rate = this._getSpeedForProfile(speedConf) * this.currentSpeed;
      utterance.pitch = 1.1;

      // Fires heavily on native implementations syncing the word boundary
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          let wordEnd = text.indexOf(' ', event.charIndex);
          if (wordEnd === -1) wordEnd = text.length;
          const matchedWord = text.substring(event.charIndex, wordEnd);
          onWordCallback(event.charIndex, matchedWord);
        }
      };

      utterance.onend = () => resolve({ status: 'success' });
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.warn('TTS Highlight Error:', e);
        }
        resolve({ status: 'interrupted' });
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Core controls
   */
  pauseSpeech() {
    this.synth.pause();
  }

  resumeSpeech() {
    this.synth.resume();
  }

  stopSpeech() {
    this.synth.cancel();
  }

  isSpeaking() {
    return this.synth.speaking;
  }

  /**
   * Exposed explicitly to UI speed dials
   */
  setReadingSpeed(speedStr) {
    if (speedStr === 'slow') this.currentSpeed = 0.7;
    else if (speedStr === 'fast') this.currentSpeed = 1.5;
    else this.currentSpeed = 1.0;
  }

  getCurrentSpeed() {
    return this.currentSpeed;
  }

  /**
   * Universal speak method used across the player
   */
  speak(text, options = {}) {
    this.stopSpeech();
    return new Promise((resolve, reject) => {
      if (!this.synth) return reject(new Error('Speech unsupported'));

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.1;

      if (options.onStart) utterance.onstart = options.onStart;
      
      utterance.onend = (e) => {
        if (options.onEnd) options.onEnd(e);
        resolve({ status: 'success' });
      };

      if (options.onBoundary) utterance.onboundary = options.onBoundary;

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.warn('TTS Error:', e);
        }
        if (options.onEnd) options.onEnd(e);
        resolve({ status: 'interrupted' });
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Utility for raw DOM elements
   */
  speakElement(elementId, studentProfile) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    this.speakWithProfile(text, studentProfile);
  }

  /**
   * Automatically hook reading on mount with brief timeout 
   */
  initAutoRead(text, studentProfile) {
    if (studentProfile?.preferences?.audioEnabled) {
      setTimeout(() => {
        this.speakWithProfile(text, studentProfile);
      }, 1000);
    }
  }
}

export default new TTSService();
