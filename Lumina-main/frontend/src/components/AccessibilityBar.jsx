import React, { useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Switch, Slider, Collapse, Tooltip } from '@mui/material';
import { useAccessibility } from '../contexts/AccessibilityContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AccessibilityBar = () => {
  const {
    isDyslexiaMode,
    toggleDyslexiaMode,
    fontSizeMultiplier,
    updateFontSize,
    highContrast,
    toggleHighContrast,
  } = useAccessibility();

  const [expanded, setExpanded] = React.useState(false);

  // Load OS prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // You can use this to set state if needed
  }, []);

  const minTouch = '48px';

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 350,
        width: '100%',
      }}
      role="complementary"
      aria-label="Universal Accessibility Controls"
    >
      <Paper
        elevation={6}
        sx={{
          p: 0,
          overflow: 'hidden',
          border: '2px solid',
          borderColor: highContrast ? '#fff' : 'primary.main',
          borderRadius: 3,
          backgroundColor: highContrast ? '#000' : '#fff',
        }}
      >
        {/* Compact Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            backgroundColor: highContrast ? '#333' : 'primary.light',
            borderBottom: expanded ? '1px solid' : 'none',
            borderColor: 'primary.main',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: highContrast ? '#fff' : 'primary.dark',
              fontSize: '14px',
            }}
          >
            ♿ Accessibility
          </Typography>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ minWidth: minTouch, minHeight: minTouch }}
            aria-label="Toggle accessibility menu"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        {/* Collapsible Controls */}
        <Collapse in={expanded} timeout="auto">
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Dyslexia Font Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tooltip title="Switch to OpenDyslexic font for better readability">
                <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                  🔤 Dyslexia Font
                </Typography>
              </Tooltip>
              <Switch
                checked={isDyslexiaMode}
                onChange={toggleDyslexiaMode}
                size="medium"
                aria-label="Toggle dyslexia font mode"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#10B981',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#10B981',
                  },
                }}
              />
            </Box>

            {/* Font Size Slider */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                📏 Font Size
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ minWidth: '30px' }}>
                  {Math.round(fontSizeMultiplier * 100)}%
                </Typography>
                <Slider
                  value={fontSizeMultiplier}
                  onChange={(e, newValue) => updateFontSize(newValue)}
                  min={0.8}
                  max={2}
                  step={0.2}
                  marks={[
                    { value: 0.8, label: 'S' },
                    { value: 1, label: 'M' },
                    { value: 2, label: 'L' },
                  ]}
                  valueLabelDisplay="off"
                  aria-label="Font size multiplier"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            {/* High Contrast Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tooltip title="Enable high contrast mode for better visibility">
                <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                  ⚫⚪ High Contrast
                </Typography>
              </Tooltip>
              <Switch
                checked={highContrast}
                onChange={toggleHighContrast}
                size="medium"
                aria-label="Toggle high contrast mode"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FBBF24',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#FBBF24',
                  },
                }}
              />
            </Box>

            {/* Info Text */}
            <Typography
              variant="caption"
              sx={{
                color: highContrast ? '#ccc' : 'text.secondary',
                fontStyle: 'italic',
                mt: 1,
              }}
            >
              Settings are saved automatically and applied globally.
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default AccessibilityBar;
