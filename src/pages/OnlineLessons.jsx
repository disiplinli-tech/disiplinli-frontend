import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import {
  Video, Plus, Calendar, Clock, User, ExternalLink, Check, X,
  ChevronRight, Edit2, Trash2, AlertCircle, Filter
} from 'lucide-react';

export default function OnlineLessons() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: 60,
    meeting_url: ''
  });

  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isCoach = role === 'coach';

  useEffect(() => {
    fetchLessons();
    if (isCoach) {
      fetchStudents();
    }
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await API.get('/api/lessons/');
      setLessons(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get('/api/coach/students/');
      setStudents(res.data);
    } catch (err) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student_id || !formData.title || !formData.scheduled_at) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    try {
      if (editingLesson) {
        await API.put(`/api/lessons/${editingLesson.id}/update/`, formData);
      } else {
        await API.post('/api/lessons/create/', formData);
      }

      setShowModal(false);
      setEditingLesson(null);
      setFormData({
        student_id: '',
        title: '',
        description: '',
        scheduled_at: '',
        duration_minutes: 60,
        meeting_url: ''
      });
      fetchLessons();
    } catch (err) {
      alert(err.response?.data?.error || 'Ders kaydedilemedi');
    }
  };

  const handleComplete = async (lessonId) => {
    const notes = prompt('Ders notları (opsiyonel):');
    try {
      await API.post(`/api/lessons/${lessonId}/complete/`, { notes: notes || '' });
      fetchLessons();
    } catch (err) {
      alert(err.response?.data?.error || 'Ders tamamlanamadı');
    }
  };

  const handleCancel = async (lessonId) => {
    if (!confirm('Bu dersi iptal etmek istediğinize emin misiniz?')) return;

    try {
      await API.post(`/api/lessons/${lessonId}/cancel/`);
      fetchLessons();
    } catch (err) {
      alert(err.response?.data?.error || 'Ders iptal edilemedi');
    }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm('Bu dersi silmek istediğinize emin misiniz?')) return;

    try {
      await API.delete(`/api/lessons/${lessonId}/delete/`);
      fetchLessons();
    } catch (err) {
      alert(err.response?.data?.error || 'Ders silinemedi');
    }
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      student_id: lesson.student_id,
      title: lesson.title,
      description: lesson.description || '',
      scheduled_at: lesson.scheduled_at.slice(0, 16), // datetime-local formatı
      duration_minutes: lesson.duration_minutes,
      meeting_url: lesson.meeting_url || ''
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock size={14} />;
      case 'completed': return <Check size={14} />;
      case 'cancelled': return <X size={14} />;
      default: return null;
    }
  };

  const filteredLessons = lessons.filter(l => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const upcomingLessons = lessons.filter(l => l.status === 'scheduled');
  const completedLessons = lessons.filter(l => l.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Online Dersler</h1>
            <p className="text-gray-500 text-sm mt-1">
              {isCoach ? 'Öğrencilerinizle online ders planlayın' : 'Planlanan ve tamamlanan dersleriniz'}
            </p>
          </div>

          {isCoach && (
            <button
              onClick={() => {
                setEditingLesson(null);
                setFormData({
                  student_id: '',
                  title: '',
                  description: '',
                  scheduled_at: '',
                  duration_minutes: 60,
                  meeting_url: ''
                });
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium w-full sm:w-auto"
            >
              <Plus size={20} />
              Yeni Ders
            </button>
          )}
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Video size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm opacity-90">Toplam</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{lessons.length}</p>
            <p className="text-[10px] md:text-xs opacity-70 mt-0.5">ders</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm opacity-90">Planlanan</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{upcomingLessons.length}</p>
            <p className="text-[10px] md:text-xs opacity-70 mt-0.5">bekleyen</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Check size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm opacity-90">Tamamlanan</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{completedLessons.length}</p>
            <p className="text-[10px] md:text-xs opacity-70 mt-0.5">ders</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm opacity-90">Toplam Saat</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">
              {Math.round(completedLessons.reduce((acc, l) => acc + l.duration_minutes, 0) / 60)}
            </p>
            <p className="text-[10px] md:text-xs opacity-70 mt-0.5">saat</p>
          </div>
        </div>

        {/* Filtre */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
              ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Tümü ({lessons.length})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
              ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Planlanan ({upcomingLessons.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
              ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Tamamlanan ({completedLessons.length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
              ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            İptal ({lessons.filter(l => l.status === 'cancelled').length})
          </button>
        </div>

        {/* Ders Listesi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredLessons.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <Video size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {filter === 'all' ? 'Henüz ders bulunmuyor' : `${filter === 'scheduled' ? 'Planlanan' : filter === 'completed' ? 'Tamamlanan' : 'İptal edilen'} ders bulunmuyor`}
              </p>
              {isCoach && filter === 'all' && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 text-indigo-600 font-medium hover:underline"
                >
                  İlk dersinizi oluşturun
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredLessons.map((lesson) => (
                <div key={lesson.id} className="p-4 md:p-5 hover:bg-gray-50 transition-colors">
                  {/* Mobil Layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                          ${lesson.status === 'scheduled' ? 'bg-blue-100' : lesson.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Video className={`${lesson.status === 'scheduled' ? 'text-blue-600' : lesson.status === 'completed' ? 'text-green-600' : 'text-red-600'}`} size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">{lesson.title}</h3>
                          <p className="text-xs text-gray-500">{isCoach ? lesson.student_name : lesson.coach_name}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(lesson.status)}`}>
                        {getStatusIcon(lesson.status)}
                        {lesson.status_display}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {lesson.scheduled_at_formatted}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {lesson.duration_minutes} dk
                      </span>
                    </div>

                    {lesson.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{lesson.description}</p>
                    )}

                    {lesson.notes && lesson.status === 'completed' && (
                      <div className="p-2 bg-green-50 rounded-lg text-xs text-green-700">
                        <strong>Notlar:</strong> {lesson.notes}
                      </div>
                    )}

                    {/* Mobil Aksiyon Butonları */}
                    <div className="flex items-center gap-2 pt-1">
                      {lesson.meeting_url && lesson.status === 'scheduled' && (
                        <a
                          href={lesson.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <ExternalLink size={14} />
                          Derse Katıl
                        </a>
                      )}

                      {isCoach && lesson.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleComplete(lesson.id)}
                            className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            title="Tamamla"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(lesson)}
                            className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleCancel(lesson.id)}
                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="İptal Et"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}

                      {isCoach && lesson.status !== 'scheduled' && (
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="p-2 text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${lesson.status === 'scheduled' ? 'bg-blue-100' : lesson.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Video className={`${lesson.status === 'scheduled' ? 'text-blue-600' : lesson.status === 'completed' ? 'text-green-600' : 'text-red-600'}`} size={24} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                            {getStatusIcon(lesson.status)}
                            {lesson.status_display}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {isCoach ? lesson.student_name : lesson.coach_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {lesson.scheduled_at_formatted}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {lesson.duration_minutes} dk
                          </span>
                        </div>

                        {lesson.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{lesson.description}</p>
                        )}

                        {lesson.notes && lesson.status === 'completed' && (
                          <div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                            <strong>Notlar:</strong> {lesson.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {lesson.meeting_url && lesson.status === 'scheduled' && (
                        <a
                          href={lesson.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <ExternalLink size={16} />
                          Katıl
                        </a>
                      )}

                      {isCoach && lesson.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleComplete(lesson.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Tamamla"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(lesson)}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleCancel(lesson.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="İptal Et"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}

                      {isCoach && lesson.status !== 'scheduled' && (
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingLesson ? 'Dersi Düzenle' : 'Yeni Ders Oluştur'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci *</label>
                <select
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Öğrenci seçin</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ders Başlığı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Örn: TYT Matematik - Fonksiyonlar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={2}
                  placeholder="Ders hakkında kısa açıklama..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih & Saat *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dk)</label>
                  <select
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={30}>30 dk</option>
                    <option value={45}>45 dk</option>
                    <option value={60}>60 dk</option>
                    <option value={90}>90 dk</option>
                    <option value={120}>120 dk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toplantı Linki</label>
                <input
                  type="url"
                  value={formData.meeting_url}
                  onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://zoom.us/j/... veya https://meet.google.com/..."
                />
                <p className="text-xs text-gray-400 mt-1">Zoom, Google Meet veya başka bir platform linki</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLesson(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  {editingLesson ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
