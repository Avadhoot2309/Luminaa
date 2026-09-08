import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { generateQRData } from '../../services/qrService';
import { getStudentInsights } from '../../services/analyticsService';
import { regeneratePIN } from '../../services/pinService';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [student, setStudent] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'content', 'settings'
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, 'studentProfiles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent({ id: docSnap.id, ...docSnap.data() });

          // Fetch behavioral insights
          try {
            const studentInsights = await getStudentInsights(docSnap.id);
            setInsights(studentInsights);
          } catch (e) {}
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Firestore student fetch failed, checking local profiles:", err);
      }

      // Check local storage fallback
      try {
        const localStudents = JSON.parse(localStorage.getItem('lumina_local_students') || '[]');
        const found = localStudents.find(s => s.id === id || s.studentId === id);
        if (found) {
          setStudent(found);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Local student search error:', e);
      }

      navigate('/teacher-dashboard');
      setLoading(false);
    };
    fetchStudent();
  }, [id, navigate]);

  const downloadQR = () => {
    const svg = document.getElementById('student-qr');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${student.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleRegeneratePIN = async () => {
    try {
      setSavingSettings(true);
      const newPin = await regeneratePIN(student.id, student.pin);
      setStudent(prev => ({ ...prev, pin: newPin }));
    } catch (e) {
      console.error('Error generating/regenerating PIN:', e);
      alert('Could not generate PIN. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleSignLanguage = async () => {
    try {
      setSavingSettings(true);
      const newValue = !student.needsSignLanguage;
      await updateDoc(doc(db, 'studentProfiles', id), {
        needsSignLanguage: newValue
      });
      setStudent({ ...student, needsSignLanguage: newValue });
    } catch (error) {
      console.error('Error updating sign language setting:', error);
      alert('Failed to update setting. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const getAttentionIndicator = (score) => {
    if (score === 'high') return '🟢 Good';
    if (score === 'medium') return '🟡 Medium';
    if (score === 'low') return '🔴 Needs attention';
    return '⚪ Unknown';
  };

  if (loading) return <div style={styles.loader}>Loading student profile...</div>;
  if (!student) return null;

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&display=swap');
      `}</style>

      {/* BACK BUTTON */}
      <div style={styles.topNav}>
        <button onClick={() => navigate('/teacher-dashboard')} style={styles.backBtn}>
          ← Back to Students
        </button>
      </div>

      <div style={styles.content}>
        <aside style={styles.leftCol}>
          {/* PROFILE CARD */}
          <div style={styles.profileCard}>
            <div style={styles.avatarLarge}>
              {student.avatar ? <img src={student.avatar} alt="" /> : <span>{student.name[0]}</span>}
            </div>
            <h1 style={styles.name}>{student.name}</h1>
            <p style={styles.ageLabel}>{student.ageGroup} Years • {student.language}</p>

            <div style={styles.badgeRow}>
              {student.disabilities?.map(d => (
                <span key={d} style={styles.disabilityBadge}>{d}</span>
              ))}
            </div>

            <div style={styles.divider} />

            <div style={styles.accessSection}>
              <h3 style={styles.sectionHeading}>Student Access</h3>
              <div style={styles.qrContainer}>
                <QRCodeSVG
                  id="student-qr"
                  value={generateQRData(student.id, student.pin || '0000')}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div style={styles.pinDisplay}>
                <span style={styles.pinLabel}>SECRET PIN</span>
                <span style={styles.pinValue}>{student.pin || 'No PIN'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={downloadQR} style={styles.downloadBtn}>⬇️ Download QR Card</button>
                <button
                  onClick={handleRegeneratePIN}
                  disabled={savingSettings}
                  style={{
                    ...styles.downloadBtn,
                    background: '#FFF9F0',
                    border: '1px solid #E8920C',
                    color: '#E8920C'
                  }}
                >
                  {savingSettings ? 'Generating...' : (student.pin ? '🔄 Regenerate PIN & QR' : '✨ Generate PIN & QR')}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main style={styles.rightCol}>
          <div style={styles.tabs}>
            {['stats', 'content', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'stats' && (
              <>
                <div style={{ marginBottom: 40 }}>
                  <h3 style={styles.sectionHeading}>📊 Learning Insights</h3>
                  <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                      <h3 style={styles.statTitle}>Avg Session</h3>
                      <p style={styles.statVal}>{insights ? `${Math.round(insights.avgSessionTime / 60)} min` : '...'}</p>
                    </div>
                    <div style={styles.statCard}>
                      <h3 style={styles.statTitle}>Attention</h3>
                      <p style={styles.statVal} className="insight-indicator">
                        {insights ? getAttentionIndicator(insights.attentionScore) : '...'}
                      </p>
                    </div>
                    <div style={styles.statCard}>
                      <h3 style={styles.statTitle}>Preferred Mode</h3>
                      <p style={styles.statVal}>{insights ? (insights.preferredMode === 'audio' ? '🎧 Audio' : '📖 Text') : '...'}</p>
                    </div>
                    <div style={styles.statCard}>
                      <h3 style={styles.statTitle}>Audio Usage</h3>
                      <p style={styles.statVal}>{insights ? `${insights.audioUsageRate}%` : '...'}</p>
                    </div>
                  </div>
                </div>

                <h3 style={styles.sectionHeading}>Overview</h3>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Time Spent</h3>
                    <p style={styles.statVal}>12.4 Hours</p>
                    <span style={styles.trend}>+12% from last week</span>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Accuracy</h3>
                    <p style={styles.statVal}>87%</p>
                    <span style={styles.trendGreen}>Improving!</span>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Lessons</h3>
                    <p style={styles.statVal}>24 / 40</p>
                    <div style={styles.miniProgress}><div style={{ ...styles.miniFill, width: '60%' }} /></div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'content' && (
              <div style={styles.contentList}>
                <h3 style={styles.sectionHeading}>Assigned Materials</h3>
                <div style={styles.emptyMaterial}>
                  <span>📚</span>
                  <p>No custom materials uploaded yet.</p>
                  <button style={styles.uploadBtn}>Upload Textbook Photo</button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div style={styles.settingsView}>
                <h3 style={styles.sectionHeading}>Accessibility Preferences (Auto-Configured)</h3>
                <div style={styles.prefGrid}>
                  <div style={styles.prefItem}>
                    <span style={styles.prefLabel}>Font Family</span>
                    <span style={styles.prefVal}>{student.preferences?.fontFamily || 'Nunito'}</span>
                  </div>
                  <div style={styles.prefItem}>
                    <span style={styles.prefLabel}>Audio Narration</span>
                    <span style={styles.prefVal}>{student.preferences?.audioEnables ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div style={styles.prefItem}>
                    <span style={styles.prefLabel}>Focus Mode</span>
                    <span style={styles.prefVal}>{student.preferences?.focusMode ? 'Active (ADHD Mode)' : 'Standard'}</span>
                  </div>
                  <div style={styles.prefItem}>
                    <span style={styles.prefLabel}>High Contrast</span>
                    <span style={styles.prefVal}>{student.preferences?.highContrast ? 'Enabled' : 'Off'}</span>
                  </div>
                </div>

                <h3 style={{ ...styles.sectionHeading, marginTop: '30px' }}>📚 Learning Programs</h3>
                <div style={styles.settingsToggleRow}>
                  <div>
                    <div style={styles.toggleLabel}>🤟 Sign Language Training</div>
                    <div style={styles.toggleDesc}>Enable sign language learning dashboard and practice games</div>
                  </div>
                  <button
                    onClick={handleToggleSignLanguage}
                    disabled={savingSettings}
                    style={{
                      ...styles.toggleButton,
                      backgroundColor: student.needsSignLanguage ? '#8B5CF6' : '#CBD5E1',
                      opacity: savingSettings ? 0.6 : 1,
                      cursor: savingSettings ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {savingSettings ? '...' : student.needsSignLanguage ? 'ON' : 'OFF'}
                  </button>
                </div>

                <button style={styles.editSettingsBtn} disabled={savingSettings}>Edit Manually</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F7F6F2',
    fontFamily: 'Nunito, sans-serif',
    padding: '40px 60px',
  },
  topNav: {
    marginBottom: 32,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#5A7088',
    fontWeight: 800,
    fontSize: 15,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    display: 'flex',
    gap: 40,
  },
  leftCol: {
    width: 360,
  },
  rightCol: {
    flex: 1,
  },
  profileCard: {
    background: '#fff',
    borderRadius: 32,
    padding: 32,
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: '100%',
    background: '#E8ECF0',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 800,
    color: '#5A7088',
    overflow: 'hidden',
  },
  name: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2rem',
    color: '#0A1628',
    marginBottom: 4,
  },
  ageLabel: {
    color: '#5A7088',
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 16,
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  disabilityBadge: {
    fontSize: 12,
    fontWeight: 800,
    background: '#F0F7FF',
    color: '#4A90D9',
    padding: '6px 14px',
    borderRadius: 100,
  },
  divider: {
    height: 1,
    background: '#E8ECF0',
    margin: '24px 0',
  },
  accessSection: {
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 900,
    color: '#0A1628',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 20,
  },
  qrContainer: {
    background: '#fff',
    padding: 12,
    borderRadius: 16,
    border: '1.5px solid #E8ECF0',
    display: 'inline-block',
    marginBottom: 20,
  },
  pinDisplay: {
    background: '#FFF9F0',
    border: '1.5px dashed #E8920C',
    padding: '12px 20px',
    borderRadius: 12,
    marginBottom: 20,
  },
  pinLabel: {
    display: 'block',
    fontSize: 10,
    fontWeight: 900,
    color: '#E8920C',
    marginBottom: 4,
  },
  pinValue: {
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: 8,
    color: '#0A1628',
  },
  downloadBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    background: '#fff',
    color: '#0A1628',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  tabs: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
  },
  tab: {
    padding: '12px 24px',
    borderRadius: 100,
    border: 'none',
    background: 'transparent',
    color: '#5A7088',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
  tabActive: {
    background: '#E8920C',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(232,146,12,0.2)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 20,
  },
  statCard: {
    background: '#fff',
    padding: 24,
    borderRadius: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  statTitle: {
    fontSize: 14, color: '#A0AEC0', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, marginTop: 0
  },
  statVal: {
    fontSize: 24, color: '#0A1628', fontWeight: 900, margin: 0
  },
  trend: {
    fontSize: 12,
    color: '#5A7088',
    marginTop: 8,
    display: 'block',
  },
  trendGreen: {
    fontSize: 12,
    color: '#3DB88A',
    fontWeight: 800,
    marginTop: 8,
    display: 'block',
  },
  miniProgress: {
    height: 4,
    background: '#E8ECF0',
    borderRadius: 10,
    marginTop: 12,
  },
  miniFill: {
    height: '100%',
    background: '#E8920C',
    borderRadius: 10,
  },
  emptyMaterial: {
    background: '#fff',
    borderRadius: 24,
    padding: 60,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    color: '#A0AEC0',
  },
  uploadBtn: {
    background: '#0A1628',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: 10,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 10,
  },
  prefGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    marginBottom: 32,
  },
  prefItem: {
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    border: '1px solid #E8ECF0',
  },
  prefLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#A0AEC0',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  prefVal: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0A1628',
  },
  editSettingsBtn: {
    background: 'none',
    border: '1.5px solid #0A1628',
    color: '#0A1628',
    padding: '12px 24px',
    borderRadius: 10,
    fontWeight: 800,
    cursor: 'pointer',
  },
  settingsToggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    marginBottom: '20px',
  },
  toggleLabel: {
    fontWeight: 800,
    color: '#0A1628',
    fontSize: '15px',
    marginBottom: '4px',
  },
  toggleDesc: {
    fontSize: '13px',
    color: '#5A7088',
    marginTop: '4px',
  },
  toggleButton: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  }
};
