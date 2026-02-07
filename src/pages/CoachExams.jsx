import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, TrendingUp, AlertCircle, ChevronRight, Search } from 'lucide-react';
import API from '../api';

export default function CoachExams() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, missing, recent

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    try {
      const res = await API.get('/api/dashboard/');
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Deneme verisi yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'missing') {
      return matchesSearch && (!s.last_exam_date || s.days_since_exam > 7);
    }
    if (filter === 'recent') {
      return matchesSearch && s.days_since_exam <= 3;
    }
    return matchesSearch;
  });

  // İstatistikler
  const stats = {
    total: students.length,
    missing: students.filter(s => !s.last_exam_date || s.days_since_exam > 7).length,
    recent: students.filter(s => s.days_since_exam <= 3).length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-indigo-500" size={28} />
          Denemeler
        </h1>
        <p className="text-gray-500 mt-1">Öğrencilerin deneme durumları</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border-2 transition-all ${
            filter === 'all'
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <Users size={20} className={filter === 'all' ? 'text-indigo-500' : 'text-gray-400'} />
          <p className="text-2xl font-bold mt-2 text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Toplam</p>
        </button>

        <button
          onClick={() => setFilter('missing')}
          className={`p-4 rounded-xl border-2 transition-all ${
            filter === 'missing'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <AlertCircle size={20} className={filter === 'missing' ? 'text-red-500' : 'text-gray-400'} />
          <p className="text-2xl font-bold mt-2 text-gray-800">{stats.missing}</p>
          <p className="text-xs text-gray-500">Eksik</p>
        </button>

        <button
          onClick={() => setFilter('recent')}
          className={`p-4 rounded-xl border-2 transition-all ${
            filter === 'recent'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <TrendingUp size={20} className={filter === 'recent' ? 'text-green-500' : 'text-gray-400'} />
          <p className="text-2xl font-bold mt-2 text-gray-800">{stats.recent}</p>
          <p className="text-xs text-gray-500">Son 3 Gün</p>
        </button>
      </div>

      {/* Arama */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Öğrenci ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Öğrenci Listesi */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Öğrenci bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => navigate(`/student/${student.id}?tab=exams`)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {student.name?.charAt(0) || '?'}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-400">
                      {student.tyt_avg_net ? `TYT: ${student.tyt_avg_net.toFixed(1)} net` : 'Deneme yok'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {student.last_exam_date ? (
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        student.days_since_exam <= 3 ? 'text-green-600' :
                        student.days_since_exam <= 7 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.days_since_exam === 0 ? 'Bugün' :
                         student.days_since_exam === 1 ? 'Dün' :
                         `${student.days_since_exam} gün önce`}
                      </p>
                      <p className="text-xs text-gray-400">Son deneme</p>
                    </div>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Deneme yok
                    </span>
                  )}
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
