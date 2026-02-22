import { useEffect, useState } from 'react';
import {
  Flame, TrendingUp, Clock, AlertCircle,
  BookOpen, Calculator, FlaskConical, Globe, Brain, History,
  Check, ChevronDown, ChevronUp, Target, Trophy, Zap,
  CheckCircle2, Circle, Loader2, BarChart3, ListChecks
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import API from '../api';

/* ─── Sabitler ─── */
const DIFFICULTY_LABELS = {
  odak: 'Odak sorunu',
  stres: 'Stres',
  konu: 'Konu zorluğu',
  erteleme: 'Erteleme',
  baska: 'Başka',
};

const DIFFICULTY_COLORS = {
  odak: { bg: 'bg-blue-100', text: 'text-blue-700', bar: '#3B82F6' },
  stres: { bg: 'bg-red-100', text: 'text-red-700', bar: '#EF4444' },
  konu: { bg: 'bg-purple-100', text: 'text-purple-700', bar: '#8B5CF6' },
  erteleme: { bg: 'bg-amber-100', text: 'text-amber-700', bar: '#F59E0B' },
  baska: { bg: 'bg-gray-100', text: 'text-gray-700', bar: '#6B7280' },
};

const ICONS = { BookOpen, Calculator, FlaskConical, Globe, Brain, History };

const COLOR_CLASSES = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', progress: 'bg-blue-500', light: 'bg-blue-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', progress: 'bg-purple-500', light: 'bg-purple-100' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', progress: 'bg-green-500', light: 'bg-green-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', progress: 'bg-orange-500', light: 'bg-orange-100' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', progress: 'bg-pink-500', light: 'bg-pink-100' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', progress: 'bg-red-500', light: 'bg-red-100' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', progress: 'bg-teal-500', light: 'bg-teal-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', progress: 'bg-amber-500', light: 'bg-amber-100' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', progress: 'bg-gray-500', light: 'bg-gray-100' },
};

/* ─── Alt Bileşenler ─── */

function ProgressBar({ progress, color = 'blue', size = 'md' }) {
  const colors = COLOR_CLASSES[color] || COLOR_CLASSES.blue;
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  return (
    <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${colors.progress} rounded-full transition-all duration-500`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function SubjectCard({ subjectKey, data, onToggle, loadingTopics }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICONS[data.icon] || BookOpen;
  const colors = COLOR_CLASSES[data.color] || COLOR_CLASSES.gray;

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300`}>
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:opacity-80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${colors.light} flex items-center justify-center`}>
            <Icon className={colors.text} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{data.name}</h3>
            <p className="text-xs text-gray-500">
              {data.completed_count} / {data.total_count} konu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-lg font-bold ${colors.text}`}>%{data.progress}</span>
          {isExpanded
            ? <ChevronUp className="text-gray-400" size={20} />
            : <ChevronDown className="text-gray-400" size={20} />
          }
        </div>
      </div>

      <div className="px-4 pb-2">
        <ProgressBar progress={data.progress} color={data.color} size="sm" />
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-white">
          <div className="p-3 grid grid-cols-1 gap-1.5">
            {data.subtopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onToggle(topic.id, subjectKey)}
                disabled={loadingTopics.has(topic.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all text-left
                  ${topic.is_completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }
                  ${loadingTopics.has(topic.id) ? 'opacity-50' : ''}
                `}
              >
                {loadingTopics.has(topic.id) ? (
                  <Loader2 size={18} className="text-gray-400 animate-spin flex-shrink-0" />
                ) : topic.is_completed ? (
                  <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${topic.is_completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                  {topic.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── İstatistikler Tab İçeriği ─── */

function StatsTab({ data }) {
  const complianceChart = (data.compliance_chart || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  }));

  const durationChart = (data.duration_chart || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  }));

  const deviationCauses = Object.entries(data.deviation_causes || {})
    .sort(([, a], [, b]) => b - a);
  const totalDeviations = deviationCauses.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="space-y-5">
      {/* Streak Kartı */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame size={28} />
            <div>
              <p className="text-2xl font-bold">{data.streak?.current || 0} gün</p>
              <p className="text-sm opacity-80">Mevcut seri</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{data.streak?.longest || 0}</p>
            <p className="text-sm opacity-80">En uzun seri</p>
          </div>
        </div>
      </div>

      {/* Plan Uyum Grafiği */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-primary-500" />
          <h2 className="font-semibold text-gray-800 text-sm">Plan Uyum %</h2>
          <span className="text-xs text-gray-400 ml-auto">Son 14 gün</span>
        </div>
        {complianceChart.some((d) => d.has_data) ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={complianceChart}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`%${v}`, 'Uyum']}
              />
              <Area type="monotone" dataKey="pct" stroke="#f97316" strokeWidth={2.5} fill="url(#compGrad)" dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Henüz check-in verisi yok</p>
              <p className="text-xs text-gray-400 mt-1">Günlük check-in yaparak ilerleme kaydedebilirsin.</p>
            </div>
          </div>
        )}
      </div>

      {/* Çalışma Süresi */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-purple-500" />
          <h2 className="font-semibold text-gray-800 text-sm">Çalışma Süresi</h2>
          <span className="text-xs text-gray-400 ml-auto">Son 14 gün (dk)</span>
        </div>
        {durationChart.some((d) => d.minutes > 0) ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={durationChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`${v} dk`, 'Süre']}
              />
              <Bar dataKey="minutes" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Clock size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Henüz tamamlanmış görev yok</p>
            </div>
          </div>
        )}
      </div>

      {/* Sapma Nedenleri */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={18} className="text-amber-500" />
          <h2 className="font-semibold text-gray-800 text-sm">Sapma Nedenleri</h2>
          <span className="text-xs text-gray-400 ml-auto">Son 30 gün</span>
        </div>
        {deviationCauses.length > 0 ? (
          <div className="space-y-3">
            {deviationCauses.map(([tag, count]) => {
              const colors = DIFFICULTY_COLORS[tag] || DIFFICULTY_COLORS.baska;
              const pct = totalDeviations > 0 ? Math.round((count / totalDeviations) * 100) : 0;
              return (
                <div key={tag} className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${colors.bg} ${colors.text} min-w-[90px] text-center`}>
                    {DIFFICULTY_LABELS[tag] || tag}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: colors.bar }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 min-w-[36px] text-right">%{pct}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-6">Henüz check-in verisi yok.</p>
        )}
      </div>
    </div>
  );
}

/* ─── Konu Takibi Tab İçeriği ─── */

function TopicsTab({ topicData, loadingTopics, onToggle }) {
  const [examTab, setExamTab] = useState('TYT');
  const currentTopics = examTab === 'TYT' ? topicData.tyt : topicData.ayt;

  return (
    <div className="space-y-4">
      {/* Genel İlerleme */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={24} />
            <div>
              <p className="text-sm opacity-80">Genel İlerleme</p>
              <p className="text-2xl font-bold">%{topicData.overall.progress}</p>
            </div>
          </div>
          <div className="text-right text-sm opacity-80">
            <p>{topicData.overall.completed} / {topicData.overall.total}</p>
            <p>konu tamamlandı</p>
          </div>
        </div>
      </div>

      {/* TYT / AYT Tab */}
      <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100">
        <button
          onClick={() => setExamTab('TYT')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all
            ${examTab === 'TYT'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Target size={16} />
          TYT
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${examTab === 'TYT' ? 'bg-orange-400' : 'bg-gray-200'}`}>
            %{topicData.tyt.progress}
          </span>
        </button>
        <button
          onClick={() => setExamTab('AYT')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all
            ${examTab === 'AYT'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Zap size={16} />
          AYT ({topicData.field_type})
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${examTab === 'AYT' ? 'bg-orange-400' : 'bg-gray-200'}`}>
            %{topicData.ayt.progress}
          </span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-xs text-gray-500">Toplam</p>
          <p className="text-xl font-bold text-gray-800">{currentTopics.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
          <p className="text-xs text-green-600">Bitti</p>
          <p className="text-xl font-bold text-green-600">{currentTopics.completed}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 text-center">
          <p className="text-xs text-orange-600">Kalan</p>
          <p className="text-xl font-bold text-orange-600">{currentTopics.total - currentTopics.completed}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
          <p className="text-xs text-amber-700">Oran</p>
          <p className="text-xl font-bold text-amber-700">%{currentTopics.progress}</p>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="space-y-3">
        {Object.entries(currentTopics.topics).map(([key, subjectData]) => (
          <SubjectCard
            key={key}
            subjectKey={key}
            data={subjectData}
            onToggle={(topicId, sk) => onToggle(topicId, sk, examTab)}
            loadingTopics={loadingTopics}
          />
        ))}
      </div>

      {Object.keys(currentTopics.topics).length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            {examTab === 'AYT' ? `${topicData.field_type} alanı için AYT konuları bulunamadı.` : 'Konu bulunamadı.'}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Ana Bileşen ─── */

export default function StudentProgress() {
  const [tab, setTab] = useState('stats');

  // İstatistik verileri
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Konu takibi verileri
  const [topicData, setTopicData] = useState(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(new Set());

  useEffect(() => {
    fetchStats();
    fetchTopics();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/student/progress/');
      setStatsData(res.data);
    } catch (err) {
      console.error('İlerleme verisi yüklenemedi:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await API.get('/api/topics/');
      setTopicData(res.data);
    } catch (err) {
      console.error('Konular yüklenemedi:', err);
    } finally {
      setTopicLoading(false);
    }
  };

  const handleToggle = async (topicId, subjectKey, examType) => {
    setLoadingTopics(prev => new Set([...prev, topicId]));
    try {
      await API.post('/api/topics/toggle/', {
        topic_id: topicId,
        subject_key: subjectKey,
        exam_type: examType,
      });
      await fetchTopics();
    } catch (err) {
      console.error('Konu güncellenemedi:', err);
    } finally {
      setLoadingTopics(prev => {
        const next = new Set(prev);
        next.delete(topicId);
        return next;
      });
    }
  };

  const isLoading = tab === 'stats' ? statsLoading : topicLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">İlerlemem</h1>

        {/* Tab Buttons */}
        <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
              ${tab === 'stats'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <BarChart3 size={16} />
            İstatistikler
          </button>
          <button
            onClick={() => setTab('topics')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
              ${tab === 'topics'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <ListChecks size={16} />
            Konu Takibi
          </button>
        </div>

        {/* Tab İçerikleri */}
        {tab === 'stats' && statsData && (
          <StatsTab data={statsData} />
        )}

        {tab === 'stats' && !statsData && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Veri yüklenemedi.</p>
          </div>
        )}

        {tab === 'topics' && topicData && (
          <TopicsTab
            topicData={topicData}
            loadingTopics={loadingTopics}
            onToggle={handleToggle}
          />
        )}

        {tab === 'topics' && !topicData && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Konu verileri yüklenemedi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
