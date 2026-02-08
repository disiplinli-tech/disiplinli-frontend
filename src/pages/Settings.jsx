import { useState, useEffect } from 'react';
import API from '../api';
import {
  Settings as SettingsIcon, User, Mail, KeyRound, Copy, Check,
  UserPlus, Users, GraduationCap, AlertCircle, Loader2, Target, Calculator, Save,
  Clock, Bell, RefreshCw, ChevronDown, ChevronUp, Plus, X, Globe, Calendar,
  Shield, Sliders, UserCheck, UserX, AlertTriangle
} from 'lucide-react';

// ==================== KOÇ AYARLARI BİLEŞENİ ====================
function CoachSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pending students
  const [pendingStudents, setPendingStudents] = useState([]);
  const [processingStudent, setProcessingStudent] = useState(null);

  // Invite code reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resettingCode, setResettingCode] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    availability: false,
    rules: true,
    onboarding: true,
    notifications: true
  });

  const DAYS = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' },
  ];

  const TIMEZONES = [
    { value: 'Europe/Istanbul', label: 'Türkiye (UTC+3)' },
    { value: 'Europe/London', label: 'Londra (UTC+0/+1)' },
    { value: 'Europe/Berlin', label: 'Berlin (UTC+1/+2)' },
  ];

  useEffect(() => {
    fetchSettings();
    fetchPendingStudents();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/api/coach/settings/');
      setSettings(res.data);
    } catch (err) {
      setError('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingStudents = async () => {
    try {
      const res = await API.get('/api/coach/onboarding/pending/');
      setPendingStudents(res.data.pending_students || []);
    } catch (err) {
      console.error('Bekleyen öğrenciler yüklenemedi');
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await API.put('/api/coach/settings/', settings);
      setSuccess('Ayarlar kaydedildi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Kaydetme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const resetInviteCode = async () => {
    setResettingCode(true);
    try {
      const res = await API.post('/api/coach/invite/reset/');
      setSettings(prev => ({ ...prev, invite_code: res.data.new_invite_code }));
      setShowResetConfirm(false);
      setSuccess('Davet kodu yenilendi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Kod yenileme başarısız');
    } finally {
      setResettingCode(false);
    }
  };

  const approveStudent = async (approvalId) => {
    setProcessingStudent(approvalId);
    try {
      await API.post(`/api/coach/onboarding/pending/${approvalId}/approve/`);
      setPendingStudents(prev => prev.filter(s => s.id !== approvalId));
      setSuccess('Öğrenci onaylandı!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Onaylama başarısız');
    } finally {
      setProcessingStudent(null);
    }
  };

  const rejectStudent = async (approvalId) => {
    setProcessingStudent(approvalId);
    try {
      await API.post(`/api/coach/onboarding/pending/${approvalId}/reject/`);
      setPendingStudents(prev => prev.filter(s => s.id !== approvalId));
    } catch (err) {
      setError('Reddetme başarısız');
    } finally {
      setProcessingStudent(null);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(settings?.invite_code || '');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let obj = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const addTimeSlot = (day) => {
    const current = settings?.availability_weekly?.[day] || [];
    updateSetting(`availability_weekly.${day}`, [...current, { start: '09:00', end: '17:00' }]);
  };

  const removeTimeSlot = (day, index) => {
    const current = settings?.availability_weekly?.[day] || [];
    updateSetting(`availability_weekly.${day}`, current.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (day, index, field, value) => {
    const current = settings?.availability_weekly?.[day] || [];
    const updated = current.map((slot, i) => i === index ? { ...slot, [field]: value } : slot);
    updateSetting(`availability_weekly.${day}`, updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl flex items-center gap-2">
          <Check size={18} />
          {success}
        </div>
      )}

      {/* ===== DAVET KODU & ONBOARDİNG ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('onboarding')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserPlus className="text-purple-600" size={20} />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-gray-800">Davet Kodu & Öğrenci Onboarding</h2>
              <p className="text-gray-500 text-sm">Yeni öğrencilerin nasıl katılacağını yönetin</p>
            </div>
          </div>
          {expandedSections.onboarding ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {expandedSections.onboarding && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
            {/* Davet Kodu */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
              <label className="block text-sm font-medium text-indigo-700 mb-2">Davet Kodunuz</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-3 font-mono text-xl tracking-wider text-indigo-700 font-bold">
                  {settings?.invite_code || '------'}
                </div>
                <button
                  onClick={copyInviteCode}
                  className={`p-3 rounded-xl transition-all ${copiedInvite ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                >
                  {copiedInvite ? <Check size={20} /> : <Copy size={20} />}
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  title="Kodu Yenile"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
              <p className="text-xs text-indigo-600 mt-2">Bu kodu öğrencilerinize verin. Öğrenci bu kodu kullanarak size bağlanabilir.</p>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Davet Kodunu Yenile</h3>
                      <p className="text-sm text-gray-500">Bu işlem geri alınamaz</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Eski davet kodunuz geçersiz olacak. Daha önce paylaştığınız kod artık çalışmayacak.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={resetInviteCode}
                      disabled={resettingCode}
                      className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resettingCode ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                      Yenile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invite Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Öğrenci Katılım Modu</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('invite_mode', 'auto_add')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    settings?.invite_mode === 'auto_add'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <UserCheck className={`mb-2 ${settings?.invite_mode === 'auto_add' ? 'text-indigo-600' : 'text-gray-400'}`} size={24} />
                  <p className="font-medium text-gray-800">Direkt Ekle</p>
                  <p className="text-xs text-gray-500 mt-1">Kod kullanan öğrenci otomatik eklenir</p>
                </button>
                <button
                  onClick={() => updateSetting('invite_mode', 'needs_approval')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    settings?.invite_mode === 'needs_approval'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Shield className={`mb-2 ${settings?.invite_mode === 'needs_approval' ? 'text-indigo-600' : 'text-gray-400'}`} size={24} />
                  <p className="font-medium text-gray-800">Onaya Düşür</p>
                  <p className="text-xs text-gray-500 mt-1">Öğrenciyi manuel onaylarsınız</p>
                </button>
              </div>
            </div>

            {/* Pending Students */}
            {settings?.invite_mode === 'needs_approval' && pendingStudents.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                  <Clock size={16} />
                  Onay Bekleyen Öğrenciler ({pendingStudents.length})
                </h4>
                <div className="space-y-2">
                  {pendingStudents.map((student) => (
                    <div key={student.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email} • {new Date(student.created_at).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => rejectStudent(student.id)}
                          disabled={processingStudent === student.id}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50"
                        >
                          <UserX size={16} />
                        </button>
                        <button
                          onClick={() => approveStudent(student.id)}
                          disabled={processingStudent === student.id}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50"
                        >
                          {processingStudent === student.id ? <Loader2 className="animate-spin" size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== KURALLAR (EŞİK DEĞERLER) ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('rules')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Sliders className="text-amber-600" size={20} />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-gray-800">Kurallar & Eşik Değerler</h2>
              <p className="text-gray-500 text-sm">Bugün sayfası filtrelerini özelleştirin</p>
            </div>
          </div>
          {expandedSections.rules ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {expandedSections.rules && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
            {/* Momentum Drop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Momentum Düşüş Eşiği
              </label>
              <select
                value={settings?.rules?.momentum_drop_threshold || 10}
                onChange={(e) => updateSetting('rules.momentum_drop_threshold', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              >
                <option value={5}>-5 net düşüş</option>
                <option value={10}>-10 net düşüş</option>
                <option value={15}>-15 net düşüş</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Son deneme ile önceki arasındaki fark bu değeri geçerse uyarı görürsünüz</p>
            </div>

            {/* No Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                "Temas Yok" Eşiği
              </label>
              <select
                value={settings?.rules?.no_contact_hours || 48}
                onChange={(e) => updateSetting('rules.no_contact_hours', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              >
                <option value={24}>24 saat</option>
                <option value={48}>48 saat</option>
                <option value={72}>72 saat</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Bu süre boyunca giriş yapmayan öğrenciler "temas yok" listesinde görünür</p>
            </div>

            {/* Exam Missing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                "Deneme Bekliyor" Eşiği
              </label>
              <select
                value={settings?.rules?.exam_missing_days || 7}
                onChange={(e) => updateSetting('rules.exam_missing_days', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              >
                <option value={7}>7 gün</option>
                <option value={10}>10 gün</option>
                <option value={14}>14 gün</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Bu süre içinde deneme girmeyen öğrenciler "deneme bekliyor" listesinde görünür</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== MÜSAİTLİK & TAKVİM ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('availability')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-gray-800">Müsaitlik & Takvim</h2>
              <p className="text-gray-500 text-sm">Çalışma saatlerinizi ve ders ayarlarınızı belirleyin</p>
            </div>
          </div>
          {expandedSections.availability ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {expandedSections.availability && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zaman Dilimi</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={settings?.timezone || 'Europe/Istanbul'}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Default Session */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Ders Süresi</label>
              <div className="grid grid-cols-3 gap-3">
                {[45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    onClick={() => updateSetting('default_session_minutes', mins)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      settings?.default_session_minutes === mins
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <p className="text-lg font-bold">{mins}</p>
                    <p className="text-xs">dakika</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Approval Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ders Talebi Onayı</label>
              <select
                value={settings?.approval_mode || 'manual'}
                onChange={(e) => updateSetting('approval_mode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              >
                <option value="auto">Otomatik Onayla</option>
                <option value="manual">Koç Onaylı</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Öğrencilerin ders taleplerini nasıl onaylayacağınız</p>
            </div>

            {/* Weekly Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Haftalık Müsaitlik</label>
              <div className="space-y-3">
                {DAYS.map(day => {
                  const slots = settings?.availability_weekly?.[day.key] || [];
                  return (
                    <div key={day.key} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700 text-sm">{day.label}</span>
                        <button
                          onClick={() => addTimeSlot(day.key)}
                          className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <Plus size={14} /> Saat Ekle
                        </button>
                      </div>
                      {slots.length === 0 ? (
                        <p className="text-xs text-gray-400">Müsait değil</p>
                      ) : (
                        <div className="space-y-2">
                          {slots.map((slot, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(day.key, idx, 'start', e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                              <span className="text-gray-400">-</span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(day.key, idx, 'end', e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              />
                              <button
                                onClick={() => removeTimeSlot(day.key, idx)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== BİLDİRİM TERCİHLERİ ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('notifications')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Bell className="text-green-600" size={20} />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-gray-800">Bildirim Tercihleri</h2>
              <p className="text-gray-500 text-sm">Hangi uyarıları almak istediğinizi seçin</p>
            </div>
          </div>
          {expandedSections.notifications ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>

        {expandedSections.notifications && (
          <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700">
                💡 Bu ayarlar yakında bildirim kanallarıyla (email, push, WhatsApp) bağlanacak.
              </p>
            </div>

            {[
              { key: 'critical', label: 'Kritik Öğrenci Uyarısı', desc: 'Risk seviyesi kritik olan öğrenciler için' },
              { key: 'no_contact', label: '48 Saat Temas Yok', desc: 'Uzun süredir giriş yapmayan öğrenciler için' },
              { key: 'exam_missing', label: 'Deneme Bekliyor', desc: 'Uzun süredir deneme girmeyen öğrenciler için' },
              { key: 'daily_digest', label: 'Günlük Özet', desc: 'Her gün öğrenci durumlarının özeti' },
            ].map(notif => (
              <div key={notif.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{notif.label}</p>
                  <p className="text-xs text-gray-500">{notif.desc}</p>
                </div>
                <button
                  onClick={() => updateSetting(`notifications.${notif.key}`, !settings?.notifications?.[notif.key])}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings?.notifications?.[notif.key] ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings?.notifications?.[notif.key] ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== KAYDET BUTONU ===== */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Ayarları Kaydet
        </button>
      </div>

      {/* ===== YAKINMA PLACEHOLDER ===== */}
      <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
            <Shield className="text-gray-400" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-400">Yakında: Ödeme & Paketler</h3>
            <p className="text-xs text-gray-400">Abonelik yönetimi ve faturalandırma</p>
          </div>
        </div>
        <p className="text-sm text-gray-400">Bu özellik yakında eklenecek 🔒</p>
      </div>
    </div>
  );
}

// ==================== ANA AYARLAR BİLEŞENİ ====================
export default function Settings() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Koç bağlama
  const [coachCode, setCoachCode] = useState('');
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [connectSuccess, setConnectSuccess] = useState('');

  // Kopyalama durumları
  const [copiedStudent, setCopiedStudent] = useState(false);
  const [copiedParent, setCopiedParent] = useState(false);

  // Profil ayarları (OBP, Alan tipi, Hedef sıralama)
  const [obp, setObp] = useState('');
  const [examGoalType, setExamGoalType] = useState('SAY');
  const [targetRanking, setTargetRanking] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const role = localStorage.getItem('role');

  const EXAM_GOAL_TYPES = [
    { value: 'SAY', label: 'Sayısal' },
    { value: 'EA', label: 'Eşit Ağırlık' },
    { value: 'SOZ', label: 'Sözel' },
    { value: 'DIL', label: 'Yabancı Dil' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (role === 'student') {
        const res = await API.get('/api/student/codes/');
        setUserData(res.data);

        // Profil bilgilerini de yükle
        try {
          const avgRes = await API.get('/api/exam-averages/');
          if (avgRes.data.obp) setObp(avgRes.data.obp.toString());
          if (avgRes.data.field_type) setExamGoalType(avgRes.data.field_type);
          if (avgRes.data.target_ranking) setTargetRanking(avgRes.data.target_ranking.toString());
        } catch (avgErr) {
        }
      }
      setError(null);
    } catch (err) {
      setError('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectCoach = async (e) => {
    e.preventDefault();
    if (!coachCode.trim()) {
      setConnectError('Lütfen koç kodunu girin.');
      return;
    }

    setConnectLoading(true);
    setConnectError('');
    setConnectSuccess('');

    try {
      const res = await API.post('/api/connect-coach/', { coach_code: coachCode });
      setConnectSuccess(res.data.message);
      setCoachCode('');
      fetchData(); // Verileri yenile
    } catch (err) {
      setConnectError(err.response?.data?.error || 'Bağlantı başarısız.');
    } finally {
      setConnectLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'student') {
      setCopiedStudent(true);
      setTimeout(() => setCopiedStudent(false), 2000);
    } else {
      setCopiedParent(true);
      setTimeout(() => setCopiedParent(false), 2000);
    }
  };

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      await API.post('/api/student/profile/update/', {
        obp: obp ? parseFloat(obp) : null,
        exam_goal_type: examGoalType,
        target_ranking: targetRanking ? parseInt(targetRanking) : null,
      });
      setProfileSuccess('Profil bilgileri kaydedildi!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Kaydetme başarısız.');
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <SettingsIcon className="text-indigo-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
          <p className="text-gray-500 text-sm">Hesap ayarlarınızı yönetin</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Hesap Bilgileri - EN ÜSTTE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Hesap Bilgileri</h2>
            <p className="text-gray-500 text-sm">Temel hesap bilgileriniz</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Ad Soyad</label>
            <p className="text-gray-800 font-medium">{localStorage.getItem('user') || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Hesap Türü</label>
            <p className="text-gray-800 font-medium capitalize">
              {role === 'coach' ? '🎓 Koç' : role === 'student' ? '📚 Öğrenci' : '👨‍👩‍👧 Veli'}
            </p>
          </div>
        </div>
      </div>

      {/* Öğrenci Ayarları */}
      {role === 'student' && userData && (
        <div className="space-y-6">

          {/* YKS Ayarları - OBP, Alan, Hedef */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calculator className="text-indigo-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">YKS Ayarları</h2>
                <p className="text-gray-500 text-sm">Sıralama hesaplama için gerekli bilgiler</p>
              </div>
            </div>

            {profileError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-4">
                {profileSuccess}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* Alan Türü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alan Türü
                </label>
                <select
                  value={examGoalType}
                  onChange={(e) => setExamGoalType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all"
                >
                  {EXAM_GOAL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Hedeflediğin puan türü</p>
              </div>

              {/* OBP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OBP (Diploma Puanı)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Örn: 85.50"
                  value={obp}
                  onChange={(e) => setObp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-400 mt-1">Ortaöğretim başarı puanın (0-100)</p>
              </div>

              {/* Hedef Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Sıralama
                </label>
                <input
                  type="number"
                  placeholder="Örn: 10000"
                  value={targetRanking}
                  onChange={(e) => setTargetRanking(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all"
                  min="1"
                />
                <p className="text-xs text-gray-400 mt-1">Hedeflediğin YKS sıralaması</p>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={profileLoading}
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium
                hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Kaydet
            </button>
          </div>

          {/* Koç Bağlantısı */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-amber-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Koç Bağlantısı</h2>
                <p className="text-gray-500 text-sm">Koçunuzla bağlantınızı yönetin</p>
              </div>
            </div>

            {userData.has_coach ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Koça Bağlısınız</p>
                    <p className="text-green-600">Koçunuz: <span className="font-bold">{userData.coach_name}</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-amber-800">Henüz bir koça bağlı değilsiniz</p>
                      <p className="text-amber-700 text-sm mt-1">
                        Koçunuzdan aldığınız davet kodunu girerek bağlanabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleConnectCoach} className="space-y-4">
                  {connectError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                      {connectError}
                    </div>
                  )}
                  {connectSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm">
                      {connectSuccess}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Koç Davet Kodu"
                        value={coachCode}
                        onChange={(e) => setCoachCode(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                          outline-none transition-all uppercase font-mono"
                        maxLength={10}
                        disabled={connectLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={connectLoading || !coachCode.trim()}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium
                        hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center gap-2"
                    >
                      {connectLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <UserPlus size={18} />
                      )}
                      Bağlan
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Kodlarım */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <KeyRound className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Kodlarım</h2>
                <p className="text-gray-500 text-sm">Kişisel kodlarınız</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Öğrenci Kodu */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Öğrenci Kodu
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg tracking-wider">
                    {userData.student_code || '-'}
                  </div>
                  <button
                    onClick={() => copyToClipboard(userData.student_code, 'student')}
                    className={`p-3 rounded-xl transition-all ${
                      copiedStudent
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {copiedStudent ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Bu kod sizin benzersiz öğrenci kodunuzdur.</p>
              </div>

              {/* Veli Davet Kodu */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
                <label className="block text-sm font-medium text-emerald-700 mb-2 flex items-center gap-2">
                  <Users size={16} />
                  Veli Davet Kodu
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-emerald-200 rounded-xl px-4 py-3 font-mono text-lg tracking-wider text-emerald-700">
                    {userData.parent_invite_code || '-'}
                  </div>
                  <button
                    onClick={() => copyToClipboard(userData.parent_invite_code, 'parent')}
                    className={`p-3 rounded-xl transition-all ${
                      copiedParent
                        ? 'bg-green-100 text-green-600'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    {copiedParent ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                <p className="text-xs text-emerald-600 mt-2">
                  Bu kodu velinize verin. Veli bu kodu kullanarak hesap açıp sizi takip edebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Koç Ayarları */}
      {role === 'coach' && <CoachSettingsPanel />}
    </div>
  );
}
