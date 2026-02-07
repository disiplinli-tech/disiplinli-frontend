import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, LogOut, GraduationCap,
  Users, Calendar, MessageCircle, ClipboardList,
  Settings, BarChart3, Menu, X, Compass, Video, FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import API from "../api";

export default function Layout({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingAssignments, setPendingAssignments] = useState(0);

  const role = user?.role || localStorage.getItem('role') || 'student';
  const userName = user?.name || localStorage.getItem('user') || 'Kullanıcı';

  // Okunmamış mesaj ve bekleyen ödev sayısını al
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await API.get('/api/dashboard/');
        if (res.data.unread_messages !== undefined) {
          setUnreadMessages(res.data.unread_messages);
        }
        if (res.data.pending_assignments !== undefined) {
          setPendingAssignments(res.data.pending_assignments);
        }
      } catch (err) {
        // Sessiz hata
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // 30 saniyede bir
    return () => clearInterval(interval);
  }, []);

  // Koç menüsü - ChatGPT önerisi ile yeniden yapılandırıldı
  const coachMenu = [
    // 1. BLOK - GÜNLÜK OPERASYON
    { icon: Compass, label: "Bugün", path: "/today", highlight: true },
    { icon: Users, label: "Öğrenciler", path: "/students" },
    { icon: MessageCircle, label: "Mesajlar", path: "/chat", badge: unreadMessages },
    { type: "divider" },
    // 2. BLOK - ZAMAN & EMEK
    { icon: Calendar, label: "Takvim", path: "/calendar" },
    { icon: Video, label: "Online Dersler", path: "/online-lessons" },
    { type: "divider" },
    // 3. BLOK - AKADEMİK AKIŞ
    { icon: ClipboardList, label: "Ödevler", path: "/assignments", badge: pendingAssignments },
    { icon: FileText, label: "Denemeler", path: "/coach-exams" },
    { type: "divider" },
    // 4. BLOK - PASİF / AYAR
    { icon: Settings, label: "Ayarlar", path: "/settings", muted: true },
  ];

  // Öğrenci menüsü
  const studentMenu = [
    { icon: LayoutDashboard, label: "Genel Bakış", path: "/" },
    { icon: BarChart3, label: "Deneme Sonuçları", path: "/exams" },
    { icon: MessageCircle, label: "Mesajlar", path: "/chat", badge: unreadMessages },
    { icon: ClipboardList, label: "Ödevler", path: "/assignments", badge: pendingAssignments },
    { icon: Calendar, label: "Programım", path: "/schedule" },
    { icon: Settings, label: "Ayarlar", path: "/settings" },
  ];

  const menuItems = role === 'coach' ? coachMenu : studentMenu;

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await API.post("/api/logout/");
        localStorage.clear();
        navigate("/login");
        window.location.reload();
      } catch (error) {
        console.error("Çıkış hatası", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* Mobil Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === SIDEBAR === */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 flex-shrink-0 bg-white border-r border-gray-200 
        flex flex-col shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl 
              flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-800">KoçumNet</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Rol Badge */}
        <div className="px-5 py-3">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-center
            ${role === 'coach'
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
            {role === 'coach' ? '🎓 Koç Paneli' : '📚 Öğrenci Paneli'}
          </div>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            // Divider (ayırıcı çizgi)
            if (item.type === 'divider') {
              return <div key={`divider-${index}`} className="my-2 border-t border-gray-100" />;
            }

            const isActive = location.pathname === item.path ||
              (item.path !== '/' && item.path !== '/today' && location.pathname.startsWith(item.path));

            // Highlight (Bugün menüsü için özel stil)
            if (item.highlight) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl
                    transition-all duration-200 group
                    ${isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200"
                      : "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 hover:from-orange-100 hover:to-amber-100 border border-orange-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={19} className={isActive ? "text-white" : "text-orange-500"} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl
                  transition-all duration-200 group
                  ${isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : item.muted
                      ? "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={19}
                    className={`transition-colors ${
                      isActive
                        ? "text-indigo-600"
                        : item.muted
                          ? "text-gray-300 group-hover:text-gray-500"
                          : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className={`text-sm ${item.muted ? 'font-normal' : 'font-medium'}`}>{item.label}</span>
                </div>

                {/* Badge (okunmamış mesaj vs.) */}
                {item.badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px]
                    font-bold rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Alt Kısım: Kullanıcı + Çıkış */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          {/* Kullanıcı bilgisi */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
              ${role === 'coach'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate">{userName}</p>
              <p className="text-[10px] text-gray-400">
                {role === 'coach' ? 'Koç' : 'Öğrenci'}
              </p>
            </div>
          </div>

          {/* Çıkış */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-500 hover:bg-red-50 
              rounded-xl transition-colors text-sm font-medium group"
          >
            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* === İÇERİK ALANI === */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">

        {/* Üst Header */}
        <header className="h-14 bg-white/95 backdrop-blur-md border-b border-gray-200 
          flex justify-between items-center px-4 md:px-6 sticky top-0 z-10 shadow-sm">

          {/* Sol: Hamburger (mobil) + Sayfa başlığı */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {getPageTitle(location.pathname, role)}
              </h1>
            </div>
          </div>

          {/* Sağ: Bildirimler + Profil */}
          <div className="flex items-center gap-3">
            {/* Mesaj ikonu */}
            <button
              onClick={() => navigate('/chat')}
              className="relative p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <MessageCircle size={20} />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white 
                  text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadMessages > 9 ? '!' : unreadMessages}
                </span>
              )}
            </button>

            {/* Ödev ikonu */}
            <button
              onClick={() => navigate('/assignments')}
              className="relative p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <ClipboardList size={20} />
              {pendingAssignments > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white 
                  text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingAssignments > 9 ? '!' : pendingAssignments}
                </span>
              )}
            </button>

            {/* Profil */}
            <div className="flex items-center gap-2 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-200">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold
                ${role === 'coach'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                }`}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * URL'ye göre sayfa başlığı döndürür
 */
function getPageTitle(pathname, role) {
  const titles = {
    '/': role === 'coach' ? 'Koç Paneli' : 'Öğrenci Paneli',
    '/today': 'Bugün',
    '/students': 'Öğrenciler',
    '/chat': 'Mesajlar',
    '/assignments': 'Ödevler',
    '/calendar': 'Takvim',
    '/schedule': 'Haftalık Program',
    '/exams': 'Deneme Sonuçları',
    '/coach-exams': 'Denemeler',
    '/online-lessons': 'Online Dersler',
    '/settings': 'Ayarlar',
  };

  // Dinamik route'lar
  if (pathname.startsWith('/student/') && pathname.endsWith('/schedule')) {
    return 'Öğrenci Programı';
  }
  if (pathname.startsWith('/student/')) {
    return 'Öğrenci Detay';
  }

  return titles[pathname] || 'KoçumNet';
}