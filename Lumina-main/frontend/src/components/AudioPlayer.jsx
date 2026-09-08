import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Slider, Tooltip, Paper } from '@mui/material';
// Ensure to use basic standard icons if MuiIcons exists or adapt as needed natively.
// Fallback unicode if standard icons are missing.
import ttsService from '../services/tts-service';

const AudioPlayer = ({ text, studentProfile, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const isDyslexia = studentProfile?.disabilities?.includes('dyslexia');
  const isLowVision = studentProfile?.disabilities?.includes('low_vision');
  const isADHD = studentProfile?.disabilities?.includes('adhd');

  const charCount = text?.length || 1;

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'Escape') {
        stopAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ttsService.stopSpeech(); // Cleanup unmount
    };
  }, [isPlaying]);

  const onWordTick = (charIndex, word) => {
    setCurrentWord(word);
    setProgress((charIndex / charCount) * 100);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setProgress(100);
    setCurrentWord('Completed');
    if (onComplete) onComplete();
  };

  const togglePlay = () => {
    if (isPlaying) {
      ttsService.pauseSpeech();
      setIsPlaying(false);
    } else {
      if (progress === 100) setProgress(0); // restart
      setIsPlaying(true);
      ttsService.speakWithHighlight(text, onWordTick, studentProfile)
        .then(handleComplete)
        .catch(err => {
          console.error(err);
          setIsPlaying(false);
        });
    }
  };

  const stopAudio = () => {
    ttsService.stopSpeech();
    setIsPlaying(false);
    setProgress(0);
    setCurrentWord('');
  };

  const changeSpeed = (e, val) => {
    setPlaybackSpeed(val);
    const speedStr = val < 0.8 ? 'slow' : (val > 1.2 ? 'fast' : 'medium');
    ttsService.setReadingSpeed(speedStr);
  };

  // Extra Large touch geometries
  const buttonSize = isLowVision ? '64px' : (isDyslexia ? '56px' : '48px');

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        my: 2, 
        bgcolor: isDyslexia ? '#fffdf7' : 'background.paper',
        border: isLowVision ? '3px solid #000' : '1px solid #ddd',
        borderRadius: 2
      }}
      role="region"
      aria-label="Text to speech audio controls"
    >
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
        
        {/* Play/Pause Button */}
        <Tooltip title={isPlaying ? "Pause Audio (Space)" : "Play Audio (Space)"}>
          <Box
            component="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio playback" : "Start audio playback"}
            sx={{
              minWidth: buttonSize,
              minHeight: buttonSize,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: '24px',
              border: isLowVision ? '3px solid #000' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:focus': { outline: '3px solid #ffcc00' }
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </Box>
        </Tooltip>

        {/* Stop Button */}
        <Tooltip title="Stop Audio (Esc)">
          <Box
            component="button"
            onClick={stopAudio}
            aria-label="Stop audio playback"
            sx={{
              minWidth: buttonSize,
              minHeight: buttonSize,
              borderRadius: '50%',
              bgcolor: 'error.main',
              color: 'white',
              fontSize: '24px',
              border: isLowVision ? '3px solid #000' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:focus': { outline: '3px solid #ffcc00' }
            }}
          >
            ⏹
          </Box>
        </Tooltip>

        <Box flex={1} minWidth={150}>
          <Typography variant="body2" color="textSecondary" gutterBottom id="reading-speed-label">
            Speed ({playbackSpeed}x)
          </Typography>
          <Slider 
            value={playbackSpeed}
            min={0.5}
            max={1.5}
            step={0.25}
            onChange={changeSpeed}
            aria-labelledby="reading-speed-label"
            sx={{ color: 'primary.main', height: 8 }}
          />
        </Box>

        {isADHD && (
           <Box textAlign="center" minWidth={100}>
             <Typography variant="caption" color="textSecondary" aria-hidden="true">Status</Typography>
             <Typography variant="body2" fontWeight="bold" aria-live="polite">
                {isPlaying ? "Listening..." : "Ready"}
             </Typography>
           </Box>
        )}

      </Box>

      {/* Progress and Live Read Region */}
      <Box mt={2}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: isLowVision ? 12 : 8, borderRadius: 2 }} 
          aria-label={`Playback progress: ${Math.round(progress)}%`}
        />
        <Typography 
          variant={isLowVision ? 'h5' : 'body1'} 
          sx={{ mt: 1, minHeight: '32px', fontWeight: 'bold' }}
          color="primary"
          aria-live="assertive"
        >
          {currentWord}
        </Typography>
      </Box>

    </Paper>
  );
};

export default AudioPlayer;
