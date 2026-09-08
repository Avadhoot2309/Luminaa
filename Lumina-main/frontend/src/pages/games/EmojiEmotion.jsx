import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ttsService from '../../services/ttsService';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const EMOTIONS = [
  { id: 'happy', emoji: '😁', label: 'Happy', threshold: 0.8 },
  { id: 'surprised', emoji: '😲', label: 'Surprised', threshold: 0.8 },
  { id: 'sad', emoji: '😢', label: 'Sad', threshold: 0.7 },
  { id: 'angry', emoji: '😠', label: 'Angry', threshold: 0.7 },
];

export default function EmojiEmotion() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { playSuccess, playCombo } = useSoundEffects();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotionIdx, setCurrentEmotionIdx] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentEmotion = EMOTIONS[currentEmotionIdx];

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models", err);
        setError("Failed to load AI models. Ensure they exist in /public/models.");
      }
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLoading(false);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera permission denied or camera not available.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  // Clean up global interval for face detection
  useEffect(() => {
    let intervalId;

    if (modelsLoaded && !loading && !success) {
      intervalId = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
          try {
            const detections = await faceapi.detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            ).withFaceExpressions();

            if (detections) {
              const expr = detections.expressions;
              const val = expr[currentEmotion.id];

              if (val > currentEmotion.threshold) {
                setSuccess(true);
              }
            }
          } catch (e) { }
        }
      }, 500); // Check every half a second
    }

    return () => clearInterval(intervalId);
  }, [modelsLoaded, loading, success, currentEmotion]);

  const handleNext = () => {
    setSuccess(false);
    setCurrentEmotionIdx((prev) => (prev + 1) % EMOTIONS.length);
  };

  // Trigger voice when a new emotion appears
  useEffect(() => {
    if (modelsLoaded && !loading && !success && !error) {
      ttsService.speak(`Can you show me a ${currentEmotion.label} face?`);
    }
  }, [currentEmotionIdx, modelsLoaded, loading, success, error, currentEmotion]);

  // Trigger voice when they get it right
  useEffect(() => {
    if (success) {
      playCombo();
      ttsService.speak("Great job!");
    }
  }, [success, playCombo]);

  // Clean up: Stop video & audio on unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', py: 6, backgroundColor: '#f0f4f8' }}>
      <Box maxWidth="lg" mx="auto" px={3}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ fontWeight: 700, borderRadius: '12px' }}
          >
            ← Back
          </Button>
        </Box>

        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1a3a5c' }}>
          Emotion Mirror 🪞
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Make a face to match the Emoji!
        </Typography>

        {error ? (
          <Box textAlign="center" mt={5}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={startVideo}>Retry Camera</Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="center" justifyContent="center" mt={4}>

            {/* Left Box: Emoji Target */}
            <Paper elevation={4} sx={{
              p: 4, width: '100%', maxWidth: 400, textAlign: 'center', borderRadius: 4,
              border: success ? '4px solid #4CAF50' : '4px solid transparent',
              transition: 'border 0.3s'
            }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Can you show me...
              </Typography>
              <Typography variant="h1" sx={{ fontSize: '120px', my: 2 }}>
                {currentEmotion.emoji}
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {currentEmotion.label}?
              </Typography>

              {success && (
                <Box mt={4} animation="pulse 1s infinite">
                  <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 2 }}>
                    Great Job! 🎉
                  </Typography>
                  <Button variant="contained" size="large" onClick={handleNext} sx={{ borderRadius: 8 }}>
                    Next Emotion
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Right Box: Camera */}
            <Paper elevation={4} sx={{ width: '100%', maxWidth: 500, minHeight: 375, overflow: 'hidden', borderRadius: 4, position: 'relative' }}>
              {(!modelsLoaded || loading) && (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%" position="absolute" top={0} left={0} bgcolor="#e2e8f0" zIndex={2}>
                  <CircularProgress size={60} />
                  <Typography mt={2}>{!modelsLoaded ? 'Loading AI Models...' : 'Starting Camera...'}</Typography>
                </Box>
              )}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '375px', objectFit: 'cover', transform: 'scaleX(-1)' }} // Mirror the video so it feels natural
                onPlaying={() => setLoading(false)}
              />
            </Paper>

          </Box>
        )}
      </Box>
    </Box>
  );
}
