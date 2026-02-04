import { useEffect, useState } from "react";
import API from "../api";
import {
  BookOpen, Calculator, FlaskConical, Globe, Brain, History,
  Check, ChevronDown, ChevronUp, Target, Trophy, Zap,
  CheckCircle2, Circle, Loader2
} from "lucide-react";

// İkon eşleştirme
const ICONS = {
  BookOpen, Calculator, FlaskConical, Globe, Brain, History,
};

// Renk sınıfları
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

// Progress Bar Component
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

// Subject Card Component
function SubjectCard({ subjectKey, data, onToggle, loadingTopics }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICONS[data.icon] || BookOpen;
  const colors = COLOR_CLASSES[data.color] || COLOR_CLASSES.gray;

  const handleTopicToggle = async (topicId) => {
    await onToggle(topicId, subjectKey);
  };

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:opacity-80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center`}>
            <Icon className={colors.text} size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{data.name}</h3>
            <p className="text-sm text-gray-500">
              {data.completed_count} / {data.total_count} konu tamamlandı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-2xl font-bold ${colors.text}`}>%{data.progress}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="text-gray-400" size={24} />
          ) : (
            <ChevronDown className="text-gray-400" size={24} />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-2">
        <ProgressBar progress={data.progress} color={data.color} />
      </div>

      {/* Subtopics */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-white">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.subtopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicToggle(topic.id)}
                disabled={loadingTopics.has(topic.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left
                  ${topic.is_completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }
                  ${loadingTopics.has(topic.id) ? 'opacity-50' : ''}
                `}
              >
                {loadingTopics.has(topic.id) ? (
                  <Loader2 size={20} className="text-gray-400 animate-spin" />
                ) : topic.is_completed ? (
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={20} className="text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${topic.is_completed ? 'text-green-700' : 'text-gray-700'}`}>
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

export default function TopicTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(new Set());
  const [activeTab, setActiveTab] = useState('TYT');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await API.get("/api/topics/");
      setData(res.data);
    } catch (err) {
      console.error("Konular yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (topicId, subjectKey) => {
    setLoadingTopics(prev => new Set([...prev, topicId]));

    try {
      await API.post("/api/topics/toggle/", {
        topic_id: topicId,
        subject_key: subjectKey,
        exam_type: activeTab,
      });

      // Veriyi yenile
      await fetchTopics();
    } catch (err) {
      console.error("Konu güncellenemedi:", err);
    } finally {
      setLoadingTopics(prev => {
        const next = new Set(prev);
        next.delete(topicId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Konular yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Konu verileri yüklenemedi.</p>
      </div>
    );
  }

  const currentTopics = activeTab === 'TYT' ? data.tyt : data.ayt;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Konu Takibi</h1>
            <p className="text-gray-500 text-sm mt-1">
              Tamamladığın konuları işaretle, ilerlemenizi takip et
            </p>
          </div>

          {/* Genel İlerleme */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-lg">
            <Trophy size={28} />
            <div>
              <p className="text-sm opacity-80">Genel İlerleme</p>
              <p className="text-2xl font-bold">%{data.overall.progress}</p>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('TYT')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all
              ${activeTab === 'TYT'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Target size={18} />
            TYT
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'TYT' ? 'bg-blue-400' : 'bg-gray-200'}`}>
              %{data.tyt.progress}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('AYT')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all
              ${activeTab === 'AYT'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Zap size={18} />
            AYT ({data.field_type})
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'AYT' ? 'bg-purple-400' : 'bg-gray-200'}`}>
              %{data.ayt.progress}
            </span>
          </button>
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <BookOpen size={16} />
              Toplam Konu
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentTopics.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-green-500 text-sm mb-1">
              <CheckCircle2 size={16} />
              Tamamlanan
            </div>
            <p className="text-2xl font-bold text-green-600">{currentTopics.completed}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-orange-500 text-sm mb-1">
              <Circle size={16} />
              Kalan
            </div>
            <p className="text-2xl font-bold text-orange-600">{currentTopics.total - currentTopics.completed}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-indigo-500 text-sm mb-1">
              <Trophy size={16} />
              İlerleme
            </div>
            <p className="text-2xl font-bold text-indigo-600">%{currentTopics.progress}</p>
          </div>
        </div>

        {/* Subjects */}
        <div className="space-y-4">
          {Object.entries(currentTopics.topics).map(([key, subjectData]) => (
            <SubjectCard
              key={key}
              subjectKey={key}
              data={subjectData}
              onToggle={handleToggle}
              loadingTopics={loadingTopics}
            />
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(currentTopics.topics).length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === 'AYT' ? 'AYT konuları bulunamadı' : 'Konu bulunamadı'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'AYT'
                ? `${data.field_type} alanı için AYT konuları yüklenemedi.`
                : 'Konular yüklenirken bir hata oluştu.'
              }
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
