/**
 * Computes the next best action for the student based on profile & insights.
 * @param {Object} profile - The student profile
 * @param {Object} insights - The computed behavioral insights
 * @returns {Object} { label, subtext, route, actionType }
 */
export const getNextAction = (profile, insights) => {
  const dis = (profile?.disabilities || []).map(d => d.toLowerCase());
  const hasADHD = dis.includes('adhd');
  const hasDyslexia = dis.includes('dyslexia');
  const hasLowVision = dis.includes('low vision') || dis.includes('blindness');

  // Default fallback
  const rec = {
    label: 'Continue Learning',
    subtext: 'Jump back into your lessons!',
    route: '/lessons',
    actionType: 'lesson'
  };

  if (!insights) return rec;

  const { preferredMode, attentionScore } = insights;

  // Rule 1: Dyslexia with audio preference
  if (hasDyslexia && preferredMode === 'audio') {
    return {
      label: 'Start Audio Lesson 🎧',
      subtext: 'Listen and read along!',
      route: '/lessons',
      actionType: 'lesson'
    };
  }

  // Rule 2: ADHD with low attention (burnout risk)
  if (hasADHD && attentionScore === 'low') {
    return {
      label: 'Play Quick Game ⚡',
      subtext: 'Short session recommended based on your focus pattern',
      route: '/game/word-jump',
      actionType: 'game'
    };
  }

  // Rule 3: Low Vision
  if (hasLowVision) {
    return {
      label: 'Play Audio Lesson 🎙️',
      subtext: 'Close your eyes & listen.',
      route: '/lessons',
      actionType: 'lesson'
    };
  }

  // Default if none match
  return rec;
};
