/**
 * PDF TEXT EXTRACTOR UTILITY
 * Uses pdfjs-dist (Mozilla PDF.js) — fully browser-compatible.
 * Falls back to Tesseract.js OCR for scanned/image-only PDFs.
 */

import * as pdfjsLib from 'pdfjs-dist';
import ocrService from '../services/ocr-service';

// Point worker to CDN — avoids Vite worker bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const MIN_TEXT_LENGTH = 50; // Chars below this = treat as scanned PDF

/**
 * Extracts raw text from a PDF File object.
 * Tries direct text extraction first; falls back to Tesseract OCR per-page.
 * @param {File} pdfFile - The PDF file from a file input
 * @param {Function} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<{ text: string, method: "pdfjs" | "ocr", pageCount: number }>}
 */
export const extractTextFromPDF = async (pdfFile, onProgress = null) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;

    let fullText = '';
    let usedOCR = false;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ').trim();

      if (pageText.length >= MIN_TEXT_LENGTH) {
        fullText += pageText + '\n\n';
      } else {
        // Scanned page — render to canvas then run Tesseract
        usedOCR = true;
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        const ocrResult = await ocrService.extractText(blob);
        fullText += (ocrResult.text || '') + '\n\n';
      }

      if (onProgress) {
        onProgress(Math.round((pageNum / pageCount) * 100));
      }
    }

    return {
      text: fullText.trim(),
      method: usedOCR ? 'ocr' : 'pdfjs',
      pageCount
    };
  } catch (err) {
    console.error('[pdfExtractor] Failed to extract PDF text:', err);
    throw new Error(`PDF extraction failed: ${err.message}`);
  }
};

/**
 * Determines whether a file is a text-based or image-based PDF.
 * @param {File} pdfFile
 * @returns {Promise<"text" | "scanned">}
 */
export const detectPDFType = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const firstPage = await pdf.getPage(1);
    const textContent = await firstPage.getTextContent();
    const text = textContent.items.map(i => i.str).join(' ').trim();
    return text.length >= MIN_TEXT_LENGTH ? 'text' : 'scanned';
  } catch {
    return 'scanned';
  }
};
