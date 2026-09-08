import React, { useState, useEffect } from 'react';
import reactionService from '../../services/reactionService';

/**
 * Bubble - A single interactive element in the TapGame
 */
const Bubble = ({ item, isAnswer, onSelect, accentColor, isHighContrast }) => {
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleTap = () => {
    if (popped) return;
    setPopped(true);
    reactionService.playClick();
    onSelect(item, isAnswer);
  };

  return (
    <div
      onClick={handleTap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', width: '130px', height: '130px', borderRadius: '50%',
        backgroundColor: popped ? (isAnswer ? '#22C55E' : '#FF6B6B') : (isHighContrast ? '#333' : '#FFF'),
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem',
        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: `${popped ? 'scale(1.2)' : (hovered ? 'scale(1.1)' : 'scale(1)')}`,
        boxShadow: popped ? 'none' : '0 15px 30px rgba(0,0,0,0.1)',
        border: `4px solid ${popped ? 'white' : (hovered ? accentColor : 'transparent')}`,
        animation: `float ${3 + Math.random() * 2}s infinite ease-in-out`,
        userSelect: 'none'
      }}
    >
      {item}
      {popped && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isAnswer ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,107,0.3)', borderRadius: '50%', fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
          {isAnswer ? '✔️' : '❌'}
        </div>
      )}
    </div>
  );
};

const TapGame = ({ count = 0, options = [], answer = null, question = "", onComplete, accentColor = '#E8920C', isHighContrast = false }) => {
  const [items, setItems] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (count > 0) {
      setItems(new Array(count).fill('🍎'));
    } else {
      setItems(options);
    }
  }, [count, options]);

  const handleSelect = (val, isCorrect) => {
    if (count > 0) {
      const next = counter + 1;
      setCounter(next);
      const utterance = new SpeechSynthesisUtterance(next.toString());
      window.speechSynthesis.speak(utterance);
      if (next === count) setTimeout(onComplete, 1500);
    } else {
      if (isCorrect || val === answer) {
        reactionService.playSuccess();
        const utterance = new SpeechSynthesisUtterance("Yes! " + val);
        window.speechSynthesis.speak(utterance);
        setTimeout(onComplete, 2000);
      } else {
        reactionService.playError();
        const utterance = new SpeechSynthesisUtterance("Try again!");
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4rem', padding: '2rem' }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes bg-pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
      `}</style>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: accentColor, textShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          {question || (count > 0 ? `Tap the apples to count to ${count}!` : "Choose the right one!")}
        </h2>
      </div>

      <div style={{ 
        display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', maxWidth: '900px',
        padding: '4rem', borderRadius: '4rem', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
        border: `2px dashed ${accentColor}33`
      }}>
        {items.map((it, idx) => (
          <Bubble 
            key={idx} 
            item={it} 
            isAnswer={count > 0 || it === answer} 
            onSelect={handleSelect}
            accentColor={accentColor}
            isHighContrast={isHighContrast}
          />
        ))}
      </div>

      {count > 0 && (
         <div style={{ fontSize: '2rem', fontWeight: 900, color: '#64748B' }}>
           Counted: <span style={{ color: accentColor, fontSize: '3rem' }}>{counter}</span> / {count}
         </div>
      )}
    </div>
  );
};

export default TapGame;
