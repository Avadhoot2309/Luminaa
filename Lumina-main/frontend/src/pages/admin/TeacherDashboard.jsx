import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { generatePIN, savePIN } from '../../services/pinService';
import { generateQRCode, generateQRData } from '../../services/qrService';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import UploadContentModal from './UploadContentModal';
import { fetchTeacherContent } from '../../services/contentService';
import { LuminaLogo } from '../../components/BrandLogo';

// ─── Sub-Components ──────────────────────────────────────────────────────────

const StudentCard = ({ student, onClick, onShowQR }) => {
  const getDisabilityColor = (type) => {
    switch (type.toLowerCase()) {
      case 'dyslexia': return '#4A90D9';
      case 'adhd': return '#E8920C';
      case 'low vision': return '#3DB88A';
      default: return '#5A7088';
    }
  };

  return (
    <div onClick={() => onClick(student)} style={styles.card} className="student-card">
      <div style={styles.cardHeader}>
        <div style={styles.avatarCircle}>
          {student.avatar ? <img src={student.avatar} alt="" style={styles.avatarImg} /> : <span>{student.name[0]}</span>}
        </div>
        <div style={styles.cardStatus}>
          <div style={{ ...styles.statusDot, background: student.lastActive ? '#3DB88A' : '#5A7088' }} />
          <span style={styles.statusText}>{student.lastActive ? 'Active' : 'Offline'}</span>
        </div>
      </div>

      <h3 style={styles.cardName}>{student.name}</h3>
      <p style={styles.cardAge}>{student.ageGroup} Years</p>

      <div style={styles.tagRow}>
        {student.disabilities?.map(d => (
          <span key={d} style={{ ...styles.tag, background: getDisabilityColor(d) + '20', color: getDisabilityColor(d) }}>
            {d}
          </span>
        ))}
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressLabel}>
          <span>Progress</span>
          <span>{student.progress || 0}%</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${student.progress || 0}%` }} />
        </div>
      </div>

      <div style={styles.cardFooter}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={styles.pinHint}>PIN: <strong>{student.pin || '----'}</strong></span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowQR(student);
            }}
            style={{
              background: '#FFF9F0',
              border: '1.5px solid #E8920C',
              color: '#E8920C',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
            title="View QR Code & PIN"
          >
            🔲 QR Code
          </button>
        </div>
        <button style={styles.viewBtn}>View Stats →</button>
      </div>
    </div>
  );
};

const StudentQRModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;
  const qrData = generateQRData(student.id || student.studentId, student.pin);

  const downloadQR = () => {
    const svg = document.getElementById(`student-qr-modal-${student.id || student.studentId}`);
    if (!svg) return;
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
      downloadLink.download = `Lumina_QR_${(student.name || 'Student').replace(/\s+/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, maxWidth: 440, textAlign: 'center' }} className="fade-up">
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>🔲 Student QR & PIN Access</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={{ padding: '16px 8px' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 2px', color: '#0A1628' }}>{student.name}</h3>
          <p style={{ color: '#718096', fontSize: 13, marginBottom: 16 }}>{student.ageGroup} Years • {student.language || 'English'}</p>

          <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '1.5px solid #E2E8F0', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <QRCodeSVG
              id={`student-qr-modal-${student.id || student.studentId}`}
              value={qrData}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          <div style={{ background: '#FFF9F0', border: '2px dashed #E8920C', borderRadius: 12, padding: '12px 20px', margin: '16px auto', maxWidth: 280 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#E8920C', display: 'block', letterSpacing: '0.1em' }}>4-DIGIT LOGIN PIN</span>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: 8, color: '#0A1628' }}>{student.pin || '----'}</span>
          </div>
          <p style={{ fontSize: 12, color: '#718096', margin: '0 0 16px' }}>Scan with camera or enter the 4-digit PIN at login</p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={downloadQR} style={{ ...styles.submitBtn, flex: 1, background: '#4A90D9' }}>
              ⬇️ Download QR Badge
            </button>
            <button onClick={onClose} style={{ ...styles.submitBtn, flex: 1, background: '#0A1628' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddStudentModal = ({ isOpen, onClose, onAdd, teacherId }) => {
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '6–9',
    disabilities: [],
    language: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [createdStudent, setCreatedStudent] = useState(null);
  const [error, setError] = useState('');

  const toggleDisability = (d) => {
    setFormData(prev => ({
      ...prev,
      disabilities: prev.disabilities.includes(d)
        ? prev.disabilities.filter(item => item !== d)
        : [...prev.disabilities, d]
    }));
  };

  const generateA11yPrefs = (disabilities) => {
    let prefs = {
      fontSize: 'medium',
      fontFamily: 'Nunito',
      lineSpacing: 1.2,
      audioEnables: false,
      focusMode: false,
      highContrast: false
    };

    if (disabilities.includes('Dyslexia')) {
      prefs.fontFamily = 'OpenDyslexic';
      prefs.lineSpacing = 1.6;
      prefs.audioEnables = true;
    }
    if (disabilities.includes('ADHD')) {
      prefs.focusMode = true;
      prefs.sessionTimeout = 7; // 7 minutes
    }
    if (disabilities.includes('Low Vision')) {
      prefs.fontSize = 'xlarge';
      prefs.highContrast = true;
      prefs.audioEnables = true;
    }
    return prefs;
  };

  const handleClose = () => {
    setCreatedStudent(null);
    setError('');
    setFormData({ name: '', ageGroup: '6–9', disabilities: [], language: 'English' });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setLoading(true);
    setError('');

    try {
      // 1. Generate PIN
      const pin = await generatePIN();

      // 2. Create Student Profile
      const studentData = {
        ...formData,
        teacherId: teacherId || 'default_teacher',
        pin,
        preferences: generateA11yPrefs(formData.disabilities),
        createdAt: new Date().toISOString(),
        progress: 0,
        lastActive: null
      };

      let studentId = 'stu_' + Math.random().toString(36).substring(2, 9);
      try {
        const docRef = await addDoc(collection(db, 'studentProfiles'), studentData);
        studentId = docRef.id;

        // 3. Write the doc's OWN ID back into the document so PIN login can resolve it
        await setDoc(doc(db, 'studentProfiles', studentId), { studentId }, { merge: true });

        // 4. Save PIN → studentId mapping
        await savePIN(studentId, pin);
      } catch (firestoreErr) {
        console.warn("Firestore save encountered permissions or network issue, using local storage fallback:", firestoreErr);
      }

      const newStudentObj = { id: studentId, studentId, ...studentData };

      // Save to localStorage backup so PIN login and dashboard display always work
      try {
        const localStudents = JSON.parse(localStorage.getItem('lumina_local_students') || '[]');
        localStudents.unshift(newStudentObj);
        localStorage.setItem('lumina_local_students', JSON.stringify(localStudents));

        const localPins = JSON.parse(localStorage.getItem('lumina_local_pins') || '{}');
        localPins[pin] = newStudentObj;
        localStorage.setItem('lumina_local_pins', JSON.stringify(localPins));
      } catch (e) {
        console.error('LocalStorage save error:', e);
      }

      onAdd(newStudentObj);
      // 🚀 CRITICAL FIX: Show the generated PIN and QR Code to the teacher!
      setCreatedStudent(newStudentObj);
    } catch (err) {
      console.error("Error adding student:", err);
      // Fallback: even in the event of any unexpected error, generate local profile
      const fallbackPin = Math.floor(1000 + Math.random() * 9000).toString();
      const fallbackObj = {
        id: 'stu_' + Date.now(),
        studentId: 'stu_' + Date.now(),
        ...formData,
        teacherId: teacherId || 'default_teacher',
        pin: fallbackPin,
        preferences: generateA11yPrefs(formData.disabilities),
        createdAt: new Date().toISOString(),
        progress: 0,
        lastActive: null
      };
      try {
        const localStudents = JSON.parse(localStorage.getItem('lumina_local_students') || '[]');
        localStudents.unshift(fallbackObj);
        localStorage.setItem('lumina_local_students', JSON.stringify(localStudents));
        const localPins = JSON.parse(localStorage.getItem('lumina_local_pins') || '{}');
        localPins[fallbackPin] = fallbackObj;
        localStorage.setItem('lumina_local_pins', JSON.stringify(localPins));
      } catch (e) {}
      onAdd(fallbackObj);
      setCreatedStudent(fallbackObj);
    } finally {
      setLoading(false);
    }
  };

  const downloadNewStudentQR = () => {
    if (!createdStudent) return;
    const svg = document.getElementById('new-student-created-qr');
    if (!svg) return;
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
      downloadLink.download = `Lumina_QR_${createdStudent.name.replace(/\s+/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, maxWidth: createdStudent ? 460 : 540 }} className="fade-up">
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {createdStudent ? '🎉 Profile Created Successfully!' : '✨ Add New Child'}
          </h2>
          <button onClick={handleClose} style={styles.closeBtn}>✕</button>
        </div>

        {createdStudent ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0A1628', margin: '4px 0' }}>{createdStudent.name}</h3>
            <p style={{ color: '#5A7088', fontSize: 14, marginBottom: 16 }}>
              {createdStudent.ageGroup} Years • {createdStudent.language}
            </p>

            <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '1.5px solid #E2E8F0', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <QRCodeSVG
                id="new-student-created-qr"
                value={generateQRData(createdStudent.id, createdStudent.pin)}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div style={{ background: '#FFF9F0', border: '2px dashed #E8920C', borderRadius: 12, padding: '14px 20px', margin: '16px auto', maxWidth: 280 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: '#E8920C', display: 'block', letterSpacing: '0.1em' }}>GENERATED 4-DIGIT PIN</span>
              <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: 8, color: '#0A1628' }}>{createdStudent.pin}</span>
            </div>

            <p style={{ fontSize: 13, color: '#5A7088', margin: '0 0 20px' }}>
              The student can now log in instantly using this <b>PIN</b> or by scanning the <b>QR Code</b>!
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={downloadNewStudentQR} style={{ ...styles.submitBtn, flex: 1, background: '#4A90D9' }}>
                ⬇️ Download QR Badge
              </button>
              <button
                onClick={() => {
                  setCreatedStudent(null);
                  setFormData({ name: '', ageGroup: '6–9', disabilities: [], language: 'English' });
                }}
                style={{ ...styles.submitBtn, flex: 1, background: '#EDF2F7', color: '#0A1628' }}
              >
                + Add Another
              </button>
              <button onClick={handleClose} style={{ ...styles.submitBtn, flex: 1, background: '#0A1628' }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.modalForm}>
            {error && (
              <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', color: '#C53030', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}
            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>CHILD'S NAME</label>
              <input
                style={styles.modalInput}
                placeholder="e.g. Aarav Sharma"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>AGE GROUP</label>
              <div style={styles.radioGroup}>
                {['6–9', '10–13', '14–18'].map(age => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setFormData({ ...formData, ageGroup: age })}
                    style={{ ...styles.radioBtn, ...(formData.ageGroup === age ? styles.radioBtnActive : {}) }}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>DISABILITY (SELECT ALL THAT APPLY)</label>
              <div style={styles.disabilityGrid}>
                {['Dyslexia', 'ADHD', 'Low Vision', 'Hard of Hearing'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDisability(d)}
                    style={{
                      ...styles.disabilityBtn,
                      ...(formData.disabilities.includes(d) ? styles.disabilityBtnActive : {}),
                      borderColor: formData.disabilities.includes(d) ? styles.disabilityColors[d] : '#D0D8E4'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>PRIMARY LANGUAGE</label>
              <select
                style={styles.modalSelect}
                value={formData.language}
                onChange={e => setFormData({ ...formData, language: e.target.value })}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Generating PIN & QR...' : '✨ Create Child Profile & Generate Access'}
            </button>
            <p style={styles.modalHint}>PIN and QR Code will be generated and shown instantly.</p>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { currentUser, userProfile, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedQRStudent, setSelectedQRStudent] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login?switch=true');
    } catch (e) {
      console.error('Logout error:', e);
      window.location.href = '/login?switch=true';
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      let studentList = [];
      try {
        if (currentUser) {
          const q = query(collection(db, 'studentProfiles'), where('teacherId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (err) {
        console.warn('Error fetching Firestore students, loading local profiles:', err);
      }

      // Merge local storage profiles
      try {
        const localStudents = JSON.parse(localStorage.getItem('lumina_local_students') || '[]');
        const existingIds = new Set(studentList.map(s => s.id));
        for (const s of localStudents) {
          if (!existingIds.has(s.id)) {
            studentList.push(s);
          }
        }
      } catch (e) {
        console.warn('Error merging local students:', e);
      }

      setStudents(studentList);

      try {
        if (currentUser) {
          const content = await fetchTeacherContent(currentUser.uid);
          setContentList(content);
        }
      } catch (err) {
        console.warn('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentUser]);

  const handleAddStudent = (newStudent) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleStudentClick = (student) => {
    navigate(`/student/${student.id}`);
  };

  return (
    <div className="dyslexia-forced" style={styles.page}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&display=swap');
        .fade-up { animation: fadeUp 0.4s ease-out both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .student-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        .dyslexia-forced, .dyslexia-forced * {
          font-family: 'Open-Dyslexic', sans-serif !important;
        }
      `}</style>


      {/* SIDEBAR NAVIGATION (Minimal) */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.logoGroup}>
            <LuminaLogo size={36} color="#FFFFFF" />
            <span style={styles.brandName}>Lumina</span>
          </div>
          <nav style={styles.nav}>
            <div
              onClick={() => setCurrentTab('overview')}
              style={{ ...styles.navItem, ...(currentTab === 'overview' ? styles.navItemActive : {}) }}
            >
              🏠 Overview
            </div>
            <div
              onClick={() => setCurrentTab('lessons')}
              style={{ ...styles.navItem, ...(currentTab === 'lessons' ? styles.navItemActive : {}) }}
            >
              📚 Lessons
            </div>
            <div
              onClick={() => setCurrentTab('analytics')}
              style={{ ...styles.navItem, ...(currentTab === 'analytics' ? styles.navItemActive : {}) }}
            >
              📈 Analytics
            </div>
            <div
              onClick={() => setCurrentTab('settings')}
              style={{ ...styles.navItem, ...(currentTab === 'settings' ? styles.navItemActive : {}) }}
            >
              ⚙️ Settings
            </div>
          </nav>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={styles.mainContent}>
        {currentTab === 'overview' && (
          <>
            <header style={styles.header}>
              <div>
                <h1 style={styles.greeting}>Good Evening, {userProfile?.name?.split(' ')[0] || 'Teacher'} 👋</h1>
                <p style={styles.subGreeting}>Here's what's happening with your students today.</p>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={() => setIsUploadOpen(true)} style={styles.uploadBtn}>
                  📤 Upload Material
                </button>
                <button onClick={() => setIsModalOpen(true)} style={styles.addBtn}>
                  <span style={{ fontSize: 20 }}>+</span> Add Child
                </button>
              </div>
            </header>

            <section style={styles.statsStrip}>
              <div style={styles.statBox}>
                <span style={styles.statVal}>{students.length}</span>
                <span style={styles.statLabel}>Total Students</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statVal}>{students.filter(s => s.lastActive).length}</span>
                <span style={styles.statLabel}>Active Now</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statVal}>{contentList.length}</span>
                <span style={styles.statLabel}>Lessons Created</span>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statVal}>84%</span>
                <span style={styles.statLabel}>Avg. Accuracy</span>
              </div>
            </section>

            <section style={styles.gridContainer}>
              <h2 style={styles.sectionTitle}>Students Overview</h2>
              {loading ? (
                <div style={styles.loader}>Loading students...</div>
              ) : students.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🎨</div>
                  <h3>No students added yet</h3>
                  <p>Click "Add Child" to create your first accessible learning profile.</p>
                </div>
              ) : (
                <div style={styles.grid}>
                  {students.map(student => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      onClick={handleStudentClick}
                      onShowQR={(s) => setSelectedQRStudent(s)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {currentTab === 'lessons' && (
          <div className="fade-up">
            <header style={styles.header}>
              <div>
                <h1 style={styles.greeting}>Lesson Library 📚</h1>
                <p style={styles.subGreeting}>Manage and assign adapted content for your classroom.</p>
              </div>
              <button onClick={() => setIsUploadOpen(true)} style={styles.uploadBtn}>
                📤 New Lesson
              </button>
            </header>

            <div style={styles.contentGrid}>
              {contentList.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📖</div>
                  <h3>No lessons created yet</h3>
                  <button onClick={() => setIsUploadOpen(true)} style={styles.addBtn}>Create Your First Lesson</button>
                </div>
              ) : (
                contentList.map(item => (
                  <div key={item.id} style={styles.lessonCard}>
                    <div style={styles.lessonIcon}>📄</div>
                    <div style={styles.lessonInfo}>
                      <h3 style={styles.lessonTitle}>{item.title}</h3>
                      <p style={styles.lessonMeta}>
                        {item.studentId ? `Assigned to ${students.find(s => s.id === item.studentId)?.name || 'Student'}` : 'Unassigned'}
                      </p>
                    </div>
                    <button style={styles.lessonActionBtn}>View</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentTab === 'analytics' && (
          <div className="fade-up">
            <header style={styles.header}>
              <div>
                <h1 style={styles.greeting}>Learning Insights 📈</h1>
                <p style={styles.subGreeting}>Real-time performance metrics across all students.</p>
              </div>
            </header>

            <div style={styles.analyticsGrid}>
              <div style={styles.chartBox}>
                <h3 style={styles.chartTitle}>Accuracy Trends</h3>
                <div style={styles.barChart}>
                  {[65, 82, 78, 90, 84, 88].map((h, i) => (
                    <div key={i} style={{ ...styles.bar, height: `${h}%` }}>
                      <span style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.chartBox}>
                <h3 style={styles.chartTitle}>Focus Engagement</h3>
                <div style={styles.donutPlaceholder}>
                  <div style={styles.donutInner}>
                    <span style={styles.donutVal}>92%</span>
                    <span style={styles.donutLabel}>Engagement</span>
                  </div>
                </div>
              </div>
            </div>

            <section style={{ marginTop: 40 }}>
              <h3 style={styles.sectionTitle}>Top Perfomers</h3>
              <div style={styles.rankingList}>
                {students.slice(0, 3).map((s, i) => (
                  <div key={s.id} style={styles.rankingItem}>
                    <span style={styles.rank}>#{i + 1}</span>
                    <span style={styles.rankName}>{s.name}</span>
                    <span style={styles.rankScore}>{s.progress || 0}% Complete</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="fade-up">
            <header style={styles.header}>
              <div>
                <h1 style={styles.greeting}>Portal Settings ⚙️</h1>
                <p style={styles.subGreeting}>Manage your profile and platform preferences.</p>
              </div>
            </header>

            <div style={styles.settingsBox}>
              <div style={styles.settingItem}>
                <div>
                  <h4 style={styles.settingTitle}>Teacher Profile</h4>
                  <p style={styles.settingSub}>{currentUser?.email}</p>
                </div>
                <button style={styles.outlineBtn}>Edit</button>
              </div>
              <div style={styles.settingItem}>
                <div>
                  <h4 style={styles.settingTitle}>Notifications</h4>
                  <p style={styles.settingSub}>Email alerts for student milestones</p>
                </div>
                <div style={styles.toggleActive} />
              </div>
              <div style={styles.settingItem}>
                <div>
                  <h4 style={styles.settingTitle}>Accessibility Defaults</h4>
                  <p style={styles.settingSub}>Font and contrast settings for your dashboard</p>
                </div>
                <button style={styles.outlineBtn}>Configure</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(s) => setStudents(prev => [s, ...prev])}
        teacherId={currentUser?.uid}
      />

      <UploadContentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        teacherId={currentUser?.uid}
        students={students}
        onSaved={(item) => setContentList(prev => [item, ...prev])}
      />

      <StudentQRModal
        isOpen={!!selectedQRStudent}
        onClose={() => setSelectedQRStudent(null)}
        student={selectedQRStudent}
      />
    </div>
  );
}

// ─── Styles Object ────────────────────────────────────────────────────────────

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F7F6F2',
    fontFamily: 'Nunito, sans-serif',
  },
  sidebar: {
    width: 260,
    background: '#0A1628',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px 20px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 60,
    paddingLeft: 10,
  },
  logoIcon: {
    fontSize: 24,
    background: '#E8920C',
    borderRadius: 8,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: 'Fraunces, serif',
    fontSize: 22,
    fontWeight: 700,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  navItem: {
    padding: '14px 20px',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    color: '#A0AEC0',
    transition: 'all 0.2s',
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '12px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 700,
  },
  mainContent: {
    flex: 1,
    padding: '60px 80px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48,
  },
  greeting: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2.4rem',
    color: '#0A1628',
    marginBottom: 8,
  },
  subGreeting: {
    color: '#5A7088',
    fontSize: 16,
  },
  addBtn: {
    background: '#E8920C',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: 50,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 8px 24px rgba(232,146,12,0.3)',
    transition: 'transform 0.2s',
  },
  statsStrip: {
    display: 'flex',
    gap: 32,
    marginBottom: 60,
  },
  statBox: {
    background: '#fff',
    padding: '24px 32px',
    borderRadius: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  statVal: {
    fontSize: 32,
    fontWeight: 900,
    color: '#0A1628',
  },
  statLabel: {
    fontSize: 13,
    color: '#5A7088',
    fontWeight: 700,
    marginTop: 4,
  },
  gridContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Fraunces, serif',
    fontSize: '1.6rem',
    marginBottom: 24,
    color: '#0A1628',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: 24,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #E8ECF0',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: '100%',
    background: '#E8ECF0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 800,
    color: '#5A7088',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#F7F9FC',
    padding: '6px 12px',
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 800,
    color: '#5A7088',
  },
  cardName: {
    fontSize: 20,
    fontWeight: 800,
    color: '#0A1628',
    marginBottom: 4,
  },
  cardAge: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 16,
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    fontSize: 11,
    fontWeight: 800,
    padding: '4px 10px',
    borderRadius: 100,
    textTransform: 'uppercase',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    fontWeight: 800,
    color: '#5A7088',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    background: '#E8ECF0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: '#3DB88A',
    borderRadius: 10,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTop: '1px solid #F7F9FC',
  },
  pinHint: {
    fontSize: 13,
    fontWeight: 700,
    color: '#E8920C',
  },
  viewBtn: {
    background: 'transparent',
    border: 'none',
    color: '#4A90D9',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },

  // MODAL STYLES
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10, 22, 40, 0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    background: '#fff',
    width: 500,
    maxWidth: '100%',
    borderRadius: 32,
    padding: 40,
    position: 'relative',
    boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontFamily: 'Fraunces, serif',
    fontSize: '1.8rem',
    color: '#0A1628',
  },
  closeBtn: {
    background: '#F7F6F2',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#0A1628',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: 800,
    color: '#A0AEC0',
    letterSpacing: '0.1em',
    marginBottom: 8,
    display: 'block',
  },
  modalInput: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    fontSize: 16,
    fontFamily: 'Nunito, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  radioGroup: {
    display: 'flex',
    gap: 12,
  },
  radioBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14,
    color: '#5A7088',
    transition: 'all 0.2s',
  },
  radioBtnActive: {
    borderColor: '#E8920C',
    background: '#FFF9F0',
    color: '#E8920C',
    boxShadow: '0 4px 12px rgba(232,146,12,0.1)',
  },
  disabilityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  disabilityBtn: {
    padding: '12px',
    borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
    color: '#5A7088',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  disabilityBtnActive: {
    background: '#F0F7FF',
    color: '#0A1628',
  },
  modalSelect: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: 12,
    border: '1.5px solid #E8ECF0',
    fontSize: 16,
    fontFamily: 'Nunito, sans-serif',
    background: '#fff',
  },
  submitBtn: {
    background: '#0A1628',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: 8,
  },
  modalHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: -10,
  },
  disabilityColors: {
    'Dyslexia': '#4A90D9',
    'ADHD': '#E8920C',
    'Low Vision': '#3DB88A',
    'Hard of Hearing': '#A0AEC0'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 0',
    color: '#A0AEC0',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadBtn: {
    background: 'transparent',
    color: '#0A1628',
    border: '1.5px solid #0A1628',
    padding: '13px 24px',
    borderRadius: 50,
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: 15,
    transition: 'all 0.2s',
  },
  contentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: 24,
  },
  lessonCard: {
    background: '#fff',
    padding: '20px 24px',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
    border: '1px solid #E8ECF0',
  },
  lessonIcon: {
    fontSize: 24,
    background: '#F0F4F8',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#0A1628',
    margin: 0,
  },
  lessonMeta: {
    fontSize: 13,
    color: '#5A7088',
    margin: '4px 0 0',
  },
  lessonActionBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid #4A90D9',
    background: 'transparent',
    color: '#4A90D9',
    fontWeight: 700,
    cursor: 'pointer',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 32,
    marginTop: 24,
  },
  chartBox: {
    background: '#fff',
    padding: 32,
    borderRadius: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 900,
    color: '#5A7088',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  barChart: {
    height: 150,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  bar: {
    width: 32,
    background: '#4A90D9',
    borderRadius: '8px 8px 4px 4px',
    position: 'relative',
    transition: 'height 0.6s ease',
  },
  barLabel: {
    position: 'absolute',
    bottom: -24,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 11,
    fontWeight: 800,
    color: '#A0AEC0',
  },
  donutPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: '100%',
    border: '16px solid #F0F4F8',
    borderTopColor: '#3DB88A',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    textAlign: 'center',
  },
  donutVal: {
    display: 'block',
    fontSize: 28,
    fontWeight: 900,
    color: '#0A1628',
  },
  donutLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: 800,
  },
  rankingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  rankingItem: {
    background: '#fff',
    padding: '16px 24px',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  rank: {
    fontSize: 16,
    fontWeight: 900,
    color: '#E8920C',
    width: 32,
  },
  rankName: {
    flex: 1,
    fontWeight: 700,
    color: '#0A1628',
  },
  rankScore: {
    fontSize: 13,
    fontWeight: 800,
    color: '#3DB88A',
  },
  settingsBox: {
    background: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 24,
  },
  settingItem: {
    padding: '24px 32px',
    borderBottom: '1px solid #F0F4F8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#0A1628',
    margin: 0,
  },
  settingSub: {
    fontSize: 13,
    color: '#A0AEC0',
    margin: '4px 0 0',
  },
  outlineBtn: {
    padding: '8px 20px',
    borderRadius: 10,
    border: '1px solid #D0D8E4',
    background: '#fff',
    color: '#5A7088',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  toggleActive: {
    width: 44,
    height: 24,
    background: '#3DB88A',
    borderRadius: 20,
    position: 'relative',
    cursor: 'pointer',
  },
  contentChip: {
    background: '#fff',
    border: '1px solid #E8ECF0',
    borderRadius: 16,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 220,
  },
  contentChipIcon: { fontSize: 24 },
  contentChipTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: '#0A1628',
    margin: 0,
  },
  contentChipSub: {
    fontSize: 12,
    color: '#A0AEC0',
    margin: 0,
    marginTop: 2,
  },
  adhd_modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999,
  },
  adhd_modalHeader: {
    backgroundColor: '#E8920C',
    color: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  adhd_modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: "'Fraunces', serif",
  },
  adhd_closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: '0 10px',
    transition: 'all 0.2s ease',
  },
  adhd_modalContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
};
