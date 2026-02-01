import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, Clock, BookOpen } from 'lucide-react';
import API from '../api';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const HOURS = Array.from({ length: 15 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

export default function StudentSchedule() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: '', day: 'Pazartesi', hour: '09:00' });

  useEffect(() => {
    loadSchedule();
  }, [studentId]);

  const loadSchedule = async () => {
    try {
      const res = await API.get(`/api/student/${studentId}/schedule/`);
      setStudentName(res.data.student_name);
      setPlans(res.data.plans);
    } catch (err) {
      console.error('Program yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPlan.title.trim()) return;
    try {
      await API.post('/api/schedule/add/', {
        ...newPlan,
        student_id: studentId
      });
      setShowModal(false);
      setNewPlan({ title: '', day: 'Pazartesi', hour: '09:00' });
      loadSchedule();
    } catch (err) {
      console.error('Ekleme hatası:', err);
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Bu dersi silmek istediğinize emin misiniz?')) return;
    try {
      await API.delete(`/api/schedule/${planId}/delete/`);
      loadSchedule();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  // Planları gün ve saate göre organize et
  const getPlansForSlot = (day, hour) => {
    return plans.filter(p => p.day === day && p.hour === hour);
  };

  // Renk paleti
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-300',
    'bg-purple-100 text-purple-700 border-purple-300',
    'bg-green-100 text-green-700 border-green-300',
    'bg-orange-100 text-orange-700 border-orange-300',
    'bg-pink-100 text-pink-700 border-pink-300',
    'bg-teal-100 text-teal-700 border-teal-300',
    'bg-yellow-100 text-yellow-700 border-yellow-300',
    'bg-red-100 text-red-700 border-red-300',
  ];

  const getColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={22} className="text-indigo-500" />
              {studentName} - Haftalık Program
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {plans.length} ders planlanmış
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 
            text-white rounded-xl text-sm font-medium transition-colors shadow-md"
        >
          <Plus size={18} />
          Ders Ekle
        </button>
      </div>

      {/* Haftalık Tablo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="p-3 text-left text-xs font-semibold text-gray-500 w-16 sticky left-0 bg-indigo-50 z-10">
                  <Clock size={14} className="inline mr-1" />
                  Saat
                </th>
                {DAYS.map(day => (
                  <th key={day} className="p-3 text-center text-xs font-semibold text-gray-600 min-w-[120px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(hour => (
                <tr key={hour} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="p-2 text-xs text-gray-400 font-mono sticky left-0 bg-white z-10 border-r border-gray-100">
                    {hour}
                  </td>
                  {DAYS.map(day => {
                    const slotPlans = getPlansForSlot(day, hour);
                    return (
                      <td key={`${day}-${hour}`} className="p-1 border-l border-gray-50 min-h-[40px]">
                        {slotPlans.map(plan => (
                          <div key={plan.id}
                            className={`group relative px-2 py-1.5 rounded-lg border text-xs font-medium 
                              mb-1 cursor-default ${getColor(plan.title)}`}
                          >
                            <span>{plan.title}</span>
                            <button
                              onClick={() => handleDelete(plan.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full 
                                hidden group-hover:flex items-center justify-center hover:bg-red-600 shadow-sm"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {DAYS.map(day => {
          const dayPlans = plans.filter(p => p.day === day);
          return (
            <div key={day} className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700">{day}</h4>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{dayPlans.length}</p>
              <p className="text-xs text-gray-400">ders</p>
              {dayPlans.length > 0 && (
                <div className="mt-2 space-y-1">
                  {dayPlans.map(p => (
                    <p key={p.id} className="text-xs text-gray-500">
                      {p.hour} - {p.title}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ders Ekleme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" />
              {studentName} İçin Ders Ekle
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Ders Adı</label>
                <input
                  type="text"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  placeholder="Matematik, Fizik, Türkçe..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Gün</label>
                  <select
                    value={newPlan.day}
                    onChange={(e) => setNewPlan({ ...newPlan, day: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Saat</label>
                  <select
                    value={newPlan.hour}
                    onChange={(e) => setNewPlan({ ...newPlan, hour: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium 
                  text-gray-600 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAdd}
                disabled={!newPlan.title.trim()}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300
                  text-white rounded-xl text-sm font-medium transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}