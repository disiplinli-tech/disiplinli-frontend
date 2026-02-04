import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  TrendingUp, Target, Award, Calendar, MessageCircle,
  ChevronRight, Trophy, Zap, BarChart3, CheckCircle, Users,
  Copy, Check, Eye, Bell, X, Edit2, Save
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ==================== KOÇ DASHBOARD ====================
function CoachDashboard({ user, stats }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyInviteCode = () => {
    navigator.clipboard.writeText(stats?.invite_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const students = stats?.students || [];
  const sortedStudents = [...students].sort((a, b) => (b.last_tyt_net || 0) - (a.last_tyt_net || 0));

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

        {/* Davet Kodu */}
        {stats?.invite_code && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Davet Kodu</p>
                <p className="text-xs opacity-60 mt-1">Öğrencilerinizle paylaşın</p>
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
                <p className="text-2xl font-bold text-gray-800">{stats?.active_today || 0}</p>
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
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Bell className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bekleyen Ödev</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.pending_assignments || 0}</p>
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
          
          {/* Tablo Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="col-span-4">ÖĞRENCİ</div>
            <div className="col-span-2 text-center">SON TYT</div>
            <div className="col-span-2 text-center">SIRALAMA</div>
            <div className="col-span-2 text-center">SON AKTİVİTE</div>
            <div className="col-span-2 text-right">İŞLEMLER</div>
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
              sortedStudents.map((student, idx) => {
                const lastNet = student.last_tyt_net;
                const ranking = student.estimated_ranking;  // Backend'den geliyor
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
                
                return (
                  <div 
                    key={student.id} 
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/student/${student.id}`)}
                  >
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold`}>
                        {student.name?.charAt(0).toUpperCase() || 'Ö'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400 truncate">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="hidden md:block col-span-2 text-center">
                      {lastNet ? <span className="text-lg font-bold text-gray-800">{lastNet}</span> : <span className="text-gray-400">-</span>}
                    </div>
                    
                    <div className="hidden md:block col-span-2 text-center">
                      {ranking ? <span className="text-indigo-600 font-semibold">~{formatRanking(ranking)}</span> : <span className="text-gray-400">-</span>}
                    </div>
                    
                    <div className="hidden md:block col-span-2 text-center text-sm text-gray-500">
                      {student.last_activity ? new Date(student.last_activity).toLocaleDateString('tr-TR') : '-'}
                    </div>
                    
                    <div className="hidden md:flex col-span-2 justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}`); }} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"><Eye size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); navigate('/schedule'); }} className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50"><Calendar size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); navigate('/messages'); }} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"><MessageCircle size={18} /></button>
                    </div>

                    <div className="col-span-12 md:hidden flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        {lastNet && <span className="text-sm"><strong>{lastNet}</strong> net</span>}
                        {ranking && <span className="text-sm text-indigo-600">~{formatRanking(ranking)}</span>}
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
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

          {/* Sıralama Kartları */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">TYT Sıralama</span>
              </div>
              <p className="text-2xl font-bold">{rankings.TYT ? formatRanking(rankings.TYT.ranking) : '-'}</p>
              {rankings.TYT && <p className="text-xs opacity-70 mt-1">Ort: {rankings.TYT.net} net ({rankings.TYT.count} deneme)</p>}
            </div>

            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">AYT Sıralama</span>
              </div>
              <p className="text-2xl font-bold">{rankings[mainAYTType] ? formatRanking(rankings[mainAYTType].ranking) : '-'}</p>
              {rankings[mainAYTType] && <p className="text-xs opacity-70 mt-1">Ort: {rankings[mainAYTType].net} net ({rankings[mainAYTType].count} deneme)</p>}
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">Tahmini Yerleşme</span>
              </div>
              <p className="text-2xl font-bold">
                {placementRanking ? formatRanking(placementRanking) : '-'}
              </p>
              <p className="text-xs opacity-70 mt-1">
                {stats?.obp ? `Diploma: ${(stats.obp / 5).toFixed(2)}` : 'Diploma notu girilmedi'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">Deneme</span>
              </div>
              <p className="text-2xl font-bold">{exams.length}</p>
              <p className="text-xs opacity-70 mt-1">Toplam deneme</p>
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

  const isCoach = stats?.role === 'coach' || localStorage.getItem('role') === 'coach';
  return isCoach ? <CoachDashboard user={user} stats={stats} /> : <StudentDashboard user={user} stats={stats} onRefresh={fetchData} />;
}