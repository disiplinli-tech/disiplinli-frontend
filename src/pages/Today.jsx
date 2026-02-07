import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, TrendingDown, FileText, MessageCircle, Calendar, ChevronRight } from 'lucide-react';
import API from '../api';

export default function Today() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    critical_students: [],
    no_contact_students: [],
    momentum_down_students: [],
    pending_exams: []
  });

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const res = await API.get('/api/coach/today/');
      setData(res.data);
    } catch (err) {
      console.error('Bugün verisi yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const ActionCard = ({ icon: Icon, title, count, color, children, emptyText }) => (
    <div className={`bg-white rounded-2xl border-2 ${color} overflow-hidden`}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {count > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            color.includes('red') ? 'bg-red-100 text-red-700' :
            color.includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
            color.includes('blue') ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {count}
          </span>
        )}
      </div>
      <div className="p-3">
        {count === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">{emptyText}</p>
        ) : (
          <div className="space-y-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  const StudentRow = ({ student, badge, badgeColor, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {student.name?.charAt(0) || '?'}
        </div>
        <div className="text-left">
          <p className="font-medium text-gray-800 text-sm">{student.name}</p>
          <p className="text-xs text-gray-400">{student.field || 'SAY'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">🧭</span> Bugün
        </h1>
        <p className="text-gray-500 mt-1">Şu an kime ne yapmalıyım?</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{data.critical_students?.length || 0}</p>
          <p className="text-xs text-red-600">Kritik</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{data.momentum_down_students?.length || 0}</p>
          <p className="text-xs text-yellow-600">Momentum ↓</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-600">{data.no_contact_students?.length || 0}</p>
          <p className="text-xs text-orange-600">48s Temas Yok</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{data.pending_exams?.length || 0}</p>
          <p className="text-xs text-blue-600">Deneme Bekliyor</p>
        </div>
      </div>

      {/* Ana Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kritik Öğrenciler */}
        <ActionCard
          icon={AlertCircle}
          title="Kritik Öğrenciler"
          count={data.critical_students?.length || 0}
          color="border-red-200"
          emptyText="Kritik öğrenci yok"
        >
          {data.critical_students?.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge="Kritik"
              badgeColor="bg-red-100 text-red-700"
              onClick={() => navigate(`/student/${student.id}`)}
            />
          ))}
        </ActionCard>

        {/* 48 Saattir Temas Yok */}
        <ActionCard
          icon={Clock}
          title="48 Saattir Temas Yok"
          count={data.no_contact_students?.length || 0}
          color="border-orange-200"
          emptyText="Tüm öğrencilerle temas kuruldu"
        >
          {data.no_contact_students?.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge={student.last_contact_days ? `${student.last_contact_days}g` : '?'}
              badgeColor="bg-orange-100 text-orange-700"
              onClick={() => navigate(`/student/${student.id}`)}
            />
          ))}
        </ActionCard>

        {/* Momentum Düşenler */}
        <ActionCard
          icon={TrendingDown}
          title="Momentum Düşenler"
          count={data.momentum_down_students?.length || 0}
          color="border-yellow-200"
          emptyText="Momentum düşen öğrenci yok"
        >
          {data.momentum_down_students?.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge={student.momentum ? `${student.momentum > 0 ? '+' : ''}${student.momentum}` : '↓'}
              badgeColor="bg-yellow-100 text-yellow-700"
              onClick={() => navigate(`/student/${student.id}`)}
            />
          ))}
        </ActionCard>

        {/* Deneme Girmesi Gerekenler */}
        <ActionCard
          icon={FileText}
          title="Deneme Girmesi Gerekenler"
          count={data.pending_exams?.length || 0}
          color="border-blue-200"
          emptyText="Herkes deneme girmiş"
        >
          {data.pending_exams?.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge={student.days_since_exam ? `${student.days_since_exam}g` : 'Yok'}
              badgeColor="bg-blue-100 text-blue-700"
              onClick={() => navigate(`/student/${student.id}`)}
            />
          ))}
        </ActionCard>
      </div>

      {/* Alt Bilgi */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Bu sayfa günde 3-5 kere açacağın yer olur.
        </p>
      </div>
    </div>
  );
}
