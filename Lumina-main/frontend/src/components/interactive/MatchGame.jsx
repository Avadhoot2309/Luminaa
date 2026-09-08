import React, { useState, useEffect } from 'react';
import reactionService from '../../services/reactionService';

const MatchGame = ({ options = [], onComplete, isHighContrast = false, accentColor = '#E8920C' }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState({}); // { wordId: imageId }
  const [items, setItems] = useState([]); // Mixed words and images

  useEffect(() => {
    // Generate initial items
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [options]);

  const handleSelect = (item) => {
    reactionService.playClick();
    if (item.type === 'word') {
      setSelectedWord(item);
    } else if (selectedWord && item.type === 'image' && item.matchId === selectedWord.id) {
       // Correct Match
       setMatches(prev => ({ ...prev, [selectedWord.id]: item.id }));
       setSelectedWord(null);
       reactionService.playSuccess();
       
       if (Object.keys(matches).length + 1 === options.length / 2) {
         setTimeout(() => onComplete && onComplete(), 2000);
       }
    } else if (selectedWord && item.type === 'image') {
       // Wrong match
       reactionService.playError();
       setSelectedWord(null);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>
      <style>{`
        @keyframes flow-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '800px', width: '100%',
        padding: '3rem', borderRadius: '4rem', background: isHighContrast ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px)', animation: 'flow-in 0.6s ease-out', border: `2px solid ${accentColor}22`
      }}>
        {items.map(it => {
          const isMatched = matches[it.id] || Object.values(matches).includes(it.id);
          const isSelected = selectedWord?.id === it.id;
          
          return (
            <div
              key={it.id}
              onClick={() => !isMatched && handleSelect(it)}
              style={{
                aspectRatio: '1', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: it.type === 'image' ? '4rem' : '1.5rem', fontWeight: 900, cursor: isMatched ? 'default' : 'pointer',
                backgroundColor: isMatched ? '#22C55E' : (isSelected ? accentColor : (isHighContrast ? '#333' : '#FFFFFF')),
                color: isMatched || isSelected ? '#FFF' : (isHighContrast ? '#FFF' : '#1A2635'),
                boxShadow: isMatched ? 'none' : `0 10px 20px rgba(0,0,0,0.06)`,
                border: isSelected ? `4px solid #1A2635` : 'none',
                opacity: isMatched ? 0.4 : 1,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {it.type === 'image' ? it.val : it.val.toUpperCase()}
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: accentColor }}>
        Match the words to the pictures! 🧩
      </h2>
    </div>
  );
};

export default MatchGame;
