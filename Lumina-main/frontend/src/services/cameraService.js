/**
 * src/services/cameraService.js
 * MediaDevices API wrapper for Luminaa
 * Handles physical interaction counting
 */

class CameraService {
  constructor() {
    this.stream = null;
    this.activeVideo = null;
  }

  /**
   * Initialize and start the camera stream
   * @param {Object} options 
   * @returns {Promise<MediaStream>}
   */
  async start({ width = 320, height = 240 } = {}) {
    if (this.stream) return this.stream;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: width }, height: { ideal: height }, facingMode: 'user' },
        audio: false
      });
      return this.stream;
    } catch (err) {
      console.error("Camera Access Denied:", err);
      throw new Error("Unable to access camera. Please check your permissions.");
    }
  }

  /**
   * Stop all camera tracks (BUG 3 FIX)
   * This must be called in the cleanup function of useEffects using the camera.
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      this.stream = null;
    }
  }

  /**
   * Dummy fingerprint detection logic for Phase 5 tasks.
   * Resolves with a random count or expectedCount after a simulated delay.
   * @param {number} expectedCount - Target count for the current activity
   * @returns {Promise<number>}
   */
  async detectFingers(expectedCount = 0) {
    return new Promise((resolve) => {
      // Simulate computer vision processing time
      setTimeout(() => {
        // Return correct count to maintain flow (to be replaced with real detection logic)
        resolve(expectedCount);
      }, 2500);
    });
  }
}

export default new CameraService();
