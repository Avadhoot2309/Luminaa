import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { ebookData } from '../../data/ebookData';
import { LuminaLogo } from '../../components/BrandLogo';

const C = {
  navy: 'var(--navy)',
  amber: 'var(--amber)',
  teal: 'var(--teal)',
  cream: 'var(--cream)',
  white: 'var(--white)',
  border: 'var(--border)'
};

const Fonts = {
  heading: "'Fraunces', serif",
  body: "'Nunito', sans-serif"
};

// CSS Animations
const globalStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .book-card {
    animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
  }
  .book-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }
`;

export default function EBookLibrary() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { studentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAge, setActiveAge] = useState('All');
  const [activeLang, setActiveLang] = useState('All');

  // Auto-set Age Filter based on student profile if available
  useEffect(() => {
    const ageVal = studentUser?.age || studentUser?.ageGroup;
    if (ageVal) {
      const age = parseInt(ageVal);
      if (!isNaN(age)) {
        if (age <= 10) setActiveAge('3-10'); // Unified small age group
        else setActiveAge('11-15');
      }
    }
  }, [studentUser]);

  const filteredBooks = ebookData.filter(book => {
    const matchesSearch = book.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.title.hi && book.title.hi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.title.mr && book.title.mr.toLowerCase().includes(searchTerm.toLowerCase()));

    // Adjusted Age matching logic
    const matchesAge = activeAge === 'All' ||
      (activeAge === '3-10' && (book.ageCategory === '3-6' || book.ageCategory === '7-10')) ||
      (activeAge === book.ageCategory);

    const matchesLang = activeLang === 'All' || book.languages.includes(activeLang.toLowerCase());

    return matchesSearch && matchesAge && matchesLang;
  });

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #F0F9F7 100%)',
    padding: '40px 60px',
    fontFamily: Fonts.body,
    color: '#1A2635',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '48px',
    position: 'relative',
    zIndex: 2
  };

  return (
    <div style={containerStyle}>
      <style>{globalStyles}</style>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(74, 144, 217, 0.1)', border: '2px solid #4A90D9', fontSize: '20px', cursor: 'pointer', color: '#4A90D9' }}>←</button>
          <div>
            <h1 style={{ fontFamily: Fonts.heading, fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#2563EB' }}>
              Gyaan Library
            </h1>
            <p style={{ margin: 0, opacity: 0.7, fontWeight: 700, color: '#64748B' }}>Dive into a world of multilingual stories!</p>
          </div>
        </div>
        <LuminaLogo size={54} color={C.amber} />
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 2 }}>
        <input
          type="text"
          placeholder="🔍 Search for stories, authors or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '18px 24px',
            borderRadius: '16px',
            border: '2px solid rgba(74, 144, 217, 0.2)',
            background: 'rgba(74, 144, 217, 0.05)',
            color: '#1A2635',
            fontSize: '16px',
            fontFamily: Fonts.body,
            outline: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => e.target.style.border = `2px solid #4A90D9`}
          onBlur={(e) => e.target.style.border = '2px solid rgba(74, 144, 217, 0.2)'}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
        {['All', 'EN', 'HI', 'MR'].map(lang => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            style={{
              padding: '10px 24px',
              borderRadius: '99px',
              border: 'none',
              backgroundColor: activeLang === lang ? C.teal : 'rgba(255,255,255,0.1)',
              color: '#FFF',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {lang}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', position: 'relative', zIndex: 2 }}>
        {filteredBooks.map((book, index) => (
          <div
            key={book.id}
            className="glass-card book-card"
            onClick={() => navigate(`/reader/${book.id}`)}
            style={{
              padding: '32px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: `1.5px solid rgba(255,255,255,0.1)`,
              background: 'rgba(255,255,255,0.05)',
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div style={{ fontSize: '80px', marginBottom: '24px', filter: `drop-shadow(0 12px 24px ${book.color || '#CCC'}66)` }}>
              {book.cover || book.icon || '📖'}
            </div>
            <h3 style={{ fontFamily: Fonts.heading, fontSize: '22px', margin: '0 0 8px 0' }}>{book.title[i18n.language] || book.title.en}</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', opacity: 0.5, fontWeight: 800 }}>{book.author}</p>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, color: C.amber }}>
                AGE {book.ageCategory}
              </span>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, color: C.teal }}>
                {(book.difficulty || 'Easy').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Decorations */}
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(232, 146, 12, 0.08) 0%, transparent 70%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '10%', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(74, 144, 217, 0.08) 0%, transparent 70%)', zIndex: 1 }} />
    </div>
  );
}
