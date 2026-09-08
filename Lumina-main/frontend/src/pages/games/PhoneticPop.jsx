import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GameContainer from '../../components/games/GameContainer';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export default function PhoneticPop() {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const { playSuccess, playError } = useSoundEffects();
  const [score, setScore] = useState(0);

  // Disability flags
  const hasDyslexia = profile?.disabilities?.includes('Dyslexia');
  const hasLowVision = profile?.disabilities?.includes('Low Vision');

  // Store sound functions in ref
  const soundFunctionsRef = useRef({ playSuccess, playError });
  useEffect(() => {
    soundFunctionsRef.current = { playSuccess, playError };
  }, [playSuccess, playError]);

  const GameComponent = () => {
    const containerRef = useRef(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const config = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: window.innerWidth * 0.95,
        height: window.innerHeight * 0.85,
        transparent: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          expandParent: true
        },
        physics: {
          default: 'arcade',
          arcade: { gravity: { y: 100 } }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      };

      const game = new Phaser.Game(config);
      let letters = [];
      let nextLetter = 'A';
      let gameScore = 0;

      function speak(text) {
        if ('speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(text);
          utter.rate = 0.8;
          window.speechSynthesis.speak(utter);
        }
      }

      function preload() { }

      function create() {
        const scene = this;

        // Visual for Dyslexia: OpenDyslexic-like font style and high contrast
        const font = hasDyslexia ? 'OpenDyslexic, sans-serif' : 'Nunito, sans-serif';
        const color = hasDyslexia ? '#0000FF' : '#E8920C';

        this.targetText = this.add.text(400, 50, `${t('games.phonetic_pop_pop')} : A`, {
          fontSize: '32px',
          fontFamily: font,
          fill: hasLowVision ? '#FFFF00' : '#1A7A62',
          fontWeight: '900'
        }).setOrigin(0.5);

        speak(`${t('games.phonetic_pop_pop')} A`);

        // Spawn timer
        this.time.addEvent({
          delay: hasDyslexia ? 2000 : 1500,
          callback: () => {
            const x = Phaser.Math.Between(50, 750);
            const chars = "ABCDEFGHIJKLMN";
            const char = Math.random() > 0.4 ? nextLetter : chars[Math.floor(Math.random() * chars.length)];

            const circle = scene.add.circle(0, 0, 40, hasDyslexia ? 0xFFEE00 : 0xFF9900);
            if (hasLowVision) circle.setStrokeStyle(4, 0xFFFFFF);

            const text = scene.add.text(0, 0, char, {
              fontSize: '32px',
              fontFamily: font,
              fill: '#000',
              fontWeight: 'bold'
            }).setOrigin(0.5);

            const container = scene.add.container(x, -50, [circle, text]);
            scene.physics.world.enable(container);
            container.body.setGravityY(hasDyslexia ? 50 : 100);
            container.setInteractive(new Phaser.Geom.Circle(0, 0, 40), Phaser.Geom.Circle.Contains);

            container.on('pointerdown', () => {
              if (char === nextLetter) {
                soundFunctionsRef.current.playSuccess();
                gameScore += 20;
                setScore(gameScore);
                speak(t('common.ready'));

                // Set next target
                const alphabet = "ABCDEFGHIJKLMN";
                nextLetter = alphabet[alphabet.indexOf(nextLetter) + 1] || 'A';
                scene.targetText.setText(`${t('games.phonetic_pop_pop')} : ` + nextLetter);
                speak(`${t('games.phonetic_pop_pop')} ` + nextLetter);

                container.destroy();
              } else {
                soundFunctionsRef.current.playError();
                speak(t('sign_match_try_again'));
                container.destroy();
              }
            });

            letters.push(container);
          },
          loop: true
        });
      }

      function update() {
        letters = letters.filter(l => {
          if (l.y > 550) {
            l.destroy();
            return false;
          }
          return true;
        });
      }

      return () => {
        game.destroy(true);
      };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: 'calc(100vh - 180px)', margin: '0 auto', borderRadius: '24px', overflow: 'hidden' }} />;
  };

  return (
    <GameContainer
      title={t('games.phonetic_pop')}
      description={t('games.phonetic_pop_desc')}
      type="component"
      gameSource={<GameComponent />}
      background={hasLowVision ? '#000' : '#FFFBF0'}
    />
  );
}
