import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * LabPage - Specialized Lab Engine (Math & Dyslexia)
 * Features PhET for Math and ICT Games (Direct Mode) for Dyslexia support.
 */

const LabPage = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const LAB_CONFIG = {
    'math': { 
      title: t('labs.math'), 
      url: 'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_all.html',
      color: '#F59E0B',
      isDirect: true
    },
    'sky-writer': { 
      title: t('labs.sky_writer'), 
      url: 'https://www.ictgames.com/mobilePage/skyWriter/index.html',
      color: '#EC4899',
      isDirect: false,
      offset: -300 // Super surgical clip to remove ICT headers
    },
    'forest-phonics': { 
      title: t('labs.forest_phonics'), 
      url: 'https://www.ictgames.com/mobilePage/forestPhonics/index.html',
      color: '#10B981',
      isDirect: false,
      offset: -300
    },
    'sound-buttons': { 
      title: t('labs.sound_buttons'), 
      url: 'https://www.ictgames.com/mobilePage/soundSayer/index.html',
      color: '#3B82F6',
      isDirect: false,
      offset: -300
    },
    'dino-decoder': { 
      title: t('labs.dino_decoder'), 
      url: 'https://www.ictgames.com/mobilePage/tellATRex/index.html',
      color: '#8B5CF6',
      isDirect: false,
      offset: -300
    }
  };

  const lab = LAB_CONFIG[labId] || LAB_CONFIG['math'];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#1E293B',
      fontFamily: 'Nunito, sans-serif',
      padding: '1rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            color: '#475569',
            padding: '10px 20px',
            borderRadius: '14px',
            cursor: 'pointer',
            fontWeight: '900',
            transition: 'all 0.2s',
            fontSize: '0.9rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = lab.color;
            e.currentTarget.style.color = lab.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.color = '#475569';
          }}
        >
          ← {t('common.back')}
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1E293B', margin: 0 }}>
            {lab.title}
          </h1>
          <div style={{ width: '50px', height: '5px', background: lab.color, margin: '6px auto', borderRadius: '3px' }} />
        </div>
        <div style={{ width: '120px' }} />
      </header>

      {/* Main Lab Area */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        position: 'relative',
        display: 'flex',
        border: `3px solid ${lab.color}22`
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            zIndex: 10
          }}>
            <div style={{
              width: '60px', height: '60px',
              border: '6px solid #F1F5F9',
              borderTopColor: lab.color,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }} />
            <p style={{ fontSize: '1.2rem', fontWeight: '900', color: '#64748B' }}>{t('labs.loading')}</p>
          </div>
        )}
        
        <div style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <iframe 
            src={lab.url}
            title={lab.title}
            width="100%"
            height={lab.isDirect ? "100%" : "calc(190% + 300px)"} // Max deep render
            style={{ 
              border: 'none', 
              minHeight: '950px',
              marginTop: `${lab.offset || 0}px`, 
              transform: lab.isDirect ? 'none' : 'scale(1.7)', // Super Surgical Zoom
              transformOrigin: 'top center',
              transition: 'opacity 0.5s ease'
            }}
            onLoad={() => setLoading(false)}
            allowFullScreen
          />
        </div>
      </main>

      <footer style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem', fontWeight: 'bold' }}>
        {t('labs.footer')}
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LabPage;
