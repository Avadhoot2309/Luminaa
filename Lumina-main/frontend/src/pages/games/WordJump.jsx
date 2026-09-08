import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { logStudentEvent } from '../../services/behaviorService';

const TARGET_WORDS = ['CAT', 'SUN', 'DOG', 'HAT', 'PEN'];

export default function WordJump() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const { profile } = useProfile();
  const { playSuccess, playError, playVictory, playCombo } = useSoundEffects();
  const location = useLocation();
  const navigate = useNavigate();

  const adaptiveConfig = location.state?.adaptiveConfig || { ui: {}, interaction: {}, content: {}, game: {} };
  const { game: gConf, ui: uiConf, interaction: iConf } = adaptiveConfig;

  // Track state outside phaser for UI
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetWord, setTargetWord] = useState('');
  const [spelledWord, setSpelledWord] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Derived config from engine
  const isDyslexia = profile?.disabilities?.includes('Dyslexia');
  const isADHD = profile?.disabilities?.includes('ADHD');
  const isLowVision = profile?.disabilities?.includes('Low Vision') || profile?.disabilities?.includes('Blindness');

  const speed = gConf.speed === 'slow' ? 50 : gConf.speed === 'fast' ? 150 : 100;
  const showTimer = iConf.showTimer; // specifically true for ADHD
  const useAudioHints = gConf.audioHints;

  // Store sound functions in ref to access from Phaser scene
  const soundFunctionsRef = useRef({ playSuccess, playError, playVictory, playCombo });
  useEffect(() => {
    soundFunctionsRef.current = { playSuccess, playError, playVictory, playCombo };
  }, [playSuccess, playError, playVictory, playCombo]);

  // Speak function
  const speakText = (text) => {
    if (useAudioHints && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = isDyslexia ? 0.8 : 1;
      window.speechSynthesis.speak(utter);
    }
  };

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let currentTarget = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
    let currentSpelled = "";
    let currentScore = 0;

    setTargetWord(currentTarget);
    if (useAudioHints) speakText("Spell the word: " + currentTarget);

    class MainScene extends Phaser.Scene {
      constructor() {
        super('MainScene');
        this.letters = [];
        this.spawnTimer = null;
      }

      preload() {
        // No heavy assets, purely text and generated shapes to keep it simple & fast
      }

      create() {
        // Background color based on low vision config
        if (uiConf.highContrast) {
          this.cameras.main.setBackgroundColor('#000000');
        } else {
          this.cameras.main.setBackgroundColor('#87CEEB');
        }

        // Spawn letters repeatedly
        const spawnDelay = isADHD ? 800 : (isDyslexia ? 2000 : 1200);

        this.spawnTimer = this.time.addEvent({
          delay: spawnDelay,
          callback: this.spawnLetter,
          callbackScope: this,
          loop: true
        });
      }

      spawnLetter() {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = -50;

        // 50% chance to spawn a required letter, 50% random
        const needsLetter = currentTarget[currentSpelled.length];
        const isTarget = Math.random() > 0.5 && needsLetter;

        const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const char = isTarget
          ? needsLetter
          : randomChars.charAt(Math.floor(Math.random() * randomChars.length));

        // Styles
        const fontSize = uiConf.highContrast ? '64px' : '48px';
        const textColor = uiConf.highContrast ? '#FFFF00' : '#FFFFFF';
        const bgColor = uiConf.highContrast ? 0x000000 : 0xFF9900;
        const strokeColor = uiConf.highContrast ? '#FFFFFF' : '#000000';

        // Create container for bubble + text
        const bubble = this.add.circle(0, 0, uiConf.highContrast ? 50 : 40, bgColor);

        // High contrast gets an outline
        if (uiConf.highContrast) {
          bubble.setStrokeStyle(4, 0xffffff);
        }

        const text = this.add.text(0, 0, char, {
          fontSize: fontSize,
          fontFamily: uiConf.fontFamily || 'Arial',
          color: textColor,
          stroke: strokeColor,
          strokeThickness: uiConf.highContrast ? 0 : 4,
          fontStyle: 'bold'
        }).setOrigin(0.5);

        const container = this.add.container(x, y, [bubble, text]);
        container.setSize(80, 80);

        // Enable physics/interaction
        this.physics.world.enable(container);
        container.body.setVelocityY(speed);

        container.setInteractive();

        container.on('pointerdown', () => this.handleLetterSelect(container, char));

        if (isDyslexia) {
          // Extra hint: gentle pulse
          this.tweens.add({
            targets: container,
            scaleX: 1.1,
            scaleY: 1.1,
            yoyo: true,
            repeat: -1,
            duration: 800
          });
        }

        this.letters.push(container);
      }

      handleLetterSelect(container, char) {
        if (gameOver) return;

        if (useAudioHints && char) {
          speakText(char);
        }

        const nextNeeded = currentTarget[currentSpelled.length];

        if (char === nextNeeded) {
          // Correct!
          soundFunctionsRef.current.playSuccess();
          currentSpelled += char;
          setSpelledWord(currentSpelled);

          // Flashy feedback for ADHD
          if (isADHD) {
            this.cameras.main.flash(200, 0, 255, 0, 0.2);
          }

          container.destroy();

          if (currentSpelled === currentTarget) {
            // Word complete
            soundFunctionsRef.current.playVictory();
            currentScore += 10;
            if (isADHD && timeLeft > 0) currentScore += 5; // speed bonus

            setScore(currentScore);
            setFeedback("Awesome! +10");
            if (useAudioHints) speakText("Awesome!");

            setTimeout(() => {
              setFeedback("");
              currentTarget = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
              currentSpelled = "";
              setTargetWord(currentTarget);
              setSpelledWord("");
              if (useAudioHints) speakText("Spell: " + currentTarget);
            }, 1500);
          } else {
            soundFunctionsRef.current.playCombo();
            setFeedback("Good!");
            setTimeout(() => setFeedback(""), 800);
          }
        } else {
          // Wrong letter
          soundFunctionsRef.current.playError();
          setFeedback("Oops! Need " + nextNeeded);
          container.destroy();
          setTimeout(() => setFeedback(""), 1000);
          if (isADHD) {
            this.cameras.main.shake(100, 0.01);
          }
        }
      }

      update() {
        if (gameOver) return;

        // Cleanup off-screen safely
        this.letters = this.letters.filter(l => {
          if (!l.active) return false;
          if (l.y > this.scale.height + 100) {
            l.destroy();
            return false;
          }
          return true;
        });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: containerRef.current?.offsetWidth || window.innerWidth * 0.95,
      height: containerRef.current?.offsetHeight || window.innerHeight * 0.6,
      parent: containerRef.current,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
      },
      scene: MainScene,
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
      }
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [profile]); // run once

  // Timer loop for ADHD
  useEffect(() => {
    if (!showTimer || gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      if (gameRef.current) {
        gameRef.current.scene.scenes[0].scene.pause();
      }
      handleEndGame();
      return;
    }

    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, showTimer, gameOver]);

  const handleEndGame = () => {
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    logStudentEvent({
      studentId: profile?.studentId,
      type: 'game',
      action: 'completed',
      duration,
      usedAudio: useAudioHints,
      metadata: { score }
    });
  };

  const quitGame = () => {
    handleEndGame();
    navigate('/dashboard');
  };

  const isDark = uiConf.highContrast;
  const overlayColor = isDark ? '#FFFFFF' : '#0A1628';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#000' : '#F7F6F2', fontFamily: uiConf.fontFamily || 'Nunito, sans-serif' }}>

      {/* REACT OVERLAY UI */}
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={quitGame} style={{ background: 'none', border: 'none', fontSize: 18, fontWeight: 'bold', color: overlayColor, cursor: 'pointer' }}>
          ← Back
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, color: overlayColor, fontWeight: 'bold' }}>Find the letters for:</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: isDark ? '#FFD700' : '#E8920C', letterSpacing: 8 }}>
            {targetWord}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: overlayColor, minHeight: 36 }}>
            {spelledWord}
            <span style={{ opacity: 0.3 }}>{targetWord.slice(spelledWord.length)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
          {showTimer && (
            <div style={{ fontSize: 24, fontWeight: 800, color: timeLeft < 10 ? 'red' : overlayColor }}>
              ⏱ {timeLeft}s
            </div>
          )}
          <div style={{ fontSize: 28, fontWeight: 900, color: isDark ? '#00FF00' : '#1A7A62' }}>
            Score: {score}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', height: 40, fontSize: 24, fontWeight: 'bold', color: isDark ? '#FFF' : '#E8920C' }}>
        {feedback}
      </div>

      {gameOver && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <h1 style={{ fontSize: 64, margin: 0 }}>Time's Up!</h1>
          <p style={{ fontSize: 32 }}>Final Score: {score}</p>
          <button onClick={quitGame} style={{ padding: '16px 32px', fontSize: 24, borderRadius: 16, border: 'none', background: '#E8920C', color: '#FFF', fontWeight: 'bold', cursor: 'pointer', marginTop: 24 }}>
            Return to Dashboard
          </button>
        </div>
      )}

      {/* PHASER CANVAS TARGET */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 260px)',
          margin: '0 auto',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: isDark ? '0 0 0 4px #FFF' : '0 20px 40px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
}
