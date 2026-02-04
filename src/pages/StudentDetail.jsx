import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  ArrowLeft, Mail, Target, TrendingUp, TrendingDown, Minus,
  Calendar, Award, BarChart3, Trophy, MessageCircle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area
} from 'recharts';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const studentRes = await API.get(`/api/student/${id}/`);
      setStudent(studentRes.data);
      
      // Exams varsa al
      if (studentRes.data.exams) {
        setExams(studentRes.data.exams);
      } else {
        try {
          const examsRes = await API.get(`/api/student/${id}/exams/`);
          setExams(examsRes.data || []);
        } catch (e) {
          console.log("Exams endpoint yok, boş bırakılıyor");
        }
      }
    } catch (err) {
      console.error("Veri yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sıralamalar - backend'den gelen estimated_ranking kullanılıyor
  const getLatestRankings = () => {
    const types = ['TYT', 'AYT_SAY', 'AYT_EA', 'AYT_SOZ'];
    const rankings = {};

    types.forEach(type => {
      const typeExams = exams.filter(e => e.exam_type === type);
      if (typeExams.length > 0) {
        const latest = typeExams[0];
        const previous = typeExams[1];
        rankings[type] = {
          net: latest.net_score,
          ranking: latest.estimated_ranking,  // Backend'den geliyor
          change: previous ? latest.net_score - previous.net_score : null,
          date: latest.date
        };
      }
    });

    return rankings;
  };

  // Grafik verisi - backend'den gelen estimated_ranking kullanılıyor
  const getTYTChartData = () => {
    return exams
      .filter(e => e.exam_type === 'TYT')
      .slice(0, 10)
      .reverse()
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        net: e.net_score,
        ranking: e.estimated_ranking  // Backend'den geliyor
      }));
  };

  const rankings = getLatestRankings();
  const tytChartData = getTYTChartData();

  // İstatistikler
  const getStats = (type) => {
    const typeExams = exams.filter(e => e.exam_type === type);
    if (typeExams.length === 0) return null;
    
    const nets = typeExams.map(e => e.net_score);
    return {
      count: typeExams.length,
      avg: (nets.reduce((a, b) => a + b, 0) / nets.length).toFixed(1),
      max: Math.max(...nets),
      min: Math.min(...nets),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Öğrenci bulunamadı</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Geri</span>
        </button>

        {/* Öğrenci Bilgi Kartı */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                  {student.name?.charAt(0).toUpperCase() || 'Ö'}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{student.name}</h1>
                  <p className="text-indigo-100 flex items-center gap-2 mt-1">
                    <Mail size={14} />
                    {student.email}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/messages')}
                className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white"
              >
                <MessageCircle size={18} />
                Mesaj Gönder
              </button>
            </div>
          </div>
          
          {/* Sıralama Kartları */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* TYT */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">TYT Sıralama</span>
                {rankings.TYT?.change !== null && (
                  <span className={`text-xs font-bold flex items-center gap-0.5
                    ${rankings.TYT.change > 0 ? 'text-green-600' : rankings.TYT.change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {rankings.TYT.change > 0 ? <TrendingUp size={12} /> : rankings.TYT.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                    {rankings.TYT.change > 0 ? '+' : ''}{rankings.TYT.change?.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {rankings.TYT ? formatRanking(rankings.TYT.ranking) : '-'}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {rankings.TYT ? `${rankings.TYT.net} net` : 'Henüz deneme yok'}
              </p>
            </div>
            
            {/* AYT */}
            <div className="bg-purple-50 rounded-xl p-4">
              <span className="text-sm font-medium text-purple-600">AYT Sıralama</span>
              <p className="text-2xl font-bold text-purple-700 mt-2">
                {rankings.AYT_SAY ? formatRanking(rankings.AYT_SAY.ranking) : '-'}
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {rankings.AYT_SAY ? `${rankings.AYT_SAY.net} net` : 'Henüz deneme yok'}
              </p>
            </div>
            
            {/* Ortalama */}
            <div className="bg-green-50 rounded-xl p-4">
              <span className="text-sm font-medium text-green-600">Ort. TYT</span>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {getStats('TYT')?.avg || '-'}
              </p>
              <p className="text-xs text-green-500 mt-1">
                {getStats('TYT')?.count || 0} deneme
              </p>
            </div>
            
            {/* Max */}
            <div className="bg-amber-50 rounded-xl p-4">
              <span className="text-sm font-medium text-amber-600">Max TYT</span>
              <p className="text-2xl font-bold text-amber-700 mt-2">
                {getStats('TYT')?.max || '-'}
              </p>
              <p className="text-xs text-amber-500 mt-1">En iyi sonuç</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 flex">
            {[
              { key: 'overview', label: 'Genel Bakış', icon: BarChart3 },
              { key: 'exams', label: 'Denemeler', icon: Award },
              { key: 'schedule', label: 'Program', icon: Calendar },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.key 
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TYT Chart */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={18} />
                    TYT Net Gelişimi
                  </h3>
                  
                  {tytChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={tytChartData}>
                        <defs>
                          <linearGradient id="tytGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={[0, 120]} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} fill="url(#tytGradient)" dot={{ fill: '#3B82F6', r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-gray-400">
                      Henüz TYT denemesi yok
                    </div>
                  )}
                </div>

                {/* Ranking Chart */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Trophy className="text-amber-500" size={18} />
                    Sıralama Gelişimi
                  </h3>
                  
                  {tytChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={tytChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                        <YAxis 
                          tick={{ fontSize: 11 }} 
                          stroke="#9CA3AF" 
                          tickFormatter={(v) => v > 1000000 ? `${(v/1000000).toFixed(1)}M` : v > 1000 ? `${(v/1000).toFixed(0)}K` : v}
                          reversed
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [formatRanking(value), 'Sıralama']}
                        />
                        <Line type="monotone" dataKey="ranking" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-gray-400">
                      Henüz deneme yok
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['TYT', 'AYT_SAY', 'AYT_EA', 'AYT_SOZ'].map(type => {
                    const stats = getStats(type);
                    if (!stats) return null;
                    
                    const labels = { 'TYT': 'TYT', 'AYT_SAY': 'AYT Sayısal', 'AYT_EA': 'AYT EA', 'AYT_SOZ': 'AYT Sözel' };
                    
                    return (
                      <div key={type} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-600 mb-3">{labels[type]}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Deneme</span>
                            <span className="font-semibold">{stats.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ortalama</span>
                            <span className="font-semibold">{stats.avg}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">En Yüksek</span>
                            <span className="font-semibold text-green-600">{stats.max}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">En Düşük</span>
                            <span className="font-semibold text-red-500">{stats.min}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exams */}
            {activeTab === 'exams' && (
              <div>
                {exams.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Award size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Henüz deneme sonucu yok</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                          <th className="pb-3 font-medium">Tarih</th>
                          <th className="pb-3 font-medium">Tür</th>
                          <th className="pb-3 font-medium text-right">Net</th>
                          <th className="pb-3 font-medium text-right">Sıralama</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {exams.map((exam, idx) => {
                          const typeColors = { 'TYT': 'blue', 'AYT_SAY': 'purple', 'AYT_EA': 'green', 'AYT_SOZ': 'orange' };
                          const typeNames = { 'TYT': 'TYT', 'AYT_SAY': 'AYT Sayısal', 'AYT_EA': 'AYT EA', 'AYT_SOZ': 'AYT Sözel' };

                          return (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-3">{new Date(exam.date).toLocaleDateString('tr-TR')}</td>
                              <td className="py-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${typeColors[exam.exam_type] || 'gray'}-100 text-${typeColors[exam.exam_type] || 'gray'}-700`}>
                                  {typeNames[exam.exam_type] || exam.exam_type}
                                </span>
                              </td>
                              <td className="py-3 text-right font-bold">{exam.net_score}</td>
                              <td className="py-3 text-right text-indigo-600 font-medium">~{formatRanking(exam.estimated_ranking)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Schedule */}
            {activeTab === 'schedule' && (
              <div className="text-center py-12 text-gray-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>Program görünümü yakında</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}