import React, { useState, useRef, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { validatePIN } from '../services/pinService';
import { saveAdminSession } from '../utils/sessionManager';
import { useNavigate, Link } from 'react-router-dom';

import { LuminaLogo } from '../components/BrandLogo';

// ─── Left Panel Illustration ──────────────────────────────────────────────────
const LeftIllustration = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="warmTeal" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#1A7A62"/>
        <stop offset="50%" stopColor="#2A9D7A"/>
        <stop offset="100%" stopColor="#3DB88A"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#warmTeal)"/>

    {/* Clouds */}
    <g opacity="0.15" fill="#fff">
      <ellipse cx="100" cy="80" rx="60" ry="30"/>
      <ellipse cx="140" cy="100" rx="70" ry="40"/>
      <ellipse cx="380" cy="60" rx="80" ry="35"/>
      <ellipse cx="420" cy="90" rx="60" ry="30"/>
    </g>

    {/* Rolling Hills */}
    <path d="M0 800V720Q120 680 250 720T500 700V800Z" fill="#125040" opacity="0.5"/>
    <path d="M0 800V750Q100 730 220 760T500 740V800Z" fill="#0D3828" opacity="0.3"/>

    {/* Glowing Diya/Lamp Illustration */}
    <g transform="translate(250, 400)">
      {/* Light radiation */}
      <circle r="120" fill="#FFD080" opacity="0.1">
        <animate attributeName="r" values="110;130;110" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle r="80" fill="#FFD080" opacity="0.15">
        <animate attributeName="r" values="75;85;75" dur="3s" repeatCount="indefinite"/>
      </circle>
      
      {/* The Diya */}
      <path d="M-60,20Q0,80 60,20Q40,-20 -40,-20Z" fill="#fff" opacity="0.95"/>
      <path d="M-50,15Q0,65 50,15Z" fill="#FFD080" opacity="0.4"/>
      
      {/* Flame */}
      <path d="M0,-20Q-15,-50 0,-90Q15,-50 0,-20" fill="#FFD080">
        <animate attributeName="d" values="M0,-20Q-15,-50 0,-90Q15,-50 0,-20;M0,-20Q-12,-55 0,-95Q12,-55 0,-20;M0,-20Q-15,-50 0,-90Q15,-50 0,-20" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M0,-20Q-8,-40 0,-70Q8,-40 0,-20" fill="#fff" opacity="0.8"/>
    </g>

    {/* Silhouettes at bottom */}
    <g fill="#fff" opacity="0.2">
      {/* Taj Mahal hint */}
      <path d="M60 720h40v-10h-5v-15Q80 685 65 695v15h-5zM80 690v-10h-2v10z"/>
      {/* Temple Gopuram hint */}
      <path d="M150 720h50l-5-10h-40l-5-10h-30l-5-10h-20l-5 10h-10z" transform="translate(250, 0) scale(0.8)"/>
      {/* Lotus outline */}
      <path d="M420 720Q400 700 420 680Q440 700 420 720M390 715Q380 695 400 685Q410 705 390 715M450 715Q460 695 440 685Q430 705 450 715" stroke="#fff" strokeWidth="2" fill="none"/>
    </g>

    {/* Sparkles */}
    {[ [150,250], [350,300], [200,550], [400,500], [100,600] ].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.8">
        <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2+i}s`} repeatCount="indefinite"/>
      </circle>
    ))}
  </svg>
);

export default function Login() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('lastLoginTab') || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const { login, loginWithPIN, studentUser, currentUser, loading: authLoading } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('lastLoginTab', tab);
    setError('');
    setEmail('');
    setPassword('');
    setPin(['', '', '', '']);
    setLoading(false);
    
    if (tab === 'student' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance("Welcome to Lumina. Please enter your four digit PIN.");
        window.speechSynthesis.speak(utter);
    }
  };

  const mapFirebaseError = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Try again.';
      case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment.';
      case 'auth/network-request-failed': return 'Network error. Check your connection.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      window.location.href = '/teacher-dashboard';
    } catch (err) {
      setError(mapFirebaseError(err.code));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    // 🚀 CRITICAL FIX: Prompt account selection so user is asked which Gmail account to use
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || 'Educator',
          role: 'teacher',
          lastLogin: new Date().toISOString()
        }, { merge: true });
        saveAdminSession(user.uid, 'teacher');
      } catch (dbErr) {
        console.warn('Could not save user profile to Firestore:', dbErr);
      }

      window.location.href = '/teacher-dashboard';
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled. Please select your Gmail account.');
      } else {
        setError(mapFirebaseError(err.code));
      }
      setLoading(false);
    }
  };

  // Keyboard PIN logic
  const handlePinKeyDown = (index, e) => {
    if (e.key >= '0' && e.key <= '9') {
      const newPin = [...pin];
      newPin[index] = e.key;
      setPin(newPin);
      if (index < 3) pinRefs[index + 1].current?.focus();
      // Auto-submit when last box filled via keyboard
      if (index === 3) {
        const fullPin = newPin.join('');
        console.log('Auto-submitting via Keyboard:', fullPin);
        setTimeout(() => submitPin(fullPin), 50);
      }
    }
    if (e.key === 'Backspace') {
      const newPin = [...pin];
      newPin[index] = '';
      setPin(newPin);
      if (index > 0) pinRefs[index - 1].current?.focus();
    }
  };

  const [scannedProfile, setScannedProfile] = useState(null);

  // ── Core PIN submission ──────────────────────────────────────────────────────
  const submitPin = async (fullPin) => {
    console.log('submitPin called with:', fullPin);
    if (!fullPin || fullPin.length !== 4) {
      console.warn('Invalid PIN length:', fullPin?.length);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const profile = await loginWithPIN(fullPin);
      console.log('loginWithPIN result profile:', profile);
      if (profile) {
        // 🚀 THE ULTIMATE FIX: Force a heavy navigation to bypass all React Router v6 async transition traps.
        window.location.href = '/dashboard';
      } else {
        setShake(true);
        setError("Hmm, that PIN didn't work. Try again! 🤔");
        setPin(['', '', '', '']);
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("Oops, that PIN didn't work. Try again!"));
        }
        setTimeout(() => setShake(false), 600);
        setTimeout(() => pinRefs[0].current?.focus(), 50);
      }
    } catch (err) {
      console.error('PIN login logic error:', err);
      setError('Something went wrong. Please try again.');
      setPin(['', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  // Called by manual "Let's go" button
  const handleStudentLogin = (e) => {
    if (e) e.preventDefault();
    const currentPin = pin.join('');
    console.log('Manual Submit Clicked. Current PIN state:', currentPin);
    submitPin(currentPin);
  };

  // Numpad button handler
  const handleNumpad = (digit) => {
    const nextEmpty = pin.findIndex(d => d === '');
    if (nextEmpty === -1) return;
    const newPin = [...pin];
    newPin[nextEmpty] = String(digit);
    setPin(newPin);
    const nextFocus = Math.min(nextEmpty + 1, 3);
    pinRefs[nextFocus].current?.focus();

    // Auto-submit on 4th digit
    if (nextEmpty === 3) {
      const fullPin = newPin.join('');
      console.log('Auto-submitting via Numpad:', fullPin);
      setTimeout(() => submitPin(fullPin), 100);
    }
  };

  const handleNumpadBack = () => {
    const lastFilled = [...pin].map((d, i) => d !== '' ? i : -1).filter(i => i >= 0).pop();
    if (lastFilled === undefined) return;
    const newPin = [...pin];
    newPin[lastFilled] = '';
    setPin(newPin);
    pinRefs[lastFilled].current?.focus();
  };

  // 🚀 Auto-fill and submit PIN if present in URL (e.g. when student scans QR code)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pinFromUrl = urlParams.get('pin');
    if (pinFromUrl && pinFromUrl.length === 4) {
      setActiveTab('student');
      setPin(pinFromUrl.split(''));
      console.log('Detected PIN from QR code / URL:', pinFromUrl);
      setTimeout(() => submitPin(pinFromUrl), 300);
    }
  }, []);

  // Voice PIN Entry Listener (from Leo)
  useEffect(() => {
    const handleVoicePin = (e) => {
      const { pin: voicePin } = e.detail;
      console.log('[Login] Received voice PIN:', voicePin);
      
      // Update UI state (one digit per box)
      const digits = voicePin.split('');
      setPin(digits);
      
      // Provide audio feedback
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const msg = `Checking PIN: ${digits.join(' ')}`;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
      }
      
      // Submit the PIN
      submitPin(voicePin);
    };

    window.addEventListener('leo:voice-pin', handleVoicePin);
    return () => window.removeEventListener('leo:voice-pin', handleVoicePin);
  }, []);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        
        .input-focus:focus-within {
          border-color: #4A90D9 !important;
          box-shadow: 0 0 0 3px rgba(74,144,217,0.12);
        }
        .pin-box:focus-within {
          border-color: #4A90D9 !important;
          box-shadow: 0 0 0 3px rgba(74,144,217,0.15) !important;
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          filter: brightness(0.95);
        }
        .numpad-btn:hover {
          border-color: #E8920C !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; }
        }

        .dot-grid {
          background-image: radial-gradient(rgba(74,144,217,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      
      {/* LEFT PANEL */}
      <div className="left-panel" style={styles.leftPanel}>
        <LeftIllustration />
        <div style={styles.leftTopBar}>
          <LuminaLogo size={42} color="#FFFFFF" />
          <span style={styles.brandNameLeft}>Lumina</span>
        </div>
        <div style={styles.leftCenterContent}>
          <div style={{ height: 200 }} /> {/* Spacer */}
          <p style={styles.everyChild}>Every child deserves to</p>
          <p style={styles.learnWay}>learn their way.</p>
        </div>
        <div style={styles.leftFooter}>
          <p style={styles.niceToSee}>NICE TO SEE YOU AGAIN</p>
          <h2 style={styles.welcomeBack}>WELCOME BACK</h2>
          <div style={styles.amberUnderline} />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel dot-grid" style={styles.rightPanel}>
        <div style={styles.rightTopBar}>
          <Link to="/" style={styles.logoGroup}>
            <LuminaLogo size={24} color="#4A90D9" />
            <span style={styles.brandNameRight}>Lumina</span>
          </Link>
          <Link to="/" style={styles.backHome}>← Back to home</Link>
        </div>

        <div style={styles.formArea}>
          <div style={styles.tabSwitcher}>
            <button 
              style={{ ...styles.tab, ...(activeTab === 'admin' ? styles.tabActive : {}) }}
              onClick={() => handleTabChange('admin')}
            >
              Teacher / Parent
            </button>
            <button 
              style={{ ...styles.tab, ...(activeTab === 'student' ? styles.tabActive : {}) }}
              onClick={() => handleTabChange('student')}
            >
              Student
            </button>
          </div>

          <div className="fade-up" style={{ minHeight: 480 }}>
            {activeTab === 'admin' ? (
              <div key="admin">
                <h1 style={styles.formH1}>Welcome</h1>
                <p style={styles.formSub}>Login securely with your educator account</p>

                {currentUser && (
                  <div style={{
                    background: '#EBF4FF',
                    border: '1.5px solid #BEE3F8',
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 20,
                    width: 380,
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    fontSize: 13
                  }}>
                    <span style={{ color: '#2B6CB0', fontWeight: 600 }}>
                      Currently signed in as: <b>{currentUser.email}</b>
                    </span>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => { window.location.href = '/teacher-dashboard'; }}
                        style={{
                          background: '#3182CE',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Go to Dashboard →
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut(auth);
                          window.location.href = '/login?switch=true';
                        }}
                        style={{
                          background: '#EDF2F7',
                          color: '#4A5568',
                          border: '1px solid #CBD5E0',
                          borderRadius: 6,
                          padding: '6px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Sign Out / Switch Account
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>EMAIL ID</label>
                    <div className="input-focus" style={styles.inputWrapper}>
                      <span style={{ fontSize: 16 }}>📧</span>
                      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>PASSWORD</label>
                    <div className="input-focus" style={styles.inputWrapper}>
                      <span style={{ fontSize: 16 }}>🔒</span>
                      <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>{showPassword ? '👁️' : '🕶️'}</button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-hover" style={styles.loginBtn}>
                    {loading ? 'AUTHENTICATING...' : 'LOGIN TO CONSOLE'}
                  </button>
                </form>

                <div style={styles.divider}>
                  <div style={styles.line} />
                  <span style={styles.orText}>OR</span>
                  <div style={styles.line} />
                </div>

                <button onClick={handleGoogleLogin} style={styles.googleBtn} className="btn-hover">
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 12 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google Educator
                </button>
              </div>
            ) : (
              <div key="student" style={{ textAlign: 'center' }}>
                <h1 style={styles.formH1}>Hi there! 🌟</h1>
                <p style={styles.formSub}>Enter your 4-digit PIN to start learning!</p>

                <div className={shake ? 'shake' : ''} style={styles.pinRow}>
                  {pin.map((digit, i) => (
                    <div key={i} className="pin-box" style={{ ...styles.pinBox, borderColor: digit ? '#E8920C' : '#D0D8E4' }}>
                      <input 
                        ref={pinRefs[i]} type={showPin ? 'text' : 'password'} value={digit}
                        onKeyDown={(e) => handlePinKeyDown(i, e)} onChange={() => {}}
                        style={styles.pinInput} maxLength={1} inputMode="numeric"
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <button onClick={() => setShowPin(!showPin)} style={styles.pinToggle}>
                    <span>{showPin ? '👁️' : '🕶️'}</span> {showPin ? 'Hide PIN' : 'Show PIN'}
                  </button>
                </div>

                <div style={styles.keypad}>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <button key={n} onClick={() => handleNumpad(n)} style={styles.keypadBtn} className="numpad-btn">{n}</button>
                  ))}
                  <button onClick={handleNumpadBack} style={styles.keypadBtn} className="numpad-btn">←</button>
                  <button onClick={() => handleNumpad(0)} style={styles.keypadBtn} className="numpad-btn">0</button>
                  <div style={styles.keypadBtn} />
                </div>

                <button 
                  onClick={handleStudentLogin} disabled={loading || pin.some(d => d === '')}
                  className={pin.some(d => d === '') ? '' : 'btn-hover'}
                  style={{ ...styles.loginBtn, opacity: pin.some(d => d === '') ? 0.45 : 1, cursor: pin.some(d => d === '') ? 'not-allowed' : 'pointer', marginTop: 32 }}
                >
                  {loading ? 'CHECKING...' : 'Let\'s go! 🚀'}
                </button>
              </div>
            )}
            {error && <div role="alert" style={styles.errorBox}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    overflow: 'hidden',
  },
  leftPanel: {
    width: '45%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  leftTopBar: {
    position: 'absolute',
    top: 40,
    left: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  brandNameLeft: {
    fontFamily: 'Fraunces, serif',
    fontSize: 26,
    fontWeight: 700,
  },
  leftCenterContent: {
    zIndex: 5,
    textAlign: 'center',
  },
  everyChild: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'Nunito, sans-serif',
    marginBottom: 4,
  },
  learnWay: {
    fontFamily: 'Fraunces, serif',
    fontStyle: 'italic',
    color: '#FFD080',
    fontSize: 22,
    fontWeight: 600,
  },
  leftFooter: {
    position: 'absolute',
    bottom: 60,
    textAlign: 'center',
    zIndex: 5,
  },
  niceToSee: {
    fontSize: 10,
    letterSpacing: '0.2em',
    opacity: 0.7,
    fontWeight: 800,
    marginBottom: 8,
  },
  welcomeBack: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2rem',
    fontWeight: 700,
  },
  amberUnderline: {
    width: 48,
    height: 3,
    background: '#E8920C',
    margin: '12px auto 0',
  },
  rightPanel: {
    width: '55%',
    height: '100%',
    background: '#F7F6F2',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowY: 'auto',   // ← allows scrolling on small screens
  },
  rightTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 60px',
    flexShrink: 0,
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  brandNameRight: {
    fontFamily: 'Fraunces, serif',
    fontSize: 18,
    fontWeight: 700,
    color: '#0A1628',
  },
  backHome: {
    fontSize: 13,
    color: '#5A7088',
    fontWeight: 700,
    textDecoration: 'none',
  },
  formArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',  // ← allows content to show from top when overflowing
    padding: '20px 40px 40px',
  },
  tabSwitcher: {
    background: '#E8ECF0',
    borderRadius: 100,
    padding: 4,
    display: 'flex',
    width: 'fit-content',
    marginBottom: 40,
  },
  tab: {
    padding: '10px 28px',
    borderRadius: 100,
    border: 'none',
    background: 'transparent',
    color: '#5A7088',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#fff',
    color: '#0A1628',
    fontWeight: 800,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formH1: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2.4rem',
    color: '#0A1628',
    fontWeight: 700,
    marginBottom: 4,
    textAlign: 'center',
  },
  formSub: {
    color: '#5A7088',
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: 380,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0A1628',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    background: '#fff',
    border: '1.5px solid #D0D8E4',
    borderRadius: 10,
    padding: '13px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.2s',
  },
  input: {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontFamily: 'Nunito, sans-serif',
    fontSize: 14,
    color: '#0A1628',
    background: 'transparent',
  },
  eyeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#A0AEC0',
    fontSize: 16,
  },
  forgotLink: {
    background: 'transparent',
    border: 'none',
    color: '#E8920C',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loginBtn: {
    width: '100%',
    background: '#E8920C',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontWeight: 900,
    fontFamily: 'Nunito, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(232,146,12,0.35)',
    transition: 'all 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: 380,
    maxWidth: '100%',
    margin: '24px 0',
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    background: '#D0D8E4',
  },
  orText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: 700,
  },
  googleBtn: {
    width: 380,
    maxWidth: '100%',
    background: '#fff',
    border: '1.5px solid #D0D8E4',
    borderRadius: 10,
    padding: 12,
    color: '#0A1628',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  bottomCta: {
    marginTop: 24,
    fontSize: 13,
    color: '#5A7088',
    textAlign: 'center',
  },
  errorBox: {
    marginTop: 20,
    width: 380,
    maxWidth: '100%',
    background: 'rgba(229, 62, 62, 0.08)',
    border: '1px solid rgba(229, 62, 62, 0.2)',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#E53E3E',
    fontSize: 13.5,
    textAlign: 'center',
  },
  pinRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pinBox: {
    width: 68,
    height: 76,
    background: '#fff',
    border: '1.5px solid #D0D8E4',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  pinInput: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 800,
    color: '#0A1628',
  },
  pinToggle: {
    background: 'transparent',
    border: 'none',
    color: '#E8920C',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    width: 216,
    margin: '0 auto',
  },
  keypadBtn: {
    width: 64,
    height: 50,
    background: '#fff',
    border: '1.5px solid #D0D8E4',
    borderRadius: 10,
    color: '#0A1628',
    fontSize: 18,
    fontWeight: 800,
    fontFamily: 'Nunito, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  successPage: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1A7A62',
    fontFamily: 'Nunito, sans-serif',
  },
  successCard: {
    background: '#fff',
    width: 440,
    padding: 60,
    borderRadius: 48,
    textAlign: 'center',
    boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
  },
  avatarHuge: {
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: '#F7F6F2',
    margin: '0 auto 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 60,
    fontWeight: 800,
    color: '#0A1628',
    overflow: 'hidden',
  },
  successName: {
    fontFamily: 'Fraunces, serif',
    fontSize: '2.8rem',
    color: '#0A1628',
    marginBottom: 8,
  },
  successSub: {
    color: '#5A7088',
    fontSize: 18,
    marginBottom: 48,
  },
  startBtn: {
    width: '100%',
    background: '#E8920C',
    color: '#fff',
    border: 'none',
    padding: '20px',
    borderRadius: 100,
    fontSize: 18,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 12px 32px rgba(232,146,12,0.3)',
  }
};
