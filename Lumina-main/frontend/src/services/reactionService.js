/**
 * Reaction Service
 * Plays audio feedback using the Web Audio API.
 * Purely functional, stateless.
 */

const _getContext = () => {
  try {
    return new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    return null;
  }
};

const _playTone = (frequency, type = 'sine', duration = 0.3, volume = 0.08) => {
  const ctx = _getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
};

export const reactionService = {
  /**
   * Play a happy "ding!" chord for correct answers
   */
  playSuccess() {
    _playTone(523.25, 'triangle', 0.15, 0.08); // C5
    setTimeout(() => _playTone(659.25, 'triangle', 0.15, 0.07), 100); // E5
    setTimeout(() => _playTone(783.99, 'triangle', 0.25, 0.06), 200); // G5
  },

  /**
   * Play a soft "oops" tone for wrong answers
   */
  playError() {
    _playTone(300, 'sine', 0.2, 0.06);
    setTimeout(() => _playTone(250, 'sine', 0.2, 0.05), 150);
  },

  /**
   * Play a gentle encouraging tone
   */
  playEncourage() {
    _playTone(440, 'triangle', 0.2, 0.06); // A4
    setTimeout(() => _playTone(494, 'triangle', 0.2, 0.06), 200); // B4
  },

  /**
   * Play a subtle "click" for UI interactions
   */
  playClick() {
    _playTone(800, 'square', 0.05, 0.04);
  },

  /**
   * 🏆 Centralized Trigger (Audio + Visual)
   * This is used to coordinate sound and triggers the parent's ReactionEngine
   */
  trigger(type, visualCallback = null) {
    switch (type) {
      case 'correct':
        this.playSuccess();
        break;
      case 'wrong':
        this.playError();
        break;
      case 'encourage':
        this.playEncourage();
        break;
      case 'click':
        this.playClick();
        break;
      default:
        break;
    }
    // If the component provides a callback to trigger visual effects
    if (visualCallback) visualCallback(type);
  }
};

export default reactionService;
