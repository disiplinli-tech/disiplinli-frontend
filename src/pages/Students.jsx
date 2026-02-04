import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { 
  Users, Flame, Eye, Calendar, MessageCircle, Search, 
  TrendingUp, Clock, BookOpen, ChevronRight, Award,
  Filter, SortAsc, ClipboardList, Trophy
} from "lucide-react";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/api/dashboard/");
      setStudents(res.data.students || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students
    .filter(s => 
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "streak") return (b.streak || 0) - (a.streak || 0);
      if (sortBy === "exam") return (b.last_exam_net || 0) - (a.last_exam_net || 0);
      return (a.name || "").localeCompare(b.name || "");
    });

  // Öğrenci detayına git
  const handleViewStudent = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  // ✅ Öğrencinin BİREYSEL haftalık programına git
  const handleCalendar = (studentId) => {
    navigate(`/student/${studentId}/schedule`);
  };

  // ✅ Canlı chat'e git
  const handleMessage = (student) => {
    navigate('/chat', { state: { userId: student.user_id, userName: student.name } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Öğrenciler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Öğrencilerim</h2>
          <p className="text-gray-500 text-sm mt-1">Toplam {students.length} öğrenci</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-xl">
            <div className="text-xs opacity-80">Aktif</div>
            <div className="font-bold">{students.filter(s => s.streak > 0).length}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl">
            <div className="text-xs opacity-80">En Yüksek Seri</div>
            <div className="font-bold">{Math.max(...students.map(s => s.streak || 0), 0)} gün</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Öğrenci ara (isim veya e-posta)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="name">İsme Göre</option>
            <option value="streak">Seriye Göre</option>
            <option value="exam">Net'e Göre</option>
          </select>
          <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Öğrenci Kartları */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student, i) => (
            <div 
              key={student.id || i} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {student.name?.charAt(0).toUpperCase() || 'Ö'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {student.email}
                    </p>
                  </div>
                </div>
                
                {/* Seri Badge */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  student.streak > 0 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Flame size={12} className={student.streak > 0 ? 'text-orange-500' : ''} />
                  {student.streak || 0}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <TrendingUp size={14} className="mx-auto text-blue-500 mb-1" />
                  <div className="text-xs text-gray-600">Son Net</div>
                  <div className="font-bold text-blue-700 text-sm">
                    {student.last_exam_net ? student.last_exam_net.toFixed(1) : '-'}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <Clock size={14} className="mx-auto text-green-500 mb-1" />
                  <div className="text-xs text-gray-600">Çalışma</div>
                  <div className="font-bold text-green-700 text-sm">
                    {student.total_study_hours ? `${student.total_study_hours.toFixed(0)}s` : '-'}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <Trophy size={14} className="mx-auto text-purple-500 mb-1" />
                  <div className="text-xs text-gray-600">Sıralama</div>
                  <div className="font-bold text-purple-700 text-sm">
                    {student.estimated_ranking || '-'}
                  </div>
                </div>
              </div>

              {/* Ödev & Mesaj Badge'leri */}
              {(student.pending_homework > 0 || student.unread_messages > 0) && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {student.pending_homework > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      <ClipboardList size={11} />
                      {student.pending_homework} ödev bekliyor
                    </span>
                  )}
                  {student.unread_messages > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs">
                      <MessageCircle size={11} />
                      {student.unread_messages} yeni mesaj
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => handleViewStudent(student.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                  title="Detay Görüntüle"
                >
                  <Eye size={16} />
                  Detay
                </button>
                <button 
                  onClick={() => handleCalendar(student.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                  title="Haftalık Program"
                >
                  <Calendar size={16} />
                  Program
                </button>
                <button 
                  onClick={() => handleMessage(student)}
                  className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Mesaj Gönder"
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Öğrenci Bulunamadı</h3>
          <p className="text-gray-500 mb-4">
            {search ? `"${search}" aramasına uygun öğrenci yok` : 'Henüz öğrenciniz bulunmuyor'}
          </p>
          {!search && (
            <p className="text-sm text-gray-400">
              Davet kodunuzu öğrencilerinizle paylaşarak başlayabilirsiniz
            </p>
          )}
        </div>
      )}
    </div>
  );
}