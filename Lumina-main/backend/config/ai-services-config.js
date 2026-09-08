require('dotenv').config();

module.exports = {
  // GROQ - Free OpenAI-compatible API (no credit card needed)
  groq: {
    apiKey: process.env.GROQ_API_KEY || '', // Free key from console.groq.com
    model: 'llama-3.3-70b-versatile',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    simplificationPrompt: `You are a learning specialist simplifying text for children with dyslexia aged 10-13.
    
Rules:
- Use simple, common words (avoid complex vocabulary)
- Keep sentences short (max 12 words)
- Use active voice only
- Break paragraphs into 2-3 sentence chunks
- Replace idioms with literal language
- Maintain the original meaning
- Output only the simplified text, no explanations`
  },

  // HUGGING FACE - Free inference API (backup option)
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '', // Free from huggingface.co
    model: 'facebook/bart-large-cnn', // Text summarization model
    endpoint: 'https://api-inference.huggingface.co/models/'
  },

  // Web Speech API - Client-side TTS (completely free, built into browsers)
  tts: {
    provider: 'browser-speech-api',
    config: {
      rate: 0.9,        // Speaking speed
      pitch: 1.0,       // Voice pitch
      volume: 1.0,      // Volume
      voice: 'Google US English' // Default voice
    }
  },

  // Tesseract.js - Client-side OCR (free, runs in browser)
  ocr: {
    provider: 'tesseract',
    config: {
      lang: 'eng',
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?-',
      tessedit_pageseg_mode: '1' // Automatic page segmentation
    }
  }
};
