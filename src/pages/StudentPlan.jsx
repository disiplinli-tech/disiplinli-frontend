import { useEffect, useState } from 'react';
import { Plus, X, Clock, BookOpen, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import API from '../api';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const SHORT_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const SUBJECTS = [
  'Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji',
  'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü', 'Edebiyat',
  'Geometri', 'Paragraf', 'Sosyal Bilimler', 'Fen Bilimleri',
];

export default function StudentPlan() {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showMinModal, setShowMinModal] = useState(false);
  const [minMinutes, setMinMinutes] = useState(60);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formSubject, setFormSubject] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formCategory, setFormCategory] = useState('TYT');
  const [formDuration, setFormDuration] = useState(30);
  const [formQuestions, setFormQuestions] = useState(0);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await API.get('/api/student/plan/');
      setPlanData(res.data);
      setMinMinutes(res.data.minimum_day_minutes || 60);
    } catch (err) {
      console.error('Plan yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormSubject('');
    setFormTopic('');
    setFormCategory('TYT');
    setFormDuration(30);
    setFormQuestions(0);
    setEditingTask(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormSubject(task.subject);
    setFormTopic(task.topic);
    setFormCategory(task.category);
    setFormDuration(task.duration_target);
    setFormQuestions(task.question_target);
    setShowAddModal(true);
  };

  const handleSaveTask = async () => {
    if (!formSubject) return;
    setSaving(true);
    try {
      if (editingTask) {
        await API.put(`/api/student/plan/${editingTask.id}/`, {
          subject: formSubject,
          topic: formTopic,
          category: formCategory,
          duration_target: formDuration,
          question_target: formQuestions,
        });
      } else {
        await API.post('/api/student/plan/add/', {
          day_of_week: selectedDay,
          subject: formSubject,
          topic: formTopic,
          category: formCategory,
          duration_target: formDuration,
          question_target: formQuestions,
        });
      }
      setShowAddModal(false);
      resetForm();
      fetchPlan();
    } catch (err) {
      alert(err.response?.data?.error || 'Görev kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/api/student/plan/${taskId}/delete/`);
      fetchPlan();
    } catch (err) {
      alert('Görev silinemedi');
    }
  };

  const handleSaveMinimum = async () => {
    try {
      await API.put('/api/student/plan/minimum/', { minimum_day_minutes: minMinutes });
      setShowMinModal(false);
      fetchPlan();
    } catch (err) {
      alert('Kaydedilemedi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const dayTasks = planData?.days?.[selectedDay]?.tasks || [];
  const todayWeekday = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Planım</h1>
          <button
            onClick={() => setShowMinModal(true)}
            className="text-sm px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Min: {planData?.minimum_day_minutes || 60} dk
          </button>
        </div>

        {/* Gün Tabları */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {SHORT_DAYS.map((day, idx) => {
            const taskCount = planData?.days?.[idx]?.tasks?.length || 0;
            const isSelected = selectedDay === idx;
            const isToday = idx === todayWeekday;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex-1 min-w-[48px] py-3 px-2 rounded-xl text-center transition-all relative
                  ${isSelected
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                    : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-500'}`}>{day}</p>
                {taskCount > 0 && (
                  <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                    {taskCount} görev
                  </p>
                )}
                {isToday && (
                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2
                    ${isSelected ? 'bg-white border-primary-500' : 'bg-primary-500 border-white'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Seçili Gün Başlık */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">{DAYS[selectedDay]}</h2>
          <span className="text-sm text-gray-400">{dayTasks.length}/3 görev</span>
        </div>

        {/* Görev Listesi */}
        {dayTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Bu gün için görev yok</p>
            <p className="text-sm text-gray-400 mt-1">Aşağıdan görev ekle.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${task.category === 'AYT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {task.category}
                      </span>
                      <h3 className="font-semibold text-gray-800">{task.subject}</h3>
                    </div>
                    {task.topic && <p className="text-sm text-gray-500 mt-0.5">{task.topic}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      {task.duration_target > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} /> {task.duration_target} dk
                        </span>
                      )}
                      {task.question_target > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <BookOpen size={12} /> {task.question_target} soru
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Görev Ekle */}
        {dayTasks.length < 3 && (
          <button
            onClick={openAddModal}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 font-medium hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Görev Ekle
          </button>
        )}

        {/* Haftalık Özet */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Haftalık Özet</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-gray-800">{planData?.summary?.total_tasks || 0}</p>
              <p className="text-xs text-gray-500">Toplam görev</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary-600">{planData?.summary?.total_duration || 0}</p>
              <p className="text-xs text-gray-500">Toplam dk</p>
            </div>
            <div>
              <p className="text-xl font-bold text-purple-600">{planData?.summary?.total_questions || 0}</p>
              <p className="text-xs text-gray-500">Toplam soru</p>
            </div>
          </div>
        </div>

        {/* Minimum Gün Bilgisi */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Minimum Gün</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Kötü bir günde bile en az <strong>{planData?.minimum_day_minutes || 60} dakika</strong> çalış.
            </p>
          </div>
        </div>
      </div>

      {/* Görev Ekle/Düzenle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddModal(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden animate-fade-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {editingTask ? 'Görevi Düzenle' : 'Yeni Görev'}
              </h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Ders */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Ders *</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                >
                  <option value="">Ders seç...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Konu */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Konu (opsiyonel)</label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="ör. Türev, Paragraf..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Kategori</label>
                <div className="flex gap-3">
                  {['TYT', 'AYT'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                        ${formCategory === cat
                          ? cat === 'TYT' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Süre + Soru */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Süre hedefi (dk)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Soru hedefi</label>
                  <input
                    type="number"
                    value={formQuestions}
                    onChange={(e) => setFormQuestions(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleSaveTask}
                disabled={!formSubject || saving}
                className={`w-full py-3 rounded-xl font-semibold transition-all
                  ${formSubject && !saving
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {saving ? 'Kaydediliyor...' : editingTask ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimum Gün Modal */}
      {showMinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMinModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 animate-fade-up">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Minimum Gün Ayarı</h3>
            <p className="text-sm text-gray-500 mb-4">Kötü bir günde bile minimum kaç dakika çalışacaksın?</p>
            <input
              type="number"
              value={minMinutes}
              onChange={(e) => setMinMinutes(parseInt(e.target.value) || 0)}
              min="0"
              max="480"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowMinModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSaveMinimum}
                className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
