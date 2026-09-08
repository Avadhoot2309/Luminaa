/**
 * VIDEO EMBED SERVICE
 * Handles YouTube logic for the Lumina Video Player with strict focus on accessibility.
 */

/**
 * Builds the fully accessible YouTube embed URL based on strict parameters.
 * @param {string} youtubeId - The YouTube video ID
 * @param {Object} options - Any overrides (rarely used, defaults are highly controlled)
 * @returns {string} The formatted embed URL
 */
export const getEmbedUrl = (youtubeId, options = {}) => {
  if (!youtubeId) return '';
  const params = new URLSearchParams({
    cc_load_policy: '1',  // Always force captions ON (Accessibility for deaf/low vision/dyslexia)
    cc_lang_pref: 'en',   // Default to English captions
    modestbranding: '1',  // Minimal YouTube UI
    rel: '0',             // No related videos at the end (Reduces ADHD distraction)
    fs: '1',              // Allow full screen
    playsinline: '1',     // Standardize on mobile devices
    color: 'white',       // Use a less aggressive player color
    ...options
  });
  
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
};

/**
 * Returns the proper YouTube ID based on the student's language profile.
 * @param {Object} lesson - The lesson document object
 * @param {string} language - The student's preferred language (e.g. 'hindi', 'english')
 * @returns {string|null} The targeted YouTube ID
 */
export const getVideoByLanguage = (lesson, language) => {
  if (!lesson || !lesson.content || !lesson.content.video) return null;
  const vid = lesson.content.video;
  
  if (language === 'hindi' && vid.has_hindi && vid.hindi_youtube_id) {
    return vid.hindi_youtube_id;
  }
  return vid.youtube_id || null;
};

/**
 * Simply returns whether a given lesson object contains an active, valid YouTube ID.
 * @param {Object} lesson - The lesson document object
 * @returns {boolean} True if the lesson has playable video content
 */
export const isVideoAvailable = (lesson) => {
  if (!lesson || !lesson.content || !lesson.content.video) return false;
  return !!lesson.content.video.youtube_id;
};

/**
 * Converts pure seconds mapped in the DB to a human-readable duration string.
 * Reduces cognitive load for ADHD users (e.g., '1 min 30 sec').
 * @param {number} seconds - The raw duration in seconds
 * @returns {string} Readable string
 */
export const getVideoDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return 'Unknown duration';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  
  if (m > 0 && s > 0) {
    return `${m} min ${s} sec`;
  } else if (m > 0) {
    return `${m} min`;
  } else {
    return `${s} sec`;
  }
};
