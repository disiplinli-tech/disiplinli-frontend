import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  ArrowLeft, Mail, TrendingUp, TrendingDown, Minus,
  Calendar, Award, BarChart3, Trophy,
  BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Flame, Clock, Star, Sparkles, Activity,
  MessageSquarePlus, Send, X, Save
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area
} from 'recharts';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Konu takip state'leri
  const [topicsData, setTopicsData] = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsTab, setTopicsTab] = useState('TYT');
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Schedule state
  const [studentSchedule, setStudentSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Subject results state (branş detayları)
  const [subjectResults, setSubjectResults] = useState([]);
  const [expandedExamId, setExpandedExamId] = useState(null);

  // Günlük Aktivite (Koç görünümü)
  const [dailyActivity, setDailyActivity] = useState(null);
  const [dailyActivityLoading, setDailyActivityLoading] = useState(false);

  // Koç Notu (Veli için)
  const [coachNotes, setCoachNotes] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    fetchData();
    fetchTopics();
    fetchSchedule();
    fetchSubjectResults();
    fetchDailyActivity();
    fetchCoachNotes();
  }, [id]);

  const fetchData = async () => {
    try {
      const studentRes = await API.get(`/api/student/${id}/`);
      setStudent(studentRes.data);
      if (studentRes.data.exams) {
        setExams(studentRes.data.exams);
      } else {
        try {
          const examsRes = await API.get(`/api/student/${id}/exams/`);
          setExams(examsRes.data || []);
        } catch (e) {}
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    setTopicsLoading(true);
    try {
      const res = await API.get(`/api/topics/?student_id=${id}`);
      setTopicsData(res.data);
    } catch (err) {
    } finally {
      setTopicsLoading(false);
    }
  };

  const fetchSchedule = async () => {
    setScheduleLoading(true);
    try {
      const res = await API.get(`/api/student/${id}/schedule/`);
      setStudentSchedule(res.data || []);
    } catch (err) {
    } finally {
      setScheduleLoading(false);
    }
  };

  const fetchSubjectResults = async () => {
    try {
      const res = await API.get(`/api/subject-results/?student_id=${id}`);
      setSubjectResults(res.data || []);
    } catch (err) {}
  };

  const fetchDailyActivity = async () => {
    setDailyActivityLoading(true);
    try {
      const res = await API.get(`/api/coach/student/${id}/daily-activity/`);
      setDailyActivity(res.data);
    } catch (err) {
    } finally {
      setDailyActivityLoading(false);
    }
  };

  const fetchCoachNotes = async () => {
    try {
      const res = await API.get(`/api/coach/student/${id}/notes/`);
      setCoachNotes(res.data.notes || []);
      if (res.data.notes?.length > 0) {
        setNoteContent(res.data.notes[0].content || '');
      }
    } catch (err) {}
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) { alert('Not içeriği boş olamaz'); return; }
    setSavingNote(true);
    try {
      await API.post(`/api/coach/student/${id}/notes/`, {
        content: noteContent,
        is_visible_to_parent: true
      });
      setShowNoteModal(false);
      fetchCoachNotes();
    } catch (err) {
      alert('Not kaydedilemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingNote(false);
    }
  };

  const getExamSubjectResults = (examId, examDate, examType) => {
    const byExamId = subjectResults.filter(r => r.exam_id === examId);
    if (byExamId.length > 0) return byExamId;
    const prefix = examType === 'TYT' ? 'TYT_' : 'AYT_';
    return subjectResults.filter(r => r.date === examDate && r.subject.startsWith(prefix));
  };

  const toggleSubjectExpand = (key) => {
    setExpandedSubjects(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sıralamalar
  const getLatestRankings = () => {
    const types = ['TYT', 'AYT_SAY', 'AYT_EA', 'AYT_SOZ'];
    const rankings = {};
    types.forEach(type => {
      const typeExams = exams.filter(e => e.exam_type === type);
      if (typeExams.length > 0) {
        const latest = typeExams[0];
        const previous = typeExams[1];
        rankings[type] = {
          net: latest.net_score,
          ranking: latest.estimated_ranking,
          change: previous ? latest.net_score - previous.net_score : null,
          date: latest.date
        };
      }
    });
    return rankings;
  };

  const getTYTChartData = () => {
    return exams
      .filter(e => e.exam_type === 'TYT')
      .slice(0, 10)
      .reverse()
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        net: e.net_score,
        ranking: e.estimated_ranking
      }));
  };

  const rankings = getLatestRankings();
  const tytChartData = getTYTChartData();

  const getStats = (type) => {
    const typeExams = exams.filter(e => e.exam_type === type);
    if (typeExams.length === 0) return null;
    const nets = typeExams.map(e => e.net_score);
    return {
      count: typeExams.length,
      avg: (nets.reduce((a, b) => a + b, 0) / nets.length).toFixed(1),
      max: Math.max(...nets),
      min: Math.min(...nets),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Öğrenci bulunamadı</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-orange-600 hover:underline">
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-[100vw] overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Geri</span>
        </button>

        {/* Öğrenci Bilgi Kartı */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 md:px-6 py-4 md:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl md:text-2xl font-bold flex-shrink-0">
                  {student.name?.charAt(0).toUpperCase() || 'Ö'}
                </div>
                <div className="text-white min-w-0 flex-1">
                  <h1 className="text-lg md:text-2xl font-bold truncate">{student.name}</h1>
                  <p className="text-orange-100 flex items-center gap-1.5 mt-0.5 md:mt-1 text-xs md:text-sm truncate">
                    <Mail size={12} className="flex-shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </p>
                </div>
              </div>
              {/* Diploma Notu & Hedef Bilgisi */}
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-white/10 rounded-xl px-4 py-2 text-white text-center">
                  <p className="text-xs opacity-80">Diploma Notu</p>
                  <p className="text-lg font-bold">{student.diploma_notu ? student.diploma_notu.toFixed(2) : '-'}</p>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-white text-center">
                  <p className="text-xs opacity-80">Alan</p>
                  <p className="text-lg font-bold">{student.exam_goal_type || 'SAY'}</p>
                </div>
                {student.target_ranking && (
                  <div className="bg-white/10 rounded-xl px-4 py-2 text-white text-center">
                    <p className="text-xs opacity-80">Hedef</p>
                    <p className="text-lg font-bold">{formatRanking(student.target_ranking)}</p>
                  </div>
                )}
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquarePlus size={18} />
                  <span className="text-sm font-medium">Veli Notu</span>
                </button>
              </div>
            </div>
            {/* Mobil görünüm */}
            <div className="flex md:hidden items-center gap-2 mt-3 flex-wrap">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg">
                📊 Diploma: {student.diploma_notu ? student.diploma_notu.toFixed(2) : '-'}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg">
                📚 {student.exam_goal_type || 'SAY'}
              </span>
              {student.target_ranking && (
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg">
                  🎯 {formatRanking(student.target_ranking)}
                </span>
              )}
            </div>
          </div>

          {/* Sıralama Kartları */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">TYT Sıralama</span>
                {rankings.TYT && rankings.TYT.change !== null && (
                  <span className={`text-xs font-bold flex items-center gap-0.5
                    ${rankings.TYT.change > 0 ? 'text-green-600' : rankings.TYT.change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {rankings.TYT.change > 0 ? <TrendingUp size={12} /> : rankings.TYT.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                    {rankings.TYT.change > 0 ? '+' : ''}{rankings.TYT.change?.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {student.tyt_avg_ranking ? formatRanking(student.tyt_avg_ranking) : '-'}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {student.tyt_avg_net ? `${student.tyt_avg_net} net` : 'Henüz deneme yok'}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <span className="text-sm font-medium text-purple-600">AYT Sıralama</span>
              <p className="text-2xl font-bold text-purple-700 mt-2">
                {student.ayt_avg_ranking ? formatRanking(student.ayt_avg_ranking) : '-'}
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {student.ayt_avg_net ? `${student.ayt_avg_net} net` : 'Henüz deneme yok'}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <span className="text-sm font-medium text-green-600">Ort. TYT</span>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {student.tyt_avg_net || getStats('TYT')?.avg || '-'}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {getStats('TYT')?.count || 0} deneme
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <span className="text-sm font-medium text-amber-600">Ort. AYT</span>
              <p className="text-2xl font-bold text-amber-700 mt-2">
                {student.ayt_avg_net || getStats('AYT_SAY')?.avg || getStats('AYT_EA')?.avg || getStats('AYT_SOZ')?.avg || '-'}
              </p>
              <p className="text-xs text-amber-500 mt-1">
                {(getStats('AYT_SAY')?.count || 0) + (getStats('AYT_EA')?.count || 0) + (getStats('AYT_SOZ')?.count || 0)} deneme
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max md:min-w-0">
              {[
                { key: 'overview', label: 'Genel', icon: BarChart3 },
                { key: 'activity', label: 'Aktivite', icon: Activity },
                { key: 'exams', label: 'Denemeler', icon: Award },
                { key: 'topics', label: 'Konular', icon: BookOpen },
                { key: 'schedule', label: 'Program', icon: Calendar },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 md:px-6 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.key
                      ? 'text-orange-600 border-orange-500 bg-orange-50/50'
                      : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* ===== GENEL ===== */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TYT Chart */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={18} />
                    TYT Net Gelişimi
                  </h3>
                  {tytChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={tytChartData}>
                        <defs>
                          <linearGradient id="tytGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={[0, 120]} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} fill="url(#tytGradient)" dot={{ fill: '#3B82F6', r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-gray-400">
                      Henüz TYT denemesi yok
                    </div>
                  )}
                </div>

                {/* Ranking Chart */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Trophy className="text-amber-500" size={18} />
                    Sıralama Gelişimi
                  </h3>
                  {tytChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={tytChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          stroke="#9CA3AF"
                          tickFormatter={(v) => v > 1000000 ? `${(v/1000000).toFixed(1)}M` : v > 1000 ? `${(v/1000).toFixed(0)}K` : v}
                          reversed
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [formatRanking(value), 'Sıralama']}
                        />
                        <Line type="monotone" dataKey="ranking" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-gray-400">
                      Henüz deneme yok
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['TYT', 'AYT_SAY', 'AYT_EA', 'AYT_SOZ'].map(type => {
                    const stats = getStats(type);
                    if (!stats) return null;
                    const labels = { 'TYT': 'TYT', 'AYT_SAY': 'AYT Sayısal', 'AYT_EA': 'AYT EA', 'AYT_SOZ': 'AYT Sözel' };
                    return (
                      <div key={type} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-600 mb-3">{labels[type]}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Deneme</span>
                            <span className="font-semibold">{stats.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ortalama</span>
                            <span className="font-semibold">{stats.avg}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">En Yüksek</span>
                            <span className="font-semibold text-green-600">{stats.max}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">En Düşük</span>
                            <span className="font-semibold text-red-500">{stats.min}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== AKTİVİTE ===== */}
            {activeTab === 'activity' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Günlük Aktivite</h3>
                    <p className="text-sm text-gray-500">Öğrencinin çalışma disiplini ve aktiviteleri</p>
                  </div>
                </div>

                {dailyActivityLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : !dailyActivity ? (
                  <div className="text-center py-12 text-gray-400">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aktivite verisi yüklenemedi</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Günlük Hedef Tamamlandı Badge */}
                    {dailyActivity.points?.daily_complete && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                        <div className="flex items-center justify-center gap-3">
                          <Star size={24} />
                          <div className="text-center">
                            <p className="text-lg font-bold">Bugünkü Hedefi Tamamladı!</p>
                            <p className="text-sm opacity-90">50/50 puana ulaştı</p>
                          </div>
                          <Star size={24} />
                        </div>
                      </div>
                    )}

                    {/* Ana Metrikler */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`rounded-xl p-4 ${dailyActivity.streak?.alive ? 'bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Flame size={20} className={dailyActivity.streak?.alive ? 'text-orange-500' : 'text-gray-400'} />
                          <span className="text-sm text-gray-600">Seri</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{dailyActivity.streak?.current || 0} <span className="text-sm font-normal text-gray-500">gün</span></p>
                        <p className="text-xs text-gray-500 mt-1">En uzun: {dailyActivity.streak?.longest || 0} gün</p>
                      </div>

                      <div className={`rounded-xl p-4 ${dailyActivity.points?.daily_complete ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300' : 'bg-amber-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={20} className={dailyActivity.points?.daily_complete ? 'text-green-500' : 'text-amber-500'} />
                          <span className="text-sm text-gray-600">Bugün</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{dailyActivity.points?.today || 0} <span className="text-sm font-normal text-gray-500">/ {dailyActivity.points?.daily_limit}</span></p>
                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${dailyActivity.points?.daily_complete ? 'bg-green-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (dailyActivity.points?.today / dailyActivity.points?.daily_limit) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={20} className="text-orange-500" />
                          <span className="text-sm text-gray-600">Toplam</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-700">{dailyActivity.points?.total || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">puan</p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={20} className="text-purple-500" />
                          <span className="text-sm text-gray-600">Bu Hafta</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{dailyActivity.summary?.total_days_active || 0} <span className="text-sm font-normal text-gray-500">/ 7 gün</span></p>
                        <p className="text-xs text-gray-500 mt-1">Ort: {dailyActivity.summary?.avg_points_day || 0} puan/gün</p>
                      </div>
                    </div>

                    {/* Haftalık Chart */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Haftalık Görünüm</h4>
                      <div className="flex items-end justify-between gap-2 h-24">
                        {dailyActivity.week_chart?.map((day, i) => {
                          const getBarColor = () => {
                            if (day.status === 'complete') return 'bg-gradient-to-t from-green-400 to-emerald-400';
                            if (day.status === 'partial') return 'bg-gradient-to-t from-yellow-400 to-amber-400';
                            return 'bg-gray-200';
                          };
                          const heightPct = Math.max(10, (day.points / (dailyActivity.points?.daily_limit || 50)) * 100);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div
                                className={`w-full rounded-t-lg transition-all ${getBarColor()}`}
                                style={{ height: `${heightPct}%` }}
                                title={`${day.day}: ${day.points} puan`}
                              />
                              <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                              <span className="text-[10px] text-gray-400">{day.points}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400"></span> Tamamlandı</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400"></span> Kısmi</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200"></span> Boş</span>
                      </div>
                    </div>

                    {/* Bugünkü Aktiviteler */}
                    {dailyActivity.today_activities?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Bugün Yapılanlar</h4>
                        <div className="space-y-2">
                          {dailyActivity.today_activities.map((act, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {act.action_type === 'study_topic' ? '📘' :
                                   act.action_type === 'study_review' ? '🔁' :
                                   act.action_type === 'study_questions' ? '🧠' :
                                   act.action_type === 'study_exam_analysis' ? '📝' :
                                   act.action_type === 'wheel_spin' ? '🎡' :
                                   act.action_type === 'exam_entry' ? '📊' :
                                   act.action_type === 'focus_interact' ? '🎯' :
                                   act.action_type === 'login' ? '👋' : '✨'}
                                </span>
                                <span className="text-sm text-gray-700">{act.action_label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">{act.time}</span>
                                <span className="text-sm font-medium text-amber-600">+{act.points}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manuel Aktivite Durumu */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-orange-800 mb-3">Manuel Çalışma Aktiviteleri</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { key: 'study_topic', label: 'Konu çalıştı', icon: '📘', points: 10 },
                          { key: 'study_review', label: 'Tekrar yaptı', icon: '🔁', points: 10 },
                          { key: 'study_questions', label: 'Soru çözdü', icon: '🧠', points: 20 },
                          { key: 'study_exam_analysis', label: 'Deneme analizi', icon: '📝', points: 10 },
                        ].map(item => {
                          const isActive = dailyActivity.manual_status?.[item.key];
                          return (
                            <div
                              key={item.key}
                              className={`p-3 rounded-lg text-center ${
                                isActive ? 'bg-green-100 border-2 border-green-300' : 'bg-white border border-gray-200'
                              }`}
                            >
                              <span className="text-2xl">{item.icon}</span>
                              <p className={`text-xs mt-1 ${isActive ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                {item.label}
                              </p>
                              {isActive && <span className="text-xs text-green-600">+{item.points}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Son Aktiviteler */}
                    {dailyActivity.recent_activities?.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Son 7 Gün Aktiviteleri</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {dailyActivity.recent_activities.map((act, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">{act.date}</span>
                                <span className="text-sm text-gray-700">{act.action_label}</span>
                              </div>
                              <span className="text-sm font-medium text-amber-600">+{act.points}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== DENEMELER ===== */}
            {activeTab === 'exams' && (
              <div>
                {exams.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Award size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Henüz deneme sonucu yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {exams.map((exam, idx) => {
                      const typeColors = { 'TYT': 'blue', 'AYT_SAY': 'purple', 'AYT_EA': 'green', 'AYT_SOZ': 'orange' };
                      const typeNames = { 'TYT': 'TYT', 'AYT_SAY': 'AYT Sayısal', 'AYT_EA': 'AYT EA', 'AYT_SOZ': 'AYT Sözel' };
                      const isExpanded = expandedExamId === exam.id;
                      const examSubjects = getExamSubjectResults(exam.id, exam.date, exam.exam_type);
                      const color = typeColors[exam.exam_type] || 'gray';

                      return (
                        <div key={exam.id || idx} className={`bg-${color}-50 rounded-xl border border-${color}-100 overflow-hidden`}>
                          <div
                            className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                            onClick={() => setExpandedExamId(isExpanded ? null : exam.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
                                  <Award className={`text-${color}-600`} size={20} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}>
                                      {typeNames[exam.exam_type] || exam.exam_type}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {new Date(exam.date).toLocaleDateString('tr-TR')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-800">{exam.net_score} <span className="text-sm font-normal text-gray-500">net</span></p>
                                  <p className="text-sm text-orange-600 font-medium">~{formatRanking(exam.estimated_ranking)}</p>
                                </div>
                                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-200 bg-white p-4">
                              {examSubjects.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">
                                  Bu deneme için branş detayı kaydedilmemiş
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {examSubjects.map((subject) => {
                                    const subjectNames = {
                                      'TYT_TURKCE': 'Türkçe', 'TYT_SOSYAL': 'Sosyal', 'TYT_MATEMATIK': 'Matematik', 'TYT_FEN': 'Fen',
                                      'AYT_MAT': 'Matematik', 'AYT_FIZIK': 'Fizik', 'AYT_KIMYA': 'Kimya', 'AYT_BIYOLOJI': 'Biyoloji',
                                      'AYT_EDEBIYAT': 'Edebiyat', 'AYT_TARIH1': 'Tarih-1', 'AYT_COGRAFYA1': 'Coğrafya-1',
                                      'AYT_TARIH2': 'Tarih-2', 'AYT_COGRAFYA2': 'Coğrafya-2', 'AYT_FELSEFE': 'Felsefe', 'AYT_DIN': 'Din'
                                    };
                                    const net = subject.net || (subject.correct - (subject.wrong / 4));
                                    const blank = subject.blank || 0;
                                    return (
                                      <div key={subject.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-gray-800 text-sm">
                                            {subjectNames[subject.subject] || subject.subject}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            <span className="text-green-600 font-medium">{subject.correct}D</span>
                                            {' / '}
                                            <span className="text-red-500 font-medium">{subject.wrong}Y</span>
                                            {blank > 0 && <span className="text-gray-400"> / {blank}B</span>}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className={`text-lg font-bold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {net.toFixed(2)}
                                          </p>
                                          <p className="text-xs text-gray-400">net</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===== KONULAR ===== */}
            {activeTab === 'topics' && (
              <div>
                {topicsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : !topicsData ? (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Konu verileri yüklenemedi</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Genel İlerleme */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-lg">
                        <Trophy size={28} />
                        <div>
                          <p className="text-sm opacity-80">Genel İlerleme</p>
                          <p className="text-2xl font-bold">%{topicsData.overall?.progress || 0}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Alan: <span className="font-semibold text-gray-700">{topicsData.field_type}</span>
                      </div>
                    </div>

                    {/* TYT / AYT Tabs */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => setTopicsTab('TYT')}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                          topicsTab === 'TYT'
                            ? 'bg-blue-500 text-white shadow'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        TYT <span className="text-xs ml-1 opacity-80">%{topicsData.tyt?.progress || 0}</span>
                      </button>
                      <button
                        onClick={() => setTopicsTab('AYT')}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                          topicsTab === 'AYT'
                            ? 'bg-purple-500 text-white shadow'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        AYT <span className="text-xs ml-1 opacity-80">%{topicsData.ayt?.progress || 0}</span>
                      </button>
                    </div>

                    {/* İstatistik Kartları */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Toplam Konu</p>
                        <p className="text-xl font-bold text-gray-800">
                          {topicsTab === 'TYT' ? topicsData.tyt?.total : topicsData.ayt?.total}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-green-600 mb-1">Tamamlanan</p>
                        <p className="text-xl font-bold text-green-700">
                          {topicsTab === 'TYT' ? topicsData.tyt?.completed : topicsData.ayt?.completed}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4">
                        <p className="text-xs text-orange-600 mb-1">Kalan</p>
                        <p className="text-xl font-bold text-orange-700">
                          {topicsTab === 'TYT'
                            ? (topicsData.tyt?.total - topicsData.tyt?.completed)
                            : (topicsData.ayt?.total - topicsData.ayt?.completed)}
                        </p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4">
                        <p className="text-xs text-amber-600 mb-1">İlerleme</p>
                        <p className="text-xl font-bold text-amber-700">
                          %{topicsTab === 'TYT' ? topicsData.tyt?.progress : topicsData.ayt?.progress}
                        </p>
                      </div>
                    </div>

                    {/* Ders Kartları */}
                    <div className="space-y-3">
                      {Object.entries((topicsTab === 'TYT' ? topicsData.tyt?.topics : topicsData.ayt?.topics) || {}).map(([key, subject]) => {
                        const isExpanded = expandedSubjects[key];
                        const colorMap = {
                          blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', progress: 'bg-blue-500' },
                          purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', progress: 'bg-purple-500' },
                          green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', progress: 'bg-green-500' },
                          orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', progress: 'bg-orange-500' },
                          pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', progress: 'bg-pink-500' },
                          red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', progress: 'bg-red-500' },
                          teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', progress: 'bg-teal-500' },
                          amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', progress: 'bg-amber-500' },
                        };
                        const colors = colorMap[subject.color] || colorMap.blue;

                        return (
                          <div key={key} className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
                            <div
                              className="p-4 flex items-center justify-between cursor-pointer hover:opacity-80"
                              onClick={() => toggleSubjectExpand(key)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center ${colors.text}`}>
                                  <BookOpen size={20} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                                  <p className="text-xs text-gray-500">
                                    {subject.completed_count} / {subject.total_count} konu
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold ${colors.text}`}>%{subject.progress}</span>
                                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                              </div>
                            </div>

                            <div className="px-4 pb-3">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors.progress} rounded-full transition-all`} style={{ width: `${subject.progress}%` }} />
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t border-gray-200 bg-white p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {subject.subtopics?.map((topic) => (
                                    <div
                                      key={topic.id}
                                      className={`flex items-center gap-2 p-2.5 rounded-lg ${
                                        topic.is_completed
                                          ? 'bg-green-50 border border-green-200'
                                          : 'bg-gray-50 border border-gray-200'
                                      }`}
                                    >
                                      {topic.is_completed ? (
                                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                                      ) : (
                                        <Circle size={18} className="text-gray-300 flex-shrink-0" />
                                      )}
                                      <span className={`text-sm ${topic.is_completed ? 'text-green-700' : 'text-gray-600'}`}>
                                        {topic.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {Object.keys((topicsTab === 'TYT' ? topicsData.tyt?.topics : topicsData.ayt?.topics) || {}).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
                        <p>{topicsTab} konuları bulunamadı</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== PROGRAM ===== */}
            {activeTab === 'schedule' && (
              <div>
                {scheduleLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : studentSchedule.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Bu öğrenci için henüz program oluşturulmamış</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => {
                      const dayPlans = studentSchedule.filter(p => p.day === day).sort((a, b) =>
                        (a.start_time || '').localeCompare(b.start_time || '')
                      );
                      if (dayPlans.length === 0) return null;

                      return (
                        <div key={day} className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-700 mb-3">{day}</h4>
                          <div className="space-y-2">
                            {dayPlans.map(plan => (
                              <div
                                key={plan.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 bg-white
                                  ${plan.category === 'AYT' ? 'border-l-purple-500' : 'border-l-blue-500'}`}
                              >
                                <div className="text-sm text-gray-500 font-medium min-w-[90px]">
                                  {plan.start_time?.slice(0,5)} - {plan.end_time?.slice(0,5)}
                                </div>
                                <div className="flex-1">
                                  <span className={`text-sm font-semibold ${plan.category === 'AYT' ? 'text-purple-700' : 'text-blue-700'}`}>
                                    {plan.category} {plan.subject}
                                  </span>
                                  {plan.activity_type && (
                                    <span className="text-xs text-gray-400 ml-2">{plan.activity_type}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Koç Notu Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Veliye Not Yaz</h3>
              <button onClick={() => setShowNoteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-3">
                Bu not <strong>{student.name}</strong> öğrencisinin velisi tarafından görülebilir.
                Haftalık kısa bir değerlendirme yazın.
              </p>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Örn: Bu hafta motivasyon dalgalıydı ama tekrar disiplini toparlandı..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {noteContent.length}/500 karakter
              </p>
            </div>

            {coachNotes.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Son not ({coachNotes[0]?.week_start}):</p>
                <p className="text-sm text-gray-600 italic">"{coachNotes[0]?.content}"</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSaveNote}
                disabled={savingNote || !noteContent.trim()}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingNote ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Kaydet
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-amber-600 mt-4 text-center">
              Not bu haftaya kaydedilir ve veliye görünür olur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
