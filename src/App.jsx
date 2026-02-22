import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, MessageCircle, ClipboardList,
  Settings as SettingsIcon, LogOut, TrendingUp, BookOpen, PanelLeftClose, PanelLeft, Menu, Video, Calculator, Target, Compass, FileText, HelpCircle
} from 'lucide-react';

// Auth Sayfaları
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import KullaniciSozlesmesi from './pages/KullaniciSozlesmesi';
import MesafeliSatisSozlesmesi from './pages/MesafeliSatisSozlesmesi';
import OnBilgilendirme from './pages/OnBilgilendirme';
import IptalIade from './pages/IptalIade';
import KVKK from './pages/KVKK';
import CerezPolitikasi from './pages/CerezPolitikasi';

// Landing Page
import LandingPage from './pages/LandingPage';
import Checkout from './pages/Checkout';

// Components
import CookieBanner from './components/CookieBanner';

// Ana Sayfalar
import Dashboard from './pages/Dashboard';
import ParentDashboard from './pages/Parentdashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Schedule from './pages/Schedule';
import Exams from './pages/Exams';
import Assignments from './pages/Assignments';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import OnlineLessons from './pages/OnlineLessons';
import RankingCalculator from './pages/RankingCalculator';
import Today from './pages/Today';
import CoachExams from './pages/CoachExams';
import FocusAreas from './pages/FocusAreas';
import QuestionWheel from './pages/QuestionWheel';
// Öğrenci Davranış Paneli
import StudentToday from './pages/StudentToday';
import StudentProgress from './pages/StudentProgress';
import StudentGoal from './pages/StudentGoal';
import StudentCoach from './pages/StudentCoach';
// Takıldıklarım
import StuckQuestions from './pages/StuckQuestions';
import StuckQuestionNew from './pages/StuckQuestionNew';
import StuckQuestionDetail from './pages/StuckQuestionDetail';

import API from './api';

// ==================== SIDEBAR ====================
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'student';
  const userName = localStorage.getItem('user') || 'Kullanıcı';
  const fullName = localStorage.getItem('full_name') || userName;
  const gradeLevel = localStorage.getItem('grade_level') || '';

  const selectedGoal = localStorage.getItem('selected_goal') || '';
  const examGoalType = localStorage.getItem('exam_goal_type') || '';

  // Dashboard'dan güncel bilgileri çek
  useEffect(() => {
    if (role === 'student') {
      const loadStudentInfo = async () => {
        try {
          const res = await API.get('/api/dashboard/');
          if (res.data?.full_name) localStorage.setItem('full_name', res.data.full_name);
          if (res.data?.grade_level) localStorage.setItem('grade_level', res.data.grade_level);
          if (res.data?.exam_goal_type) localStorage.setItem('exam_goal_type', res.data.exam_goal_type);
          if (res.data?.selected_goal) localStorage.setItem('selected_goal', res.data.selected_goal);
        } catch (err) {
          // Hata olsa da devam et
        }
      };
      loadStudentInfo();
    }
  }, [role]);

  const handleLogout = async () => {
    try {
      await API.post('/api/logout/');
    } catch (err) {
      // Logout API hatası olsa bile localStorage temizlenmeli
    }
    localStorage.clear();
    navigate('/login');
  };

  // Koç menüsü
  const coachMenuItems = [
    { icon: LayoutDashboard, label: 'Genel Bakış', path: '/dashboard' },
    { icon: Compass, label: 'Bugün', path: '/coach-today' },
    { icon: Users, label: 'Öğrenciler', path: '/students' },
    { icon: MessageCircle, label: 'Mesajlar', path: '/chat' },
    { icon: Calendar, label: 'Takvim', path: '/schedule' },
    { icon: FileText, label: 'Denemeler', path: '/coach-exams' },
    { icon: Video, label: 'Canlı Dersler', path: '/lessons' },
    { icon: ClipboardList, label: 'Ödevler', path: '/assignments' },
    { icon: SettingsIcon, label: 'Ayarlar', path: '/settings' },
  ];

  // Öğrenci menüsü
  const studentMenuItems = [
    { icon: Compass, label: 'Çalışmalarım', path: '/today' },
    { icon: TrendingUp, label: 'İlerlemem', path: '/progress' },
    { icon: Target, label: 'Hedefim', path: '/goal' },
    { icon: BookOpen, label: 'Denemeler', path: '/exams' },
    { icon: HelpCircle, label: 'Takıldıklarım', path: '/stuck' },
    { icon: Calendar, label: 'Takvim', path: '/schedule' },
    { icon: MessageCircle, label: 'Koçum', path: '/coach' },
    { icon: SettingsIcon, label: 'Ayarlar', path: '/settings' },
  ];

  // Veli menüsü
  const parentMenuItems = [
    { icon: LayoutDashboard, label: 'Veli Paneli', path: '/dashboard' },
    { icon: SettingsIcon, label: 'Ayarlar', path: '/settings' },
  ];

  const menuItems = role === 'coach' ? coachMenuItems : 
                    role === 'parent' ? parentMenuItems : 
                    studentMenuItems;

  // Kategori etiketi oluştur (Ortaokul • 5. Sınıf, YKS • Sayısal, LGS, vb.)
  const getCategoryLabel = () => {
    const goalLabelsMap = { ortaokul: 'Ortaokul', lise: 'Lise', lgs: 'LGS', yks: 'YKS' };
    const gradeLabelsMap = { '5': '5. Sınıf', '6': '6. Sınıf', '7': '7. Sınıf', '9': '9. Sınıf', '10': '10. Sınıf', '11': '11. Sınıf' };
    const fieldLabelsMap = { 'SAY': 'Sayısal', 'EA': 'Eşit Ağırlık', 'SOZ': 'Sözel', 'DIL': 'Yabancı Dil' };

    const goal = selectedGoal;
    const goalLabel = goalLabelsMap[goal] || '';

    if (goal === 'ortaokul' || goal === 'lise') {
      const gradeLabel = gradeLabelsMap[gradeLevel] || '';
      return gradeLabel ? `${goalLabel} • ${gradeLabel}` : goalLabel;
    } else if (goal === 'yks') {
      const fieldLabel = fieldLabelsMap[examGoalType] || '';
      return fieldLabel ? `YKS • ${fieldLabel}` : 'YKS';
    } else if (goal === 'lgs') {
      return 'LGS';
    }

    // Fallback: eski kayıtlar için grade_level'dan tahmin et
    if (gradeLevel) {
      const fallback = { '5': 'Ortaokul • 5. Sınıf', '6': 'Ortaokul • 6. Sınıf', '7': 'Ortaokul • 7. Sınıf',
        '9': 'Lise • 9. Sınıf', '10': 'Lise • 10. Sınıf', '11': 'Lise • 11. Sınıf', 'LGS': 'LGS', 'YKS': 'YKS' };
      return fallback[gradeLevel] || '';
    }
    return '';
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'coach': return { gradient: 'from-orange-500 to-amber-500', emoji: '🎓', label: 'Koç' };
      case 'parent': return { gradient: 'from-orange-500 to-amber-500', emoji: '👨‍👩‍👧', label: 'Veli' };
      default: return { gradient: 'from-orange-500 to-amber-500', emoji: '📚', label: getCategoryLabel() || 'Öğrenci' };
    }
  };

  const badge = getRoleBadge();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`p-4 border-b border-gray-100 ${collapsed ? 'px-2' : ''}`}>
        <div className="flex items-center justify-center">
          {collapsed ? (
            <span className="text-lg font-bold text-orange-500">d</span>
          ) : (
            <h1 className="font-bold text-lg text-gray-800">disiplinli<span className="text-orange-500">.com</span></h1>
          )}
        </div>
      </div>

      {/* User Badge */}
      <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
        <div className={`bg-gradient-to-r ${badge.gradient} rounded-xl p-3 text-white ${collapsed ? 'p-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              {fullName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{fullName}</p>
                <p className="text-xs opacity-80">{badge.emoji} {badge.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                ${isActive
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'}
                ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon size={20} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle + Logout */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors
            ${collapsed ? 'justify-center px-2' : ''}`}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          {!collapsed && <span className="text-sm">Menüyü Küçült</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors
            ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Çıkış Yap</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0
        ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

// ==================== LAYOUT ====================
function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef(null);
  const userName = localStorage.getItem('user') || 'Kullanıcı';

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const currentY = el.scrollTop;
    const delta = currentY - lastScrollY.current;

    // En üstteyse her zaman göster
    if (currentY < 10) {
      setHeaderVisible(true);
    }
    // Aşağı 15px+ kaydırırsa gizle
    else if (delta > 15) {
      setHeaderVisible(false);
    }
    // Yukarı 5px+ çekerse göster (düşük eşik = anında tepki)
    else if (delta < -5) {
      setHeaderVisible(true);
    }

    lastScrollY.current = currentY;
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header — aşağı kaydırınca gizlenir, yukarı çekince gelir */}
        <header className={`md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-40 w-full
          transition-transform duration-300 absolute top-0 left-0 right-0
          ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <span className="font-bold text-gray-800">disiplinli<span className="text-orange-500">.com</span></span>
          </div>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page Content — mobilde header yüksekliği kadar üstten padding */}
        <main ref={mainRef} onScroll={handleScroll} className="flex-1 overflow-y-auto pt-[49px] md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  
  if (!token || !user || !role) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

// ==================== PUBLIC ROUTE ====================
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// ==================== DASHBOARD ROUTER ====================
function DashboardRouter() {
  const role = localStorage.getItem('role');

  // Veli için ParentDashboard göster
  if (role === 'parent') {
    return <ParentDashboard />;
  }

  // Öğrenci için /today'e yönlendir
  if (role === 'student') {
    return <Navigate to="/today" replace />;
  }

  // Koç için normal Dashboard
  return <Dashboard />;
}

// ==================== APP ====================
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedRole && storedToken) {
      setUser({ name: storedUser, role: storedRole });
    }
  }, []);

  return (
    <BrowserRouter>
      <CookieBanner />
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={
          <PublicRoute>
            <Login setUser={setUser} />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/kullanici-sozlesmesi" element={<KullaniciSozlesmesi />} />
        <Route path="/mesafeli-satis-sozlesmesi" element={<MesafeliSatisSozlesmesi />} />
        <Route path="/on-bilgilendirme" element={<OnBilgilendirme />} />
        <Route path="/iptal-iade" element={<IptalIade />} />
        <Route path="/kvkk" element={<KVKK />} />
        <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* ===== ANA SAYFA - LANDING PAGE ===== */}
        <Route path="/" element={
          localStorage.getItem('token')
            ? <Navigate to="/dashboard" replace />
            : <LandingPage />
        } />
        
        {/* ===== PROTECTED ROUTES ===== */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/today" element={<ProtectedRoute><StudentToday /></ProtectedRoute>} />
        <Route path="/plan" element={<Navigate to="/today" replace />} />
        <Route path="/progress" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
        <Route path="/goal" element={<ProtectedRoute><StudentGoal /></ProtectedRoute>} />
        <Route path="/coach" element={<ProtectedRoute><StudentCoach /></ProtectedRoute>} />
        <Route path="/coach-today" element={<ProtectedRoute><Today /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/student/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
        <Route path="/coach-exams" element={<ProtectedRoute><CoachExams /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><OnlineLessons /></ProtectedRoute>} />
        <Route path="/ranking-calculator" element={<ProtectedRoute><RankingCalculator /></ProtectedRoute>} />
        <Route path="/topics" element={<Navigate to="/progress" replace />} />
        <Route path="/focus-areas" element={<ProtectedRoute><FocusAreas /></ProtectedRoute>} />
        <Route path="/question-wheel" element={<ProtectedRoute><QuestionWheel /></ProtectedRoute>} />
        <Route path="/stuck" element={<ProtectedRoute><StuckQuestions /></ProtectedRoute>} />
        <Route path="/stuck/new" element={<ProtectedRoute><StuckQuestionNew /></ProtectedRoute>} />
        <Route path="/stuck/:id" element={<ProtectedRoute><StuckQuestionDetail /></ProtectedRoute>} />

        {/* ===== 404 ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;