import { useState, useEffect } from 'react';
import API from '../api';
import { 
  Trophy, Target, TrendingUp, Calendar, BookOpen, User, 
  GraduationCap, Clock, AlertCircle, RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/parent/dashboard/');
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error('Parent dashboard error:', err);
      setError(err.response?.data?.error || 'Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const formatRanking = (ranking) => {
    if (!ranking) return '-';
    return ranking.toLocaleString('tr-TR');
  };

  const formatDate = (dateStr) => {
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

  // Grafik verisi hazırla
  const chartData = data.exams
    .filter(e => e.exam_type === 'TYT')
    .slice(0, 10)
    .reverse()
    .map(e => ({
      date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      net: e.net_score,
    }));

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Merhaba, {data.parent_name}! 👋</h1>
            <p className="text-emerald-100">
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2">
            <User size={20} />
            <span className="font-medium">Veli Paneli</span>
          </div>
        </div>
      </div>

      {/* Öğrenci Bilgisi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {data.student.name?.charAt(0) || 'Ö'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{data.student.name}</h2>
            <p className="text-gray-500 text-sm">{data.student.email}</p>
            <div className="flex items-center gap-4 mt-2">
              {data.coach_name && (
                <span className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <GraduationCap size={14} />
                  Koç: {data.coach_name}
                </span>
              )}
              {data.student.last_activity && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock size={14} />
                  Son aktivite: {formatDate(data.student.last_activity)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* TYT Sıralama */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3 text-blue-100">
            <Trophy size={18} />
            <span className="text-sm font-medium">TYT Sıralama</span>
          </div>
          <p className="text-2xl font-bold">{formatRanking(data.last_tyt_ranking)}</p>
          <p className="text-blue-200 text-sm mt-1">{data.last_tyt_net ? `${data.last_tyt_net} net` : '-'}</p>
        </div>

        {/* AYT Sıralama */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3 text-purple-100">
            <Trophy size={18} />
            <span className="text-sm font-medium">AYT Sıralama</span>
          </div>
          <p className="text-2xl font-bold">{formatRanking(data.last_ayt_ranking)}</p>
          <p className="text-purple-200 text-sm mt-1">{data.last_ayt_net ? `${data.last_ayt_net} net` : '-'}</p>
        </div>

        {/* Hedef Sıralama */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3 text-orange-100">
            <Target size={18} />
            <span className="text-sm font-medium">Hedef Sıralama</span>
          </div>
          <p className="text-2xl font-bold">{formatRanking(data.student.target_ranking)}</p>
          <p className="text-orange-200 text-sm mt-1">Belirlenen hedef</p>
        </div>

        {/* Toplam Deneme */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3 text-green-100">
            <BookOpen size={18} />
            <span className="text-sm font-medium">Toplam Deneme</span>
          </div>
          <p className="text-2xl font-bold">{data.total_exams}</p>
          <p className="text-green-200 text-sm mt-1">Girilen deneme</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-500" size={20} />
            <h3 className="font-bold text-gray-800">TYT Net Gelişimi</h3>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis domain={[0, 120]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} net`, 'TYT']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#4f46e5' }}
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

        {/* Son Denemeler */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-indigo-500" size={20} />
            <h3 className="font-bold text-gray-800">Son Denemeler</h3>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {data.exams.length > 0 ? (
              data.exams.slice(0, 10).map((exam) => (
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
              <p className="text-gray-400 text-center py-8">Henüz deneme girilmemiş</p>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-indigo-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Veli Paneli Hakkında</h4>
            <p className="text-gray-600 text-sm">
              Bu panel üzerinden öğrencinizin deneme sonuçlarını, sıralama tahminlerini ve gelişim grafiğini takip edebilirsiniz. 
              Veriler öğrenciniz yeni deneme girdikçe otomatik olarak güncellenir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}