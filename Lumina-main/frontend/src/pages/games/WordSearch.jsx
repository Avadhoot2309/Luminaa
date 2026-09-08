import React, { useState, useEffect, useCallback } from 'react';
import GameContainer from '../../components/games/GameContainer';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export default function WordSearch() {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const { playSuccess, playVictory } = useSoundEffects();
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [found, setFound] = useState([]);
  const [selection, setSelection] = useState([]);

  const grade = profile?.grade || 6;
  const isDyslexic = profile?.disabilities?.includes('Dyslexia');

  const wordBank = {
    1: ['CAT', 'DOG', 'SUN', 'HAT', 'PEN'],
    6: ['FRACTION', 'ALGEBRA', 'NUMBER', 'GEOMETRY', 'RATIO'],
    10: ['EQUATION', 'THEOREM', 'POLYNOMIAL', 'PARABOLA', 'SYMMETRY']
  };

  const initGame = useCallback(() => {
    const currentWords = wordBank[grade] || wordBank[6];
    setWords(currentWords);
    setFound([]);
    setSelection([]);

    const size = 10;
    const newGrid = Array(size).fill(0).map(() => Array(size).fill(''));

    // Simplified placement for native demo
    currentWords.forEach((word, wordIdx) => {
      const row = wordIdx;
      for (let i = 0; i < word.length; i++) {
        newGrid[row][i] = word[i];
      }
    });

    // Fill blanks
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!newGrid[r][c]) {
          newGrid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    setGrid(newGrid);
  }, [grade]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (r, c) => {
    const char = grid[r][c];
    const newSelection = [...selection, { r, c, char }];
    setSelection(newSelection);

    const selectedWord = newSelection.map(s => s.char).join('');
    if (words.includes(selectedWord)) {
      playSuccess();
      setFound(f => [...f, selectedWord]);
      setSelection([]);
    } else if (selectedWord.length > 10) {
      setSelection([]);
    }
  };

  const GameComponent = () => (
    <div style={{ padding: '20px', width: '100%', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: isDyslexic ? 'OpenDyslexic, sans-serif' : 'Nunito, sans-serif' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {words.map(w => (
          <span key={w} style={{
            textDecoration: found.includes(w) ? 'line-through' : 'none',
            color: found.includes(w) ? '#94A3B8' : '#1A7A62',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>{w}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', border: '4px solid #E8920C', padding: '10px', borderRadius: '12px', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        {grid.map((row, r) => row.map((char, c) => {
          const isSelected = selection.some(s => s.r === r && s.c === c);
          return (
            <div
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? '#E8920C' : '#FFF',
                color: isSelected ? '#FFF' : '#334155',
                borderRadius: '4px',
                fontSize: '20px',
                fontWeight: '900',
                cursor: 'pointer'
              }}
            >
              {char}
            </div>
          );
        }))}
      </div>
      <button onClick={() => setSelection([])} style={{ marginTop: '20px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#CBD5E1', cursor: 'pointer' }}>{t('games.word_search_clear')}</button>
    </div >
  );

  return (
    <GameContainer
      title={t('games.word_search')}
      description={t('games.word_search_grid_desc', { grade })}
      type="component"
      gameSource={<GameComponent />}
      background="#FFFBF0"
    />
  );
}
