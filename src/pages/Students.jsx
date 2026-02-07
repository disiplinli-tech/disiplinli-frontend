import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  Users, Eye, Calendar, MessageCircle, Search,
  ChevronRight, SortAsc, AlertTriangle, Zap
} from "lucide-react";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("risk"); // Varsayılan: Risk sırasına göre
  const [sendingReminder, setSendingReminder] = useState(null); // Hatırlat butonu için

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/dashboard/");
      setStudents(res.data.students || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Risk sıralama fonksiyonu
  const getRiskOrder = (riskLevel) => {
    const order = { risk: 0, warning: 1, safe: 2 };
    return order[riskLevel] || 2;
  };

  const filteredStudents = students
    .filter(s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "risk") return getRiskOrder(a.risk_level) - getRiskOrder(b.risk_level);
      if (sortBy === "discipline") return (b.discipline_score?.total || 0) - (a.discipline_score?.total || 0);
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

  // İstatistikler
  const criticalCount = students.filter(s => s.risk_level === 'risk').length;
  const warningCount = students.filter(s => s.risk_level === 'warning').length;
  const safeCount = students.filter(s => s.risk_level === 'safe').length;

  // Aktivite durumuna göre renk
  const getActivityColor = (status) => {
    switch (status?.status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Hatırlat butonu - tek tıkla preset mesaj gönder
  const sendReminder = async (student) => {
    setSendingReminder(student.id);
    try {
      const messageText = `Merhaba ${student.name?.split(' ')[0] || ''}, bugün çalışma durumunu merak ettim. Her şey yolunda mı? 📚`;

      // Debug: user_id kontrolü
      if (!student.user_id) {
        console.error('user_id bulunamadı:', student);
        alert('Öğrenci bilgisi eksik (user_id yok)');
        return;
      }

      await API.post('/api/chat/send/', {
        receiver_id: student.user_id,
        message: messageText
      });
      alert(`✅ ${student.name}'e hatırlatma gönderildi!`);
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err.response?.data || err);
      alert(`Mesaj gönderilemedi: ${err.response?.data?.error || 'Bilinmeyen hata'}`);
    } finally {
      setSendingReminder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Öğrenciler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Öğrencilerim</h2>
          <p className="text-gray-500 text-sm mt-1">Toplam {students.length} öğrenci</p>
        </div>

        {/* Risk İstatistikleri */}
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded-xl flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <div>
                <div className="text-xs opacity-80">Kritik</div>
                <div className="font-bold">{criticalCount}</div>
              </div>
            </div>
          )}
          {warningCount > 0 && (
            <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-xl flex items-center gap-2">
              <span className="text-lg">🟡</span>
              <div>
                <div className="text-xs opacity-80">Dalgalı</div>
                <div className="font-bold">{warningCount}</div>
              </div>
            </div>
          )}
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded-xl flex items-center gap-2">
            <span className="text-lg">🟢</span>
            <div>
              <div className="text-xs opacity-80">Güvende</div>
              <div className="font-bold">{safeCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Öğrenci ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="risk">Risk Durumuna Göre</option>
            <option value="discipline">Disipline Göre</option>
            <option value="name">İsme Göre</option>
          </select>
          <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Öğrenci Kartları - ChatGPT Önerisi ile Yeni Format */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student, i) => {
            const riskLevel = student.risk_level || 'warning';
            const momentum = student.momentum || {};
            const disciplineScore = student.discipline_score?.total || 0;
            const activityStatus = student.activity_status;
            const daysInactive = activityStatus?.days_inactive;

            // Risk renkleri
            const riskStyles = {
              risk: {
                border: 'border-red-300',
                badge: 'bg-red-500 text-white',
                badgeText: '🔴 Kritik'
              },
              warning: {
                border: 'border-yellow-300',
                badge: 'bg-yellow-500 text-white',
                badgeText: '🟡 Dalgalı'
              },
              safe: {
                border: 'border-green-300',
                badge: 'bg-green-500 text-white',
                badgeText: '🟢 Güvende'
              }
            };
            const style = riskStyles[riskLevel] || riskStyles.warning;

            return (
              <div
                key={student.id || i}
                onClick={() => navigate(`/student/${student.id}`)}
                className={`bg-white rounded-2xl border-2 ${style.border} p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
              >
                {/* ÜST SATIR: İsim + Alan + Risk Badge + Son Temas */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {student.name?.charAt(0).toUpperCase() || 'Ö'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{student.name}</h3>
                      <p className="text-xs text-gray-400">{student.field_type_display || student.exam_goal_type || 'Sayısal'}</p>
                    </div>
                  </div>

                  {/* Risk Badge - Büyük ve Belirgin */}
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${style.badge}`}>
                    {style.badgeText}
                  </span>
                </div>

                {/* Son Temas - Üst satırın devamı */}
                <div className="flex items-center justify-end mb-3 -mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    daysInactive === 0 ? 'bg-green-100 text-green-700' :
                    daysInactive === 1 ? 'bg-yellow-100 text-yellow-700' :
                    daysInactive > 1 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {daysInactive === 0 ? '📍 Bugün' :
                     daysInactive === 1 ? '📍 Dün' :
                     daysInactive ? `📍 ${daysInactive}g önce` : '📍 -'}
                  </span>
                </div>

                {/* ORTA ALAN: Sadece 3 şey - Momentum, Disiplin, Sıralama */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-3 mb-4">
                  {/* 1. Momentum */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Momentum</span>
                    {momentum.direction === 'up' ? (
                      <span className="text-green-600 font-bold text-sm">↑ +{momentum.change} net</span>
                    ) : momentum.direction === 'down' ? (
                      <span className="text-red-600 font-bold text-sm">↓ {momentum.change} net</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Veri yok</span>
                    )}
                  </div>

                  {/* 2. Disiplin - Bar + Sayı */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Disiplin</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            disciplineScore >= 65 ? 'bg-green-500' :
                            disciplineScore >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${disciplineScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold min-w-[40px] text-right ${
                        disciplineScore >= 65 ? 'text-green-600' :
                        disciplineScore >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>{disciplineScore}</span>
                    </div>
                  </div>

                  {/* 3. Sıralama - Tek satır */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">Sıralama</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {student.tyt_ranking ? `TYT ${formatRanking(student.tyt_ranking)}` :
                       student.ayt_ranking ? `AYT ${formatRanking(student.ayt_ranking)}` : '-'}
                    </span>
                  </div>
                </div>

                {/* ALT SATIR: Aksiyon Butonları */}
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/student/${student.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                  >
                    <Eye size={15} />
                    Detay
                  </button>
                  <button
                    onClick={() => navigate(`/student/${student.id}/schedule`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm"
                  >
                    <Calendar size={15} />
                    Program
                  </button>
                  <button
                    onClick={() => navigate('/chat', { state: { userId: student.user_id, userName: student.name } })}
                    className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    title="Mesaj"
                  >
                    <MessageCircle size={15} />
                  </button>
                  <button
                    onClick={() => sendReminder(student)}
                    disabled={sendingReminder === student.id}
                    className={`p-2 rounded-lg transition-colors ${
                      sendingReminder === student.id
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }`}
                    title="Hatırlat"
                  >
                    <Zap size={15} className={sendingReminder === student.id ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Öğrenci Bulunamadı</h3>
          <p className="text-gray-500 mb-4">
            {search ? `"${search}" aramasına uygun öğrenci yok` : 'Henüz öğrenciniz bulunmuyor'}
          </p>
          {!search && (
            <p className="text-sm text-gray-400">
              Davet kodunuzu öğrencilerinizle paylaşarak başlayabilirsiniz
            </p>
          )}
        </div>
      )}
    </div>
  );
}
