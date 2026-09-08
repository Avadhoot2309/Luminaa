import React, { useState, useEffect, useCallback } from 'react';
import GameContainer from '../../components/games/GameContainer';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export default function MemoryMatch() {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const { playMatch, playError, playVictory, playClick } = useSoundEffects();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [animating, setAnimating] = useState(new Set());

  const grade = profile?.grade || 6;
  const isLowVision = profile?.disabilities?.includes('Low Vision');

  const symbols = ['🍎', '🐶', '☀️', '⚽', '🎨', '🚀', '🧠', '🎈', '🍭', '🌊', '🦖', '🦜', '🍕', '🍰', '🏎️', '🌍'];

  const initGame = useCallback(() => {
    let pairCount = 4;
    if (grade > 3) pairCount = 8;
    if (grade > 6) pairCount = 12;

    const gameSymbols = symbols.slice(0, pairCount);
    const deck = [...gameSymbols, ...gameSymbols]
      .sort(() => Math.random() - 0.5)
      .map((s, i) => ({ id: i, symbol: s }));

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setAnimating(new Set());
  }, [grade]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Play victory sound when all cards are matched
  useEffect(() => {
    if (matched.length > 0 && cards.length > 0 && matched.length === cards.length) {
      setTimeout(() => playVictory(), 300);
    }
  }, [matched, cards.length, playVictory]);

  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    playClick();
    const newAnimating = new Set(animating);
    newAnimating.add(id);
    setAnimating(newAnimating);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [id1, id2] = newFlipped;
      if (cards[id1].symbol === cards[id2].symbol) {
        playMatch();
        setTimeout(() => {
          setMatched(m => [...m, id1, id2]);
          setScore(s => s + 500);
          setFlipped([]);
          const resetAnimating = new Set(animating);
          resetAnimating.delete(id1);
          resetAnimating.delete(id2);
          setAnimating(resetAnimating);
        }, 600);
      } else {
        playError();
        setTimeout(() => {
          setFlipped([]);
          setAnimating(new Set());
        }, 1000);
      }
    }
  };

  const gridSize = cards.length <= 8 ? '2' : cards.length <= 16 ? '4' : '6';

  const GameComponent = () => (
    <div style={{
      padding: '10px',
      width: '100%',
      height: 'calc(100vh - 180px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes flip {
          0% { transform: perspective(1000px) rotateY(0deg); }
          50% { transform: perspective(1000px) rotateY(90deg); }
          100% { transform: perspective(1000px) rotateY(0deg); }
        }
        .card-flip {
          animation: flip 0.6s ease-in-out;
        }
      `}</style>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: '8px',
        width: '96%',
        maxWidth: 'none',
        height: 'auto',
        padding: '8px',
        boxSizing: 'border-box',
        justifyItems: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          const isAnimating = animating.has(i);
          // Calculate card size based on viewport and grid
          let cardSize;
          if (cards.length <= 8) {
            cardSize = 'min(160px, calc((100vw - 40px) / 2))';
          } else if (cards.length <= 16) {
            cardSize = 'min(140px, calc((100vw - 50px) / 4))';
          } else {
            cardSize = 'min(120px, calc((100vw - 60px) / 6))';
          }
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(i)}
              className={isAnimating ? 'card-flip' : ''}
              style={{
                width: cardSize,
                height: cardSize,
                cursor: matched.includes(i) ? 'default' : 'pointer',
                backgroundColor: isFlipped ? (isLowVision ? '#000' : '#FFF') : (isLowVision ? '#222' : '#E8920C'),
                border: isLowVision ? '3px solid #FFF' : 'none',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: cards.length <= 8 ? '50px' : cards.length <= 16 ? '38px' : '28px',
                boxShadow: isFlipped ? '0 4px 10px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.3s',
                opacity: matched.includes(i) ? 0.5 : 1,
                flexShrink: 0
              }}
            >
              {isFlipped ? card.symbol : '?'}
            </div>
          );
        })}
      </div>
      {matched.length === cards.length && cards.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <h2 style={{ fontSize: '40px', color: '#FFF', margin: '20px 0' }}>{t('games.memory_match_master')}</h2>
          <button onClick={initGame} style={{ padding: '16px 40px', backgroundColor: '#E8920C', color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>{t('games.memory_match_restart')}</button>
        </div>
      )}
    </div>
  );

  return (
    <GameContainer
      title={t('games.memory_match')}
      description={t('games.memory_match_desc')}
      type="component"
      gameSource={<GameComponent />}
      background={isLowVision ? '#000' : '#F7F6F2'}
    />
  );
}
