import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  TrendingUp, Target, Award, Calendar, MessageCircle,
  ChevronRight, Trophy, Zap, BarChart3, CheckCircle, Users,
  Copy, Check, Eye, Bell, X, Edit2, Save, AlertTriangle, AlertCircle, Mail, Send
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ==================== KOÇ DASHBOARD ====================
function CoachDashboard({ user, stats }) {
  const [copied, setCopied] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const navigate = useNavigate();

  const copyInviteCode = () => {
    navigator.clipboard.writeText(stats?.invite_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const students = stats?.students || [];
  const sortedStudents = [...students].sort((a, b) => (b.last_tyt_net || 0) - (a.last_tyt_net || 0));
  const inactiveStudents = stats?.inactive_students || [];
  const criticalCount = stats?.critical_count || 0;
  const warningCount = stats?.warning_count || 0;

  // İnaktif öğrencilere toplu hatırlatma gönder
  const handleSendReminders = async () => {
    if (inactiveStudents.length === 0) return;

    setSendingReminder(true);
    try {
      const studentIds = inactiveStudents.map(s => s.id);
      await API.post('/api/send-reminder/', { student_ids: studentIds });
      setReminderSent(true);
      setTimeout(() => setReminderSent(false), 3000);
    } catch (err) {
      alert('Hatırlatma gönderilemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setSendingReminder(false);
    }
  };

  // Aktivite durumuna göre renk
  const getActivityColor = (status) => {
    switch (status?.status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Aktivite badge
  const ActivityBadge = ({ activity_status }) => {
    if (!activity_status) return null;
    const colors = {
      active: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      critical: 'bg-red-100 text-red-700',
      inactive: 'bg-gray-100 text-gray-600'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[activity_status.status] || colors.inactive}`}>
        {activity_status.label}
      </span>
    );
  };

  // Momentum Badge - Yeni mantık: Son deneme - Önceki deneme
  const MomentumBadge = ({ momentum }) => {
    if (!momentum || momentum.direction === 'none' || momentum.change === null) {
      return <span className="text-xs px-2 py-1 rounded-full text-gray-500 bg-gray-100">Veri yok</span>;
    }
    const configs = {
      up: { icon: '↑', color: 'text-green-600 bg-green-50' },
      down: { icon: '↓', color: 'text-red-600 bg-red-50' },
      stable: { icon: '→', color: 'text-gray-600 bg-gray-100' }
    };
    const config = configs[momentum.direction] || configs.stable;
    const displayChange = momentum.change > 0 ? `+${momentum.change}` : momentum.change;
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}>
        {config.icon} {displayChange}
      </span>
    );
  };

  // Disiplin Skoru Badge - Yeni eşikler: 65+ yeşil, 40-65 sarı, 0-40 kırmızı
  const DisciplineBadge = ({ score }) => {
    if (score === undefined || score === null) return <span className="text-gray-400">-</span>;
    const total = score.total || 0;
    let color = 'text-red-600 bg-red-50';  // 0-40 kritik
    if (total >= 65) color = 'text-green-600 bg-green-50';  // 65+ güçlü
    else if (total >= 40) color = 'text-yellow-600 bg-yellow-50';  // 40-65 dalgalı
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-bold ${color}`}>
        {total}
      </span>
    );
  };

  // Risk Seviyesi Badge
  const RiskBadge = ({ level }) => {
    const configs = {
      safe: { icon: '🟢', label: 'Güvende', color: 'text-green-700 bg-green-50' },
      warning: { icon: '🟡', label: 'Dalgalı', color: 'text-yellow-700 bg-yellow-50' },
      risk: { icon: '🔴', label: 'Riskte', color: 'text-red-700 bg-red-50' }
    };
    const config = configs[level] || configs.warning;
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}>
        {config.icon}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hoş Geldiniz, {user?.first_name || user?.username || 'Hocam'}! 🎓</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* 🚨 İNAKTİF ÖĞRENCİ UYARISI - En üstte göster */}
        {(criticalCount > 0 || warningCount > 0) && (
          <div className={`rounded-2xl p-5 ${criticalCount > 0 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-yellow-500 to-amber-500'} text-white`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {criticalCount > 0 ? '⚠️ Dikkat! İnaktif Öğrenciler' : '📢 Takip Gerektiren Öğrenciler'}
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  {criticalCount > 0 && <span className="font-semibold">{criticalCount} öğrenci 2+ gündür giriş yapmadı. </span>}
                  {warningCount > 0 && <span>{warningCount} öğrenci dün giriş yapmadı.</span>}
                </p>

                {/* İnaktif öğrenci listesi */}
                {inactiveStudents.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    {inactiveStudents.slice(0, 5).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigate(`/student/${s.id}`)}
                        className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <span>{s.name}</span>
                        <span className="opacity-75">({s.activity_status?.days_inactive}g)</span>
                      </button>
                    ))}
                    {inactiveStudents.length > 5 && (
                      <span className="px-3 py-1.5 text-sm opacity-75">+{inactiveStudents.length - 5} daha</span>
                    )}

                    {/* Hatırlatma Gönder Butonu */}
                    <button
                      onClick={handleSendReminders}
                      disabled={sendingReminder || reminderSent}
                      className="ml-auto bg-white text-red-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {sendingReminder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : reminderSent ? (
                        <>
                          <Check size={16} />
                          Gönderildi!
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Hatırlatma Gönder
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Davet Kodu */}
        {stats?.invite_code && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Davet Kodu</p>
                <p className="text-sm opacity-90 mt-1">Öğrencilerinizle paylaşabilirsiniz</p>
              </div>
              <button
                onClick={copyInviteCode}
                className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl transition-colors"
              >
                <span className="text-2xl font-bold tracking-wider">{stats.invite_code}</span>
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Öğrenci</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.total_students || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Bugün</p>
                <p className="text-2xl font-bold text-green-600">{stats?.active_today || 0}</p>
              </div>
            </div>
          </div>

          {/* Uyarı Kartı - Kritik varsa kırmızı */}
          <div className={`rounded-2xl p-5 border shadow-sm ${criticalCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${criticalCount > 0 ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <AlertCircle className={criticalCount > 0 ? 'text-red-600' : 'text-yellow-600'} size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">İnaktif</p>
                <p className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                  {criticalCount + warningCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bu Hafta Deneme</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.exams_this_week || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Öğrencilerim */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Öğrencilerim</h2>
            <button
              onClick={() => navigate('/students')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              Tümünü Gör <ChevronRight size={16} />
            </button>
          </div>

          {/* Tablo Header - Yeni Sütunlar */}
          <div className="hidden lg:grid gap-2 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500" style={{gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.7fr 0.7fr 0.7fr 1.2fr'}}>
            <div>ÖĞRENCİ</div>
            <div className="text-center">TYT ORT</div>
            <div className="text-center">TYT SIRA</div>
            <div className="text-center">AYT ORT</div>
            <div className="text-center">AYT SIRA</div>
            <div className="text-center">MOM.</div>
            <div className="text-center">DİS.</div>
            <div className="text-center">RİSK</div>
            <div className="text-right">İŞLEMLER</div>
          </div>

          {/* Öğrenci Listesi */}
          <div className="divide-y divide-gray-50">
            {sortedStudents.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Henüz öğrenciniz yok</p>
                <p className="text-sm text-gray-400 mt-2">Davet kodunuzu paylaşarak öğrenci ekleyin</p>
              </div>
            ) : (
              sortedStudents.map((student) => {
                const activityStatus = student.activity_status;
                const isCritical = activityStatus?.status === 'critical' || activityStatus?.status === 'inactive';
                const isWarning = activityStatus?.status === 'warning';
                const riskLevel = student.risk_level || 'warning';

                return (
                  <div
                    key={student.id}
                    className={`px-3 lg:px-5 py-3 lg:py-4 hover:bg-gray-50 cursor-pointer transition-colors ${isCritical ? 'bg-red-50/50' : isWarning ? 'bg-yellow-50/50' : ''}`}
                    onClick={() => navigate(`/student/${student.id}`)}
                  >
                    {/* Mobile/Tablet Layout */}
                    <div className="lg:hidden flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-indigo-500'}`}>
                            {student.name?.charAt(0).toUpperCase() || 'Ö'}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getActivityColor(activityStatus)}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {student.name}
                            {student.field_type_display && (
                              <span className="text-xs text-gray-400 ml-1">({student.field_type_display})</span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {student.tyt_avg_net && <span className="text-xs text-blue-600">TYT: {student.tyt_avg_net}</span>}
                            {student.tyt_ranking && <span className="text-xs text-gray-500">~{formatRanking(student.tyt_ranking)}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiskBadge level={riskLevel} />
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Desktop Layout - Yeni Tablo */}
                    <div className="hidden lg:grid gap-2 items-center" style={{gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.7fr 0.7fr 0.7fr 1.2fr'}}>
                      {/* Öğrenci İsim + Alan */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-indigo-500'}`}>
                            {student.name?.charAt(0).toUpperCase() || 'Ö'}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getActivityColor(activityStatus)}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {student.field_type_display || student.exam_goal_type || 'SAY'}
                          </p>
                        </div>
                      </div>

                      {/* TYT Ortalama */}
                      <div className="text-center">
                        {student.tyt_avg_net ? (
                          <span className="text-sm font-bold text-blue-600">{student.tyt_avg_net}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>

                      {/* TYT Sıralama */}
                      <div className="text-center">
                        {student.tyt_ranking ? (
                          <span className="text-xs text-blue-600 font-medium">{formatRanking(student.tyt_ranking)}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>

                      {/* AYT Ortalama */}
                      <div className="text-center">
                        {student.ayt_avg_net ? (
                          <span className="text-sm font-bold text-purple-600">{student.ayt_avg_net}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>

                      {/* AYT Sıralama */}
                      <div className="text-center">
                        {student.ayt_ranking ? (
                          <span className="text-xs text-purple-600 font-medium">{formatRanking(student.ayt_ranking)}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>

                      {/* Momentum */}
                      <div className="flex justify-center">
                        <MomentumBadge momentum={student.momentum} />
                      </div>

                      {/* Disiplin */}
                      <div className="flex justify-center">
                        <DisciplineBadge score={student.discipline_score} />
                      </div>

                      {/* Risk */}
                      <div className="flex justify-center">
                        <RiskBadge level={riskLevel} />
                      </div>

                      {/* İşlemler */}
                      <div className="flex justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}`); }} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"><Eye size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/schedule'); }} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50"><Calendar size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/messages'); }} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"><MessageCircle size={16} /></button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ÖĞRENCİ DASHBOARD ====================
function StudentDashboard({ user, stats, onRefresh }) {
  const navigate = useNavigate();
  const exams = stats?.exams || [];

  // State'ler
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showOBPModal, setShowOBPModal] = useState(false);
  const [targetInput, setTargetInput] = useState(stats?.target_ranking?.toString() || '');
  const [targetUniversity, setTargetUniversity] = useState(stats?.target_university || '');
  const [targetDepartment, setTargetDepartment] = useState(stats?.target_department || '');
  const [obpInput, setObpInput] = useState(stats?.obp?.toString() || '');
  const [saving, setSaving] = useState(false);
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  // Haftalık hedefleri yükle
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await API.get('/api/goals/');
        setWeeklyGoals(res.data.goals || []);
      } catch (err) {
        console.log('Hedefler yüklenemedi');
      }
    };
    fetchGoals();
  }, []);

  // Tüm denemelerin ORTALAMASINA göre sıralama hesapla
  const getAverageRankings = () => {
    const types = ['TYT', 'AYT_SAY', 'AYT_EA', 'AYT_SOZ'];
    const rankings = {};
    types.forEach(type => {
      const typeExams = exams.filter(e => e.exam_type === type);
      if (typeExams.length > 0) {
        // Ortalama net hesapla
        const avgNet = typeExams.reduce((sum, e) => sum + e.net_score, 0) / typeExams.length;
        const roundedNet = Math.round(avgNet * 10) / 10;
        // Ortalama sıralama hesapla (backend'den gelen sıralamaların ortalaması)
        const avgRanking = Math.round(typeExams.reduce((sum, e) => sum + (e.estimated_ranking || 0), 0) / typeExams.length);
        rankings[type] = {
          net: roundedNet,
          ranking: avgRanking || null,
          count: typeExams.length
        };
      }
    });
    return rankings;
  };

  const prepareChartData = () => {
    const tytExams = exams.filter(e => e.exam_type === 'TYT').slice(0, 10).reverse();
    return tytExams.map(e => ({
      date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      net: e.net_score,
      ranking: e.estimated_ranking  // Backend'den geliyor
    }));
  };

  const rankings = getAverageRankings();
  const chartData = prepareChartData();
  const goalType = stats?.exam_goal_type || 'SAY';
  const mainAYTType = goalType === 'SAY' ? 'AYT_SAY' : goalType === 'EA' ? 'AYT_EA' : goalType === 'DIL' ? 'YDT' : 'AYT_SOZ';

  // TYT ve AYT istatistikleri (Exams.jsx'tekiyle aynı)
  const getExamStats = () => {
    const tytExams = exams.filter(e => e.exam_type === 'TYT');
    const aytExams = exams.filter(e => e.exam_type?.startsWith('AYT'));

    return {
      tytCount: tytExams.length,
      tytAvg: tytExams.length > 0 ? (tytExams.reduce((a, e) => a + e.net_score, 0) / tytExams.length).toFixed(1) : null,
      tytMax: tytExams.length > 0 ? Math.max(...tytExams.map(e => e.net_score)) : null,
      aytCount: aytExams.length,
      aytAvg: aytExams.length > 0 ? (aytExams.reduce((a, e) => a + e.net_score, 0) / aytExams.length).toFixed(1) : null,
      aytMax: aytExams.length > 0 ? Math.max(...aytExams.map(e => e.net_score)) : null,
    };
  };
  const examStats = getExamStats();

  // MEB OGM Materyal YKS Sıralama Tahmini - Diploma 85 baz alınarak
  const estimateRanking = (net, type) => {
    const TYT_RANKING_TABLE = [
      { net: 120, rank: 50 }, { net: 115, rank: 250 }, { net: 110, rank: 1450 },
      { net: 105, rank: 4550 }, { net: 100, rank: 10500 }, { net: 90, rank: 34500 },
      { net: 80, rank: 81500 }, { net: 70, rank: 155500 }, { net: 60, rank: 265500 },
      { net: 50, rank: 437500 }, { net: 40, rank: 686500 }, { net: 30, rank: 1047000 },
      { net: 20, rank: 1460500 }, { net: 10, rank: 1903500 },
    ];

    const AYT_SAY_TABLE = [
      { net: 70, rank: 3150 }, { net: 60, rank: 13500 }, { net: 50, rank: 40500 },
      { net: 40, rank: 76500 }, { net: 35, rank: 126500 }, { net: 25, rank: 200000 },
    ];

    const tables = { 'TYT': TYT_RANKING_TABLE, 'AYT': AYT_SAY_TABLE, 'AYT_SAY': AYT_SAY_TABLE };
    const table = tables[type] || TYT_RANKING_TABLE;
    if (!net || net <= 0) return null;

    for (let i = 0; i < table.length; i++) {
      if (net >= table[i].net) {
        if (i === 0) return table[0].rank;
        const higher = table[i - 1];
        const lower = table[i];
        const ratio = (net - lower.net) / (higher.net - lower.net);
        return Math.round(lower.rank - (lower.rank - higher.rank) * ratio);
      }
    }
    const last = table[table.length - 1];
    const secondLast = table[table.length - 2];
    const slope = (last.rank - secondLast.rank) / (secondLast.net - last.net);
    return Math.round(last.rank + slope * (last.net - net));
  };

  // Hedef kaydetme (sıralama + üniversite + bölüm)
  const handleSaveTarget = async () => {
    setSaving(true);
    try {
      const data = {
        target_ranking: targetInput ? parseInt(targetInput) : null,
        target_university: targetUniversity || null,
        target_department: targetDepartment || null,
      };

      const res = await API.post('/api/student/profile/update/', data);
      setShowTargetModal(false);
      if (onRefresh) await onRefresh();
    } catch (err) {
      alert('Kaydetme başarısız: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Diploma notu kaydetme
  const handleSaveOBP = async () => {
    setSaving(true);
    try {
      // Diploma notunu 5 ile çarparak OBP'ye çevir
      const diplomaNotu = obpInput ? parseFloat(obpInput) : null;
      const obpValue = diplomaNotu ? diplomaNotu * 5 : null;

      const res = await API.post('/api/student/profile/update/', {
        obp: obpValue
      });
      setShowOBPModal(false);
      if (onRefresh) await onRefresh();
    } catch (err) {
      alert('Kaydetme başarısız: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Yerleşme sıralaması hesaplama (OBP dahil)
  const calculatePlacementRanking = () => {
    if (!rankings.TYT && !rankings[mainAYTType]) return null;

    const tytRank = rankings.TYT?.ranking || 9999999;
    const aytRank = rankings[mainAYTType]?.ranking || 9999999;

    // OBP etkisi: 100 OBP = %5 iyileştirme, 0 OBP = değişiklik yok
    const obp = stats?.obp || 0;
    const obpFactor = 1 - (obp / 100) * 0.05;

    const baseRank = Math.min(tytRank, aytRank);
    return Math.round(baseRank * obpFactor);
  };

  const placementRanking = calculatePlacementRanking();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hedef Modal - Sıralama + Üniversite + Bölüm */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">🎯 Hedefini Belirle</h3>
              <button onClick={() => setShowTargetModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Sıralama
                </label>
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="Örn: 10000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Üniversite
                </label>
                <input
                  type="text"
                  value={targetUniversity}
                  onChange={(e) => setTargetUniversity(e.target.value)}
                  placeholder="Örn: İstanbul Teknik Üniversitesi"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Bölüm
                </label>
                <input
                  type="text"
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  placeholder="Örn: Bilgisayar Mühendisliği"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTargetModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSaveTarget}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diploma Notu Modal */}
      {showOBPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">📊 Diploma Notu Gir</h3>
              <button onClick={() => setShowOBPModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diploma Notu
              </label>
              <input
                type="number"
                step="0.01"
                value={obpInput}
                onChange={(e) => setObpInput(e.target.value)}
                placeholder="Örn: 85.50"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                min="0"
                max="100"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOBPModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSaveOBP}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Merhaba, {stats?.name || user?.first_name || 'Öğrenci'}! 📚</h1>
                <p className="text-indigo-100 text-sm mt-1">
                  {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                {/* Diploma Notu Girişi */}
                <button
                  onClick={() => {
                    // OBP'yi 5'e bölerek diploma notuna çevir
                    const diplomaNotu = stats?.obp ? (stats.obp / 5).toFixed(2) : '';
                    setObpInput(diplomaNotu);
                    setShowOBPModal(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-white transition-colors group"
                >
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    Diploma Notu <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="font-semibold">{stats?.obp ? (stats.obp / 5).toFixed(2) : 'Gir →'}</p>
                </button>

                {/* Koç Bilgisi */}
                {stats?.coach && (
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                      {stats.coach.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white">
                      <p className="text-xs opacity-80">Koçun</p>
                      <p className="font-semibold">{stats.coach}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Özet Kartları - TYT ve AYT */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={18} className="opacity-80" />
                <span className="text-sm opacity-90">TYT Ortalama</span>
              </div>
              <p className="text-3xl font-bold">{examStats.tytAvg || '-'}</p>
              <p className="text-xs opacity-70 mt-1">{examStats.tytCount} deneme</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Target size={18} className="opacity-80" />
                <span className="text-sm opacity-90">TYT Sıralama</span>
              </div>
              <p className="text-2xl font-bold">{examStats.tytAvg ? formatRanking(estimateRanking(parseFloat(examStats.tytAvg), 'TYT')) : '-'}</p>
              <p className="text-xs opacity-70 mt-1">Ortalamaya göre</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={18} className="opacity-80" />
                <span className="text-sm opacity-90">AYT Ortalama</span>
              </div>
              <p className="text-3xl font-bold">{examStats.aytAvg || '-'}</p>
              <p className="text-xs opacity-70 mt-1">{examStats.aytCount} deneme</p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Target size={18} className="opacity-80" />
                <span className="text-sm opacity-90">AYT Sıralama</span>
              </div>
              <p className="text-2xl font-bold">{examStats.aytAvg ? formatRanking(estimateRanking(parseFloat(examStats.aytAvg), 'AYT')) : '-'}</p>
              <p className="text-xs opacity-70 mt-1">Ortalamaya göre</p>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol: Grafik + Son Denemeler */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-indigo-500" size={20} />
                TYT Net Gelişimi
              </h2>
              
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" domain={[0, 120]} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="net" stroke="#6366F1" strokeWidth={3} fill="url(#netGradient)" dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Henüz deneme sonucu yok</p>
                    <button onClick={() => navigate('/exams')} className="mt-2 text-indigo-600 font-medium hover:underline">İlk denemeni ekle →</button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Award className="text-amber-500" size={20} />
                  Son Denemeler
                </h2>
                <button onClick={() => navigate('/exams')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  Tümünü Gör <ChevronRight size={16} />
                </button>
              </div>
              
              {exams.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {exams.slice(0, 5).map((exam, idx) => {
                    const typeLabels = { 'TYT': { name: 'TYT', color: 'blue' }, 'AYT_SAY': { name: 'AYT Sayısal', color: 'purple' }, 'AYT_EA': { name: 'AYT EA', color: 'green' }, 'AYT_SOZ': { name: 'AYT Sözel', color: 'orange' } };
                    const info = typeLabels[exam.exam_type] || { name: exam.exam_type, color: 'gray' };

                    return (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-${info.color}-100 flex items-center justify-center`}>
                            <Award className={`text-${info.color}-600`} size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{info.name}</p>
                            <p className="text-xs text-gray-500">{new Date(exam.date).toLocaleDateString('tr-TR')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{exam.net_score} net</p>
                          {exam.estimated_ranking && <p className="text-xs text-indigo-600">~{formatRanking(exam.estimated_ranking)}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400"><p>Henüz deneme sonucu yok</p></div>
              )}
            </div>
          </div>

          {/* Sağ: Hızlı Erişim */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-amber-500" size={20} />
                Hızlı Eylemler
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/exams')} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center">
                  <TrendingUp className="mx-auto text-gray-400 group-hover:text-indigo-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Deneme Ekle</span>
                </button>
                <button onClick={() => navigate('/schedule')} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group text-center">
                  <Calendar className="mx-auto text-gray-400 group-hover:text-purple-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Programım</span>
                </button>
                <button onClick={() => navigate('/messages')} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group text-center">
                  <MessageCircle className="mx-auto text-gray-400 group-hover:text-green-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Mesajlar</span>
                </button>
                <button onClick={() => navigate('/assignments')} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all group text-center">
                  <CheckCircle className="mx-auto text-gray-400 group-hover:text-orange-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Ödevler</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Target size={18} />
                Hedefin
              </h3>
              <button
                onClick={() => {
                  setTargetInput(stats?.target_ranking?.toString() || '');
                  setTargetUniversity(stats?.target_university || '');
                  setTargetDepartment(stats?.target_department || '');
                  setShowTargetModal(true);
                }}
                className="w-full text-left hover:bg-white/5 rounded-xl p-1 -m-1 transition-colors group"
              >
                <div className="space-y-3">
                  {/* Üniversite */}
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs opacity-80 flex items-center gap-1">
                      🏛️ Üniversite <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="font-semibold truncate">{stats?.target_university || 'Belirle →'}</p>
                  </div>

                  {/* Bölüm */}
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs opacity-80 flex items-center gap-1">
                      📚 Bölüm <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="font-semibold truncate">{stats?.target_department || 'Belirle →'}</p>
                  </div>

                  {/* Hedef Sıralama */}
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs opacity-80 flex items-center gap-1">
                      🎯 Hedef Sıralama <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-xl font-bold">{stats?.target_ranking ? formatRanking(stats.target_ranking) : 'Belirle →'}</p>
                  </div>

                  {/* Hedefe Uzaklık */}
                  {stats?.target_ranking && placementRanking && (
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-xs opacity-80">Hedefe Uzaklık</p>
                      <p className={`text-xl font-bold ${placementRanking <= stats.target_ranking ? 'text-green-300' : 'text-amber-300'}`}>
                        {placementRanking <= stats.target_ranking
                          ? `🎉 Hedeftesin!`
                          : `${formatRanking(placementRanking - stats.target_ranking)} sıra`}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* 📋 Haftalık Hedefler */}
            {weeklyGoals.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-indigo-500" />
                  Bu Hafta Hedeflerin
                </h3>
                <div className="space-y-3">
                  {weeklyGoals.map((goal) => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{goal.goal_type_display}</span>
                        <span className={`font-semibold ${goal.is_completed ? 'text-green-600' : 'text-gray-800'}`}>
                          {goal.current_value}/{goal.target_value}
                          {goal.is_completed && ' ✓'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${goal.is_completed ? 'bg-green-500' : 'bg-indigo-500'}`}
                          style={{ width: `${goal.progress_percentage}%` }}
                        />
                      </div>
                      {goal.note && (
                        <p className="text-xs text-gray-500 italic">📝 {goal.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 👀 Koçum İzliyor Göstergesi */}
            {stats?.coach && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Eye size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-800 font-medium">Koçun seni takip ediyor 👀</p>
                    <p className="text-emerald-600 text-xs mt-0.5">{stats.coach} • İlerlemeni görüyor</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <p className="text-sm text-amber-800 font-medium">Günün Sözü</p>
                  <p className="text-amber-700 mt-1 text-sm italic">"Başarı, her gün tekrarlanan küçük çabaların toplamıdır."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== VELİ DASHBOARD ====================
function ParentDashboard({ user, stats }) {
  const navigate = useNavigate();
  const student = stats?.student || {};
  const exams = stats?.exams || [];
  const weeklyGoals = stats?.weekly_goals || [];
  const coach = stats?.coach || null;

  // Aktivite durumu
  const getActivityStatus = () => {
    if (!student.last_activity) return { text: 'Henüz giriş yapmadı', color: 'gray', icon: '⏳' };
    const hours = student.hours_since_activity || 0;
    if (hours < 24) return { text: 'Bugün aktif', color: 'green', icon: '✅' };
    if (hours < 48) return { text: 'Dün aktifti', color: 'yellow', icon: '⚠️' };
    return { text: `${Math.floor(hours / 24)} gündür giriş yapmadı`, color: 'red', icon: '🔴' };
  };

  const activityStatus = getActivityStatus();

  // Grafik verisi
  const chartData = exams.slice(0, 10).reverse().map((exam, index) => ({
    name: `#${index + 1}`,
    net: exam.net_score || 0,
    date: exam.date
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Veli Paneli</p>
              <h1 className="text-2xl font-bold mt-1">Hoş geldin, {user?.first_name || 'Veli'} 👋</h1>
            </div>
            <button
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-all"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Öğrenci Bilgi Kartı */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {student.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{student.name || 'Öğrenci'}</h2>
              <p className="text-gray-500 text-sm">{student.exam_goal_type || 'SAY'} • {student.target_university || 'Hedef belirtilmemiş'}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  activityStatus.color === 'green' ? 'bg-green-100 text-green-700' :
                  activityStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  activityStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activityStatus.icon} {activityStatus.text}
                </span>
                {student.streak > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    🔥 {student.streak} gün seri
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sol Kolon */}
          <div className="lg:col-span-2 space-y-6">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-xs">Son TYT Net</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{student.last_tyt_net?.toFixed(1) || '-'}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-xs">Son AYT Net</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{student.last_ayt_net?.toFixed(1) || '-'}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-xs">Toplam Deneme</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{exams.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-xs">Hedef Sıralama</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{student.target_ranking ? formatRanking(student.target_ranking) : '-'}</p>
              </div>
            </div>

            {/* Grafik */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">📈 Deneme Performansı</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="parentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} net`, 'Net']}
                      />
                      <Area type="monotone" dataKey="net" stroke="#8b5cf6" fill="url(#parentGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Son Denemeler */}
            {exams.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">📝 Son Denemeler</h3>
                <div className="space-y-3">
                  {exams.slice(0, 5).map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800">{exam.exam_type}</p>
                        <p className="text-gray-500 text-xs">{exam.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">{exam.net_score} net</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ Kolon */}
          <div className="space-y-6">
            {/* Koç Bilgisi */}
            {coach && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                    👨‍🏫
                  </div>
                  <div>
                    <p className="text-sm text-indigo-800 font-medium">Öğrencinin Koçu</p>
                    <p className="text-indigo-600 font-semibold">{coach}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Haftalık Hedefler */}
            {weeklyGoals.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-4">🎯 Haftalık Hedefler</h3>
                <div className="space-y-3">
                  {weeklyGoals.map((goal, index) => {
                    const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-gray-700">{goal.goal_type_display}</p>
                          <span className={`text-xs font-medium ${goal.is_completed ? 'text-green-600' : 'text-gray-500'}`}>
                            {goal.current_value}/{goal.target_value}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${goal.is_completed ? 'bg-green-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bilgi Kutusu */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <p className="text-sm text-amber-800 font-medium">Veli İpucu</p>
                  <p className="text-amber-700 mt-1 text-sm">Öğrencinizin düzenli çalışmasını destekleyin. Motivasyonu yüksek tutmak başarının anahtarıdır!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ANA DASHBOARD ====================
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/api/dashboard/");
      setStats(res.data);
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');
      if (storedUser) {
        setUser({ first_name: storedUser, username: storedUser, role: storedRole });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const role = stats?.role || localStorage.getItem('role');

  if (role === 'coach') {
    return <CoachDashboard user={user} stats={stats} />;
  } else if (role === 'parent') {
    return <ParentDashboard user={user} stats={stats} />;
  } else {
    return <StudentDashboard user={user} stats={stats} onRefresh={fetchData} />;
  }
}