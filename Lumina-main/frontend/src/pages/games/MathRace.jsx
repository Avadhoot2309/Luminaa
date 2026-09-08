import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GameContainer from '../../components/games/GameContainer';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../contexts/ProfileContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';

/**
 * Math Race: Turbo Adventure (Phaser High-Fidelity Restored)
 * Features: Parallax road, center-lane car switching, combo system, and victory celebrate.
 */

const MathRace = () => {
    const gameRef = useRef(null);
    const { t } = useTranslation();
    const { profile } = useProfile();
    const { playSuccess, playError, playVictory, playWarning } = useSoundEffects();
    const [victory, setVictory] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    // Store sound functions in ref for access from Phaser scene
    const soundFunctionsRef = useRef({ playSuccess, playError, playVictory, playWarning });
    useEffect(() => {
        soundFunctionsRef.current = { playSuccess, playError, playVictory, playWarning };
    }, [playSuccess, playError, playVictory, playWarning]);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-container',
            width: 600,
            height: 800,
            backgroundColor: '#0A1628',
            transparent: true,
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        let road, sky, stars, laneMarkers;
        let car;
        let particles;
        let questionText, scoreText, comboText;
        let score = 0;
        let combo = 0;
        let questionCount = 0;
        let isPlaying = false;
        let currentProblem = { q: '', a: 0, options: [] };
        let activeButtons = [];
        let isMoving = false;
        let currentLane = 1; // 0: left, 1: center, 2: right
        const laneX = [150, 300, 450];
        let currentSpeed = 10;
        let targetSpeed = 10;
        let questionStartTime = 0;

        function preload() {
            // Load high-quality assets (Local car png)
            this.load.image('car', '/assets/visuals/car.png');
        }

        function create() {
            const scene = this;

            // Generate procedural particle textures to avoid CORS issues
            const starGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
            starGraphics.fillStyle(0xffffff, 1);
            starGraphics.fillCircle(4, 4, 4);
            starGraphics.generateTexture('star_p', 8, 8);

            const smokeGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
            smokeGraphics.fillStyle(0xffffff, 0.5);
            smokeGraphics.fillCircle(8, 8, 8);
            smokeGraphics.generateTexture('smoke_p', 16, 16);

            // 🛣️ Parallax World
            stars = scene.add.group();
            for (let i = 0; i < 40; i++) {
                const s = scene.add.circle(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 800), Phaser.Math.FloatBetween(0.5, 2), 0xFFFFFF, 0.4);
                stars.add(s);
            }

            // Road Gradient
            const graphics = scene.add.graphics();
            graphics.fillGradientStyle(0x0f172a, 0x0f172a, 0x1e293b, 0x1e293b, 1);
            graphics.fillRect(100, 0, 400, 800);

            // Lane markers
            laneMarkers = scene.add.group();
            for (let i = 0; i < 10; i++) {
                const l1 = scene.add.rectangle(230, i * 100, 4, 40, 0x475569);
                const l2 = scene.add.rectangle(370, i * 100, 4, 40, 0x475569);
                laneMarkers.add(l1);
                laneMarkers.add(l2);
            }

            // 🚗 Car Setup
            car = scene.physics.add.sprite(laneX[1], 650, 'car').setScale(0.5);

            // New Phaser 3.60+ Particle System
            particles = scene.add.particles(0, 0, 'smoke_p', {
                speed: { min: 50, max: 150 },
                scale: { start: 0.5, end: 0 },
                blendMode: 'ADD',
                alpha: 0.3,
                angle: { min: 80, max: 100 },
                follow: car,
                followOffset: { x: 0, y: 30 }
            });

            // 🎓 UI Setup
            const uiPanel = scene.add.rectangle(300, 100, 500, 140, 0x1e293b, 0.85).setStrokeStyle(2, 0x3b82f6);
            questionText = scene.add.text(300, 85, 'Click to Start', {
                fontFamily: 'Fraunces, serif', fontSize: '38px', fontWeight: 'bold', fill: '#FFD080'
            }).setOrigin(0.5);

            scoreText = scene.add.text(300, 180, 'Score: 0', {
                fontFamily: 'Nunito, sans-serif', fontSize: '20px', fill: '#94A3B8'
            }).setOrigin(0.5);

            comboText = scene.add.text(500, 50, '', {
                fontFamily: 'Nunito, sans-serif', fontSize: '24px', fill: '#06B6D4', fontStyle: 'bold'
            }).setOrigin(0.5);

            // Global Click to Start
            scene.input.on('pointerdown', () => {
                if (!isPlaying) {
                    isPlaying = true;
                    generateQuestion.call(scene);
                }
            });
        }

        function createOptionButtons(scene, options) {
            activeButtons.forEach(btn => btn.destroy());
            activeButtons = [];

            options.forEach((opt, i) => {
                const x = laneX[i % 3];
                const y = 300 + Math.floor(i / 3) * 120;

                const bg = scene.add.rectangle(x, y, 120, 80, 0x334155, 1).setInteractive({ useHandCursor: true }).setStrokeStyle(2, 0x475569);
                const txt = scene.add.text(x, y, opt, {
                    fontSize: '28px', fontWeight: 'bold', fill: '#fff'
                }).setOrigin(0.5);

                bg.on('pointerdown', () => handleAnswer.call(scene, opt, i));
                bg.on('pointerover', () => bg.setStrokeStyle(4, 0x3b82f6));
                bg.on('pointerout', () => bg.setStrokeStyle(2, 0x475569));

                activeButtons.push(bg, txt);
            });
        }

        function generateQuestion() {
            if (questionCount >= 10) {
                soundFunctionsRef.current.playVictory();
                this.add.text(300, 400, 'FINISHED!', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
                setTimeout(() => {
                    setFinalScore(score);
                    setVictory(true);
                }, 1000);
                return;
            }

            const grade = profile?.grade || 5;
            let n1 = Phaser.Math.Between(1, 15);
            let n2 = Phaser.Math.Between(1, 10);
            let ans = n1 + n2;
            currentProblem = { q: `${n1} + ${n2}`, a: ans };

            const opts = [ans, ans + 2, Math.abs(ans - 3)].sort(() => Math.random() - 0.5);
            currentProblem.options = opts;

            questionText.setText(`${currentProblem.q} = ?`);
            createOptionButtons(this, opts);
            questionStartTime = Date.now();
        }

        function handleAnswer(choice, laneIndex) {
            if (isMoving) return;

            // Slide Car to Lane
            isMoving = true;
            this.tweens.add({
                targets: car,
                x: laneX[laneIndex],
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    isMoving = false;
                    currentLane = laneIndex;

                    if (choice === currentProblem.a) {
                        const elapsed = Date.now() - questionStartTime;
                        correctAnswer.call(this, elapsed);
                    } else {
                        wrongAnswer.call(this);
                    }
                }
            });
        }

        function correctAnswer(elapsed) {
            soundFunctionsRef.current.playSuccess();
            score += 100 + (combo * 10);
            combo++;
            questionCount++;

            // ⚡ Speed Boost logic based on response time
            if (elapsed < 2000) {
                soundFunctionsRef.current.playWarning(); // Extra excitement for fast answers
                targetSpeed = 40; // Super fast!
                this.cameras.main.shake(200, 0.01);
            } else if (elapsed < 4000) {
                targetSpeed = 25; // Good speed
            } else {
                targetSpeed = 15; // Cruise speed
            }

            scoreText.setText(`Score: ${score}`);
            if (combo > 1) comboText.setText(`${combo}x COMBO!`);

            this.cameras.main.shake(100, 0.005);
            generateQuestion.call(this);
        }

        function wrongAnswer() {
            soundFunctionsRef.current.playError();
            combo = 0;
            targetSpeed = 5; // Slow down on mistake
            comboText.setText('');
            this.cameras.main.flash(200, 200, 0, 0);
            generateQuestion.call(this);
        }

        function update() {
            // Speed decay back to normal over time
            if (targetSpeed > 10) targetSpeed -= 0.05;
            if (targetSpeed < 10) targetSpeed += 0.05;

            // Smoothlerp current speed
            currentSpeed = Phaser.Math.Linear(currentSpeed, targetSpeed, 0.1);

            // Parallax movement based on current speed
            if (laneMarkers && laneMarkers.children) {
                laneMarkers.children.iterate(child => {
                    child.y += currentSpeed;
                    if (child.y > 800) child.y = -40;
                });
            }

            if (stars && stars.children) {
                stars.children.iterate(star => {
                    star.y += currentSpeed * 0.5;
                    if (star.y > 800) star.y = -10;
                });
            }

            // Car Tilt & Vibrations at high speed
            if (car && car.x !== undefined) {
                if (car.x < laneX[currentLane]) car.angle = -5;
                else if (car.x > laneX[currentLane]) car.angle = 5;
                else car.angle = (currentSpeed > 30) ? Phaser.Math.Between(-1, 1) : 0;
            }
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, [profile?.grade, t]);

    const VictoryOverlay = () => (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 22, 40, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, color: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: '100px', marginBottom: '20px' }}>🏆</div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: '48px', color: '#FFD080', marginBottom: '8px' }}>MATH CHAMPION!</h1>
            <p style={{ fontSize: '20px', color: '#94A3B8', marginBottom: '32px' }}>Amazing speed and focus today!</p>
            <div style={{ padding: '24px 48px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '40px' }}>
                <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Total Score</div>
                <div style={{ fontSize: '42px', fontWeight: '900', color: '#fff' }}>{finalScore}</div>
            </div>
            <button onClick={() => window.location.reload()} style={{ padding: '16px 48px', borderRadius: '99px', backgroundColor: '#3B82F6', color: '#fff', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 8px 0 #1D4ED8' }}>PLAY AGAIN 🏁</button>
        </div>
    );

    return (
        <GameContainer
            title={t('games.math_race')}
            description={t('games.math_race_desc')}
            type="component"
            gameSource={
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    aspectRatio: '600 / 800',
                    maxHeight: 'calc(100vh - 150px)',
                    backgroundColor: '#020617',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                }}>
                    <div id="phaser-container" style={{ width: '100%', height: '100%' }} />
                    {victory && <VictoryOverlay />}
                </div>
            }
        />
    );
};

export default MathRace;
