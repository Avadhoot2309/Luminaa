import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import ttsService from '../services/tts-service';
import ocrService from '../services/ocr-service';
import aiService from '../services/ai-simplification-service';

export default function TestServices() {
  const [text, setText] = useState('Hello! This is a test of text to speech.');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [ocrResult, setOcrResult] = useState('');

  // Test TTS
  const handleSpeak = async () => {
    try {
      await ttsService.speak(text, { rate: 0.9 });
      alert('Speech completed!');
    } catch (error) {
      alert('TTS failed: ' + error.message);
    }
  };

  // Test Text Simplification
  const handleSimplify = async () => {
    try {
      const result = await aiService.simplifyText(text);
      setSimplifiedText(result);
    } catch (error) {
      alert('Simplification failed: ' + error.message);
    }
  };

  // Test OCR
  const handleOCR = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await ocrService.extractText(file);
      setOcrResult(result.text);
    } catch (error) {
      alert('OCR failed: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Free AI Services
      </Typography>

      {/* TTS Test */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Text-to-Speech (Free)</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" onClick={handleSpeak} sx={{ mt: 2 }}>
          🔊 Speak
        </Button>
        <Button variant="outlined" onClick={() => ttsService.stop()} sx={{ mt: 2, ml: 2 }}>
          Stop
        </Button>
      </Paper>

      {/* Text Simplification Test */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Text Simplification (Groq - Free)</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" onClick={handleSimplify} sx={{ mt: 2 }}>
          ✨ Simplify
        </Button>
        {simplifiedText && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Simplified:
            </Typography>
            <Typography variant="body1">{simplifiedText}</Typography>
          </Box>
        )}
      </Paper>

      {/* OCR Test */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">OCR (Tesseract - Free)</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleOCR}
          style={{ marginTop: 16 }}
        />
        {ocrResult && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Extracted Text:
            </Typography>
            <Typography variant="body1">{ocrResult}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
