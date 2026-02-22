import { useEffect, useState, useRef } from 'react';
import { Flame, Check, Clock, BookOpen, AlertCircle, ChevronRight, Play, Plus, X, Edit2, Trash2, Lock } from 'lucide-react';
import API from '../api';
import CheckInModal from '../components/CheckInModal';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const SHORT_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const SUBJECTS = [
  'Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji',
  'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü', 'Edebiyat',
  'Geometri', 'Paragraf', 'Sosyal Bilimler', 'Fen Bilimleri',
];

export default function StudentToday() {
  const [tab, setTab] = useState('daily');

  // === Günlük state ===
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [noteInputId, setNoteInputId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [countdown, setCountdown] = useState('');
  const countdownRef = useRef(null);

  // === Haftalık Plan state ===
  const [planData, setPlanData] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const todayWeekday = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showMinModal, setShowMinModal] = useState(false);
  const [minMinutes, setMinMinutes] = useState(60);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formSubject, setFormSubject] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formCategory, setFormCategory] = useState('TYT');
  const [formDuration, setFormDuration] = useState('');
  const [formQuestions, setFormQuestions] = useState('');

  useEffect(() => {
    fetchToday();
    fetchPlan();
  }, []);

  // Countdown timer for check-in window (22:00 GMT+3)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // GMT+3 saatini hesapla
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const turkeyTime = new Date(utc + 3 * 3600000);
      const h = turkeyTime.getHours();
      const m = turkeyTime.getMinutes();
      const s = turkeyTime.getSeconds();

      if (h >= 22) {
        setCountdown('');
        clearInterval(countdownRef.current);
        return;
      }

      const totalSecsLeft = (22 - h - 1) * 3600 + (59 - m) * 60 + (60 - s);
      const hours = Math.floor(totalSecsLeft / 3600);
      const mins = Math.floor((totalSecsLeft % 3600) / 60);
      const secs = totalSecsLeft % 60;

      if (hours > 0) {
        setCountdown(`${hours} sa ${mins} dk`);
      } else if (mins > 0) {
        setCountdown(`${mins} dk ${secs} sn`);
      } else {
        setCountdown(`${secs} sn`);
      }
    };

    updateCountdown();
    countdownRef.current = setInterval(updateCountdown, 1000);
    return () => clearInterval(countdownRef.current);
  }, []);

  // === Günlük fonksiyonlar ===
  const fetchToday = async () => {
    try {
      const res = await API.get('/api/student/today/');
      setData(res.data);
    } catch (err) {
      console.error('Bugün verisi yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId) => {
    setCompletingId(taskId);
    try {
      await API.post('/api/student/today/complete/', { task_id: taskId, note: noteText });
      setNoteInputId(null);
      setNoteText('');
      fetchToday();
    } catch (err) {
      alert('Görev güncellenemedi');
    } finally {
      setCompletingId(null);
    }
  };

  const toggleTask = (task) => {
    if (task.status === 'completed') {
      handleComplete(task.id);
    } else {
      if (noteInputId === task.id) {
        handleComplete(task.id);
      } else {
        setNoteInputId(task.id);
        setNoteText('');
      }
    }
  };

  // === Haftalık Plan fonksiyonlar ===
  const fetchPlan = async () => {
    try {
      const res = await API.get('/api/student/plan/');
      setPlanData(res.data);
      setMinMinutes(res.data.minimum_day_minutes || 60);
    } catch (err) {
      console.error('Plan yüklenemedi:', err);
    } finally {
      setPlanLoading(false);
    }
  };

  const resetForm = () => {
    setFormSubject('');
    setFormTopic('');
    setFormCategory('TYT');
    setFormDuration('');
    setFormQuestions('');
    setEditingTask(null);
  };

  const openAddModal = () => { resetForm(); setShowAddModal(true); };

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
      const duration = parseInt(formDuration) || 0;
      const questions = parseInt(formQuestions) || 0;
      if (editingTask) {
        await API.put(`/api/student/plan/${editingTask.id}/`, {
          subject: formSubject, topic: formTopic, category: formCategory,
          duration_target: duration, question_target: questions,
        });
      } else {
        await API.post('/api/student/plan/add/', {
          day_of_week: selectedDay, subject: formSubject, topic: formTopic,
          category: formCategory, duration_target: duration, question_target: questions,
        });
      }
      setShowAddModal(false);
      resetForm();
      fetchPlan();
      // Bugüne denk geliyorsa günlük veriyi de yenile
      if (selectedDay === todayWeekday) fetchToday();
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
      // Bugüne denk geliyorsa günlük veriyi de yenile
      if (selectedDay === todayWeekday) fetchToday();
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

  // === Loading ===
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoryColors = {
    TYT: { badge: 'bg-blue-100 text-blue-700' },
    AYT: { badge: 'bg-purple-100 text-purple-700' },
  };

  const dayTasks = planData?.days?.[selectedDay]?.tasks || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bugün</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-0.5">
                {data.day_name}, {new Date(data.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
          {data && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
              <Flame size={20} className="text-orange-500" />
              <div className="text-right">
                <p className="text-lg font-bold text-orange-600 leading-none">{data.metrics.streak}</p>
                <p className="text-[10px] text-orange-500 font-medium">gün seri</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab('daily')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${tab === 'daily' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
          >
            Günlük
          </button>
          <button
            onClick={() => setTab('weekly')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${tab === 'weekly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
          >
            Haftalık Plan
          </button>
        </div>

        {/* ==================== GÜNLÜK TAB ==================== */}
        {tab === 'daily' && data && (
          <>
            {/* Mini Metrikler */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {data.metrics.tasks_completed}<span className="text-gray-400 text-lg">/{data.metrics.tasks_total}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Bugün görev</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{data.metrics.streak}</p>
                <p className="text-xs text-gray-500 mt-1">Gün seri</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-primary-600">%{data.metrics.compliance_7day}</p>
                <p className="text-xs text-gray-500 mt-1">7 gün uyum</p>
              </div>
            </div>

            {/* Günün Görevleri */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Günün Görevleri</h2>

              {data.tasks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Bugün için görev yok</p>
                  <button
                    onClick={() => setTab('weekly')}
                    className="text-sm text-primary-600 font-medium mt-2 hover:underline"
                  >
                    Haftalık plandan görev ekle →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.tasks.map((task) => {
                    const colors = categoryColors[task.category] || categoryColors.TYT;
                    const isCompleted = task.status === 'completed';
                    const isCompletingThis = completingId === task.id;
                    const showNote = noteInputId === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`bg-white rounded-2xl border transition-all ${
                          isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-100'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTask(task)}
                              disabled={isCompletingThis}
                              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                                ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-primary-400'}`}
                            >
                              {isCompleted && <Check size={16} className="text-white" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                                  {task.category}
                                </span>
                                <h3 className={`font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                  {task.subject}
                                </h3>
                              </div>
                              {task.topic && (
                                <p className={`text-sm mt-0.5 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {task.topic}
                                </p>
                              )}
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
                              {isCompleted && task.completion_note && (
                                <p className="text-xs text-green-600 mt-2 bg-green-50 px-2 py-1 rounded-lg inline-block">
                                  "{task.completion_note}"
                                </p>
                              )}
                            </div>

                            {!isCompleted && !showNote && (
                              <button
                                onClick={() => toggleTask(task)}
                                className="flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors flex-shrink-0"
                              >
                                <Play size={14} /> Başla
                              </button>
                            )}
                          </div>

                          {showNote && (
                            <div className="mt-3 ml-10 flex gap-2">
                              <input
                                type="text"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Kısa not (opsiyonel)..."
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                                onKeyDown={(e) => e.key === 'Enter' && handleComplete(task.id)}
                                autoFocus
                              />
                              <button
                                onClick={() => handleComplete(task.id)}
                                disabled={isCompletingThis}
                                className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                              >
                                {isCompletingThis ? '...' : 'Tamam'}
                              </button>
                              <button
                                onClick={() => { setNoteInputId(null); setNoteText(''); }}
                                className="px-3 py-2 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronRight size={16} className="rotate-90" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sapma Uyarısı */}
            {data.deviation_warning && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    {data.deviation_warning === 'zero_progress'
                      ? 'Bugün henüz başlamadın.'
                      : 'Bugün planının yarısının altındasın.'}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Küçük bir adım bile fark yaratır. Kendi verinle ilerliyorsun.
                  </p>
                </div>
              </div>
            )}

            {/* Gün Sonu Check-in */}
            {data.checkin_done ? (
              <button
                disabled
                className="w-full py-4 rounded-2xl font-semibold text-lg bg-green-100 text-green-600 border-2 border-green-200 cursor-default flex items-center justify-center gap-2"
              >
                <Check size={20} /> Bugün değerlendirildi
              </button>
            ) : data.checkin_window_open ? (
              <button
                onClick={() => setShowCheckIn(true)}
                className="w-full py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <Clock size={20} /> Günümü Değerlendir
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl bg-gray-100 border-2 border-gray-200 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2 text-gray-400 font-semibold text-base">
                  <Lock size={18} /> Günümü Değerlendir
                </div>
                <p className="text-xs text-gray-400">
                  Açılmasına kalan süre: <span className="font-bold text-gray-500">{countdown || '...'}</span>
                </p>
              </div>
            )}
          </>
        )}

        {/* ==================== HAFTALIK PLAN TAB ==================== */}
        {tab === 'weekly' && (
          <>
            {planLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Gün Tabları */}
                <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                  {SHORT_DAYS.map((day, idx) => {
                    const taskCount = planData?.days?.[idx]?.tasks?.length || 0;
                    const isSelected = selectedDay === idx;
                    const isToday = idx === todayWeekday;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDay(idx)}
                        className={`flex-1 min-w-[40px] sm:min-w-[48px] py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-center transition-all relative
                          ${isSelected
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                            : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <p className={`text-[11px] sm:text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-500'}`}>{day}</p>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{dayTasks.length}/3 görev</span>
                    <button
                      onClick={() => setShowMinModal(true)}
                      className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                      Min: {planData?.minimum_day_minutes || 60}dk
                    </button>
                  </div>
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
                            <button onClick={() => openEditModal(task)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
                    <Plus size={20} /> Görev Ekle
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
              </>
            )}
          </>
        )}
      </div>

      {/* Check-in Modal */}
      {showCheckIn && (
        <CheckInModal
          onClose={() => setShowCheckIn(false)}
          onSuccess={() => fetchToday()}
        />
      )}

      {/* Görev Ekle/Düzenle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddModal(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {editingTask ? 'Görevi Düzenle' : 'Yeni Görev'}
              </h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Ders *</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                >
                  <option value="">Ders seç...</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Süre hedefi (dk)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="örn: 60"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Soru hedefi</label>
                  <input
                    type="number"
                    value={formQuestions}
                    onChange={(e) => setFormQuestions(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="örn: 20"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
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
