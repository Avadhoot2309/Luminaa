import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Stepper, Step, StepLabel,
  Button, Paper, TextField, MenuItem, Select, FormControl,
  InputLabel, Grid, Card, CardActionArea, CardContent,
  Switch, FormControlLabel, Slider, Radio, RadioGroup, formLabelClasses,
  Alert
} from '@mui/material';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Basic Info', 'Disability Profile', 'Learning Preferences'];

const DISABILITIES = [
  { id: 'dyslexia', title: 'Dyslexia', icon: '🔤', desc: 'Difficulty with reading and spelling' },
  { id: 'adhd', title: 'ADHD', icon: '⚡', desc: 'Difficulty with focus and attention' },
  { id: 'low_vision', title: 'Low Vision', icon: '👁️', desc: 'Difficulty with seeing clearly' },
];

const FONT_SIZES = [
  { value: 1, label: 'Small' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Large' },
  { value: 4, label: 'X-Large' },
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const { currentUser } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [language, setLanguage] = useState('');

  // Step 2
  const [disabilities, setDisabilities] = useState([]);

  // Step 3
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(2); // 1 = small, 2 = medium...
  const [gameModeEnabled, setGameModeEnabled] = useState(true);
  const [readingSpeed, setReadingSpeed] = useState('medium');
  const [colorScheme, setColorScheme] = useState('default');

  const handleDisabilityToggle = (id) => {
    if (id === 'none') {
      setDisabilities([]);
      return;
    }
    setDisabilities(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!firstName || !age || !grade || !language) {
        setError('Please fill out all fields.');
        return;
      }
      if (age < 10 || age > 13) {
        setError('Age must be between 10 and 13.');
        return;
      }
      setError('');
    } else if (activeStep === 1) {
      setError('');
    }
    
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const isDyslexic = disabilities.includes('dyslexia');
      const fontSizeMap = { 1: 'small', 2: 'medium', 3: 'large', 4: 'xlarge' };
      
      const profileData = {
        userId: currentUser.uid,
        firstName,
        age: parseInt(age),
        grade: parseInt(grade),
        language,
        disabilities,
        preferences: {
          audioEnabled,
          fontSize: fontSizeMap[fontSize],
          fontFamily: isDyslexic ? 'opendyslexic' : 'roboto',
          colorScheme,
          gameModeEnabled,
          readingSpeed,
          attentionSpan: 'medium'
        },
        createdAt: new Date().toISOString(),
        currentStreak: 0
      };

      await updateProfile(profileData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
      setLoading(false);
    }
  };

  const ColorSwatch = ({ scheme, bgColor, activeBg, label }) => {
    const isSelected = colorScheme === scheme;
    return (
      <Box 
        onClick={() => setColorScheme(scheme)}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          cursor: 'pointer', opacity: isSelected ? 1 : 0.6,
          transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }
        }}
      >
        <Box 
          sx={{
            width: 80, height: 80, borderRadius: '50%', mb: 1,
            backgroundColor: isSelected ? activeBg : bgColor,
            border: isSelected ? '4px solid #1976d2' : '2px solid #ccc',
            boxShadow: isSelected ? '0 0 15px rgba(25,118,210,0.5)' : 'none'
          }}
        />
        <Typography variant="body2" sx={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
          {label}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Setup Your Lumina Profile
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box sx={{ minHeight: 300 }}>
            {/* STEP 1: Basic Info */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="First Name" required 
                    value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Age (10-13)" type="number" required 
                    inputProps={{ min: 10, max: 13 }}
                    value={age} onChange={(e) => setAge(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Grade</InputLabel>
                    <Select value={grade} label="Grade" onChange={(e) => setGrade(e.target.value)}>
                      {[5, 6, 7, 8].map(g => <MenuItem key={g} value={g}>Grade {g}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Language Preference</InputLabel>
                    <Select value={language} label="Language Preference" onChange={(e) => setLanguage(e.target.value)}>
                      {['English', 'Hindi', 'Marathi'].map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {/* STEP 2: Disability Profile */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" align="center" gutterBottom>Help us personalize your experience</Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
                  Select all that apply (you can change this later)
                </Typography>
                
                <Grid container spacing={3}>
                  {DISABILITIES.map((d) => (
                    <Grid item xs={12} sm={4} key={d.id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          border: disabilities.includes(d.id) ? '3px solid #1976d2' : '1px solid #ddd',
                          backgroundColor: disabilities.includes(d.id) ? '#e3f2fd' : 'white',
                          transition: 'all 0.2s',
                          transform: disabilities.includes(d.id) ? 'scale(1.02)' : 'none'
                        }}
                      >
                        <CardActionArea onClick={() => handleDisabilityToggle(d.id)} sx={{ height: '100%', p: 2 }}>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" sx={{ mb: 1 }}>{d.icon}</Typography>
                            <Typography variant="h6" gutterBottom>{d.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{d.desc}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box textAlign="center" mt={4}>
                  <Button 
                    variant={disabilities.length === 0 ? "contained" : "outlined"} 
                    color="inherit"
                    onClick={() => handleDisabilityToggle('none')}
                    sx={{ borderRadius: 2 }}
                  >
                    None of the above
                  </Button>
                </Box>
              </Box>
            )}

            {/* STEP 3: Learning Preferences */}
            {activeStep === 2 && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Display Preferences</Typography>
                  <Box mb={4}>
                    <Typography id="font-size-slider" gutterBottom>Font Size</Typography>
                    <Slider 
                      aria-labelledby="font-size-slider"
                      value={fontSize}
                      step={1} min={1} max={4}
                      marks={FONT_SIZES}
                      valueLabelDisplay="off"
                      onChange={(_, newVal) => setFontSize(newVal)}
                    />
                  </Box>
                  <Box>
                    <Typography gutterBottom sx={{ mb: 2 }}>Color Scheme</Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                      <ColorSwatch scheme="default" bgColor="#ffffff" activeBg="#ffffff" label="Default" />
                      <ColorSwatch scheme="dyslexia_friendly" bgColor="#fffaeb" activeBg="#FFF5D1" label="Dyslexia Friendly" />
                      <ColorSwatch scheme="high_contrast" bgColor="#333333" activeBg="#1a1a1a" label="High Contrast" />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Learning & Content</Typography>
                  
                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <Typography gutterBottom>Reading Speed</Typography>
                    <RadioGroup 
                      row value={readingSpeed} 
                      onChange={(e) => setReadingSpeed(e.target.value)}
                    >
                      <FormControlLabel value="slow" control={<Radio />} label="Slow" />
                      <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                      <FormControlLabel value="fast" control={<Radio />} label="Fast" />
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">Audio Narration</Typography>
                        <Typography variant="body2" color="text.secondary">Read text out loud automatically</Typography>
                      </Box>
                      <Switch checked={audioEnabled} onChange={(e) => setAudioEnabled(e.target.checked)} color="primary" />
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">Game Mode</Typography>
                        <Typography variant="body2" color="text.secondary">Learn through games and challenges</Typography>
                      </Box>
                      <Switch checked={gameModeEnabled} onChange={(e) => setGameModeEnabled(e.target.checked)} color="secondary" />
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
            <Button disabled={activeStep === 0 || loading} onClick={handleBack} variant="outlined" size="large">
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained" color="primary" size="large" disabled={loading}>
                {loading ? 'Saving...' : 'Finish Setup'}
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained" color="primary" size="large">
                Next Request
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
