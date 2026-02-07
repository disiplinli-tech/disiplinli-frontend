import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Check, Clock, AlertTriangle, Trash2,
  BookOpen, Calendar, User, CheckCircle2, XCircle
} from 'lucide-react';
import API from '../api';



export default function Assignments() {
  const [creating, setCreating] = useState(false);  // En üste ekle
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed, late
  const [newAssignment, setNewAssignment] = useState({
    student_id: '', title: '', description: '', due_date: ''
  });

  useEffect(() => {
    loadAssignments();
    if (role === 'coach') loadStudents();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await API.get('/api/assignments/');
      setAssignments(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await API.get('/api/coach/students/');
      setStudents(res.data);
    } catch (err) {
    }
  };


  const handleCreate = async () => {
    if (!newAssignment.student_id || !newAssignment.title || !newAssignment.due_date) return;
    if (creating) return;
    
    setCreating(true);
    try {
      await API.post('/api/assignments/create/', newAssignment);
      setShowModal(false);
      setNewAssignment({ student_id: '', title: '', description: '', due_date: '' });
      loadAssignments();
    } catch (err) {
    } finally {
      setCreating(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.post(`/api/assignments/${id}/complete/`);
      loadAssignments();
    } catch (err) {
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ödevi silmek istediğinize emin misiniz?')) return;
    try {
      await API.delete(`/api/assignments/${id}/delete/`);
      loadAssignments();
    } catch (err) {
    }
  };

  const filtered = assignments.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const statusConfig = {
    pending: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    late: { label: 'Gecikmiş', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    late: assignments.filter(a => a.status === 'late').length,
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500 hidden md:block" />
              Ödevler
            </h1>
            <p className="text-xs md:text-sm text-gray-500">{stats.total} ödev, {stats.pending} bekliyor</p>
          </div>
        </div>

        {role === 'coach' && (
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600
              text-white rounded-xl text-sm font-medium transition-colors shadow-md whitespace-nowrap">
            <Plus size={16} />
            Ödev Ver
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Toplam', value: stats.total, color: 'from-indigo-500 to-blue-500', key: 'all' },
          { label: 'Bekliyor', value: stats.pending, color: 'from-yellow-500 to-orange-500', key: 'pending' },
          { label: 'Tamamlandı', value: stats.completed, color: 'from-green-500 to-emerald-500', key: 'completed' },
          { label: 'Gecikmiş', value: stats.late, color: 'from-red-500 to-pink-500', key: 'late' },
        ].map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`p-4 rounded-xl border-2 transition-all
              ${filter === s.key ? 'border-indigo-500 shadow-md' : 'border-transparent bg-white shadow-sm'}`}>
            <p className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Ödev Listesi */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">
            {filter === 'all' ? 'Henüz ödev yok' : `${statusConfig[filter]?.label || ''} ödev bulunamadı`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const config = statusConfig[a.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <div key={a.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-gray-800 ${a.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                        {a.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>

                    {a.description && (
                      <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {role === 'coach' && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {a.student_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Son: {a.due_date_formatted}
                      </span>
                      {a.completed_at && (
                        <span className="flex items-center gap-1 text-green-500">
                          <Check size={12} />
                          {a.completed_at}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {a.status === 'pending' && (
                      <button onClick={() => handleComplete(a.id)}
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-600 
                          rounded-lg transition-colors" title="Tamamla">
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    {a.status === 'late' && role === 'student' && (
                      <button onClick={() => handleComplete(a.id)}
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-600 
                          rounded-lg transition-colors" title="Geç de olsa tamamla">
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    {role === 'coach' && (
                      <button onClick={() => handleDelete(a.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 
                          rounded-lg transition-colors" title="Sil">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ödev Oluşturma Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" />
              Yeni Ödev Ver
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Öğrenci</label>
                <select
                  value={newAssignment.student_id}
                  onChange={(e) => setNewAssignment({ ...newAssignment, student_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Öğrenci seçin...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Ödev Başlığı</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="TYT Matematik - Limit Türev"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Açıklama (Opsiyonel)</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Sayfa 45-60 arası çöz, yanlışlarını not al..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Son Tarih</label>
                <input
                  type="date"
                  value={newAssignment.due_date}
                  onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium 
                  text-gray-600 hover:bg-gray-50 transition-colors">
                İptal
              </button>
              <button onClick={handleCreate}
                disabled={creating || !newAssignment.student_id || !newAssignment.title || !newAssignment.due_date}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300
                  text-white rounded-xl text-sm font-medium transition-colors">
                {creating ? 'Ekleniyor...' : 'Ödev Ver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}