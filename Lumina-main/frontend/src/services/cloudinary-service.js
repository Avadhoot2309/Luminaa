/**
 * CLOUDINARY MEDIA SERVICE (FREE FILE STORAGE)
 * Use this as an alternative to Firebase Storage to avoid credit card requirements.
 */

import axios from 'axios';

class CloudinaryService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  }

  /**
   * Upload an image or file (Unsigned)
   * Need to enable "Unsigned Uploads" in Cloudinary Settings → Upload → Upload Presets
   */
  async upload(file, folder = 'uploads') {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary not configured. Check your .env file.');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', `lumina/${folder}`);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`,
        formData
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        bytes: response.data.bytes,
        format: response.data.format
      };
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  }

  /**
   * Helper to get transformed URL (e.g., resizing)
   */
  getTransformedUrl(publicId, width = 500, height = 500) {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${width},h_${height},c_fill/${publicId}`;
  }
}

export default new CloudinaryService();
