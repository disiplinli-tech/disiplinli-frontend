import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  ArrowLeft, Mail, Target, TrendingUp, TrendingDown, Minus,
  Calendar, Award, BarChart3, Trophy, MessageCircle, Plus, X, Save,
  BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Flame, Clock, AlertTriangle, HelpCircle, FileQuestion
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

  // Haftalık hedef state'leri
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Konu takip state'leri
  const [topicsData, setTopicsData] = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsTab, setTopicsTab] = useState('TYT');
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [goalForm, setGoalForm] = useState({
    goal_type: 'DENEME_TYT',
    target_value: '',
    note: ''
  });
  const [savingGoal, setSavingGoal] = useState(false);

  // Schedule state
  const [studentSchedule, setStudentSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Subject results state (branş detayları)
  const [subjectResults, setSubjectResults] = useState([]);
  const [expandedExamId, setExpandedExamId] = useState(null);

  // Odak Alanları ve Soru Aktivitesi (Koç görünümü)
  const [focusAreas, setFocusAreas] = useState([]);
  const [focusLoading, setFocusLoading] = useState(false);
  const [questionActivity, setQuestionActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchGoals();
    fetchTopics();
    fetchSchedule();
    fetchSubjectResults();
    fetchFocusAreas();
    fetchQuestionActivity();
  }, [id]);

  const fetchData = async () => {
    try {
      const studentRes = await API.get(`/api/student/${id}/`);
      setStudent(studentRes.data);

      // Exams varsa al
      if (studentRes.data.exams) {
        setExams(studentRes.data.exams);
      } else {
        try {
          const examsRes = await API.get(`/api/student/${id}/exams/`);
          setExams(examsRes.data || []);
        } catch (e) {
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await API.get(`/api/goals/?student_id=${id}`);
      setWeeklyGoals(res.data.goals || []);
    } catch (err) {
      console.log('Hedefler yüklenemedi');
    }
  };

  const fetchTopics = async () => {
    setTopicsLoading(true);
    try {
      const res = await API.get(`/api/topics/?student_id=${id}`);
      setTopicsData(res.data);
    } catch (err) {
      console.log('Konu verileri yüklenemedi');
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
      console.log('Program yüklenemedi');
    } finally {
      setScheduleLoading(false);
    }
  };

  const fetchSubjectResults = async () => {
    try {
      const res = await API.get(`/api/subject-results/?student_id=${id}`);
      setSubjectResults(res.data || []);
    } catch (err) {
      console.log('Branş sonuçları yüklenemedi');
    }
  };

  const fetchFocusAreas = async () => {
    setFocusLoading(true);
    try {
      const res = await API.get(`/api/coach/student/${id}/focus-areas/`);
      setFocusAreas(res.data.focus_areas || []);
    } catch (err) {
      console.error('Odak alanları yüklenemedi:', err.response?.data || err.message);
    } finally {
      setFocusLoading(false);
    }
  };

  const fetchQuestionActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await API.get(`/api/coach/student/${id}/question-activity/`);
      setQuestionActivity(res.data);
    } catch (err) {
      console.error('Soru aktivitesi yüklenemedi:', err.response?.data || err.message);
    } finally {
      setActivityLoading(false);
    }
  };

  // Bir denemenin branş sonuçlarını getir (tarihe göre)
  const getExamSubjectResults = (examDate) => {
    return subjectResults.filter(r => r.date === examDate);
  };

  const toggleSubjectExpand = (key) => {
    setExpandedSubjects(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateGoal = async () => {
    if (!goalForm.target_value) {
      alert('Hedef değeri giriniz');
      return;
    }

    setSavingGoal(true);
    try {
      await API.post('/api/goals/create/', {
        student_id: id,
        goal_type: goalForm.goal_type,
        target_value: parseInt(goalForm.target_value),
        note: goalForm.note
      });
      setShowGoalModal(false);
      setGoalForm({ goal_type: 'DENEME_TYT', target_value: '', note: '' });
      fetchGoals();
    } catch (err) {
      alert('Hedef oluşturulamadı: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingGoal(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Bu hedefi silmek istediğinize emin misiniz?')) return;

    try {
      await API.delete(`/api/goals/${goalId}/delete/`);
      fetchGoals();
    } catch (err) {
      alert('Hedef silinemedi');
    }
  };

  // Sıralamalar - backend'den gelen estimated_ranking kullanılıyor
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
          ranking: latest.estimated_ranking,  // Backend'den geliyor
          change: previous ? latest.net_score - previous.net_score : null,
          date: latest.date
        };
      }
    });

    return rankings;
  };

  // Grafik verisi - backend'den gelen estimated_ranking kullanılıyor
  const getTYTChartData = () => {
    return exams
      .filter(e => e.exam_type === 'TYT')
      .slice(0, 10)
      .reverse()
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        net: e.net_score,
        ranking: e.estimated_ranking  // Backend'den geliyor
      }));
  };

  const rankings = getLatestRankings();
  const tytChartData = getTYTChartData();

  // İstatistikler
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
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Öğrenci bulunamadı</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">
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
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 md:px-6 py-4 md:py-5">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl md:text-2xl font-bold flex-shrink-0">
                {student.name?.charAt(0).toUpperCase() || 'Ö'}
              </div>
              <div className="text-white min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold truncate">{student.name}</h1>
                <p className="text-indigo-100 flex items-center gap-1.5 mt-0.5 md:mt-1 text-xs md:text-sm truncate">
                  <Mail size={12} className="flex-shrink-0" />
                  <span className="truncate">{student.email}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Sıralama Kartları - ORTALAMAYA GÖRE */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* TYT Sıralama (Ortalamaya göre) */}
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

            {/* AYT Sıralama (Ortalamaya göre) */}
            <div className="bg-purple-50 rounded-xl p-4">
              <span className="text-sm font-medium text-purple-600">AYT Sıralama</span>
              <p className="text-2xl font-bold text-purple-700 mt-2">
                {student.ayt_avg_ranking ? formatRanking(student.ayt_avg_ranking) : '-'}
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {student.ayt_avg_net ? `${student.ayt_avg_net} net` : 'Henüz deneme yok'}
              </p>
            </div>

            {/* Ort. TYT Net */}
            <div className="bg-green-50 rounded-xl p-4">
              <span className="text-sm font-medium text-green-600">Ort. TYT</span>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {student.tyt_avg_net || getStats('TYT')?.avg || '-'}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {getStats('TYT')?.count || 0} deneme
              </p>
            </div>

            {/* Ort. AYT Net */}
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
                { key: 'focus', label: 'Odak', icon: Target },
                { key: 'questions', label: 'Sorular', icon: FileQuestion },
                { key: 'exams', label: 'Deneme', icon: Award },
                { key: 'topics', label: 'Konular', icon: BookOpen },
                { key: 'goals', label: 'Hedef', icon: Trophy },
                { key: 'schedule', label: 'Program', icon: Calendar },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 md:px-6 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.key
                      ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50'
                      : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview */}
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

            {/* Focus Areas - Odak Alanları (Koç görünümü) */}
            {activeTab === 'focus' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Öğrencinin Odak Alanları</h3>
                    <p className="text-sm text-gray-500">Öğrencinin belirlediği öncelikli konular</p>
                  </div>
                </div>

                {focusLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : focusAreas.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Henüz odak alanı belirlenmemiş</p>
                    <p className="text-sm mt-2">Öğrenci kendi panelinden ekleyebilir</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {focusAreas.map((area, idx) => {
                      const priorityColors = {
                        1: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
                        2: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
                        3: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
                      };
                      const statusLabels = {
                        active: { label: 'Aktif', icon: Clock, color: 'text-blue-600 bg-blue-50' },
                        working: { label: 'Yoğun çalışılıyor', icon: Flame, color: 'text-orange-600 bg-orange-50' },
                      };
                      const colors = priorityColors[area.priority] || priorityColors[2];
                      const status = statusLabels[area.status] || statusLabels.active;
                      const StatusIcon = status.icon;

                      return (
                        <div key={area.id} className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4`}>
                          <div className="flex items-start gap-4">
                            {/* Numara */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                              {idx + 1}
                            </div>

                            {/* İçerik */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-gray-800">{area.subject}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-700">{area.topic}</span>
                              </div>

                              {area.reason && (
                                <p className="text-sm text-gray-500 mb-2 italic">"{area.reason}"</p>
                              )}

                              {/* Etiketler */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Durum */}
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                  <StatusIcon size={12} />
                                  {status.label}
                                </span>

                                {/* Süre */}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  <Clock size={12} />
                                  {area.days_in_focus} gündür odakta
                                </span>

                                {/* Kırmızı Bayrak */}
                                {area.is_stale && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                    <AlertTriangle size={12} />
                                    7+ gün değişiklik yok
                                  </span>
                                )}

                                {/* İlişkili Sorular */}
                                {area.related_questions > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    <FileQuestion size={12} />
                                    {area.unsolved_questions}/{area.related_questions} soru
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Öncelik Badge */}
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colors.badge}`}>
                              {area.priority === 1 ? 'Yüksek' : area.priority === 2 ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Koç Notu */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Koç olarak:</strong> Odak alanlarını sadece görebilirsin. Öğrenci bunları kendi belirler.
                    Ders sırasında bu konulara odaklanarak yardımcı olabilirsin.
                  </p>
                </div>
              </div>
            )}

            {/* Question Activity - Soru Aktivitesi (Koç görünümü) */}
            {activeTab === 'questions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Soru Aktivitesi</h3>
                    <p className="text-sm text-gray-500">Öğrencinin soru çarkı kullanımı</p>
                  </div>
                </div>

                {activityLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : !questionActivity ? (
                  <div className="text-center py-12 text-gray-400">
                    <FileQuestion size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Soru aktivitesi yüklenemedi</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Metrikler */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Toplam Yüklenen</p>
                        <p className="text-2xl font-bold text-gray-800">{questionActivity.metrics?.total_uploaded || 0}</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4">
                        <p className="text-xs text-orange-600 mb-1">Bekleyen</p>
                        <p className="text-2xl font-bold text-orange-700">{questionActivity.metrics?.total_pending || 0}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-green-600 mb-1">Çözülen</p>
                        <p className="text-2xl font-bold text-green-700">{questionActivity.metrics?.total_solved || 0}</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-xs text-red-600 mb-1">Çözemedi</p>
                        <p className="text-2xl font-bold text-red-700">{questionActivity.metrics?.total_failed || 0}</p>
                      </div>
                    </div>

                    {/* Son 7 Gün */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-indigo-800 mb-2">Son 7 Gün</h4>
                      <p className="text-gray-700">
                        <strong>{questionActivity.metrics?.recent_uploaded_7d || 0}</strong> soru yükledi,
                        <strong className="text-orange-600 ml-1">{questionActivity.metrics?.recent_pending_7d || 0}</strong>'i hâlâ bekliyor
                      </p>
                    </div>

                    {/* Kırmızı Bayraklar */}
                    {questionActivity.has_red_flags && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <AlertTriangle className="text-red-500" size={16} />
                          Dikkat Gerektiren Durumlar
                        </h4>
                        {questionActivity.red_flags?.map((flag, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border-l-4 ${
                              flag.severity === 'high'
                                ? 'bg-red-50 border-red-500 text-red-800'
                                : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                            }`}
                          >
                            <p className="text-sm font-medium">{flag.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Branş Dağılımı */}
                    {questionActivity.subject_breakdown?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Çözülmemiş Sorular (Branşa Göre)</h4>
                        <div className="flex flex-wrap gap-2">
                          {questionActivity.subject_breakdown.map((item, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                item.count >= 5
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {item.subject || 'Belirtilmemiş'}: {item.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Boş Durum */}
                    {questionActivity.metrics?.total_uploaded === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <HelpCircle size={40} className="mx-auto mb-3 opacity-50" />
                        <p>Henüz soru yüklememiş</p>
                        <p className="text-sm mt-1">Öğrenci "Soru Çarkı" özelliğini kullanmaya başladığında burada göreceksin</p>
                      </div>
                    )}

                    {/* Koç Notu */}
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <p className="text-sm text-purple-800">
                        💡 <strong>Koç olarak:</strong> Öğrencinin fotoğraflarını göremezsin (gizlilik).
                        Sadece desenleri ve takıldığı konuları görürsün. Derste bu konulara odaklanabilirsin.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Exams */}
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
                      const examSubjects = getExamSubjectResults(exam.date);
                      const color = typeColors[exam.exam_type] || 'gray';

                      return (
                        <div key={exam.id || idx} className={`bg-${color}-50 rounded-xl border border-${color}-100 overflow-hidden`}>
                          {/* Deneme Header - Tıklanabilir */}
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
                                  <p className="text-sm text-indigo-600 font-medium">~{formatRanking(exam.estimated_ranking)}</p>
                                </div>
                                {isExpanded ? (
                                  <ChevronUp size={20} className="text-gray-400" />
                                ) : (
                                  <ChevronDown size={20} className="text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Branş Detayları - Expandable */}
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

            {/* Topics - Konu Takibi */}
            {activeTab === 'topics' && (
              <div>
                {topicsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
                      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-lg">
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
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <p className="text-xs text-indigo-600 mb-1">İlerleme</p>
                        <p className="text-xl font-bold text-indigo-700">
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
                            {/* Ders Header */}
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

                            {/* Progress Bar */}
                            <div className="px-4 pb-3">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors.progress} rounded-full transition-all`} style={{ width: `${subject.progress}%` }} />
                              </div>
                            </div>

                            {/* Konular */}
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

                    {/* Boş durum */}
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

            {/* Goals - Haftalık Hedefler */}
            {activeTab === 'goals' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Bu Hafta Hedefler</h3>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={18} />
                    Hedef Ekle
                  </button>
                </div>

                {weeklyGoals.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Bu hafta için hedef belirlenmemiş</p>
                    <button
                      onClick={() => setShowGoalModal(true)}
                      className="mt-4 text-indigo-600 hover:underline font-medium"
                    >
                      İlk hedefi oluştur →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {weeklyGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`bg-gray-50 rounded-xl p-4 border-l-4 ${goal.is_completed ? 'border-green-500' : 'border-indigo-500'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-800">{goal.goal_type_display}</span>
                              {goal.is_completed && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Tamamlandı ✓</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span>Hedef: <strong>{goal.target_value}</strong></span>
                              <span>Mevcut: <strong className={goal.is_completed ? 'text-green-600' : 'text-indigo-600'}>{goal.current_value}</strong></span>
                            </div>
                            {goal.note && (
                              <p className="text-sm text-gray-500 italic">📝 {goal.note}</p>
                            )}
                            {/* Progress bar */}
                            <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${goal.is_completed ? 'bg-green-500' : 'bg-indigo-500'}`}
                                style={{ width: `${goal.progress_percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{goal.progress_percentage}% tamamlandı</p>
                          </div>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Schedule */}
            {activeTab === 'schedule' && (
              <div>
                {scheduleLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
                                    <span className="text-xs text-gray-400 ml-2">• {plan.activity_type}</span>
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

      {/* Hedef Oluşturma Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">🎯 Haftalık Hedef Oluştur</h3>
              <button onClick={() => setShowGoalModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Tipi
                </label>
                <select
                  value={goalForm.goal_type}
                  onChange={(e) => setGoalForm({ ...goalForm, goal_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="DENEME_TYT">TYT Denemesi</option>
                  <option value="DENEME_AYT">AYT Denemesi</option>
                  <option value="SORU">Soru Çözümü</option>
                  <option value="KONU">Konu Tamamlama</option>
                  <option value="CALISMA">Çalışma Süresi (dk)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Değer
                </label>
                <input
                  type="number"
                  value={goalForm.target_value}
                  onChange={(e) => setGoalForm({ ...goalForm, target_value: e.target.value })}
                  placeholder={goalForm.goal_type === 'CALISMA' ? 'Örn: 300 (dakika)' : goalForm.goal_type === 'SORU' ? 'Örn: 500' : 'Örn: 3'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Not (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={goalForm.note}
                  onChange={(e) => setGoalForm({ ...goalForm, note: e.target.value })}
                  placeholder="Örn: Her gün 1 deneme çöz"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={savingGoal}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingGoal ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Oluştur
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}