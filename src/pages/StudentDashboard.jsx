import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  TrendingUp, Target, Award, BookOpen, Calendar, MessageCircle,
  ChevronRight, Trophy, Zap, BarChart3, Clock, CheckCircle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart
} from 'recharts';

export default function StudentDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const studentName = user?.first_name || user?.username || 'Öğrenci';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, examsRes] = await Promise.all([
        API.get("/api/student/stats/"),
        API.get("/api/exams/")
      ]);
      setStats(statsRes.data);
      setExams(examsRes.data || []);
    } catch (err) {
      console.error("Veri yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Son denemelerden sıralama hesapla
  const getLatestRankings = () => {
    const types = ['TYT', 'AYT_SAY', 'AYT_EA', 'AYT_SOZ'];
    const rankings = {};
    
    types.forEach(type => {
      const typeExams = exams.filter(e => e.exam_type === type);
      if (typeExams.length > 0) {
        const latest = typeExams[0];
        rankings[type] = {
          net: latest.net_score,
          ranking: estimateRanking(latest.net_score, type),
          date: latest.date
        };
      }
    });
    
    return rankings;
  };

  // Grafik verisi hazırla
  const prepareChartData = () => {
    const tytExams = exams.filter(e => e.exam_type === 'TYT').slice(0, 10).reverse();
    return tytExams.map(e => ({
      date: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      net: e.net_score,
      ranking: estimateRanking(e.net_score, 'TYT')
    }));
  };

  const rankings = getLatestRankings();
  const chartData = prepareChartData();
  
  // Hedef alan belirleme (varsayılan Sayısal)
  const goalType = user?.exam_goal_type || 'SAY';
  const mainAYTType = goalType === 'SAY' ? 'AYT_SAY' : goalType === 'EA' ? 'AYT_EA' : 'AYT_SOZ';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header - Hoşgeldin + Sıralamalar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Merhaba, {studentName}! 📚</h1>
                <p className="text-indigo-100 text-sm mt-1">
                  {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              {/* Koçum */}
              {stats?.coach && (
                <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    {stats.coach.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white">
                    <p className="text-xs opacity-80">Koçun</p>
                    <p className="font-semibold">{stats.coach}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sıralama Kartları */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* TYT Sıralaması */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">TYT Sıralama</span>
              </div>
              <p className="text-2xl font-bold">
                {rankings.TYT ? formatRanking(rankings.TYT.ranking) : '-'}
              </p>
              {rankings.TYT && (
                <p className="text-xs opacity-70 mt-1">{rankings.TYT.net} net</p>
              )}
            </div>
            
            {/* AYT Sıralaması */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">AYT Sıralama</span>
              </div>
              <p className="text-2xl font-bold">
                {rankings[mainAYTType] ? formatRanking(rankings[mainAYTType].ranking) : '-'}
              </p>
              {rankings[mainAYTType] && (
                <p className="text-xs opacity-70 mt-1">{rankings[mainAYTType].net} net</p>
              )}
            </div>
            
            {/* Yerleşme Tahmini */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">Yerleşme</span>
              </div>
              <p className="text-2xl font-bold">
                {rankings.TYT && rankings[mainAYTType] 
                  ? formatRanking(Math.min(rankings.TYT.ranking, rankings[mainAYTType].ranking))
                  : '-'}
              </p>
              <p className="text-xs opacity-70 mt-1">Tahmini</p>
            </div>
            
            {/* Deneme Sayısı */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={18} className="opacity-80" />
                <span className="text-sm font-medium opacity-90">Deneme</span>
              </div>
              <p className="text-2xl font-bold">{exams.length}</p>
              <p className="text-xs opacity-70 mt-1">Toplam deneme</p>
            </div>
          </div>
        </div>

        {/* Ana İçerik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol: Grafik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Net Gelişimi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" size={20} />
                  TYT Net Gelişimi
                </h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                  <option>Son 10 Deneme</option>
                  <option>Son 1 Ay</option>
                  <option>Tümü</option>
                </select>
              </div>
              
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" domain={[0, 120]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value, name) => [value, name === 'net' ? 'Net' : 'Sıralama']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#6366F1" 
                      strokeWidth={3}
                      fill="url(#netGradient)"
                      dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Henüz deneme sonucu yok</p>
                    <button 
                      onClick={() => navigate('/exams')}
                      className="mt-2 text-indigo-600 font-medium hover:underline"
                    >
                      İlk denemeni ekle →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Son Denemeler */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Award className="text-amber-500" size={20} />
                  Son Denemeler
                </h2>
                <button 
                  onClick={() => navigate('/exams')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  Tümünü Gör <ChevronRight size={16} />
                </button>
              </div>
              
              {exams.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {exams.slice(0, 5).map((exam, idx) => {
                    const typeLabels = {
                      'TYT': { name: 'TYT', color: 'blue' },
                      'AYT_SAY': { name: 'AYT Sayısal', color: 'purple' },
                      'AYT_EA': { name: 'AYT EA', color: 'green' },
                      'AYT_SOZ': { name: 'AYT Sözel', color: 'orange' },
                    };
                    const info = typeLabels[exam.exam_type] || { name: exam.exam_type, color: 'gray' };
                    const ranking = estimateRanking(exam.net_score, exam.exam_type);
                    
                    return (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-${info.color}-100 flex items-center justify-center`}>
                            <Award className={`text-${info.color}-600`} size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{info.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(exam.date).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{exam.net_score} net</p>
                          {ranking && (
                            <p className="text-xs text-indigo-600">~{formatRanking(ranking)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p>Henüz deneme sonucu yok</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ: Hızlı Erişim */}
          <div className="space-y-6">
            {/* Hızlı Eylemler */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-amber-500" size={20} />
                Hızlı Eylemler
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/exams')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 
                    hover:bg-indigo-50 transition-all group text-center"
                >
                  <TrendingUp className="mx-auto text-gray-400 group-hover:text-indigo-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">Deneme Ekle</span>
                </button>
                
                <button 
                  onClick={() => navigate('/schedule')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 
                    hover:bg-purple-50 transition-all group text-center"
                >
                  <Calendar className="mx-auto text-gray-400 group-hover:text-purple-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Programım</span>
                </button>
                
                <button 
                  onClick={() => navigate('/messages')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-300 
                    hover:bg-green-50 transition-all group text-center"
                >
                  <MessageCircle className="mx-auto text-gray-400 group-hover:text-green-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Mesajlar</span>
                </button>
                
                <button 
                  onClick={() => navigate('/assignments')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 
                    hover:bg-orange-50 transition-all group text-center"
                >
                  <CheckCircle className="mx-auto text-gray-400 group-hover:text-orange-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Ödevler</span>
                </button>
              </div>
            </div>

            {/* Hedef Kartı */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target size={18} />
                  Hedefin
                </h3>
                <button className="text-xs bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30">
                  Düzenle
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs opacity-80">Hedef Sıralama</p>
                  <p className="text-xl font-bold">
                    {user?.target_ranking ? formatRanking(user.target_ranking) : '50.000'}
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-xs opacity-80">Mevcut Durumun</p>
                  <p className="text-xl font-bold">
                    {rankings.TYT ? formatRanking(rankings.TYT.ranking) : '-'}
                  </p>
                </div>
                
                {rankings.TYT && user?.target_ranking && (
                  <div className="text-center pt-2">
                    <p className="text-sm opacity-80">
                      {rankings.TYT.ranking > user.target_ranking 
                        ? `Hedefe ${formatRanking(rankings.TYT.ranking - user.target_ranking)} kişi kaldı 💪`
                        : 'Hedefine ulaştın! 🎉'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Günlük Motivasyon */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <p className="text-sm text-amber-800 font-medium">Günün Sözü</p>
                  <p className="text-amber-700 mt-1 text-sm italic">
                    "Başarı, her gün tekrarlanan küçük çabaların toplamıdır."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}