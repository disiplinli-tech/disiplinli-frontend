import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, MessageCircle, ClipboardList,
  Settings as SettingsIcon, LogOut, TrendingUp, BookOpen, ChevronLeft, ChevronRight, Menu, Video, Calculator, Target
} from 'lucide-react';

// Auth Sayfaları
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import KullaniciSozlesmesi from './pages/KullaniciSozlesmesi';

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
import TopicTracker from './pages/TopicTracker';
import API from './api';

// Alan Tipleri
const goalTypeLabels = {
  'SAY': { label: 'Sayısal', emoji: '🔢' },
  'EA': { label: 'Eşit Ağırlık', emoji: '⚖️' },
  'SOZ': { label: 'Sözel', emoji: '📖' },
  'DIL': { label: 'Yabancı Dil', emoji: '🌍' },
};

// ==================== SIDEBAR ====================
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'student';
  const userName = localStorage.getItem('user') || 'Kullanıcı';

  // Öğrenci için alan bilgisi
  const [studentField, setStudentField] = useState(localStorage.getItem('exam_goal_type') || 'SAY');
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [savingField, setSavingField] = useState(false);

  // Öğrenci alanını yükle
  useEffect(() => {
    if (role === 'student') {
      const loadStudentField = async () => {
        try {
          const res = await API.get('/api/dashboard/');
          if (res.data?.exam_goal_type) {
            setStudentField(res.data.exam_goal_type);
            localStorage.setItem('exam_goal_type', res.data.exam_goal_type);
          }
        } catch (err) {
          // Hata olsa da devam et
        }
      };
      loadStudentField();
    }
  }, [role]);

  // Alan değiştir
  const handleFieldChange = async (newField) => {
    setSavingField(true);
    try {
      await API.post('/api/student/profile/update/', { exam_goal_type: newField });
      setStudentField(newField);
      localStorage.setItem('exam_goal_type', newField);
      setShowFieldMenu(false);
      // Sayfayı yenile
      window.location.reload();
    } catch (err) {
    } finally {
      setSavingField(false);
    }
  };

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
    { icon: LayoutDashboard, label: 'Koç Paneli', path: '/dashboard' },
    { icon: Users, label: 'Öğrenciler', path: '/students' },
    { icon: Video, label: 'Online Dersler', path: '/lessons' },
    { icon: MessageCircle, label: 'Mesajlar', path: '/chat' },
    { icon: ClipboardList, label: 'Ödevler', path: '/assignments' },
    { icon: Calendar, label: 'Takvim', path: '/schedule' },
    { icon: SettingsIcon, label: 'Ayarlar', path: '/settings' },
  ];

  // Öğrenci menüsü
  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Genel Bakış', path: '/dashboard' },
    { icon: TrendingUp, label: 'Deneme Sonuçları', path: '/exams' },
    { icon: Target, label: 'Konu Takibi', path: '/topics' },
    { icon: Video, label: 'Online Dersler', path: '/lessons' },
    { icon: MessageCircle, label: 'Mesajlar', path: '/chat' },
    { icon: ClipboardList, label: 'Ödevler', path: '/assignments' },
    { icon: Calendar, label: 'Programım', path: '/schedule' },
    { icon: Calculator, label: 'Sıralama Hesapla', path: '/ranking-calculator' },
    { icon: SettingsIcon, label: 'Ayarlar', path: '/settings' },
  ];

  // Veli menüsü (sadece dashboard ve ayarlar)
  const parentMenuItems = [
    { icon: LayoutDashboard, label: 'Veli Paneli', path: '/dashboard' },
    { icon: SettingsIcon, label: 'Ayarlar', path: '/settings' },
  ];

  const menuItems = role === 'coach' ? coachMenuItems : 
                    role === 'parent' ? parentMenuItems : 
                    studentMenuItems;

  const getRoleBadge = () => {
    switch (role) {
      case 'coach': return { gradient: 'from-amber-500 to-orange-500', emoji: '🎓', label: 'Koç' };
      case 'parent': return { gradient: 'from-emerald-500 to-teal-500', emoji: '👨‍👩‍👧', label: 'Veli' };
      default: return { gradient: 'from-indigo-500 to-purple-500', emoji: '📚', label: 'Öğrenci' };
    }
  };

  const badge = getRoleBadge();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`p-4 border-b border-gray-100 ${collapsed ? 'px-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="text-white" size={20} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-gray-800">KoçumNet</h1>
              <p className="text-xs text-gray-400">YKS Koçluk</p>
            </div>
          )}
        </div>
      </div>

      {/* User Badge */}
      <div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
        <div className={`bg-gradient-to-r ${badge.gradient} rounded-xl p-3 text-white ${collapsed ? 'p-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{userName}</p>
                <p className="text-xs opacity-80">{badge.emoji} {badge.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alan Seçimi - Sadece Öğrenciler İçin */}
      {role === 'student' && (
        <div className={`px-4 pb-3 ${collapsed ? 'px-2' : ''}`}>
          <div className="relative">
            <button
              onClick={() => setShowFieldMenu(!showFieldMenu)}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-2.5 text-white hover:from-green-600 hover:to-emerald-700 transition-all ${collapsed ? 'p-2' : ''}`}
            >
              <div className="flex items-center justify-center gap-2">
                {collapsed ? (
                  <span className="text-lg">{goalTypeLabels[studentField]?.emoji || '🔢'}</span>
                ) : (
                  <>
                    <span className="text-base">{goalTypeLabels[studentField]?.emoji || '🔢'}</span>
                    <span className="font-medium text-sm">{goalTypeLabels[studentField]?.label || 'Sayısal'}</span>
                    <svg className={`w-4 h-4 transition-transform ${showFieldMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </div>
            </button>

            {/* Alan Seçim Menüsü */}
            {showFieldMenu && !collapsed && (
              <>
                {/* Backdrop - dışarı tıklayınca kapat */}
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setShowFieldMenu(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-[101]">
                  {Object.entries(goalTypeLabels).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFieldChange(key);
                      }}
                      disabled={savingField}
                      className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors ${studentField === key ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                    >
                      <span>{info.emoji}</span>
                      <span className="text-sm font-medium">{info.label}</span>
                      {studentField === key && (
                        <svg className="w-4 h-4 ml-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'}
                ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-500' : 'text-gray-400'} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
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
        
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full 
            flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
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
  const userName = localStorage.getItem('user') || 'Kullanıcı';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 w-full">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={16} />
            </div>
            <span className="font-bold text-gray-800">KoçumNet</span>
          </div>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
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
  
  // Koç ve Öğrenci için normal Dashboard
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
        <Route path="/kullanici-sozlesmesi" element={<KullaniciSozlesmesi />} />

        {/* ===== ANA SAYFA ===== */}
        <Route path="/" element={
          localStorage.getItem('token') 
            ? <Navigate to="/dashboard" replace /> 
            : <Navigate to="/login" replace />
        } />
        
        {/* ===== PROTECTED ROUTES ===== */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/student/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><OnlineLessons /></ProtectedRoute>} />
        <Route path="/ranking-calculator" element={<ProtectedRoute><RankingCalculator /></ProtectedRoute>} />
        <Route path="/topics" element={<ProtectedRoute><TopicTracker /></ProtectedRoute>} />

        {/* ===== 404 ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;