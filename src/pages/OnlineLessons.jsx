import { useState, useEffect } from 'react';
import API from '../api';
import {
  Video, Plus, Calendar, Clock, User, ExternalLink, Check, X,
  Edit2, Trash2
} from 'lucide-react';

export default function OnlineLessons() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: 60,
    meeting_url: ''
  });

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
      scheduled_at: lesson.scheduled_at.slice(0, 16),
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

  const filteredLessons = lessons.filter(l => filter === 'all' ? true : l.status === filter);
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
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ padding: '24px 16px', maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Online Dersler</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                {isCoach ? 'Öğrencilerinizle online ders planlayın' : 'Planlanan ve tamamlanan dersleriniz'}
              </p>
            </div>
            {isCoach && (
              <button
                onClick={() => {
                  setEditingLesson(null);
                  setFormData({ student_id: '', title: '', description: '', scheduled_at: '', duration_minutes: 60, meeting_url: '' });
                  setShowModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: '#4f46e5', color: 'white', padding: '12px 20px',
                  borderRadius: '12px', fontWeight: '500', border: 'none', cursor: 'pointer',
                  width: '100%'
                }}
              >
                <Plus size={20} />
                Yeni Ders
              </button>
            )}
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px',
          width: '100%'
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={20} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Toplam</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{lessons.length}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#d97706" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Planlanan</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{upcomingLessons.length}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={20} color="#059669" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Tamamlanan</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{completedLessons.length}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} color="#7c3aed" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Toplam Saat</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                  {Math.round(completedLessons.reduce((acc, l) => acc + l.duration_minutes, 0) / 60)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtre Butonları */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
          {[
            { key: 'all', label: `Tümü (${lessons.length})`, active: filter === 'all' },
            { key: 'scheduled', label: `Planlanan (${upcomingLessons.length})`, active: filter === 'scheduled' },
            { key: 'completed', label: `Tamamlanan (${completedLessons.length})`, active: filter === 'completed' },
            { key: 'cancelled', label: `İptal (${lessons.filter(l => l.status === 'cancelled').length})`, active: filter === 'cancelled' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '500',
                whiteSpace: 'nowrap', border: f.active ? 'none' : '1px solid #e5e7eb',
                backgroundColor: f.active ? '#4f46e5' : 'white',
                color: f.active ? 'white' : '#4b5563',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Ders Listesi */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
          {filteredLessons.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Video size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#6b7280' }}>
                {filter === 'all' ? 'Henüz ders bulunmuyor' : 'Bu kategoride ders bulunmuyor'}
              </p>
            </div>
          ) : (
            <div>
              {filteredLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  style={{
                    padding: '16px',
                    borderBottom: index < filteredLessons.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: lesson.status === 'scheduled' ? '#dbeafe' : lesson.status === 'completed' ? '#d1fae5' : '#fee2e2'
                    }}>
                      <Video size={20} color={lesson.status === 'scheduled' ? '#2563eb' : lesson.status === 'completed' ? '#059669' : '#dc2626'} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lesson.title}
                        </h3>
                        <span style={{
                          padding: '2px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', flexShrink: 0,
                          backgroundColor: lesson.status === 'scheduled' ? '#dbeafe' : lesson.status === 'completed' ? '#d1fae5' : '#fee2e2',
                          color: lesson.status === 'scheduled' ? '#1d4ed8' : lesson.status === 'completed' ? '#047857' : '#dc2626'
                        }}>
                          {lesson.status_display}
                        </span>
                      </div>

                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {isCoach ? lesson.student_name : lesson.coach_name}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {lesson.scheduled_at_formatted}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {lesson.duration_minutes}dk
                        </span>
                      </div>

                      {/* Aksiyon Butonları */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {lesson.meeting_url && lesson.status === 'scheduled' && (
                          <a
                            href={lesson.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '8px 12px', backgroundColor: '#4f46e5', color: 'white',
                              borderRadius: '8px', fontSize: '12px', fontWeight: '500',
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={14} />
                            Katıl
                          </a>
                        )}

                        {isCoach && lesson.status === 'scheduled' && (
                          <>
                            <button onClick={() => handleComplete(lesson.id)} style={{ padding: '8px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                              <Check size={16} />
                            </button>
                            <button onClick={() => openEditModal(lesson)} style={{ padding: '8px', backgroundColor: '#f3f4f6', color: '#6b7280', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleCancel(lesson.id)} style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {isCoach && lesson.status !== 'scheduled' && (
                          <button onClick={() => handleDelete(lesson.id)} style={{ padding: '8px', backgroundColor: '#f3f4f6', color: '#9ca3af', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                {editingLesson ? 'Dersi Düzenle' : 'Yeni Ders Oluştur'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Öğrenci *</label>
                <select
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px' }}
                >
                  <option value="">Öğrenci seçin</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Ders Başlığı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: TYT Matematik"
                  required
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Tarih *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Süre</label>
                  <select
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px' }}
                  >
                    <option value={30}>30 dk</option>
                    <option value={45}>45 dk</option>
                    <option value={60}>60 dk</option>
                    <option value={90}>90 dk</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Toplantı Linki</label>
                <input
                  type="url"
                  value={formData.meeting_url}
                  onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  style={{ width: '100%', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingLesson(null); }}
                  style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: 'white', color: '#4b5563', fontWeight: '500', cursor: 'pointer' }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', backgroundColor: '#4f46e5', color: 'white', fontWeight: '500', cursor: 'pointer' }}
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
