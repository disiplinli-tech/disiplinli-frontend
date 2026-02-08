import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, TrendingDown, FileText, ChevronRight, Zap, Settings } from 'lucide-react';
import API from '../api';

export default function Today() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [sendingReminder, setSendingReminder] = useState(null);

  // Dinamik eşik değerleri (koç ayarlarından gelecek)
  const [thresholds, setThresholds] = useState({
    no_contact_hours: 48,
    exam_missing_days: 7,
    momentum_drop_threshold: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Dashboard ve ayarları paralel çek
      const [dashboardRes, settingsRes] = await Promise.all([
        API.get('/api/dashboard/'),
        API.get('/api/coach/settings/').catch(() => null) // Ayarlar yoksa hata vermesin
      ]);

      setStudents(dashboardRes.data.students || []);

      // Koç ayarlarından eşik değerlerini al
      if (settingsRes?.data?.rules) {
        setThresholds({
          no_contact_hours: settingsRes.data.rules.no_contact_hours || 48,
          exam_missing_days: settingsRes.data.rules.exam_missing_days || 7,
          momentum_drop_threshold: settingsRes.data.rules.momentum_drop_threshold || 10
        });
      }
    } catch (err) {
      console.error('Veri yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dinamik eşiklere göre hesapla
  const noContactDays = Math.ceil(thresholds.no_contact_hours / 24);

  // Verileri kategorize et
  const criticalStudents = students.filter(s => s.risk_level === 'risk');

  const noContactStudents = students.filter(s => {
    const days = s.activity_status?.days_inactive;
    return days === undefined || days === null || days >= noContactDays;
  });

  const momentumDownStudents = students.filter(s => {
    if (s.momentum?.direction !== 'down') return false;
    const change = Math.abs(s.momentum?.change || 0);
    return change >= thresholds.momentum_drop_threshold;
  });

  const pendingExamStudents = students.filter(s => {
    const lastExam = s.last_exam_date;
    if (!lastExam) return true;
    const daysSince = Math.floor((new Date() - new Date(lastExam)) / (1000 * 60 * 60 * 24));
    return daysSince >= thresholds.exam_missing_days;
  });

  // Hatırlat butonu
  const sendReminder = async (student) => {
    setSendingReminder(student.id);
    try {
      const messageText = `Merhaba ${student.name?.split(' ')[0] || ''}, bugün çalışma durumunu merak ettim. Her şey yolunda mı? 📚`;

      // Debug: user_id kontrolü
      if (!student.user_id) {
        console.error('user_id bulunamadı:', student);
        alert('Öğrenci bilgisi eksik (user_id yok)');
        return;
      }

      await API.post('/api/chat/send/', {
        receiver_id: student.user_id,
        message: messageText
      });
      alert(`✅ ${student.name}'e hatırlatma gönderildi!`);
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err.response?.data || err);
      alert(`Mesaj gönderilemedi: ${err.response?.data?.error || 'Bilinmeyen hata'}`);
    } finally {
      setSendingReminder(null);
    }
  };

  const ActionCard = ({ icon: Icon, title, count, color, children, emptyText, subtitle }) => (
    <div className={`bg-white rounded-2xl border-2 ${color} overflow-hidden`}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {count > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            color.includes('red') ? 'bg-red-100 text-red-700' :
            color.includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
            color.includes('orange') ? 'bg-orange-100 text-orange-700' :
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

  const StudentRow = ({ student, badge, badgeColor, showReminder = true }) => (
    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors group">
      <button
        onClick={() => navigate(`/student/${student.id}`)}
        className="flex items-center gap-3 flex-1 text-left"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          {student.name?.charAt(0) || '?'}
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{student.name}</p>
          <p className="text-xs text-gray-400">{student.field_type_display || student.exam_goal_type || 'SAY'}</p>
        </div>
      </button>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {badge}
          </span>
        )}
        {showReminder && (
          <button
            onClick={() => sendReminder(student)}
            disabled={sendingReminder === student.id}
            className={`p-1.5 rounded-lg transition-colors ${
              sendingReminder === student.id
                ? 'bg-gray-100 text-gray-400'
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
            title="Hatırlat"
          >
            <Zap size={14} className={sendingReminder === student.id ? 'animate-pulse' : ''} />
          </button>
        )}
        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🧭</span> Bugün
          </h1>
          <p className="text-gray-500 mt-1">Şu an kime ne yapmalıyım?</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Eşik değerlerini ayarla"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{criticalStudents.length}</p>
          <p className="text-xs text-red-600">Kritik</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{momentumDownStudents.length}</p>
          <p className="text-xs text-yellow-600">Momentum ↓{thresholds.momentum_drop_threshold}+</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-600">{noContactStudents.length}</p>
          <p className="text-xs text-orange-600">{thresholds.no_contact_hours}s Temas Yok</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{pendingExamStudents.length}</p>
          <p className="text-xs text-blue-600">{thresholds.exam_missing_days}g+ Deneme Yok</p>
        </div>
      </div>

      {/* Ana Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kritik Öğrenciler */}
        <ActionCard
          icon={AlertCircle}
          title="Kritik Öğrenciler"
          count={criticalStudents.length}
          color="border-red-200"
          emptyText="🎉 Kritik öğrenci yok!"
        >
          {criticalStudents.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge="Kritik"
              badgeColor="bg-red-100 text-red-700"
            />
          ))}
          {criticalStudents.length > 5 && (
            <button
              onClick={() => navigate('/students')}
              className="w-full text-center text-sm text-red-600 hover:text-red-700 py-2"
            >
              +{criticalStudents.length - 5} daha...
            </button>
          )}
        </ActionCard>

        {/* Temas Yok */}
        <ActionCard
          icon={Clock}
          title={`${thresholds.no_contact_hours} Saattir Temas Yok`}
          subtitle="Ayarlar'dan değiştirebilirsiniz"
          count={noContactStudents.length}
          color="border-orange-200"
          emptyText="🎉 Tüm öğrencilerle temas kuruldu!"
        >
          {noContactStudents.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge={student.activity_status?.days_inactive ? `${student.activity_status.days_inactive}g` : '?'}
              badgeColor="bg-orange-100 text-orange-700"
            />
          ))}
          {noContactStudents.length > 5 && (
            <button
              onClick={() => navigate('/students')}
              className="w-full text-center text-sm text-orange-600 hover:text-orange-700 py-2"
            >
              +{noContactStudents.length - 5} daha...
            </button>
          )}
        </ActionCard>

        {/* Momentum Düşenler */}
        <ActionCard
          icon={TrendingDown}
          title={`Momentum -${thresholds.momentum_drop_threshold}+ Net Düşenler`}
          subtitle="Ayarlar'dan değiştirebilirsiniz"
          count={momentumDownStudents.length}
          color="border-yellow-200"
          emptyText="🎉 Momentum düşen öğrenci yok!"
        >
          {momentumDownStudents.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge={student.momentum?.change ? `${student.momentum.change}` : '↓'}
              badgeColor="bg-yellow-100 text-yellow-700"
            />
          ))}
          {momentumDownStudents.length > 5 && (
            <button
              onClick={() => navigate('/students')}
              className="w-full text-center text-sm text-yellow-600 hover:text-yellow-700 py-2"
            >
              +{momentumDownStudents.length - 5} daha...
            </button>
          )}
        </ActionCard>

        {/* Deneme Girmesi Gerekenler */}
        <ActionCard
          icon={FileText}
          title={`${thresholds.exam_missing_days}+ Gündür Deneme Yok`}
          subtitle="Ayarlar'dan değiştirebilirsiniz"
          count={pendingExamStudents.length}
          color="border-blue-200"
          emptyText="🎉 Herkes deneme girmiş!"
        >
          {pendingExamStudents.slice(0, 5).map(student => (
            <StudentRow
              key={student.id}
              student={student}
              badge={`${thresholds.exam_missing_days}g+`}
              badgeColor="bg-blue-100 text-blue-700"
            />
          ))}
          {pendingExamStudents.length > 5 && (
            <button
              onClick={() => navigate('/students')}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
            >
              +{pendingExamStudents.length - 5} daha...
            </button>
          )}
        </ActionCard>
      </div>

      {/* Alt Bilgi */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Bu sayfa günde 3-5 kere açacağın yer olur. <button onClick={() => navigate('/settings')} className="text-indigo-500 hover:underline">Eşik değerlerini ayarla →</button>
        </p>
      </div>
    </div>
  );
}
