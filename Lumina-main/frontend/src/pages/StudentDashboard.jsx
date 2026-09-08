import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { LuminaLogo } from '../components/BrandLogo';
import EnlightenmentScene from '../components/EnlightenmentScene';
import DiyaGuru from '../components/DiyaGuru';
import Companion from '../components/interactive/Companion';
import reactionService from '../services/reactionService';
import { useAccessibility } from '../contexts/AccessibilityContext';

// Specialty Dashboards
import ADHDDashboard from './ADHDDashboard';
import SignLanguageDashboard from './SignLanguageDashboard';

// 🎨 Dyslexia-Friendly Pure Neutral Palette
const C = {
  navy: '#0F172A',
  blue: '#2563EB', // Fixed Primary Blue (Accessible contrast)
  slate: '#F8FAFC', // Near-white Slate background
  white: '#FFFFFF',
  text: '#1E293B',
  textSoft: '#64748B',
  border: '#E2E8F0',
  amber: '#F59E0B'
};

const Fonts = {
  get heading() { return window.isDyslexiaMode ? "'Open-Dyslexic', sans-serif" : "'Fraunces', serif" },
  get body() { return window.isDyslexiaMode ? "'Open-Dyslexic', sans-serif" : "'Nunito', sans-serif" }
};

const Icons = {
  Home: () => <span>🏠</span>,
  Book: () => <span>📖</span>,
  Game: () => <span>🎮</span>,
  Flask: () => <span>🧪</span>,
  Settings: () => <span>⚙️</span>,
  EBook: () => <span>📚</span>,
  Language: () => <span>🌐</span>,
  Font: () => <span>🔤</span>
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile() || { profile: null };
  const { logoutChild } = useAuth();
  const { t, i18n } = useTranslation();

  const [isDyslexiaMode, setIsDyslexiaMode] = useState(true);
  const toggleDyslexiaMode = () => {
    setIsDyslexiaMode(!isDyslexiaMode);
    window.isDyslexiaMode = !isDyslexiaMode;
  };
  
  useEffect(() => {
    window.isDyslexiaMode = isDyslexiaMode;
  }, [isDyslexiaMode]);

  const [currentView, setCurrentView] = useState('home'); // 'home', 'labs', 'settings'
  const [companionState, setCompanionState] = useState('idle');
  const [companionMsg, setCompanionMsg] = useState('');

  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => {
    const greetTimer = setTimeout(() => {
      setCompanionState('happy');
      setCompanionMsg(t('dashboard.companion_greeting', { name: profile?.name || 'Explorer' }));
      setTimeout(() => { setCompanionState('idle'); setCompanionMsg(''); }, 5000);
    }, 1500);
    return () => clearTimeout(greetTimer);
  }, [profile?.name, t]);

  const navItems = [
    { id: 'lessons', label: t('dashboard.lessons'), path: '/subjects', icon: Icons.Home },
    { id: 'games', label: t('dashboard.games'), path: '/games', icon: Icons.Game },
    { id: 'ebooks', label: t('dashboard.ebooks'), path: '/library', icon: Icons.EBook },
    { id: 'resources', label: 'Resources', action: () => setCurrentView('resources'), icon: Icons.Book },
    { id: 'labs', label: t('dashboard.labs'), action: () => setCurrentView('labs'), icon: Icons.Flask },
    { id: 'settings', label: t('dashboard.settings'), action: () => setCurrentView('settings'), icon: Icons.Settings }
  ];

  const assignments = [
    { id: 1, title: 'Math Adventures: Level 1', type: 'PDF', url: 'https://www.math-drills.com/addition/addition_0109_001.pdf', icon: '➕' },
    { id: 2, title: 'The Story Explorer: Worksheet', type: 'PDF', url: 'https://www.k5learning.com/free-reading-worksheets/first-grade-1/reading-comprehension/gr1-reading-comprehension-exercise-1.pdf', icon: '📝' },
    { id: 3, title: 'Dino-Phonics Weekly Practice', type: 'PDF', url: 'https://www.k5learning.com/free-phonics-worksheets/second-grade-2/vowels/vowel-sounds-of-y.pdf', icon: '🦖' }
  ];

  const videos = [
    { id: 1, title: 'Believe In Yourself 🚀', videoUrl: 'https://www.youtube-nocookie.com/embed/zN9XzB9B6Q0?autoplay=0&rel=0' },
    { id: 2, title: 'Never Give Up! ✨', videoUrl: 'https://www.youtube-nocookie.com/embed/GxDIsB9L_Sg?autoplay=0&rel=0' }
  ];

  const labs = [
    { id: 'math', label: t('labs.math'), icon: '➕', color: '#F59E0B', path: '/labs/math' },
    { id: 'sky-writer', label: t('labs.sky_writer'), icon: '✍️', color: '#EC4899', path: '/labs/sky-writer' },
    { id: 'forest-phonics', label: t('labs.forest_phonics'), icon: '🌳', color: '#10B981', path: '/labs/forest-phonics' },
    { id: 'sound-buttons', label: t('labs.sound_buttons'), icon: '🔘', color: '#3B82F6', path: '/labs/sound-buttons' },
    { id: 'dino-decoder', label: t('labs.dino_decoder'), icon: '🦖', color: '#8B5CF6', path: '/labs/dino-decoder' }
  ];

  const mainAreaStyle = {
    minHeight: '100vh',
    backgroundColor: C.slate,
    fontFamily: isDyslexiaMode ? "'Open-Dyslexic', sans-serif" : Fonts.body,
    display: 'flex',
    flexDirection: 'column'
  };

  const topBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 60px',
    height: 'auto',
    backgroundColor: C.white,
    borderBottom: `2px solid ${C.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };

  const navLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '14px',
    color: isActive ? C.blue : C.textSoft,
    backgroundColor: isActive ? `${C.blue}10` : 'transparent',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `2px solid ${isActive ? C.blue : 'transparent'}`,
    fontFamily: 'inherit',
    whiteSpace: 'nowrap'
  });

  const guidedButtonStyle = (isPrimary, isHovered) => ({
    width: '100%',
    padding: isPrimary ? '48px 40px' : '48px 40px',
    backgroundColor: isPrimary ? C.blue : C.white,
    color: isPrimary ? C.white : C.text,
    border: isPrimary ? 'none' : `2px solid ${C.border}`,
    borderRadius: '24px',
    fontSize: isPrimary ? '1.8rem' : '1.4rem',
    fontWeight: '900',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    boxShadow: isHovered ? '0 16px 32px -4px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    textAlign: 'center'
  });

  const floatingControlStyle = {
    position: 'fixed',
    bottom: '40px',
    left: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    zIndex: 999
  };

  const controlButtonStyle = {
    backgroundColor: C.white,
    border: `2px solid ${C.border}`,
    padding: '12px 20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '700',
    color: C.text,
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    fontSize: '0.85rem',
    fontFamily: 'inherit'
  };

  return (
    <div className={isDyslexiaMode ? "dyslexia-forced" : ""}>

      {/* 🎓 ADHD DASHBOARD - Auto-rendered for ADHD students */}
      {profile?.condition === 'ADHD' ? (
        <ADHDDashboard />
      ) : profile?.needsSignLanguage ? (
        <SignLanguageDashboard />
      ) : (
        <div style={mainAreaStyle}>
          {/* 🚥 TOP NAVIGATION */}
          <header style={topBarStyle}>

            <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', flex: 1, margin: '0 30px' }}>
              {navItems.map(item => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    style={navLinkStyle(isActive)}
                    onClick={() => item.action ? item.action() : navigate(item.path)}
                  >
                    <item.icon />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div style={{ padding: '10px 18px', backgroundColor: `${C.amber}12`, borderRadius: '12px', border: `2px solid ${C.amber}40`, color: C.text, fontWeight: '800', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              ✨ {profile?.name || 'Explorer'}
            </div>
          </header>

          {/* 🖼️ MAIN GUIDED AREA */}
          <main style={{ flex: 1, padding: '50px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            {/* <DiyaGuru state={companionState} message={companionMsg} /> */}

            {currentView === 'home' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* 🎯 PRIMARY CTA BUTTON */}
                <button
                  style={guidedButtonStyle(true, hoveredAction === 'continue')}
                  onMouseEnter={() => setHoveredAction('continue')}
                  onMouseLeave={() => setHoveredAction(null)}
                  onClick={() => navigate('/subjects')}
                >
                  <span>{t('dashboard.continue_learning')}</span>
                </button>

                {/* 📊 QUICK ACCESS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                  {/* Lessons Card */}
                  <button
                    onClick={() => navigate('/subjects')}
                    style={{
                      padding: '48px 32px',
                      borderRadius: '20px',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                      color: 'white',
                      minHeight: '200px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '3.6rem' }}>📚</span>
                    <span style={{ fontWeight: 800, fontSize: '1.3rem', textAlign: 'center' }}>{t('dashboard.lessons')}</span>
                    <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Start learning</span>
                  </button>

                  {/* Games Card */}
                  <button
                    onClick={() => navigate('/games')}
                    style={{
                      padding: '48px 32px',
                      borderRadius: '20px',
                      backgroundColor: '#EC4899',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 16px rgba(236, 72, 153, 0.3)',
                      color: 'white',
                      minHeight: '200px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(236, 72, 153, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '3.6rem' }}>🎮</span>
                    <span style={{ fontWeight: 800, fontSize: '1.3rem', textAlign: 'center' }}>{t('dashboard.games')}</span>
                    <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Play & learn</span>
                  </button>

                  {/* EBooks Card */}
                  <button
                    onClick={() => navigate('/library')}
                    style={{
                      padding: '48px 32px',
                      borderRadius: '20px',
                      backgroundColor: '#10B981',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                      color: 'white',
                      minHeight: '200px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '3.6rem' }}>📖</span>
                    <span style={{ fontWeight: 800, fontSize: '1.3rem', textAlign: 'center' }}>{t('dashboard.ebooks')}</span>
                    <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Read stories</span>
                  </button>

                  {/* Labs Card */}
                  <button
                    onClick={() => setCurrentView('labs')}
                    style={{
                      padding: '48px 32px',
                      borderRadius: '20px',
                      backgroundColor: '#F59E0B',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                      color: 'white',
                      minHeight: '200px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(245, 158, 11, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '3.6rem' }}>🧪</span>
                    <span style={{ fontWeight: 800, fontSize: '1.3rem', textAlign: 'center' }}>{t('dashboard.labs')}</span>
                    <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Explore labs</span>
                  </button>

                  {/* Resources Card */}
                  <button
                    onClick={() => setCurrentView('resources')}
                    style={{
                      padding: '48px 32px',
                      borderRadius: '20px',
                      backgroundColor: '#8B5CF6',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
                      color: 'white',
                      minHeight: '200px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 92, 246, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '3.6rem' }}>📚</span>
                    <span style={{ fontWeight: 800, fontSize: '1.3rem', textAlign: 'center' }}>Resources</span>
                    <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>Videos & PDFs</span>
                  </button>
                </div>
              </div>
            ) : currentView === 'labs' ? (
              /* 🧪 LABS ONE-BY-ONE GALLERY */
              <div>
                <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button onClick={() => setCurrentView('home')} style={{ color: C.textSoft, background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = C.text} onMouseLeave={(e) => e.target.style.color = C.textSoft}>← {t('common.back')}</button>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: Fonts.heading, margin: 0 }}>{t('dashboard.labs')}</h2>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {labs.map(lab => (
                    <button
                      key={lab.id}
                      onClick={() => navigate(lab.path)}
                      style={{
                        padding: '28px 32px',
                        borderRadius: '20px',
                        backgroundColor: C.white,
                        border: `2px solid ${lab.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '28px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = lab.color;
                        e.currentTarget.style.boxShadow = `0 8px 24px ${lab.color}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = `${lab.color}20`;
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', width: '70px', height: '70px', backgroundColor: `${lab.color}12`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {lab.icon}
                      </div>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: C.navy }}>{lab.label}</h3>
                        <p style={{ color: C.textSoft, fontWeight: 600, margin: '6px 0 0 0', fontSize: '0.95rem' }}>Explore and learn</p>
                      </div>
                      <div style={{ fontSize: '1.4rem', color: lab.color, fontWeight: 800 }}>→</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : currentView === 'resources' ? (
              /* 📚 RESOURCES VIEW */
              <div>
                <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button onClick={() => setCurrentView('home')} style={{ color: C.textSoft, background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = C.text} onMouseLeave={(e) => e.target.style.color = C.textSoft}>← {t('common.back')}</button>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: Fonts.heading, margin: 0 }}>Resources</h2>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
                  {/* Video Section */}
                  <section>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: C.navy }}>
                      📺 Motivational Videos
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
                      {videos.map(v => (
                        <div key={v.id} style={{ backgroundColor: C.white, padding: '20px', borderRadius: '20px', border: `2px solid ${C.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                          <iframe
                            width="100%"
                            height="220"
                            src={v.videoUrl.replace('youtube.com', 'youtube-nocookie.com')}
                            title={v.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{ borderRadius: '14px', marginBottom: '16px' }}
                          ></iframe>
                          <p style={{ fontWeight: 800, fontSize: '1rem', margin: 0, color: C.text }}>{v.title}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Assignments Section */}
                  <section>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: C.navy }}>
                      📙 Home Assignments
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      {assignments.map(a => (
                        <a
                          key={a.id}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '24px',
                            borderRadius: '18px',
                            backgroundColor: C.white,
                            border: `2px solid ${C.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '18px',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = C.blue;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.borderColor = C.border;
                          }}
                        >
                          <span style={{ fontSize: '2.2rem' }}>{a.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 800, fontSize: '1rem', color: C.text, margin: 0 }}>{a.title}</p>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: C.textSoft }}>Download PDF</span>
                          </div>
                          <span style={{ color: C.blue, fontWeight: 800, fontSize: '1.2rem' }}>↓</span>
                        </a>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              /* ⚙️ SETTINGS VIEW */
              <div style={{ backgroundColor: C.white, borderRadius: '24px', padding: '40px', border: `2px solid ${C.border}`, maxWidth: '500px' }}>
                <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button onClick={() => setCurrentView('home')} style={{ color: C.textSoft, background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.color = C.text} onMouseLeave={(e) => e.target.style.color = C.textSoft}>← {t('common.back')}</button>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: Fonts.heading, margin: 0 }}>{t('dashboard.settings')}</h2>
                </header>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <p style={{ fontWeight: 700, color: C.textSoft, margin: 0 }}>Manage your profile and learning preferences.</p>
                  <button onClick={logoutChild} style={{ backgroundColor: '#EF4444', color: '#fff', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s ease', width: 'fit-content' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'} onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}>
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* 🔤 FIXED ACCESSIBILITY CONTROLS */}
          <div style={floatingControlStyle}>
            {/* Language Selection Pop-up / Button */}
            <div style={{ position: 'relative' }}>
              <select
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                value={i18n.language}
                style={controlButtonStyle}
              >
                <option value="en">🇺🇸 EN</option>
                <option value="hi">🇮🇳 HI</option>
                <option value="mr">🇮🇳 MR</option>
                <option value="kn">🇮🇳 KN</option>
              </select>
            </div>

            <button
              onClick={toggleDyslexiaMode}
              style={{
                ...controlButtonStyle,
                backgroundColor: isDyslexiaMode ? C.blue : C.white,
                color: isDyslexiaMode ? C.white : C.text,
                borderColor: isDyslexiaMode ? C.blue : C.border
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.12)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)'}
            >
              <Icons.Font />
              {isDyslexiaMode ? 'DYSLEXIC FONT: ON' : 'DYSLEXIC FONT: OFF'}
            </button>
          </div>

          <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        button:active { transform: scale(0.95); }
        .dyslexia-forced, .dyslexia-forced * {
          font-family: 'Open-Dyslexic', sans-serif !important;
        }
      `}</style>
        </div>
      )}
    </div>
  );
}
