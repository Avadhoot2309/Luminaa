import React, { useState, useEffect, useMemo } from 'react';

/**
 * src/components/lessons/MatchGame.jsx
 * Word-to-image card matching activity for literacy and visual recognition
 */

const MatchGame = ({ 
  pairs = [], 
  onComplete = null, 
  triggerReaction = null,
  isHighContrast = false 
}) => {
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState({}); // matchId -> true
  const [wrong, setWrong] = useState(null);

  // Shuffle both sets of cards independently but keep the matchId link
  const cards = useMemo(() => {
    const words = pairs.map(p => ({ id: `word-${p.matchId}`, type: 'word', content: p.word, matchId: p.matchId }));
    const images = pairs.map(p => ({ id: `img-${p.matchId}`, type: 'image', content: p.image, matchId: p.matchId }));
    
    // Simple deterministic shuffle to keep cards fresh
    return {
      wordList: [...words].sort(() => Math.random() - 0.5),
      imageList: [...images].sort(() => Math.random() - 0.5)
    };
  }, [pairs]);

  const totalPairs = pairs.length;

  useEffect(() => {
    // 🚨 BUG 5 FIX: MatchGame completion check logic
    if (Object.keys(matches).length === totalPairs && totalPairs > 0) {
      // 1.5s delay before moving to next activity
      const timer = setTimeout(() => onComplete && onComplete(), 1500);
      return () => clearTimeout(timer);
    }
  }, [matches, totalPairs, onComplete]);

  const handleCardClick = (card) => {
    if (matches[card.matchId] || (wrong && (wrong.id1 === card.id || wrong.id2 === card.id))) return;

    if (!selected) {
      setSelected(card);
      if (triggerReaction) triggerReaction('click');
    } else {
      // Tapping the same card twice deselects it
      if (selected.id === card.id) {
        setSelected(null);
        if (triggerReaction) triggerReaction('click');
        return;
      }

      // Check if it's a match
      if (selected.matchId === card.matchId && selected.type !== card.type) {
        // Success
        setMatches(prev => ({ ...prev, [card.matchId]: true }));
        setSelected(null);
        
        // Trigger celebration sound for this pair
        // If it's the LAST pair, LessonPlayer might handle the phase change, 
        // but we want the 'correct' sound immediately.
        if (triggerReaction) triggerReaction('correct');
      } else {
        // Fail: Wrong pair
        setWrong({ id1: selected.id, id2: card.id });
        setSelected(null);
        if (triggerReaction) triggerReaction('wrong');
        setTimeout(() => setWrong(null), 800);
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      height: '100%',
      width: '100%'
    },
    title: {
      fontSize: 'clamp(1.5rem, 4vh, 2.5rem)',
      fontWeight: '900',
      color: isHighContrast ? '#FFFFFF' : '#2D2D2D',
      marginBottom: '2vh',
      fontFamily: "'Fredoka One', cursive"
    },
    gameBoard: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '60vh',
      overflowY: 'auto',
      padding: '1rem'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    card: (item) => {
      const isSelected = selected?.id === item.id;
      const isMatched = matches[item.matchId];
      const isWrong = wrong?.id1 === item.id || wrong?.id2 === item.id;

      return {
        backgroundColor: isMatched ? '#4CAF50' : (isSelected ? '#FFEECC' : (isHighContrast ? '#161B22' : '#FFFFFF')),
        color: isMatched ? '#FFFFFF' : '#2D2D2D',
        fontSize: item.type === 'image' ? 'clamp(2rem, 6vh, 3.5rem)' : 'clamp(1rem, 2.5vh, 1.4rem)',
        fontWeight: '900',
        padding: '1rem',
        borderRadius: '1.5rem',
        border: isMatched ? '4px solid #4CAF50' : 
                (isSelected ? '4px solid #FF6B35' : 
                (isWrong ? '4px solid #FF6B35' : 
                (isHighContrast ? '4px solid #FFFFFF' : '2px solid #F5F0E8'))),
        cursor: isMatched ? 'default' : 'pointer',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'clamp(60px, 12vh, 100px)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isSelected ? 'scale(1.05)' : (isWrong ? 'scale(0.95)' : 'scale(1)'),
        boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
        animation: isWrong ? 'shake 0.5s' : 'none',
        opacity: isMatched ? 0.6 : 1
      };
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) rotate(-1deg); }
          75% { transform: translateX(8px) rotate(1deg); }
        }
      `}</style>
      
      <h2 style={styles.title}>Match the words with images! 🧩</h2>

      <div style={styles.gameBoard}>
        {/* Words Column */}
        <div style={styles.column}>
          {cards.wordList.map(item => (
            <button 
              key={item.id} 
              style={styles.card(item)} 
              onClick={() => handleCardClick(item)}
              aria-label={`Match word: ${item.content}`}
            >
              {item.content}
            </button>
          ))}
        </div>

        {/* Images Column */}
        <div style={styles.column}>
          {cards.imageList.map(item => (
            <button 
              key={item.id} 
              style={styles.card(item)} 
              onClick={() => handleCardClick(item)}
              aria-label={`Match image: ${item.matchId}`}
            >
              {item.content}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchGame;
