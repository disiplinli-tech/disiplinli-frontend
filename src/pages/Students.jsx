import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  Users, Eye, Calendar, MessageCircle, Search,
  ChevronRight, SortAsc, AlertTriangle
} from "lucide-react";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("risk"); // Varsayılan: Risk sırasına göre

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

      {/* Öğrenci Kartları - 3 Katmanlı Yapı */}
      {filteredStudents.length > 0 ? (
        <div className="space-y-3">
          {filteredStudents.map((student, i) => {
            const riskLevel = student.risk_level || 'warning';
            const momentum = student.momentum || {};
            const disciplineScore = student.discipline_score?.total || 0;
            const activityStatus = student.activity_status;
            const daysInactive = activityStatus?.days_inactive;

            // Risk rengine göre border
            const riskColors = {
              risk: 'border-l-4 border-l-red-500 bg-red-50/30',
              warning: 'border-l-4 border-l-yellow-500 bg-yellow-50/30',
              safe: 'border-l-4 border-l-green-500 bg-white'
            };

            return (
              <div
                key={student.id || i}
                className={`rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer ${riskColors[riskLevel] || ''}`}
                onClick={() => navigate(`/student/${student.id}`)}
              >
                {/* 3 KATMANLI KART YAPISI */}
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      riskLevel === 'risk' ? 'bg-red-500' :
                      riskLevel === 'warning' ? 'bg-yellow-500' :
                      'bg-indigo-500'
                    }`}>
                      {student.name?.charAt(0).toUpperCase() || 'Ö'}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getActivityColor(activityStatus)}`} />
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    {/* Üst: İsim + Alan */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.field_type_display || student.exam_goal_type || 'SAY'}</p>
                      </div>
                    </div>

                    {/* KATMAN 1: DURUM - En büyük */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Momentum */}
                      <div className="flex items-center gap-1.5">
                        {momentum.direction === 'up' ? (
                          <span className="text-green-600 font-bold text-base">
                            ↗ +{momentum.change}
                          </span>
                        ) : momentum.direction === 'down' ? (
                          <span className="text-red-600 font-bold text-base">
                            ↘ {momentum.change}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">● Veri yok</span>
                        )}
                        {momentum.direction && momentum.direction !== 'none' && (
                          <span className="text-xs text-gray-400">net</span>
                        )}
                      </div>

                      {/* Risk Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        riskLevel === 'risk' ? 'bg-red-100 text-red-700' :
                        riskLevel === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {riskLevel === 'risk' ? '🔴 Kritik' :
                         riskLevel === 'warning' ? '🟡 Dalgalı' :
                         '🟢 Güvende'}
                      </span>
                    </div>

                    {/* KATMAN 2: DAVRANIŞ - Disiplin + Son Temas */}
                    <div className="flex items-center gap-4 mb-2">
                      {/* Disiplin */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">💪 Disiplin:</span>
                        <span className={`text-sm font-bold ${
                          disciplineScore >= 65 ? 'text-green-600' :
                          disciplineScore >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{disciplineScore}/100</span>
                        {/* Mini progress bar */}
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              disciplineScore >= 65 ? 'bg-green-500' :
                              disciplineScore >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${disciplineScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Son Temas */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">🔵 Son temas:</span>
                        <span className={`text-xs font-medium ${
                          daysInactive === 0 ? 'text-green-600' :
                          daysInactive === 1 ? 'text-yellow-600' :
                          daysInactive > 1 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {daysInactive === 0 ? 'Bugün' :
                           daysInactive === 1 ? 'Dün' :
                           daysInactive ? `${daysInactive} gün` : '-'}
                        </span>
                      </div>
                    </div>

                    {/* KATMAN 3: KİMLİK / BAĞLAM - En küçük */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {/* TYT Sıralama */}
                      {student.tyt_ranking && (
                        <span>~ TYT {formatRanking(student.tyt_ranking)}</span>
                      )}
                      {/* Hedef */}
                      {student.target_ranking && (
                        <span className="text-indigo-500">| Hedef: {formatRanking(student.target_ranking)}</span>
                      )}
                    </div>
                  </div>

                  {/* Sağ: İşlem butonları + Chevron */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}`); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Detay"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}/schedule`); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Program"
                      >
                        <Calendar size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/chat', { state: { userId: student.user_id, userName: student.name } }); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Mesaj"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 sm:hidden" />
                  </div>
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
