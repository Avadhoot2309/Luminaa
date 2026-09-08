import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { getAdaptiveConfig } from '../utils/adaptiveEngine';
import { logStudentEvent } from '../services/behaviorService';
import { getStudentInsights } from '../services/analyticsService';
import { getNextAction } from '../utils/recommendationEngine';
import { LuminaLogo } from '../components/BrandLogo';



export default function Dashboard({ selectedStudent = null, isEmbedded = false }) {
  const { logout, logoutChild, isAdminSession } = useAuth();
  const contextProfile = useProfile() || {};
  const profile = selectedStudent || contextProfile?.profile; // Use selectedStudent if provided
  const profileLoading = !selectedStudent && contextProfile?.loading; // Only check loading if not embedded
  const navigate = useNavigate();
  const [adaptiveConfig, setAdaptiveConfig] = useState(null);
  const [insights, setInsights] = useState(null);
  const [nextAction, setNextAction] = useState(null);

  // When embedded from teacher dashboard, don't show navigation back
  const showNavigation = !isEmbedded;

  const handleSignOut = async () => {
    if (isAdminSession && isAdminSession()) {
      await logout();
    } else {
      logoutChild();
    }
    navigate('/login');
  };

  useEffect(() => {
    if (profile) {
      const initConfig = getAdaptiveConfig(profile);

      const fetchAndAdapt = async () => {
        try {
          const studentInsights = await getStudentInsights(profile.studentId);
          setInsights(studentInsights);

          const action = getNextAction(profile, studentInsights);
          setNextAction(action);

          if (studentInsights?.attentionScore === 'low') {
            initConfig.content.chunkSize = 'small';
          }
          if (studentInsights?.preferredMode === 'audio' || studentInsights?.audioUsageRate > 70) {
            initConfig.content.audioFirst = true;
          }
        } catch (error) {
          console.error("Failed to load dashboard insights:", error);
          // System defaults on network failure
          setInsights({ attentionScore: 'medium', totalSessions: 0 });
        } finally {
          setAdaptiveConfig(initConfig);

          if (initConfig.ui.highContrast) {
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#FFFFFF';
          } else {
            document.body.style.backgroundColor = '#F5F7F6';
            document.body.style.color = '#1A2E2A';
          }
        }
      };

      fetchAndAdapt();
    }
  }, [profile]);

  const handleLessonClick = () => {
    logStudentEvent({ studentId: profile.studentId, type: 'lesson', action: 'started', duration: 0 });
    navigate('/subjects', { state: { adaptiveConfig } });
  };

  const handleGameClick = () => {
    logStudentEvent({ studentId: profile.studentId, type: 'game', action: 'started', duration: 0 });
    navigate('/game/word-jump', { state: { adaptiveConfig } });
  };

  if (profileLoading || !adaptiveConfig) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F5F7F6', color: '#1F7A6B' }}>
      <h2 style={{ fontFamily: 'Nunito, sans-serif' }}>Loading your calm space...</h2>
    </div>
  );

  const dis = (profile?.disabilities || []).map(d => d.toLowerCase());
  const hasADHD = dis.includes('adhd');
  const hasDyslexia = dis.includes('dyslexia');
  const hasLowVision = dis.includes('low vision') || dis.includes('blindness');

  let headerSubtext = "Ready to learn something new today?";
  if (hasADHD) {
    headerSubtext = "Let’s do a quick fun session ⚡";
  } else if (hasDyslexia) {
    headerSubtext = "Let’s learn together with audio 😊";
  }

  const isHighContrast = adaptiveConfig.ui.highContrast;
  const isDyslexicFont = adaptiveConfig.ui.fontFamily === 'OpenDyslexic';

  const sizeMap = { small: '16px', normal: '18px', medium: '18px', large: '22px', xlarge: '28px' };
  const baseFontSize = sizeMap[adaptiveConfig.ui.fontSize] || '18px';

  // --- STYLES ---
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: isHighContrast ? '#000000' : '#F5F7F6',
      color: isHighContrast ? '#FFFFFF' : '#1A2E2A',
      fontFamily: isDyslexicFont ? 'OpenDyslexic, sans-serif' : 'Nunito, sans-serif',
      padding: '40px 60px',
      fontSize: baseFontSize,
      position: 'relative',
      overflowX: 'hidden',
    },
    leafSgv: {
      position: 'absolute',
      bottom: -40,
      left: -40,
      width: 250,
      height: 250,
      opacity: 0.05,
      pointerEvents: 'none',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '60px',
      position: 'relative',
      zIndex: 10,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 32,
    },
    brandGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    brandText: {
      fontFamily: 'Fraunces, serif',
      fontSize: '1.5rem',
      fontWeight: 800,
      color: isHighContrast ? '#FFF' : '#1F7A6B',
      margin: 0,
    },
    welcomeBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    nameText: {
      fontSize: hasLowVision ? '3rem' : '2.5rem',
      fontWeight: 900,
      margin: 0,
      letterSpacing: '-1px',
    },
    subText: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: isHighContrast ? '#CCCCCC' : '#4C6B64',
      margin: 0,
    },
    toolbar: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: '20px',
      backgroundColor: isHighContrast ? '#FFFFFF' : '#FFD080',
      color: isHighContrast ? '#000000' : '#8A5800',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: 900,
      boxShadow: isHighContrast ? 'none' : '0 8px 16px rgba(255, 208, 128, 0.4)',
      overflow: 'hidden',
    },
    logoutBtn: {
      backgroundColor: isHighContrast ? '#333' : '#FFFFFF',
      color: isHighContrast ? '#FFF' : '#5C746E',
      border: 'none',
      padding: '12px 24px',
      borderRadius: 16,
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      transition: 'background-color 0.2s',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 40,
      maxWidth: 1000,
      margin: '0 auto 60px auto',
    },
    cardHoverContainer: {
      transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    cardPrimary: {
      backgroundColor: isHighContrast ? '#0B4A3A' : '#1F7A6B',
      borderRadius: 32,
      padding: hasLowVision ? '32px' : '48px',
      color: '#FFFFFF',
      boxShadow: '0 16px 32px rgba(31, 122, 107, 0.15)',
      border: isHighContrast ? '4px solid #FFF' : 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    cardSecondary: {
      backgroundColor: isHighContrast ? '#A06000' : '#FFD080',
      borderRadius: 32,
      padding: hasLowVision ? '32px' : '48px',
      color: isHighContrast ? '#FFFFFF' : '#8A5800',
      boxShadow: '0 16px 32px rgba(255, 208, 128, 0.2)',
      border: isHighContrast ? '4px solid #FFF' : 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    cardIconBox: {
      width: 80,
      height: 80,
      borderRadius: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 36,
      marginBottom: 32,
    },
    cardTitle: {
      fontSize: '2rem',
      fontWeight: 800,
      margin: '0 0 12px 0',
      lineHeight: 1.2,
    },
    cardDesc: {
      fontSize: '1.2rem',
      fontWeight: 600,
      opacity: 0.9,
      margin: 0,
      marginBottom: 40,
    },
    arrowCircle: {
      marginTop: 'auto',
      alignSelf: 'flex-start',
      width: 48,
      height: 48,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      fontWeight: 'bold',
    },
    recentSection: {
      maxWidth: 1000,
      margin: '0 auto',
    },
    recentHeading: {
      fontSize: '1.2rem',
      fontWeight: 800,
      marginBottom: 20,
      color: isHighContrast ? '#FFFFFF' : '#4C6B64',
      opacity: 0.8,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    recentFlex: {
      display: 'flex',
      gap: 20,
      overflowX: 'auto',
      paddingBottom: 24,
    },
    recentItem: {
      minWidth: 200,
      backgroundColor: isHighContrast ? '#111' : '#FFFFFF',
      borderRadius: 20,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      border: isHighContrast ? '2px solid #555' : 'none',
      boxShadow: isHighContrast ? 'none' : '0 8px 16px rgba(0,0,0,0.02)',
      cursor: 'pointer',
    },
    recentItemContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    recentItemIcon: {
      fontSize: 28,
    },
    recentItemText: {
      fontWeight: 700,
      fontSize: '1.1rem',
      margin: 0,
    },
    progressBarBg: {
      width: '100%',
      height: 8,
      borderRadius: 4,
      backgroundColor: isHighContrast ? '#333' : '#F0F4F2',
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#1F7A6B',
      borderRadius: 4,
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&display=swap');
        .hover-scale:hover { transform: translateY(-4px) scale(1.02); }
        .hover-lift:hover { transform: translateY(-2px); }
        .btn-hover:hover { filter: brightness(0.95); }
      `}</style>

      {/* Subtle Jungle Leaf Decor (Bottom Left) */}
      {!isHighContrast && (
        <svg style={styles.leafSgv} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 Q50,0 100,50 Q50,100 0,50Z" fill="#1F7A6B" />
        </svg>
      )}

      {/* HEADER */}
      {showNavigation && (
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.brandGroup}>
              <LuminaLogo size={42} color={isHighContrast ? '#FFF' : '#1F7A6B'} />
              <p style={styles.brandText}>Lumina</p>
            </div>

            <div style={{ width: 2, height: 40, backgroundColor: isHighContrast ? '#333' : '#E8ECEB' }} />

            <div style={styles.welcomeBox}>
              <h1 style={styles.nameText}>Hi, {profile?.name} 👋</h1>
              <p style={styles.subText}>{headerSubtext}</p>
            </div>
          </div>

          <div style={styles.toolbar}>
            <div style={styles.avatar}>
              {profile?.avatar ? <img src={profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{profile?.name?.[0]}</span>}
            </div>
            <button onClick={handleSignOut} style={styles.logoutBtn} className="btn-hover">Sign Out</button>
          </div>
        </header>
      )}

      {/* MAIN CONTENT GRID */}
      <main style={styles.mainGrid}>
        {/* CARD 1: Continue Learning */}
        <div
          onClick={handleLessonClick}
          className="hover-scale"
          style={styles.cardHoverContainer}
          role="button"
          tabIndex={0}
        >
          <div style={styles.cardPrimary}>
            <div style={{ ...styles.cardIconBox, backgroundColor: isHighContrast ? '#FFFFFF' : 'rgba(255,255,255,0.15)', color: isHighContrast ? '#000' : '#FFF' }}>
              📚
            </div>
            <h2 style={styles.cardTitle}>Continue Learning</h2>
            <p style={styles.cardDesc}>Jump back into your lessons</p>
            <div style={{ ...styles.arrowCircle, backgroundColor: isHighContrast ? '#FFF' : 'rgba(255,255,255,0.2)', color: isHighContrast ? '#000' : '#FFF' }}>
              →
            </div>
          </div>
        </div>

        {/* CARD 2: Play Games */}
        <div
          onClick={handleGameClick}
          className="hover-scale"
          style={styles.cardHoverContainer}
          role="button"
          tabIndex={0}
        >
          <div style={styles.cardSecondary}>
            <div style={{ ...styles.cardIconBox, backgroundColor: isHighContrast ? '#FFFFFF' : 'rgba(255,255,255,0.4)', color: isHighContrast ? '#000' : '#8A5800' }}>
              🎮
            </div>
            <h2 style={styles.cardTitle}>Play Games</h2>
            <p style={styles.cardDesc}>Learn while having fun</p>
            <div style={{ ...styles.arrowCircle, backgroundColor: isHighContrast ? '#FFF' : 'rgba(138, 88, 0, 0.1)', color: isHighContrast ? '#000' : '#8A5800' }}>
              →
            </div>
          </div>
        </div>
      </main>

      {/* OPTIONAL SECTION: Recently Learned */}
      <section style={styles.recentSection}>
        <h3 style={styles.recentHeading}>Recently Learned</h3>
        <div style={styles.recentFlex}>
          <div className="hover-lift" style={styles.recentItem}>
            <div style={styles.recentItemContent}>
              <span style={styles.recentItemIcon}>🦁</span>
              <p style={styles.recentItemText}>Animals</p>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: '80%' }} />
            </div>
          </div>

          <div className="hover-lift" style={styles.recentItem}>
            <div style={styles.recentItemContent}>
              <span style={styles.recentItemIcon}>🍎</span>
              <p style={styles.recentItemText}>Fruits</p>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: '40%' }} />
            </div>
          </div>

          <div className="hover-lift" style={styles.recentItem}>
            <div style={styles.recentItemContent}>
              <span style={styles.recentItemIcon}>🪐</span>
              <p style={styles.recentItemText}>Planets</p>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: '100%' }} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
