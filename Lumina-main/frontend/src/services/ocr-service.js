/**
 * FREE OCR SERVICE
 * Uses Tesseract.js (runs in browser)
 * NO API KEY NEEDED - 100% FREE
 */

import Tesseract from 'tesseract.js';

class OCRService {
  /**
   * Extract text from image
   * Simplified for Tesseract.js v5 stability
   */
  async extractText(imageFile) {
    try {
      console.log('Starting OCR process...');
      
      const result = await Tesseract.recognize(
        imageFile,
        'eng',
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          } 
        }
      );
      
      return {
        text: result.data.text,
        confidence: result.data.confidence,
        blocks: result.data.blocks
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw error;
    }
  }

  async extractFromPDF(pdfFile) {
    throw new Error('PDF OCR not yet implemented - use image upload for now');
  }
}

export default new OCRService();
