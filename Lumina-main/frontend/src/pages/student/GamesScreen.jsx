import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import { LuminaLogo } from '../../components/BrandLogo';

const C = {
    navy: 'var(--navy)',
    amber: 'var(--amber)',
    teal: 'var(--teal)',
    cream: 'var(--cream)',
    white: 'var(--white)',
    blue: 'var(--blue)',
    textSoft: 'var(--text-soft)',
};

const Fonts = {
    heading: "'Fraunces', serif",
    body: "'Nunito', sans-serif"
};

export default function GamesScreen() {
    const navigate = useNavigate();
    const { profile } = useProfile();
    const { t } = useTranslation();
    const hasLowVision = profile?.disabilities?.includes('Low Vision');

    const games = [
        { id: 'math-race', name: t('games.math_race'), path: '/game/math-race', icon: '🏎️', color: '#1A7A62', desc: t('games.math_race_desc') },
        { id: 'memory-match', name: t('games.memory_match'), path: '/game/memory-match', icon: '🧠', color: '#E8920C', desc: t('games.memory_match_desc') },
        { id: 'word-search', name: t('games.word_search'), path: '/game/word-search', icon: '🔍', color: '#4A90D9', desc: t('games.word_search_desc') },
        { id: 'word-jump', name: t('games.word_jump'), path: '/game/word-jump', icon: '🏃', color: '#FF9900', desc: t('games.word_jump_desc') },
        { id: 'focus-flash', name: t('games.focus_flash'), path: '/game/focus-flash', icon: '⚡', color: '#10B981', desc: t('games.focus_flash_desc') },
        { id: 'phonetic-pop', name: t('games.phonetic_pop'), path: '/game/phonetic-pop', icon: '🫧', color: '#3B82F6', desc: t('games.phonetic_pop_desc') },
        { id: 'sign-match', name: t('games.sign_match'), path: '/game/sign-match', icon: '🍎', color: '#F59E0B', desc: t('games.sign_match_desc') },
        { id: 'emoji-emotion', name: 'Emotion Mirror', path: '/game/emoji-emotion', icon: '🪞', color: '#E91E63', desc: 'Copy the facial expressions to win! 😃' },
    ];

    const containerStyle = {
        minHeight: '100vh',
        background: hasLowVision ? '#FFFFFF' : 'linear-gradient(180deg, #F8FAFC 0%, #F0F9F7 100%)',
        padding: '40px 60px',
        fontFamily: Fonts.body,
        color: hasLowVision ? '#000000' : '#1A2635',
        position: 'relative',
        overflow: 'hidden'
    };

    const starStyle = (top, left, size, delay) => ({
        position: 'absolute',
        top, left,
        width: size,
        height: size,
        backgroundColor: hasLowVision ? '#000' : '#4A90D9',
        borderRadius: '50%',
        opacity: 0.08,
        animation: `glow ${delay}s infinite alternate`
    });

    return (
        <div style={containerStyle}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(10, 22, 40, 0.05)', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(10, 22, 40, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(10, 22, 40, 0.05)'}>←</button>
                    <div>
                        <h1 style={{ fontFamily: Fonts.heading, fontSize: '42px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#2563EB' }}>{t('dashboard.game_zone')}</h1>
                        <p style={{ margin: 0, color: '#64748B', fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>
                            {t('dashboard.ready_to_learn')} — Master your skills through play!
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>Daily Streak</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1A2635' }}>🔥 12 Days</div>
                    </div>
                    <LuminaLogo size={48} color={C.amber} />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', position: 'relative', zIndex: 2 }}>
                {games.map(game => (
                    <div
                        key={game.id}
                        onClick={() => navigate(game.path)}
                        className="glass-card card-lift"
                        style={{
                            padding: '40px 32px',
                            border: hasLowVision ? '2px solid #000' : `2px solid rgba(74, 144, 217, 0.2)`,
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div style={{
                            fontSize: '72px',
                            filter: `drop-shadow(0 12px 24px ${game.color}66)`,
                            marginBottom: '8px',
                            transform: 'scale(1.1)'
                        }}>{game.icon}</div>
                        <h2 style={{ fontFamily: Fonts.heading, fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1A2635' }}>{game.name}</h2>
                        <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, fontWeight: 600 }}>{game.desc}</p>
                        <button className="btn-premium" style={{ marginTop: 'auto', padding: '12px 32px', fontSize: '14px', width: '100%' }}>
                            {t('common.play')} →
                        </button>
                    </div>
                ))}
            </div>

            {/* Decorative Background Elements */}
            <div style={starStyle('10%', '15%', '4px', 3)} />
            <div style={starStyle('25%', '85%', '3px', 5)} />
            <div style={starStyle('60%', '5%', '2px', 4)} />
            <div style={starStyle('85%', '20%', '4px', 2)} />
            <div style={starStyle('45%', '95%', '3px', 6)} />

            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(232, 146, 12, 0.08) 0%, transparent 70%)', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: '10%', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(74, 144, 217, 0.08) 0%, transparent 70%)', zIndex: 1 }} />
        </div>
    );
}
