import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle, Plus, Filter, CheckCircle2, Clock, AlertCircle,
  FileText, ClipboardList, BookOpen, Library, Image as ImageIcon
} from 'lucide-react';
import API from '../api';

const SOURCE_LABELS = {
  exam: { label: 'Deneme', color: 'bg-blue-100 text-blue-700' },
  homework: { label: 'Ödev', color: 'bg-green-100 text-green-700' },
  lesson: { label: 'Ders', color: 'bg-purple-100 text-purple-700' },
  book: { label: 'Kitap', color: 'bg-amber-100 text-amber-700' },
};

const STATUS_CONFIG = {
  open: { label: 'Çözülmedi', color: 'bg-red-50 text-red-600 border-red-200', icon: AlertCircle },
  solved: { label: 'Çözüldü', color: 'bg-green-50 text-green-600 border-green-200', icon: CheckCircle2 },
};

const SUBJECTS = [
  'Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji',
  'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü',
  'Edebiyat', 'Geometri', 'Paragraf', 'Diğer'
];

export default function StuckQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, solved: 0 });
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      if (filterSubject) params.append('subject', filterSubject);
      if (filterStatus) params.append('status', filterStatus);
      if (filterSource) params.append('source_type', filterSource);
      const res = await API.get(`/api/stuck/?${params.toString()}`);
      setQuestions(res.data.stuck_questions || []);
      setStats(res.data.stats || { total: 0, open: 0, solved: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterSubject, filterStatus, filterSource]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <HelpCircle size={22} className="text-orange-500" />
            Takıldıklarım
          </h1>
          <p className="text-gray-500 text-xs mt-1">Çözemediğin soruları kaydet, takip et</p>
        </div>
        <button
          onClick={() => navigate('/stuck/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          <Plus size={18} />
          Soru Ekle
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Toplam</p>
        </div>
        <div className="bg-white rounded-xl border border-red-100 p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.open}</p>
          <p className="text-xs text-gray-500">Açık</p>
        </div>
        <div className="bg-white rounded-xl border border-green-100 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.solved}</p>
          <p className="text-xs text-gray-500">Çözüldü</p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {/* Status filtre */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-600 min-w-fit"
        >
          <option value="">Tüm Durum</option>
          <option value="open">Çözülmedi</option>
          <option value="solved">Çözüldü</option>
        </select>

        {/* Branş filtre */}
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-600 min-w-fit"
        >
          <option value="">Tüm Branşlar</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Kaynak filtre */}
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-600 min-w-fit"
        >
          <option value="">Tüm Kaynaklar</option>
          <option value="exam">Deneme</option>
          <option value="homework">Ödev</option>
          <option value="lesson">Ders</option>
          <option value="book">Kitap</option>
        </select>
      </div>

      {/* Boş state */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <HelpCircle size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Henüz soru yok</h3>
          <p className="text-sm text-gray-500 mb-4">
            Çözemediğin soruları fotoğrafla ve buraya ekle
          </p>
          <button
            onClick={() => navigate('/stuck/new')}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            İlk Sorunu Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {questions.map(q => {
            const src = SOURCE_LABELS[q.source_type] || { label: q.source_type, color: 'bg-gray-100 text-gray-600' };
            const st = STATUS_CONFIG[q.status] || STATUS_CONFIG.open;
            const StatusIcon = st.icon;
            const thumb = q.images?.[0]?.url;

            return (
              <div
                key={q.id}
                onClick={() => navigate(`/stuck/${q.id}`)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-orange-100 text-orange-700">
                        {q.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${src.color}`}>
                        {src.label}
                      </span>
                    </div>

                    {q.topic && q.topic !== 'Emin degilim' && (
                      <p className="text-sm text-gray-700 font-medium truncate">{q.topic}</p>
                    )}
                    {q.exam_name && (
                      <p className="text-xs text-gray-500 truncate">{q.exam_name}</p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${st.color}`}>
                        <StatusIcon size={12} />
                        {st.label}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(q.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
