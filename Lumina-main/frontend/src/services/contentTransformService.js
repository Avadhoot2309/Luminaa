/**
 * CONTENT TRANSFORM SERVICE
 * Transforms raw extracted text into disability-optimised formats
 * using Groq AI (via Vite proxy) with retry logic.
 */

const GROQ_ENDPOINT = '/api/groq/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
// Words per minute for average child reader
const CHILD_WPM = 100;

// ─── Groq AI helper with exponential backoff ──────────────────────────────────

/**
 * Calls Groq AI with automatic retry on failure.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {number} [maxRetries=3]
 * @returns {Promise<string>} AI response text
 */
const callGroqWithRetry = async (systemPrompt, userPrompt, maxRetries = 3) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.5,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.error?.message || `HTTP ${response.status}`;
        throw new Error(msg);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      if (attempt === maxRetries) {
        console.error(`[contentTransformService] Groq failed after ${maxRetries} attempts:`, err.message);
        throw err;
      }
      // Exponential backoff: 500ms, 1000ms, 2000ms
      const delay = 500 * Math.pow(2, attempt - 1);
      console.warn(`[contentTransformService] Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

// ─── Fallback transformers (rule-based, no AI needed) ────────────────────────

/**
 * Rule-based dyslexia simplification fallback.
 * @param {string} text
 * @returns {string}
 */
const ruleBasedSimplify = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const simplified = sentences.map(s => {
    const words = s.trim().split(/\s+/);
    if (words.length > 12) {
      const mid = Math.ceil(words.length / 2);
      return words.slice(0, mid).join(' ') + '. ' + words.slice(mid).join(' ') + '.';
    }
    return s;
  });
  // Group into paragraphs of 3 sentences
  const result = [];
  for (let i = 0; i < simplified.length; i += 3) {
    result.push(simplified.slice(i, i + 3).join(' '));
  }
  return result.join('\n\n');
};

// ─── Core transform functions ─────────────────────────────────────────────────

/**
 * Simplifies text for students with dyslexia using Groq AI.
 * Sentences are shortened to max 12 words, paragraph breaks added every 3 sentences.
 * Falls back to rule-based simplification if AI fails.
 * @param {string} text - Raw input text
 * @returns {Promise<string>} Simplified text
 */
export const simplifyForDyslexia = async (text) => {
  if (!text || text.trim().length === 0) return '';
  try {
    const systemPrompt =
      'You are an expert learning specialist who adapts educational content for children. ' +
      'Your only job is to simplify text. Return ONLY the rewritten text — no preamble, no explanation, no labels.';

    const userPrompt =
      `Simplify the following text for a 10-13 year old student with dyslexia.

Rules:
- Use short sentences
- Use simple words
- Break long paragraphs
- Add line breaks
- Keep meaning same
- Avoid complex vocabulary

Text:
${text}`;

    return await callGroqWithRetry(systemPrompt, userPrompt);
  } catch {
    console.info('[contentTransformService] Using rule-based dyslexia fallback');
    return ruleBasedSimplify(text);
  }
};

/**
 * Splits text into ADHD-friendly reading chunks.
 * Each chunk targets approximately chunkSizeMinutes of reading time.
 * @param {string} text - Raw input text
 * @param {number} [chunkSizeMinutes=5] - Target minutes per chunk
 * @returns {Array<{ chunk_number: number, text: string, estimatedTime: number }>}
 */
export const chunkForADHD = (text, chunkSizeMinutes = 5) => {
  if (!text || text.trim().length === 0) return [];

  const targetWords = CHILD_WPM * chunkSizeMinutes;
  const words = text.trim().split(/\s+/);
  const chunks = [];
  let i = 0;
  let chunkNum = 1;

  while (i < words.length) {
    const slice = words.slice(i, i + targetWords);
    // Try to end chunk at a sentence boundary
    const sliceText = slice.join(' ');
    const lastPeriod = Math.max(
      sliceText.lastIndexOf('. '),
      sliceText.lastIndexOf('! '),
      sliceText.lastIndexOf('? ')
    );

    let chunkText;
    let wordsConsumed;
    if (lastPeriod > 0 && slice.length === targetWords) {
      chunkText = sliceText.substring(0, lastPeriod + 1).trim();
      wordsConsumed = chunkText.split(/\s+/).length;
    } else {
      chunkText = sliceText.trim();
      wordsConsumed = slice.length;
    }

    const wordCount = chunkText.split(/\s+/).length;
    const estimatedTime = Math.ceil(wordCount / CHILD_WPM);

    chunks.push({
      chunk_number: chunkNum++,
      text: chunkText,
      estimatedTime
    });
    i += wordsConsumed;
  }

  return chunks;
};

/**
 * Wraps text in high-contrast HTML for low-vision students.
 * Uses black background, white text, and large font.
 * @param {string} text - Raw input text
 * @returns {string} HTML string with high-contrast styling
 */
export const generateHighContrast = (text) => {
  if (!text) return '';
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const paragraphs = escaped.split(/\n+/).map(p =>
    `<p style="margin:0 0 1.2em 0;">${p}</p>`
  ).join('');

  return `<div style="
    background-color: #000000;
    color: #FFFFFF;
    font-size: 22px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.8;
    padding: 24px;
    border-radius: 8px;
    letter-spacing: 0.03em;
    word-spacing: 0.1em;
  ">${paragraphs}</div>`;
};

/**
 * Cleans and formats text for Web Speech API TTS output.
 * Removes markdown, special symbols; spells out numbers.
 * @param {string} text - Raw input text
 * @returns {string} TTS-ready clean string
 */
export const generateAudioScript = (text) => {
  if (!text) return '';

  return text
    // Remove markdown formatting
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Spell out % symbol
    .replace(/(\d+)%/g, '$1 percent')
    // Spell out common symbols
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/=/g, ' equals ')
    .replace(/>/g, ' greater than ')
    .replace(/<(?!\/?\w)/g, ' less than ')
    // Remove remaining special characters except punctuation
    .replace(/[^\w\s.,!?;:'"-]/g, ' ')
    // Normalise whitespace
    .replace(/\s{2,}/g, ' ')
    .trim();
};

/**
 * Master transform function — applies all relevant disability transforms.
 * @param {string} rawText - The extracted raw text
 * @param {string[]} disabilities - Array of disability types e.g. ["dyslexia", "adhd", "low_vision"]
 * @returns {Promise<{
 *   original_text: string,
 *   dyslexia_text: string|null,
 *   chunked_lessons: Array|null,
 *   high_contrast_text: string|null,
 *   audio_script: string
 * }>}
 */
export const transformContent = async (rawText, disabilities = []) => {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('transformContent: rawText cannot be empty');
  }

  const result = {
    original_text: rawText,
    dyslexia_simplified_text: null,
    chunked_lessons: null,
    high_contrast_text: null,
    audio_script: generateAudioScript(rawText) // always generated
  };

  const tasks = [];

  if (disabilities.includes('dyslexia')) {
    tasks.push(
      simplifyForDyslexia(rawText).catch(() => ruleBasedSimplify(rawText)).then(t => { result.dyslexia_simplified_text = t; })
    );
  }

  if (disabilities.includes('adhd')) {
    result.chunked_lessons = chunkForADHD(rawText, 5);
  }

  if (disabilities.includes('low_vision')) {
    result.high_contrast_text = generateHighContrast(rawText);
  }

  // Run AI calls concurrently
  await Promise.allSettled(tasks);

  return result;
};
