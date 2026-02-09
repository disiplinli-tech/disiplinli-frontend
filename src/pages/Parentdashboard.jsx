import { useState, useEffect } from 'react';
import API from '../api';
import { formatRanking, formatDate } from '../utils/formatters';
import {
  Trophy, Target, TrendingUp, Calendar, BookOpen, User,
  GraduationCap, Clock, AlertCircle, RefreshCw, Link, Loader2, Award, BarChart3, Eye, MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsLink, setNeedsLink] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  // Yeni state'ler - Koç notları ve haftalık özet
  const [coachNotes, setCoachNotes] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(null);

  useEffect(() => {
    fetchData();
    fetchExtraData(); // Koç notları ve haftalık özet
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/parent/dashboard/');
      setData(res.data);
      setError(null);
      setNeedsLink(false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Veriler yüklenemedi.';
      if (errorMsg.includes('Bağlı öğrenci bulunamadı')) {
        setNeedsLink(true);
        setError(null);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Koç notları ve haftalık özeti yükle
  const fetchExtraData = async () => {
    try {
      const [notesRes, summaryRes] = await Promise.all([
        API.get('/api/parent/coach-notes/').catch(() => ({ data: { notes: [] } })),
        API.get('/api/parent/weekly-summary/').catch(() => ({ data: null }))
      ]);
      setCoachNotes(notesRes.data.notes || []);
      setWeeklySummary(summaryRes.data);
    } catch (err) {
      console.log('Ekstra veli verileri yüklenemedi');
    }
  };

  const handleLinkStudent = async (e) => {
    e.preventDefault();
    if (!studentCode.trim()) {
      setLinkError('Lütfen öğrenci kodunu girin');
      return;
    }

    setLinkLoading(true);
    setLinkError('');

    try {
      await API.post('/api/parent/link-student/', { student_code: studentCode.trim() });
      // Başarılı - dashboard'u yeniden yükle
      fetchData();
    } catch (err) {
      setLinkError(err.response?.data?.error || 'Bağlantı kurulamadı');
    } finally {
      setLinkLoading(false);
    }
  };

  const formatDateLocal = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Öğrenci bağlama ekranı
  if (needsLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Öğrenci Bağlantısı</h2>
            <p className="text-gray-500">
              Öğrencinizin size verdiği <strong>Veli Davet Kodunu</strong> girerek hesabınızı bağlayın.
            </p>
          </div>

          <form onSubmit={handleLinkStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öğrenci Veli Davet Kodu
              </label>
              <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                placeholder="Örn: VEL-ABC123"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-lg font-mono tracking-wider"
                maxLength={15}
              />
            </div>

            {linkError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                {linkError}
              </div>
            )}

            <button
              type="submit"
              disabled={linkLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {linkLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Bağlanıyor...
                </>
              ) : (
                <>
                  <Link size={20} />
                  Öğrenciyi Bağla
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>💡 İpucu:</strong> Öğrenciniz, kendi panelindeki <strong>Ayarlar</strong> sayfasından
              Veli Davet Kodunu bulabilir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bir Sorun Oluştu</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={18} />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // TYT Grafik verisi
  const tytChartData = (data.tyt_chart_data || []).map(e => ({
    date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: e.net,
  }));

  // AYT Grafik verisi
  const aytChartData = (data.ayt_chart_data || []).map(e => ({
    date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    net: e.net,
  }));

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Merhaba, {data.parent_name}! 👋</h1>
            <p className="text-emerald-100">
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2">
            <User size={20} />
            <span className="font-medium">Veli Paneli</span>
          </div>
        </div>
      </div>

      {/* Öğrenci Bilgisi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {data.student.name?.charAt(0) || 'Ö'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800">{data.student.name}</h2>
            <p className="text-gray-500 text-sm truncate">{data.student.email}</p>
            <div className="flex items-center gap-2 md:gap-4 mt-2 flex-wrap">
              {data.student.field_type_display && (
                <span className="flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  <BarChart3 size={14} />
                  {data.student.field_type_display}
                </span>
              )}
              {data.coach_name && (
                <span className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <GraduationCap size={14} />
                  Koç: {data.coach_name}
                </span>
              )}
              {data.student.obp && (
                <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Award size={14} />
                  Diploma: {data.student.obp}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları - 5'li Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* TYT Yerleştirme */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 md:p-5 text-white">
          <div className="flex items-center gap-2 mb-2 text-blue-100">
            <Trophy size={16} />
            <span className="text-xs md:text-sm font-medium">TYT Yerleştirme</span>
          </div>
          <p className="text-xl md:text-2xl font-bold">{formatRanking(data.tyt_ranking || data.tyt_avg_ranking)}</p>
          <p className="text-blue-200 text-xs md:text-sm mt-1">
            {data.tyt_avg_net ? `${data.tyt_avg_net} net ort.` : '-'}
          </p>
        </div>

        {/* AYT Yerleştirme */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 md:p-5 text-white">
          <div className="flex items-center gap-2 mb-2 text-purple-100">
            <Trophy size={16} />
            <span className="text-xs md:text-sm font-medium">AYT Yerleştirme</span>
          </div>
          <p className="text-xl md:text-2xl font-bold">{formatRanking(data.ayt_ranking || data.ayt_avg_ranking)}</p>
          <p className="text-purple-200 text-xs md:text-sm mt-1">
            {data.ayt_avg_net ? `${data.ayt_avg_net} net ort.` : '-'}
          </p>
        </div>

        {/* Hedef Sıralama */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-4 md:p-5 text-white">
          <div className="flex items-center gap-2 mb-2 text-orange-100">
            <Target size={16} />
            <span className="text-xs md:text-sm font-medium">Hedef</span>
          </div>
          <p className="text-xl md:text-2xl font-bold">{formatRanking(data.student.target_ranking)}</p>
          <p className="text-orange-200 text-xs md:text-sm mt-1">Belirlenen hedef</p>
        </div>

        {/* TYT Deneme Sayısı */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 md:p-5 text-white">
          <div className="flex items-center gap-2 mb-2 text-emerald-100">
            <BookOpen size={16} />
            <span className="text-xs md:text-sm font-medium">TYT Deneme</span>
          </div>
          <p className="text-xl md:text-2xl font-bold">{data.tyt_exam_count || 0}</p>
          <p className="text-emerald-200 text-xs md:text-sm mt-1">Çözülen TYT</p>
        </div>

        {/* AYT Deneme Sayısı */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-4 md:p-5 text-white col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2 text-rose-100">
            <BookOpen size={16} />
            <span className="text-xs md:text-sm font-medium">AYT Deneme</span>
          </div>
          <p className="text-xl md:text-2xl font-bold">{data.ayt_exam_count || 0}</p>
          <p className="text-rose-200 text-xs md:text-sm mt-1">Çözülen AYT</p>
        </div>
      </div>

      {/* Grafikler - 2'li Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* TYT Grafik */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-500" size={20} />
            <h3 className="font-bold text-gray-800">TYT Net Gelişimi</h3>
            {data.tyt_avg_net && (
              <span className="ml-auto text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Ort: {data.tyt_avg_net} net
              </span>
            )}
          </div>

          {tytChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tytChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis domain={[0, 120]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} net`, 'TYT']}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Henüz TYT denemesi girilmemiş
            </div>
          )}
        </div>

        {/* AYT Grafik */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-purple-500" size={20} />
            <h3 className="font-bold text-gray-800">AYT Net Gelişimi</h3>
            {data.ayt_avg_net && (
              <span className="ml-auto text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                Ort: {data.ayt_avg_net} net
              </span>
            )}
          </div>

          {aytChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aytChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis domain={[0, 80]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} net`, 'AYT']}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#9333ea' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Henüz AYT denemesi girilmemiş
            </div>
          )}
        </div>
      </div>

      {/* Koç Takip Ediyor Badge + Haftalık Özet + Koç Notları - YENİ */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Koç Takip Ediyor Badge */}
        {(data.coach_name || weeklySummary?.coach_tracking) && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Eye size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg">👀 Koç düzenli takip ediyor</p>
                <p className="text-sm text-emerald-100">
                  {weeklySummary?.coach_name || data.coach_name || 'Koçunuz'} öğrencinizin ilerlemesini izliyor
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Haftalık Özet - Bu Hafta */}
        {weeklySummary?.summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              📊 Bu Hafta
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-gray-600">✔ Çalıştığı gün</span>
                <span className="font-bold text-green-700">{weeklySummary.summary.days_active} / 7</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-gray-600">✔ Tahmini soru</span>
                <span className="font-bold text-blue-700">~{weeklySummary.summary.questions_solved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-gray-600">✔ Deneme</span>
                <span className="font-bold text-purple-700">{weeklySummary.summary.exams_count}</span>
              </div>
              {weeklySummary.summary.current_streak > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <span className="text-sm text-gray-600">🔥 Seri</span>
                  <span className="font-bold text-orange-700">{weeklySummary.summary.current_streak} gün</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Koç Notları */}
        {coachNotes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-500" />
              Koçun Notları
            </h3>
            <div className="space-y-3">
              {coachNotes.slice(0, 3).map((note, index) => (
                <div key={note.id || index} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-400">
                  <p className="text-sm text-gray-700 italic">"{note.content}"</p>
                  <p className="text-xs text-gray-400 mt-2">{note.week_label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Son Denemeler */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-indigo-500" size={20} />
          <h3 className="font-bold text-gray-800">Son Denemeler</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {data.exams.length > 0 ? (
            data.exams.slice(0, 12).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    exam.exam_type === 'TYT' ? 'bg-blue-100 text-blue-700' :
                    exam.exam_type.startsWith('AYT') ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {exam.exam_type}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(exam.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{exam.net_score} net</p>
                  <p className="text-xs text-gray-400">~{formatRanking(exam.ranking)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8 col-span-full">Henüz deneme girilmemiş</p>
          )}
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-indigo-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Veli Paneli Hakkında</h4>
            <p className="text-gray-600 text-sm">
              Bu panelde öğrencinizin <strong>TYT ve AYT ortalama netleri</strong>, <strong>yerleştirme sıralaması tahmini</strong> ve
              gelişim grafiklerini takip edebilirsiniz. Sıralamalar, öğrencinizin tüm denemelerinin ortalamasına göre hesaplanır.
              Yerleştirme tahmini, TYT + AYT ortalamaları ve diploma notuna göre hesaplanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}