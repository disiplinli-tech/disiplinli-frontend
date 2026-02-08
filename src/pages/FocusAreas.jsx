import { useState, useEffect } from 'react';
import API from '../api';
import {
  Target, Plus, X, Check, AlertCircle, Loader2,
  ChevronUp, ChevronDown, Trash2, Edit2, Save
} from 'lucide-react';

const SUBJECTS = [
  'Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji',
  'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü', 'İngilizce',
  'Edebiyat', 'Geometri', 'Paragraf', 'Diğer'
];

const PRIORITY_LABELS = {
  1: { label: 'Yüksek', color: 'bg-red-100 text-red-700 border-red-200' },
  2: { label: 'Orta', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  3: { label: 'Düşük', color: 'bg-green-100 text-green-700 border-green-200' },
};

export default function FocusAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Yeni alan ekleme
  const [showAddForm, setShowAddForm] = useState(false);
  const [newArea, setNewArea] = useState({
    subject: '',
    topic: '',
    reason: '',
    priority: 2
  });

  // Düzenleme
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await API.get('/api/focus-areas/');
      setAreas(res.data.focus_areas || []);
    } catch (err) {
      setError('Odak alanları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const addArea = async () => {
    if (!newArea.subject || !newArea.topic) {
      setError('Branş ve konu gerekli');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await API.post('/api/focus-areas/', newArea);
      setAreas([...areas, { id: res.data.id, ...newArea, created_at: new Date().toISOString() }]);
      setNewArea({ subject: '', topic: '', reason: '', priority: 2 });
      setShowAddForm(false);
      setSuccess('Odak alanı eklendi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Eklenemedi');
    } finally {
      setSaving(false);
    }
  };

  const updateArea = async (id) => {
    setSaving(true);
    try {
      await API.put(`/api/focus-areas/${id}/`, editData);
      setAreas(areas.map(a => a.id === id ? { ...a, ...editData } : a));
      setEditingId(null);
      setSuccess('Güncellendi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  const deleteArea = async (id) => {
    if (!confirm('Bu odak alanını silmek istediğinize emin misiniz?')) return;

    try {
      await API.delete(`/api/focus-areas/${id}/`);
      setAreas(areas.filter(a => a.id !== id));
      setSuccess('Silindi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Silinemedi');
    }
  };

  const markComplete = async (id) => {
    try {
      await API.put(`/api/focus-areas/${id}/`, { is_completed: true });
      setAreas(areas.filter(a => a.id !== id));
      setSuccess('Tamamlandı olarak işaretlendi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('İşaretlenemedi');
    }
  };

  const startEdit = (area) => {
    setEditingId(area.id);
    setEditData({
      subject: area.subject,
      topic: area.topic,
      reason: area.reason,
      priority: area.priority
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Odak Alanlarım</h1>
            <p className="text-gray-500 text-sm">Öncelikli çalışman gereken konular</p>
          </div>
        </div>

        {areas.length < 5 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Ekle
          </button>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl mb-4 flex items-center gap-2">
          <Check size={18} />
          {success}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>💡 İpucu:</strong> 3-5 adet odak alanı belirle. Bunlar zorunluluk değil, sadece önerin.
          Tamamladığında ✓ ile işaretle ve yeni bir alan ekle.
        </p>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Yeni Odak Alanı</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Branş */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branş</label>
              <select
                value={newArea.subject}
                onChange={(e) => setNewArea({ ...newArea, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none"
              >
                <option value="">Seçin...</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Konu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
              <input
                type="text"
                placeholder="Örn: Türev, Limit, Paragraf..."
                value={newArea.topic}
                onChange={(e) => setNewArea({ ...newArea, topic: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none"
              />
            </div>

            {/* Sebep (Opsiyonel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neden? <span className="text-gray-400 font-normal">(opsiyonel)</span>
              </label>
              <input
                type="text"
                placeholder="Örn: Son denemede düşük, tekrar gerekiyor..."
                value={newArea.reason}
                onChange={(e) => setNewArea({ ...newArea, reason: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none"
              />
            </div>

            {/* Öncelik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(p => (
                  <button
                    key={p}
                    onClick={() => setNewArea({ ...newArea, priority: p })}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      newArea.priority === p
                        ? PRIORITY_LABELS[p].color + ' border-current'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {PRIORITY_LABELS[p].label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addArea}
              disabled={saving || !newArea.subject || !newArea.topic}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              Ekle
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {areas.length === 0 && !showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Henüz odak alanı yok</h3>
          <p className="text-gray-500 mb-4">Odaklanman gereken konuları ekle ve takip et.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            İlk Odak Alanını Ekle
          </button>
        </div>
      )}

      {/* Areas List */}
      <div className="space-y-3">
        {areas.map((area, index) => (
          <div
            key={area.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            {editingId === area.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="flex gap-3">
                  <select
                    value={editData.subject}
                    onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="text"
                    value={editData.topic}
                    onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="Konu"
                  />
                </div>
                <input
                  type="text"
                  value={editData.reason}
                  onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Sebep (opsiyonel)"
                />
                <div className="flex gap-2">
                  {[1, 2, 3].map(p => (
                    <button
                      key={p}
                      onClick={() => setEditData({ ...editData, priority: p })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                        editData.priority === p ? PRIORITY_LABELS[p].color : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {PRIORITY_LABELS[p].label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => updateArea(area.id)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center justify-center gap-1"
                  >
                    <Save size={14} /> Kaydet
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{area.subject}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{area.topic}</span>
                  </div>
                  {area.reason && (
                    <p className="text-sm text-gray-500">{area.reason}</p>
                  )}
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_LABELS[area.priority]?.color || PRIORITY_LABELS[2].color}`}>
                      {PRIORITY_LABELS[area.priority]?.label || 'Orta'} Öncelik
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => markComplete(area.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Tamamlandı"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => startEdit(area)}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteArea(area.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Counter */}
      {areas.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          {areas.length}/5 odak alanı
        </div>
      )}
    </div>
  );
}
