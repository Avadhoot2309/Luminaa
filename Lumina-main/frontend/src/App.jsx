import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { LearningAssistantProvider } from './contexts/LearningAssistantContext';
import GlobalAssistant from './components/GlobalAssistant';

import Login from './pages/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/StudentDashboard';
import ADHDDashboardDemo from './pages/DashboardPrototype';
import SignLanguageDashboard from './pages/SignLanguageDashboard';
import TestServices from './pages/TestServices';
import TestBackend from './pages/TestBackend';
import { Landing } from './pages/Landing';
import TeacherDashboard from './pages/admin/TeacherDashboard';
import StudentDetail from './pages/admin/StudentDetail';
import ContentViewer from './pages/student/ContentViewer';
import WordJump from './pages/games/WordJump';
import SubjectsScreen from './pages/student/SubjectsScreen';
import ChaptersScreen from './pages/student/ChaptersScreen';
import LessonPlayer from './pages/student/LessonPlayer';
import FocusFlash from './pages/games/FocusFlash';
import PhoneticPop from './pages/games/PhoneticPop';
import SignMatch from './pages/games/SignMatch';
import GamesScreen from './pages/student/GamesScreen';
import MathRace from './pages/games/MathRace';
import MemoryMatch from './pages/games/MemoryMatch';
import WordSearch from './pages/games/WordSearch';
import EmojiEmotion from './pages/games/EmojiEmotion';
import EBookLibrary from './pages/student/EBookLibrary';
import EBookReader from './pages/student/EBookReader';
import LowVisionDashboard from './pages/LowVisionDashboard';
import LowVisionGames from './pages/games/LowVisionGames';
import LabPage from './pages/labs/LabPage';
import DiyaGuru from './components/DiyaGuru';

function GlobalDiya() {
  const { studentUser, currentUser } = useAuth();
  // Show DiyaGuru if either a student or a teacher is logged in
  return (studentUser || currentUser) ? <DiyaGuru /> : null;
}

function ConditionalGlobalAssistant() {
  const { studentUser, currentUser } = useAuth();
  const location = useLocation();
  // Show GlobalAssistant if a student/teacher is logged in OR we are on the login page
  const shouldShow = studentUser || currentUser || location.pathname === '/login';
  return shouldShow ? <GlobalAssistant /> : null;
}

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: { fontFamily: '"Roboto", "OpenDyslexic", sans-serif' },
});

/**
 * AdminRoute — lets through any Firebase-Auth user (teacher/parent).
 * If the session is a child PIN session, redirect back to student dashboard.
 * If no user at all, redirect to login.
 */
function AdminRoute({ children }) {
  const { currentUser, loading, studentUser } = useAuth();
  const hasLocalStudent = !!localStorage.getItem('studentUser');

  if (loading) return null;

  // No teacher logged in? Redirect to login
  if (!currentUser) return <Navigate to="/login" />;

  // A student logged in? They can't see admin pages
  // 🚀 FIX: Only block if NO teacher is present.
  if ((studentUser || hasLocalStudent) && !currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function DashboardRoute({ children }) {
  const { currentUser, studentUser, loading } = useAuth();
  const hasLocalStudent = !!localStorage.getItem('studentUser');

  if (loading) return null;

  // ⚡ PRIORITY: If a Teacher hits a student route, send them to their console.
  if (currentUser && !studentUser) {
    return <Navigate to="/teacher-dashboard" replace />;
  }

  // No student session or teacher? Redirect to login.
  if (!studentUser && !hasLocalStudent && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AccessibilityProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <ProfileProvider>
            <ProgressProvider>
              <LearningAssistantProvider>
                <Router>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Teacher/Parent Routes */}
                    <Route
                      path="/teacher-dashboard"
                      element={
                        <AdminRoute>
                          <TeacherDashboard />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/student/:id"
                      element={
                        <AdminRoute>
                          <StudentDetail />
                        </AdminRoute>
                      }
                    />

                    {/* Student Routes - No Setup Needed for Child */}
                    <Route
                      path="/dashboard"
                      element={
                        <DashboardRoute>
                          <StudentDashboard />
                        </DashboardRoute>
                      }
                    />
                    <Route
                      path="/test-services"
                      element={
                        <AdminRoute>
                          <TestServices />
                        </AdminRoute>
                      }
                    />
                    <Route path="/test-backend" element={<TestBackend />} />
                    <Route path="/adhd-demo" element={<ADHDDashboardDemo />} />
                    <Route path="/low-vision" element={
                      <DashboardRoute>
                        <LowVisionDashboard />
                      </DashboardRoute>
                    } />
                    <Route path="/" element={<Landing />} />
                    <Route path="/lessons" element={
                      <DashboardRoute><ContentViewer /></DashboardRoute>
                    } />
                    <Route path="/subjects" element={
                      <DashboardRoute><SubjectsScreen /></DashboardRoute>
                    } />
                    <Route path="/chapters/:subjectId" element={
                      <DashboardRoute><ChaptersScreen /></DashboardRoute>
                    } />
                    <Route path="/lesson/:lessonId" element={
                      <DashboardRoute><LessonPlayer /></DashboardRoute>
                    } />
                    <Route path="/game/word-jump" element={
                      <DashboardRoute><WordJump /></DashboardRoute>
                    } />
                    <Route path="/game/focus-flash" element={
                      <DashboardRoute><FocusFlash /></DashboardRoute>
                    } />
                    <Route path="/game/phonetic-pop" element={
                      <DashboardRoute><PhoneticPop /></DashboardRoute>
                    } />
                    <Route path="/game/sign-match" element={
                      <DashboardRoute><SignMatch /></DashboardRoute>
                    } />
                    <Route path="/games" element={
                      <DashboardRoute><GamesScreen /></DashboardRoute>
                    } />
                    <Route path="/low-vision-games" element={
                      <DashboardRoute><LowVisionGames /></DashboardRoute>
                    } />
                    <Route path="/game/math-race" element={
                      <DashboardRoute><MathRace /></DashboardRoute>
                    } />
                    <Route path="/game/memory-match" element={
                      <DashboardRoute><MemoryMatch /></DashboardRoute>
                    } />
                    <Route path="/game/word-search" element={
                      <DashboardRoute><WordSearch /></DashboardRoute>
                    } />
                    <Route path="/game/emoji-emotion" element={
                      <DashboardRoute><EmojiEmotion /></DashboardRoute>
                    } />
                    <Route path="/library" element={
                      <DashboardRoute><EBookLibrary /></DashboardRoute>
                    } />
                    <Route path="/reader/:bookId" element={
                      <DashboardRoute><EBookReader /></DashboardRoute>
                    } />
                    <Route path="/labs/:labId" element={
                      <DashboardRoute><LabPage /></DashboardRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                  <ConditionalGlobalAssistant />
                  <GlobalDiya />
                  <ArrowKeyToLogin />
                </Router>
              </LearningAssistantProvider>
            </ProgressProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}

function ArrowKeyToLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Don't trigger if already on login page
        if (location.pathname === '/login') return;
        
        // Don't trigger if user is typing in an input or textarea
        const active = document.activeElement;
        if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable) {
          return;
        }
        
        console.log('[GlobalNav] Arrow key detected, navigating to login...');
        navigate('/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname]);

  return null;
}

export default App;
