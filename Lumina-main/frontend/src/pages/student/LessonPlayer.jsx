import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Services
import ttsService from '../../services/ttsService';
import adaptiveEngine from '../../services/adaptiveEngine';
import rewardService from '../../services/rewardService';
import reactionService from '../../services/reactionService';

// Data
import { syllabusData, getLessonById } from '../../data/syllabusData';

// Components
import StartScreen from '../../components/lessons/StartScreen';
import StoryPlayer from '../../components/lessons/StoryPlayer';
import InteractionOverlay from '../../components/lessons/InteractionOverlay';
import VideoPlayer from '../../components/lessons/VideoPlayer';
import ActivityRouter from '../../components/lessons/ActivityRouter';
import QuizPlayer from '../../components/lessons/QuizPlayer';
import CompletionScreen from '../../components/lessons/CompletionScreen';
import Companion from '../../components/lessons/Companion';
import ReactionEngine from '../../components/lessons/ReactionEngine';
import BreakCheckModal from '../../components/lessons/BreakCheckModal';

/**
 * src/pages/student/LessonPlayer.jsx
 * The Core Orchestration State Machine for Luminaa
 * Handles 100% Frictionless Auto-Flow (Section 4)
 */

const LessonPlayer = () => {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();

  // Core Flow State: 'start' | 'story' | 'interact' | 'video' | 'activities' | 'quiz' | 'complete'
  const [phase, setPhase] = useState('start');
  const [lesson, setLesson] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Experience Settings (Accessibility-First)
  const [settings, setSettings] = useState({
    isHighContrast: false,
    isDyslexia: false,
    isADHD: false
  });

  // Companion & Reaction State
  const [companionState, setCompanionState] = useState('idle');
  const [companionMsg, setCompanionMsg] = useState("");
  const [reactionTrigger, setReactionTrigger] = useState(null);

  // 🔮 Central Reaction Trigger
  const triggerReaction = useCallback((type) => {
    setReactionTrigger(type);
    reactionService.trigger(type);

    // Update companion state for immediate reaction
    if (type === 'correct') setCompanionState('happy');
    if (type === 'wrong') setCompanionState('sad');
    if (type === 'encourage') setCompanionState('encourage');

    // Reset trigger after delay
    setTimeout(() => {
      setReactionTrigger(null);
    }, 3000);
  }, []);

  // Progress Trackers
  const [activityIndex, setActivityIndex] = useState(0);
  const [stars, setStars] = useState(0);

  // 🎥 Video Tracking & Break Check (NEW)
  const [videosWatched, setVideosWatched] = useState(() => {
    // Retrieve from sessionStorage to persist across lesson navigation
    const stored = sessionStorage.getItem('videosWatchedThisSession');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showBreakModal, setShowBreakModal] = useState(false);

  // Initialize Lesson & Subject
  useEffect(() => {
    const loadContent = () => {
      // 🔴 BUG 1 FIX: Correct data structure traversal
      const result = getLessonById(lessonId);
      if (!result) {
        console.warn(`Lesson ${lessonId} not found.`);
        return setLoading(false);
      }

      setSubject(result.subject);
      setLesson(result.lesson);
      setLoading(false);

      // 🏆 Initial Personality check from companion logic
      setCompanionState('idle');
      setCompanionMsg(`Hi! Ready for ${result.lesson.title}?`);
    };

    loadContent();

    // Cleanup all TTS on exit
    return () => ttsService.stop();
  }, [lessonId]);

  // Load Student Profile Traits
  useEffect(() => {
    const mockProfile = { traits: { highContrast: false, dyslexia: false, adhd: false } };
    const adaptiveSettings = adaptiveEngine.applyStudentProfile(mockProfile);
    setSettings(adaptiveSettings);
  }, []);

  /**
   * 🔴 BUG 5 FIX: Expanded Companion State Logic
   */
  const updateCompanionForPhase = useCallback((nextPhase) => {
    switch (nextPhase) {
      case 'start':
        setCompanionState('idle');
        break;
      case 'story':
        setCompanionState('talking');
        break;
      case 'interact':
        setCompanionState('listen');
        setCompanionMsg("Repeat after me! 🎤");
        break;
      case 'video':
        setCompanionState('thinking');
        setCompanionMsg("Watch this! 👀");
        break;
      case 'activities':
        setCompanionState('encourage'); // BUG 5 FIX
        setCompanionMsg("Let's play games! 🧩");
        break;
      case 'quiz':
        setCompanionState('thinking'); // BUG 5 FIX
        setCompanionMsg("Pop Quiz! You've got this! 💪");
        break;
      case 'complete':
        setCompanionState('happy');
        setCompanionMsg("WE DID IT! 🥳");
        break;
      default:
        break;
    }
  }, []);

  /**
   * Orchestrator: Main Flow Transitions (Section 4)
   * NEW: Track video completion for break suggestions
   */
  const advancePhase = useCallback((next) => {
    // 🎥 NEW: Track video completion
    if (next === 'activities') {
      // User just finished watching a video, increment counter
      const newCount = videosWatched + 1;
      setVideosWatched(newCount);
      sessionStorage.setItem('videosWatchedThisSession', newCount.toString());

      // Show break modal after 3 videos
      if (newCount === 3) {
        setShowBreakModal(true);
        // Don't advance phase yet - wait for user response
        return;
      }
    }

    setPhase(next);
    updateCompanionForPhase(next);

    // 🔴 WOW MOMENT: High-impact celebration on completion
    if (next === 'complete') {
      triggerReaction('correct');
      rewardService.saveProgress({
        studentId: 'student_user',
        lessonId,
        stars: stars + 5,
        completedAt: new Date()
      });
    }
  }, [videosWatched, updateCompanionForPhase, triggerReaction, lessonId, stars]);

  /**
   * Interaction Handlers
   */
  // 🔴 BUG 3 & BUG 10 FIX: Cycle through all activities and wrap onComplete in useCallback
  const handleActivityComplete = useCallback(() => {
    setStars(prev => prev + 1);
    triggerReaction('correct');

    if (lesson.activities && activityIndex < lesson.activities.length - 1) {
      setActivityIndex(prev => prev + 1);
    } else {
      advancePhase('quiz');
    }
  }, [activityIndex, lesson, advancePhase]);

  // 🔴 BUG 4 FIX: Receive quizStars from QuizPlayer and update once
  const handleQuizComplete = useCallback((quizStars) => {
    setStars(prev => prev + quizStars);
    advancePhase('complete');
  }, [advancePhase]);

  // 🎥 NEW: Handle break check modal responses
  const handleContinueLearning = useCallback(() => {
    setShowBreakModal(false);
    setPhase('activities');
    updateCompanionForPhase('activities');
  }, [updateCompanionForPhase]);

  const handleTakeBreak = useCallback(() => {
    setShowBreakModal(false);
    // Reset video counter and navigate to games for a break
    sessionStorage.setItem('videosWatchedThisSession', '0');
    setVideosWatched(0);
    navigate('/games');
  }, [navigate]);

  const handleExitLesson = useCallback(() => {
    ttsService.stop();
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/subjects');
  }, [navigate]);

  // UI Styles
  const styles = {
    screen: {
      position: 'fixed',
      inset: 0,
      backgroundColor: settings.isHighContrast ? '#000000' : '#FFFDF5',
      color: '#2D2D2D',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none',
      fontFamily: '"Nunito", sans-serif'
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem 2rem',
      position: 'relative',
      width: '100%',
      maxHeight: 'calc(100vh - 40px)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    statusBar: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      zIndex: 1000
    },
    backBar: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    },
    starBadge: {
      backgroundColor: '#FFFFFF',
      border: settings.isHighContrast ? '4px solid #FFFFFF' : '2px solid rgba(255,184,0,0.2)',
      color: '#2D2D2D',
      padding: '0.6rem 1.2rem',
      borderRadius: '50px',
      fontSize: '1.2rem',
      fontWeight: '900',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
    }
  };

  // 📝 Dyslexia Font Override
  if (settings.isDyslexia) {
    styles.screen.fontFamily = "'OpenDyslexic', sans-serif";
  }

  if (loading) return <div style={styles.screen}>Loading Adventure...</div>;
  if (!lesson) return <div style={styles.screen}>Lesson Not Found</div>;

  return (
    <main style={styles.screen} data-dyslexia={settings.isDyslexia} data-hc={settings.isHighContrast}>
      {/* 🔮 Visual Feedback Overlay */}
      <ReactionEngine trigger={reactionTrigger} />

      {/* 🎥 NEW: Break Check Modal - After 3 Videos */}
      {showBreakModal && (
        <BreakCheckModal
          videosWatched={videosWatched}
          onContinue={handleContinueLearning}
          onTakeBreak={handleTakeBreak}
        />
      )}

      {/* 🦉 The Companion Helper */}
      {/* <Companion state={companionState} message={companionMsg} isHighContrast={settings.isHighContrast} /> */}

      {/* ⭐️ Real-time Star Count */}
      <div style={styles.statusBar}>
        <div style={styles.starBadge} aria-label={`${stars} stars collected`}>
          ⭐ {stars}
        </div>
      </div>

      <div style={styles.backBar}>
        <button
          onClick={handleExitLesson}
          style={{
            backgroundColor: '#FFFFFF',
            border: settings.isHighContrast ? '3px solid #FFFFFF' : '2px solid rgba(10,22,40,0.14)',
            color: settings.isHighContrast ? '#000000' : '#0A1628',
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: '900',
            cursor: 'pointer',
            fontFamily: styles.screen.fontFamily,
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
          }}
          aria-label="Exit lesson"
        >
          ← Back
        </button>
      </div>

      {/* 🚀 Phase Router */}
      <div style={styles.mainArea}>
        {phase === 'start' && (
          <StartScreen
            lesson={lesson}
            subject={subject}
            onStart={() => advancePhase('story')}
            isHighContrast={settings.isHighContrast}
          />
        )}

        {phase === 'story' && (
          <StoryPlayer
            chunks={lesson.story?.chunks || [lesson.description]}
            hints={lesson.story?.visualHints || {}}
            fallbackImage={lesson.illustration || ""}
            subjectId={subject.id}
            onComplete={() => advancePhase('interact')}
            isADHD={settings.isADHD}
            isHighContrast={settings.isHighContrast}
          />
        )}

        {phase === 'interact' && (
          <InteractionOverlay
            visible={true}
            keywords={lesson.story?.keywords || ["Hello"]}
            prompt="Try saying a keyword from the story!"
            onCorrect={() => advancePhase('video')}
            onSkip={() => advancePhase('video')}
            isHighContrast={settings.isHighContrast}
          />
        )}

        {phase === 'video' && (
          <VideoPlayer
            // 🔴 BUG 2 FIX: video structure correction
            video={{ url: lesson.video.url, title: lesson.video.title }}
            onContinue={() => advancePhase('activities')}
            isHighContrast={settings.isHighContrast}
          />
        )}

        {phase === 'activities' && (
          <ActivityRouter
            activities={lesson.activities}
            currentIndex={activityIndex}
            onActivityComplete={handleActivityComplete}
            triggerReaction={triggerReaction}
            isHighContrast={settings.isHighContrast}
          />
        )}

        {phase === 'quiz' && (
          <QuizPlayer
            quiz={lesson.quiz}
            onComplete={handleQuizComplete}
            triggerReaction={triggerReaction}
            isHighContrast={settings.isHighContrast}
          />
        )}

        {phase === 'complete' && (
          <CompletionScreen
            lesson={lesson}
            stars={stars}
            onReturn={() => navigate('/dashboard')}
            isHighContrast={settings.isHighContrast}
          />
        )}
      </div>
    </main>
  );
};

export default LessonPlayer;
