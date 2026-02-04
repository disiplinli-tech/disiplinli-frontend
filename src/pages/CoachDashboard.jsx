import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  Users, TrendingUp, Calendar, MessageCircle, Award, Eye,
  ChevronRight, Copy, Check, Target, BarChart3, Bell
} from "lucide-react";

export default function CoachDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const coachName = user?.first_name || user?.username || 'Hocam';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        API.get("/api/dashboard/stats/"),
        API.get("/api/coach/students/")
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error("Dashboard verisi yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(stats?.invite_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Öğrencileri son net'e göre sırala
  const sortedStudents = [...students].sort((a, b) => {
    const aNet = a.last_tyt_net || 0;
    const bNet = b.last_tyt_net || 0;
    return bNet - aNet;
  });

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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hoş Geldiniz, {coachName}! 🎓</h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Davet Kodu */}
        {stats?.invite_code && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Davet Kodu</p>
                <p className="text-xs opacity-60 mt-1">Öğrencilerinizle paylaşın</p>
              </div>
              <button
                onClick={copyInviteCode}
                className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl transition-colors"
              >
                <span className="text-2xl font-bold tracking-wider">{stats.invite_code}</span>
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Öğrenci</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.total_students || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Bugün</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.active_today || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bu Hafta Deneme</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.exams_this_week || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Bell className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bekleyen Ödev</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.pending_assignments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Öğrencilerim */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Öğrencilerim</h2>
            <button 
              onClick={() => navigate('/students')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              Tümünü Gör <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Tablo Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="col-span-4">ÖĞRENCİ</div>
            <div className="col-span-2 text-center">SON TYT</div>
            <div className="col-span-2 text-center">SIRALAMA</div>
            <div className="col-span-2 text-center">SON AKTİVİTE</div>
            <div className="col-span-2 text-right">İŞLEMLER</div>
          </div>
          
          {/* Öğrenci Listesi */}
          <div className="divide-y divide-gray-50">
            {sortedStudents.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Henüz öğrenciniz yok</p>
                <p className="text-sm text-gray-400 mt-2">Davet kodunuzu paylaşarak öğrenci ekleyin</p>
              </div>
            ) : (
              sortedStudents.map((student, idx) => {
                const lastNet = student.last_tyt_net || student.last_net;
                const ranking = student.estimated_ranking;  // Backend'den geliyor
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
                
                return (
                  <div 
                    key={student.id} 
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/student/${student.id}`)}
                  >
                    {/* Öğrenci */}
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold`}>
                        {student.name?.charAt(0).toUpperCase() || 'Ö'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400 truncate">{student.email}</p>
                      </div>
                    </div>
                    
                    {/* Son TYT */}
                    <div className="hidden md:block col-span-2 text-center">
                      {lastNet ? (
                        <span className="text-lg font-bold text-gray-800">{lastNet}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    
                    {/* Sıralama */}
                    <div className="hidden md:block col-span-2 text-center">
                      {ranking ? (
                        <span className="text-indigo-600 font-semibold">~{formatRanking(ranking)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    
                    {/* Son Aktivite */}
                    <div className="hidden md:block col-span-2 text-center text-sm text-gray-500">
                      {student.last_activity 
                        ? new Date(student.last_activity).toLocaleDateString('tr-TR')
                        : '-'}
                    </div>
                    
                    {/* İşlemler */}
                    <div className="hidden md:flex col-span-2 justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}`); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                        title="Detay"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/schedule'); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                        title="Program"
                      >
                        <Calendar size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50"
                        title="Mesaj"
                      >
                        <MessageCircle size={18} />
                      </button>
                    </div>

                    {/* Mobil: Net ve Sıralama */}
                    <div className="col-span-12 md:hidden flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        {lastNet && <span className="text-sm"><strong>{lastNet}</strong> net</span>}
                        {ranking && <span className="text-sm text-indigo-600">~{formatRanking(ranking)}</span>}
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}