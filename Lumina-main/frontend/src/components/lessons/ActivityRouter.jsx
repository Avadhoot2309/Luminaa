import React from 'react';
import TapGame from './TapGame';
import CountGame from './CountGame';
import MatchGame from './MatchGame';
import CameraCountGame from './CameraCountGame';
import VoiceInput from './VoiceInput';

/**
 * src/components/lessons/ActivityRouter.jsx
 * Dynamic router for phase "activities"
 * Determines which interactive component to render based on current activity
 */

const ActivityRouter = ({ 
  activities = [], 
  currentIndex = 0,
  onActivityComplete = null, 
  triggerReaction = null,
  isHighContrast = false 
}) => {
  const activity = activities[currentIndex];
  
  if (!activity) return null;

  switch (activity.type) {
    case 'tap':
      return (
        <TapGame 
          question={activity.question}
          options={activity.options}
          answer={activity.answer}
          onComplete={onActivityComplete}
          triggerReaction={triggerReaction}
          isHighContrast={isHighContrast}
        />
      );

    case 'count':
      return (
        <CountGame 
          question={activity.question}
          count={activity.count}
          emoji={activity.emoji}
          onComplete={onActivityComplete}
          triggerReaction={triggerReaction}
          isHighContrast={isHighContrast}
        />
      );

    case 'match':
      return (
        <MatchGame 
          pairs={activity.pairs}
          onComplete={onActivityComplete}
          triggerReaction={triggerReaction}
          isHighContrast={isHighContrast}
        />
      );

    case 'camera':
      return (
        <CameraCountGame 
          expectedCount={activity.expectedCount}
          onResult={onActivityComplete}
          triggerReaction={triggerReaction}
          isHighContrast={isHighContrast}
        />
      );

    case 'voice':
      return (
        <VoiceInput 
          question={activity.question}
          phrase={activity.phrase}
          keywords={activity.keywords}
          onResult={(res) => {
            if (res.matched || res.skipped || res.unsupported) {
              onActivityComplete && onActivityComplete();
            }
          }}
          isHighContrast={isHighContrast}
        />
      );

    default:
      console.warn(`❌ Unknown activity type: ${activity.type}`);
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: '#F78166' }}>Mystery Game! 🕵️</h2>
          <button 
            onClick={onActivityComplete} 
            style={{ padding: '1rem 2rem', background: '#58A6FF', color: 'white', border: 'none', borderRadius: '10px' }}
          >
            Skip to next →
          </button>
        </div>
      );
  }
};

export default ActivityRouter;
