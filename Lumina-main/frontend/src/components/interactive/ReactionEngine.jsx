import React, { useEffect, useState } from 'react';

/**
 * ReactionEngine - Visual feedback orchestrator
 * Props: trigger ('correct' | 'wrong' | 'encourage' | null)
 * Renders confetti, glow ring, or shake overlay
 */

const CONFETTI_COLORS = ['#E8920C', '#4A90D9', '#1A7A62', '#FF6B6B', '#FFD93D', '#22C55E'];

const ConfettiBurst = ({ count = 60 }) => {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    duration: 2 + Math.random() * 1.5,
    rotate: Math.random() * 720,
  }));

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-80px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            top: 0,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            '--rot': `${p.rotate}deg`,
            zIndex: 2000,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

const GlowOverlay = ({ color = '#22C55E' }) => (
  <div style={{
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1500,
    boxShadow: `inset 0 0 80px ${color}55`,
    animation: 'glow-fade 1s ease-out forwards',
  }}>
    <style>{`
      @keyframes glow-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
    `}</style>
  </div>
);

const ReactionEngine = ({ trigger }) => {
  const [active, setActive] = useState(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    setActive(trigger);
    setKey(k => k + 1);
    const t = setTimeout(() => setActive(null), 3000);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!active) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1500 }}>
      {active === 'correct'   && <><ConfettiBurst key={`conf-${key}`} /><GlowOverlay color="#22C55E" /></>}
      {active === 'wrong'     && <GlowOverlay color="#FF6B6B" />}
      {active === 'encourage' && <GlowOverlay color="#E8920C" />}
    </div>
  );
};

export default ReactionEngine;
