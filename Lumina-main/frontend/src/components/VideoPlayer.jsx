import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography, Button, LinearProgress, Paper } from '@mui/material';
import { 
  getEmbedUrl, 
  getVideoByLanguage, 
  isVideoAvailable, 
  getVideoDuration 
} from '../services/videoService';

const VideoPlayer = ({ lesson, studentProfile, onComplete }) => {
  const [isHindi, setIsHindi] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const playerRef = useRef(null);
  
  // Track interval
  const intervalRef = useRef(null);

  if (!isVideoAvailable(lesson)) {
    return (
      <Box p={3} textAlign="center" border={1} borderColor="grey.300" borderRadius={2} aria-label="Video not available fallback">
        <Typography variant="h6" color="textSecondary">Video content is not available for this lesson.</Typography>
      </Box>
    );
  }

  const videoMeta = lesson.content.video;
  const isLowVision = studentProfile?.disabilities?.includes('low_vision');
  const isADHD = studentProfile?.disabilities?.includes('adhd');
  
  // Derive which video to load
  const languageOverride = isHindi ? 'hindi' : (studentProfile?.preferences?.language || 'english');
  const activeVideoId = getVideoByLanguage(lesson, languageOverride);

  // Accessible embed params via string map from service
  const embedOpts = {
    height: isLowVision ? '600' : '400',
    width: '100%',
    playerVars: {
      cc_load_policy: 1,
      cc_lang_pref: 'en',
      modestbranding: 1,
      rel: 0,
      fs: 1,
      playsinline: 1,
      color: 'white'
    }
  };

  const handleStateChange = (event) => {
    // 1 = playing, 2 = paused
    if (event.data === 1) {
      intervalRef.current = setInterval(() => {
        if (!playerRef.current) return;
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration() || videoMeta.duration_seconds;
        if (total > 0) {
          const percent = (current / total) * 100;
          setWatchProgress(percent);
          if (percent > 80 && !completed) {
            setCompleted(true);
            if (onComplete) onComplete();
          }
        }
      }, 2000);
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mt: 3, 
        border: isLowVision ? '4px solid #000' : 'none',
        borderRadius: 2
      }}
      role="region"
      aria-label="Accessible Video Player"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
        <Box>
          <Typography variant="h6" component="h2" mb={0.5} sx={{ fontWeight: isLowVision ? 700 : 500 }}>
            {videoMeta.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" aria-label={`Estimated duration: ${getVideoDuration(videoMeta.duration_seconds)}`}>
            ⏱ {getVideoDuration(videoMeta.duration_seconds)} video
          </Typography>
        </Box>

        {videoMeta.has_hindi && (
          <Button 
            variant="outlined" 
            onClick={() => setIsHindi(!isHindi)}
            sx={{ minHeight: '48px', minWidth: '48px', fontWeight: 'bold' }}
            aria-label={`Switch audio language. Currently ${isHindi ? 'Hindi' : 'English'}.`}
            color="primary"
          >
            Translate to {isHindi ? 'English' : 'Hindi'}
          </Button>
        )}
      </Box>

      {/* Progress Overlay for ADHD Focus Tracking */}
      {isADHD && (
        <Box mb={2} aria-hidden="true">
          <Typography variant="caption" color="textSecondary">Focus Tracker ({Math.round(watchProgress)}%)</Typography>
          <LinearProgress variant="determinate" value={watchProgress} sx={{ height: 10, borderRadius: 1 }} />
        </Box>
      )}

      {/* Renders iFrame */}
      <YouTube
        videoId={activeVideoId}
        opts={embedOpts}
        onReady={onReady}
        onStateChange={handleStateChange}
        title={`Video player for ${videoMeta.title}`}
        style={{ width: '100%', outline: isLowVision ? '3px solid #ffcc00' : 'none' }}
      />
    </Paper>
  );
};

export default VideoPlayer;
