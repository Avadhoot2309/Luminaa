export const getAdaptiveConfig = (profile) => {
  if (!profile) return getDefaultConfig();

  const { disabilities = [], ageGroup = '6-9', preferences = {} } = profile;
  
  // Start with teacher-set preferences or defaults
  const config = {
    ui: {
      fontFamily: preferences.fontFamily || 'Nunito',
      fontSize: preferences.fontSize || 'medium',
      highContrast: preferences.highContrast || false,
      focusMode: preferences.focusMode || false,
    },
    content: {
      chunkSize: 'medium',
      audioFirst: preferences.audioEnabled || false,
      highlightWords: false,
    },
    interaction: {
      showTimer: false,
      showProgressBar: true,
      allowDistractions: true,
    },
    game: {
      speed: 'normal',
      audioHints: false,
      rewardFrequency: 'medium',
    }
  };

  // OVERRIDE WITH DISABILITY-SPECIFIC ADAPTATIONS
  
  const dis = disabilities.map(d => d.toLowerCase());
  if (dis.includes('dyslexia')) {
    config.ui.fontFamily = 'OpenDyslexic';
    config.content.audioFirst = true;
    config.content.highlightWords = true;
    config.game.audioHints = true;
  }

  if (dis.includes('adhd')) {
    config.ui.focusMode = true;
    config.interaction.showTimer = true;
    config.content.chunkSize = 'small';
    config.game.rewardFrequency = 'high';
    config.interaction.allowDistractions = false;
  }

  if (dis.includes('low vision') || dis.includes('blindness')) {
    config.ui.highContrast = true;
    config.ui.fontSize = 'xlarge';
    config.content.audioFirst = true;
    config.game.audioHints = true;
    config.game.speed = 'slow';
  }

  if (dis.includes('deafness') || dis.includes('hard of hearing')) {
    config.content.audioFirst = false;
    config.game.audioHints = false;
  }

  return config;
};

const getDefaultConfig = () => ({
  ui: {
    fontFamily: 'Nunito',
    fontSize: 'medium',
    highContrast: false,
    focusMode: false,
  },
  content: {
    chunkSize: 'medium',
    audioFirst: false,
    highlightWords: false,
  },
  interaction: {
    showTimer: false,
    showProgressBar: true,
    allowDistractions: true,
  },
  game: {
    speed: 'normal',
    audioHints: false,
    rewardFrequency: 'medium',
  }
});
