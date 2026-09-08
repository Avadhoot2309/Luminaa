import React, { useEffect, useState } from 'react';

const EnlightenmentScene = ({ progress = 0.6, points = 450 }) => {
  const [auraScale, setAuraScale] = useState(1);
  const [leaves, setLeaves] = useState([]);

  // Animation for aura pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setAuraScale(s => (s === 1 ? 1.1 : 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Falling leaves effect
  useEffect(() => {
    const newLeaves = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: -20,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="glass-card" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      minHeight: '500px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.9) 0%, rgba(26, 92, 74, 0.8) 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '40px'
    }}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(245, 184, 76, 0.4)); }
          50% { filter: drop-shadow(0 0 25px rgba(245, 184, 76, 0.8)); }
        }
      `}</style>

      {/* Night Sky Elements */}
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
         <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#FFFDE7" opacity="0.3" />
            <circle cx="50" cy="50" r="30" fill="#FFFDE7" opacity="0.6" />
         </svg>
      </div>

      {/* Enlightenment Aura */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 184, 76, 0.3) 0%, rgba(245, 184, 76, 0) 70%)',
        transform: `scale(${auraScale + (progress * 0.5)})`,
        transition: 'transform 2s ease-in-out',
        zIndex: 1
      }} />

      {/* Banyan Tree (Stylized SVG) */}
      <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%', zIndex: 2, maxWidth: '500px' }}>
        <defs>
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2D1B0E" />
            <stop offset="50%" stopColor="#3D2308" />
            <stop offset="100%" stopColor="#2D1B0E" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Canopy */}
        <g opacity="0.85">
          <ellipse cx="200" cy="180" rx="160" ry="100" fill="#0F4030" />
          <ellipse cx="120" cy="160" rx="100" ry="80" fill="#125040" />
          <ellipse cx="280" cy="160" rx="100" ry="80" fill="#0D3828" />
          <ellipse cx="200" cy="120" rx="120" ry="90" fill="#156A52" />
        </g>

        {/* Aerial Roots (Dangling) */}
        {[100, 150, 200, 250, 300].map((x, i) => (
          <path 
            key={i}
            d={`M${x},200 Q${x + (i-2)*10},300 ${x},450`} 
            stroke="#2D1B0E" 
            strokeWidth="3" 
            fill="none" 
            opacity={0.4} 
          />
        ))}

        {/* Trunk */}
        <path d="M160,500 L180,250 Q200,200 220,250 L240,500 Z" fill="url(#trunkGrad)" />

        {/* Roots growing based on progress */}
        {[1, 2, 3, 4, 5].map((idx) => (
          <path 
            key={idx}
            d={`M${160 + idx*15},480 Q${120 + idx*20},500 ${80 + idx*25},510`} 
            stroke="#3D2308" 
            strokeWidth="6" 
            fill="none"
            strokeDasharray="200"
            strokeDashoffset={idx <= progress * 5 ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 2s ease-in' }}
          />
        ))}

        {/* The Meditating Sage (Silhouette) */}
        <g transform="translate(175, 400)" style={{ animation: 'glow 3s infinite' }}>
          {/* Head */}
          <circle cx="25" cy="0" r="12" fill="#F5B84C" />
          {/* Body/Pose */}
          <path d="M5,45 L15,15 Q25,5 35,15 L45,45 Q25,55 5,45Z" fill="#F5B84C" />
          {/* Legs folded */}
          <path d="M0,45 Q-15,55 10,65 L40,65 Q65,55 50,45" fill="#F5B84C" />
        </g>
      </svg>

      {/* Falling Leaves */}
      {leaves.map(leaf => (
        <div key={leaf.id} style={{
          position: 'absolute',
          top: leaf.y,
          left: leaf.x,
          width: '8px',
          height: '12px',
          background: '#1A7A62',
          borderRadius: '50% 0 50% 0',
          animation: `float ${leaf.duration}s linear infinite`,
          animationDelay: `${leaf.delay}s`,
          opacity: 0,
          zIndex: 3
        }} />
      ))}

      {/* Info Overlay */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        textAlign: 'right',
        color: '#fff',
        zIndex: 4
      }}>
        <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Gyaan Level</div>
        <div style={{ fontSize: '28px', fontStyle: 'italic', fontFamily: 'Fraunces, serif', color: '#F5B84C' }}>Seeker of Truth</div>
        <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '100px', display: 'inline-block', fontSize: '14px' }}>
          ✨ {points} Knowledge Points
        </div>
      </div>

    </div>
  );
};

export default EnlightenmentScene;
