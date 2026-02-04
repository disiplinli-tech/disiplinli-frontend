import { useState, useEffect } from 'react';
import API from '../api';
import {
  Settings as SettingsIcon, User, Mail, KeyRound, Copy, Check,
  UserPlus, Users, GraduationCap, AlertCircle, Loader2, Target, Calculator, Save
} from 'lucide-react';

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
          console.log('Ortalamalar yüklenemedi');
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
      {role === 'coach' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-amber-600" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Koç Ayarları</h2>
              <p className="text-gray-500 text-sm">Koç hesap ayarlarınız</p>
            </div>
          </div>
          
          <p className="text-gray-500">Koç ayarları yakında eklenecek...</p>
        </div>
      )}

      {/* Hesap Bilgileri */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
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
    </div>
  );
}