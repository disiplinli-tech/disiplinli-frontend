import { useEffect, useState } from 'react';
import { Target, Edit2, Check, X, Award, MapPin } from 'lucide-react';
import { formatRanking } from '../utils/formatters';
import API from '../api';

export default function StudentGoal() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [targetRanking, setTargetRanking] = useState('');
  const [targetUni, setTargetUni] = useState('');
  const [targetDept, setTargetDept] = useState('');
  const [motivationText, setMotivationText] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/student/stats/');
      setStats(res.data);
      setTargetRanking(res.data.target_ranking || '');
      setTargetUni(res.data.target_university || '');
      setTargetDept(res.data.target_department || '');
      setMotivationText(res.data.motivation_text || '');
    } catch (err) {
      console.error('Stats yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.post('/api/student/profile/update/', {
        target_ranking: targetRanking ? parseInt(targetRanking) : null,
        target_university: targetUni,
        target_department: targetDept,
        motivation_text: motivationText,
      });
      setEditing(false);
      fetchStats();
    } catch (err) {
      alert('Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Hedefe uzaklık hesapla
  const currentRanking = stats?.current_ranking || null;
  const targetRank = stats?.target_ranking || null;
  let progressPct = 0;
  let distanceText = '';

  if (currentRanking && targetRank) {
    if (currentRanking <= targetRank) {
      progressPct = 100;
      distanceText = 'Hedefine ulaştın!';
    } else {
      // Max ranking ~2M olarak varsayalım, progress hesapla
      const startRanking = 2000000; // başlangıç referans
      const totalDistance = startRanking - targetRank;
      const covered = startRanking - currentRanking;
      progressPct = Math.max(0, Math.min(100, Math.round((covered / totalDistance) * 100)));
      const distance = currentRanking - targetRank;
      distanceText = `Hedefe ${formatRanking(distance)} kişi kaldı`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Hedefim</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              <Edit2 size={14} />
              Düzenle
            </button>
          )}
        </div>

        {/* Hedef Bilgileri */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {editing ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Hedef Sıralama</label>
                <input
                  type="number"
                  value={targetRanking}
                  onChange={(e) => setTargetRanking(e.target.value)}
                  placeholder="ör. 5000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Hedef Üniversite</label>
                <input
                  type="text"
                  value={targetUni}
                  onChange={(e) => setTargetUni(e.target.value)}
                  placeholder="ör. İstanbul Teknik Üniversitesi"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Hedef Bölüm</label>
                <input
                  type="text"
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                  placeholder="ör. Bilgisayar Mühendisliği"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600"
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hedef Sıralama</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {targetRank ? formatRanking(targetRank) : 'Belirlenmedi'}
                  </p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Üniversite</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {stats?.target_university || 'Belirlenmedi'}
                  </p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bölüm</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {stats?.target_department || 'Belirlenmedi'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hedefe Uzaklık */}
        {targetRank && (
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">Hedefe Uzaklık</h3>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs opacity-80">Mevcut Sıralaman</p>
                <p className="text-xl font-bold">
                  {currentRanking ? formatRanking(currentRanking) : '-'}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs opacity-80">Hedef Sıralaman</p>
                <p className="text-xl font-bold">{formatRanking(targetRank)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-3">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-80">{distanceText || 'Hedef sıralama belirle'}</p>
              <p className="text-sm font-bold">%{progressPct}</p>
            </div>
          </div>
        )}

        {/* Motivasyon Cümlesi */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Motivasyon Cümlen</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Düzenle
              </button>
            )}
          </div>
          {editing ? (
            <textarea
              value={motivationText}
              onChange={(e) => setMotivationText(e.target.value)}
              placeholder="Seni motive eden bir cümle yaz... Bu seni zor günlerde hatırlatacak."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 resize-none"
            />
          ) : motivationText ? (
            <p className="text-gray-700 italic">"{motivationText}"</p>
          ) : (
            <p className="text-gray-400 text-sm">
              Henüz bir motivasyon cümlesi yazmadın. Düzenle butonuna tıklayarak ekleyebilirsin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
