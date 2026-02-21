import { useEffect, useState } from 'react';
import { Flame, Check, Clock, BookOpen, AlertCircle, ChevronRight, Play } from 'lucide-react';
import API from '../api';
import CheckInModal from '../components/CheckInModal';

export default function StudentToday() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [completingId, setCompletingId] = useState(null);
  const [noteInputId, setNoteInputId] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchToday();
  }, []);

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
      await API.post('/api/student/today/complete/', {
        task_id: taskId,
        note: noteText,
      });
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
      // Geri al
      handleComplete(task.id);
    } else {
      // Not girişi göster
      if (noteInputId === task.id) {
        handleComplete(task.id);
      } else {
        setNoteInputId(task.id);
        setNoteText('');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">Veri yüklenemedi. Sayfayı yenile.</p>
      </div>
    );
  }

  const { tasks, metrics, checkin_done, deviation_warning, day_name, date } = data;

  const categoryColors = {
    TYT: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    AYT: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bugün, <span className="text-primary-600">{day_name}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
            <Flame size={20} className="text-orange-500" />
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600 leading-none">{metrics.streak}</p>
              <p className="text-[10px] text-orange-500 font-medium">gün seri</p>
            </div>
          </div>
        </div>

        {/* Mini Metrikler */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {metrics.tasks_completed}<span className="text-gray-400 text-lg">/{metrics.tasks_total}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Bugün görev</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{metrics.streak}</p>
            <p className="text-xs text-gray-500 mt-1">Gün seri</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">%{metrics.compliance_7day}</p>
            <p className="text-xs text-gray-500 mt-1">7 gün uyum</p>
          </div>
        </div>

        {/* Günün Görevleri */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Günün Görevleri</h2>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Bugün için görev yok</p>
              <p className="text-sm text-gray-400 mt-1">Planım sayfasından haftalık plan oluşturabilirsin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
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
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleTask(task)}
                          disabled={isCompletingThis}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                            ${isCompleted
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-primary-400'
                            }`}
                        >
                          {isCompleted && <Check size={16} className="text-white" />}
                        </button>

                        {/* İçerik */}
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
                                <Clock size={12} />
                                {task.duration_target} dk
                              </span>
                            )}
                            {task.question_target > 0 && (
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <BookOpen size={12} />
                                {task.question_target} soru
                              </span>
                            )}
                          </div>
                          {isCompleted && task.completion_note && (
                            <p className="text-xs text-green-600 mt-2 bg-green-50 px-2 py-1 rounded-lg inline-block">
                              "{task.completion_note}"
                            </p>
                          )}
                        </div>

                        {/* Başla butonu */}
                        {!isCompleted && !showNote && (
                          <button
                            onClick={() => toggleTask(task)}
                            className="flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors flex-shrink-0"
                          >
                            <Play size={14} />
                            Başla
                          </button>
                        )}
                      </div>

                      {/* Not girişi */}
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
        {deviation_warning && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {deviation_warning === 'zero_progress'
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
        <button
          onClick={() => setShowCheckIn(true)}
          disabled={checkin_done}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2
            ${checkin_done
              ? 'bg-green-100 text-green-600 border-2 border-green-200 cursor-default'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 active:scale-[0.98]'
            }`}
        >
          {checkin_done ? (
            <>
              <Check size={20} />
              Bugün değerlendirildi
            </>
          ) : (
            <>
              <Clock size={20} />
              Günümü Değerlendir
            </>
          )}
        </button>
      </div>

      {/* Check-in Modal */}
      {showCheckIn && (
        <CheckInModal
          onClose={() => setShowCheckIn(false)}
          onSuccess={() => fetchToday()}
        />
      )}
    </div>
  );
}
