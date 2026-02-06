import { useEffect, useState, useRef } from "react";
import API from "../api";
import { Calendar, Plus, X, Trash2, Clock, User, ChevronRight } from "lucide-react";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);

const BRANCHES = {
  TYT: ['Türkçe', 'Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü'],
  AYT: ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Edebiyat', 'Tarih', 'Coğrafya', 'Felsefe', 'Psikoloji', 'Sosyoloji', 'Mantık']
};

const ACTIVITY_TYPES = [
  { value: 'SORU', label: 'Soru Çözümü', emoji: '✏️' },
  { value: 'KONU', label: 'Konu Çalışması', emoji: '📖' },
  { value: 'TEKRAR', label: 'Tekrar', emoji: '🔄' },
  { value: 'DENEME', label: 'Deneme', emoji: '📝' },
];

const COLORS = {
  TYT: { light: "bg-blue-100", text: "text-blue-700", border: "border-l-blue-500" },
  AYT: { light: "bg-purple-100", text: "text-purple-700", border: "border-l-purple-500" },
};

const STUDENT_COLORS = [
  { light: "bg-blue-50", text: "text-blue-700", border: "border-l-blue-500", hex: "#3B82F6" },
  { light: "bg-purple-50", text: "text-purple-700", border: "border-l-purple-500", hex: "#8B5CF6" },
  { light: "bg-green-50", text: "text-green-700", border: "border-l-green-500", hex: "#10B981" },
  { light: "bg-orange-50", text: "text-orange-700", border: "border-l-orange-500", hex: "#F59E0B" },
  { light: "bg-pink-50", text: "text-pink-700", border: "border-l-pink-500", hex: "#EC4899" },
  { light: "bg-teal-50", text: "text-teal-700", border: "border-l-teal-500", hex: "#14B8A6" },
];

export default function Schedule({ user }) {
  const [schedule, setSchedule] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const currentTimeRef = useRef(null);

  const role = user?.role || localStorage.getItem('role');
  const isCoach = role === 'coach';

  const [newPlan, setNewPlan] = useState({
    student_id: '',
    day: 'Pazartesi',
    start_hour: '09',
    start_min: '00',
    end_hour: '10',
    end_min: '00',
    category: '',
    subject: '',
    activity_type: 'SORU'
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        currentTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [loading]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const scheduleRes = await API.get("/api/schedule/");
      setSchedule(scheduleRes.data || []);
      
      const currentRole = user?.role || localStorage.getItem('role');
      if (currentRole === 'coach') {
        const studentsRes = await API.get("/api/coach/students/");
        setStudents(studentsRes.data || []);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getTodayIndex = () => {
    const day = currentTime.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getCurrentTimeTop = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    if (hours < 7 || hours >= 22) return -1;
    return ((hours - 7) * 60 + minutes);
  };

  const handleCellClick = (day, hour) => {
    setNewPlan({
      student_id: selectedStudent !== 'all' ? selectedStudent : '',
      day,
      start_hour: hour.toString().padStart(2, '0'),
      start_min: '00',
      end_hour: Math.min(hour + 1, 22).toString().padStart(2, '0'),
      end_min: '00',
      category: '',
      subject: '',
      activity_type: 'SORU'
    });
    setShowModal(true);
  };

  const addPlan = async () => {
    if (!newPlan.category || !newPlan.subject) {
      alert("Lütfen kategori ve branş seçin");
      return;
    }
    if (isCoach && !newPlan.student_id) {
      alert("Lütfen öğrenci seçin");
      return;
    }

    setSaving(true);
    
    const payload = {
      student_id: newPlan.student_id,
      day: newPlan.day,
      start_time: `${newPlan.start_hour}:${newPlan.start_min}`,
      end_time: `${newPlan.end_hour}:${newPlan.end_min}`,
      category: newPlan.category,
      subject: newPlan.subject,
      activity_type: newPlan.activity_type
    };
    
    
    try {
      await API.post("/api/schedule/add/", payload);
      fetchData();
      setShowModal(false);
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || "Plan eklenemedi"));
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (planId, e) => {
    e?.stopPropagation();
    if (!confirm("Bu dersi silmek istediğinize emin misiniz?")) return;
    try {
      await API.delete(`/api/schedule/${planId}/delete/`);
      fetchData();
    } catch (err) {
    }
  };

  const getStudentColor = (studentId) => {
    const index = students.findIndex(s => s.id === studentId);
    return STUDENT_COLORS[index % STUDENT_COLORS.length];
  };

  const filteredSchedule = selectedStudent === "all" 
    ? schedule 
    : schedule.filter(p => p.student_id === parseInt(selectedStudent));

  const getPlansForDay = (day) => filteredSchedule.filter(p => p.day === day);

  const getMinutesFromStart = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h - 7) * 60 + (m || 0);
  };

  const getPlanStyle = (plan) => {
    const startMin = getMinutesFromStart(plan.start_time);
    const endMin = plan.end_time ? getMinutesFromStart(plan.end_time) : startMin + 60;
    const duration = Math.max(endMin - startMin, 30);
    return { top: `${startMin}px`, height: `${duration - 2}px` };
  };

  const todayIndex = getTodayIndex();
  const currentTimeTop = getCurrentTimeTop();
  
  const hourOptions = Array.from({ length: 16 }, (_, i) => (i + 7).toString().padStart(2, '0'));
  const minOptions = ['00', '15', '30', '45'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-indigo-600" size={24} />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Takvim</h1>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => currentTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
            >
              Bugün
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isCoach && students.length > 0 && (
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">Tüm Öğrenciler</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}

            <button
              onClick={() => {
                setNewPlan({ 
                  ...newPlan, 
                  day: DAYS[todayIndex], 
                  category: '', 
                  subject: '', 
                  student_id: selectedStudent !== 'all' ? selectedStudent : '' 
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Ders Ekle</span>
            </button>
          </div>
        </div>

        {isCoach && selectedStudent === "all" && students.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-[1800px] mx-auto">
            {students.map((s, i) => (
              <span 
                key={s.id} 
                className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:scale-105 transition
                  ${STUDENT_COLORS[i % STUDENT_COLORS.length].light} ${STUDENT_COLORS[i % STUDENT_COLORS.length].text}`}
                onClick={() => setSelectedStudent(s.id.toString())}
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[900px] max-w-[1800px] mx-auto">
          {/* Gün başlıkları */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200 grid grid-cols-[60px_repeat(7,1fr)]">
            <div className="p-2 text-center text-xs text-gray-400 border-r border-gray-100">
              <Clock size={14} className="mx-auto" />
            </div>
            {DAYS.map((day, i) => (
              <div key={day} className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${i === todayIndex ? 'bg-indigo-50' : ''}`}>
                <p className={`text-xs font-medium ${i === todayIndex ? 'text-indigo-600' : 'text-gray-500'}`}>{day.slice(0, 3)}</p>
                <p className={`text-lg font-bold mt-0.5 ${i === todayIndex ? 'text-indigo-600' : 'text-gray-800'}`}>
                  {new Date(currentTime.getTime() + (i - todayIndex) * 86400000).getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
            <div className="border-r border-gray-100">
              {HOURS.map(hour => (
                <div key={hour} className="h-[60px] pr-2 text-right border-b border-gray-50">
                  <span className="text-xs text-gray-400 relative -top-2">{`${hour.toString().padStart(2, '0')}:00`}</span>
                </div>
              ))}
            </div>

            {DAYS.map((day, dayIndex) => {
              const dayPlans = getPlansForDay(day);
              const isToday = dayIndex === todayIndex;
              
              return (
                <div key={day} className={`relative border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-indigo-50/30' : ''}`}>
                  {HOURS.map(hour => (
                    <div 
                      key={hour}
                      onClick={() => handleCellClick(day, hour)}
                      className="h-[60px] border-b border-gray-100 cursor-pointer hover:bg-indigo-50/50 group"
                    >
                      <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Plus size={16} className="text-indigo-400" />
                      </div>
                    </div>
                  ))}

                  <div className="absolute inset-0 pointer-events-none">
                    {dayPlans.map(plan => {
                      const style = getPlanStyle(plan);
                      const color = isCoach && plan.student_id 
                        ? getStudentColor(plan.student_id)
                        : (plan.category === 'AYT' ? COLORS.AYT : COLORS.TYT);
                      
                      return (
                        <div
                          key={plan.id}
                          style={style}
                          className={`absolute left-1 right-1 rounded-lg border-l-4 ${color.border} ${color.light} 
                            shadow-sm overflow-hidden pointer-events-auto cursor-default group/plan hover:shadow-md`}
                        >
                          <div className="p-1.5 h-full flex flex-col">
                            <div className="flex items-start justify-between gap-1">
                              <span className={`text-xs font-semibold ${color.text} truncate flex-1`}>
                                {plan.category} {plan.subject}
                              </span>
                              <button
                                onClick={(e) => deletePlan(plan.id, e)}
                                className="opacity-0 group-hover/plan:opacity-100 p-0.5 hover:bg-red-100 rounded flex-shrink-0"
                              >
                                <Trash2 size={12} className="text-red-500" />
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-500">
                              {plan.start_time?.slice(0,5)} - {plan.end_time?.slice(0,5)}
                            </span>
                            {isCoach && plan.student_name && selectedStudent === "all" && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-auto">
                                <User size={10} />{plan.student_name}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {isToday && currentTimeTop >= 0 && (
                    <div 
                      ref={currentTimeRef}
                      className="absolute left-0 right-0 z-10 pointer-events-none"
                      style={{ top: `${currentTimeTop}px` }}
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 shadow-lg border-2 border-white"></div>
                        <div className="flex-1 h-0.5 bg-red-500"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {currentTimeTop >= 0 && (
              <div className="absolute left-0 z-30 pointer-events-none" style={{ top: `${currentTimeTop - 8}px` }}>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-r-md shadow-sm">
                  {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={20} />Ders Planla
                </h3>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
              </div>
              <p className="text-indigo-100 text-sm mt-1">{newPlan.day}</p>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Öğrenci Seçimi */}
              {isCoach && students.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Öğrenci</label>
                  <div className="grid grid-cols-3 gap-2">
                    {students.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setNewPlan({ ...newPlan, student_id: s.id.toString() })}
                        className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                          ${newPlan.student_id === s.id.toString()
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: STUDENT_COLORS[i % STUDENT_COLORS.length].hex }}
                        >
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-gray-700 truncate w-full text-center">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gün */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gün</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setNewPlan({ ...newPlan, day })}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all
                        ${newPlan.day === day ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saat Seçimi - Basit ve Temiz */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saat Aralığı</label>
                <div className="flex items-center gap-3">
                  {/* Başlangıç */}
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1 text-center">Başlangıç</span>
                    <select
                      value={`${newPlan.start_hour}:${newPlan.start_min}`}
                      onChange={e => {
                        const [h, m] = e.target.value.split(':');
                        setNewPlan({ ...newPlan, start_hour: h, start_min: m });
                      }}
                      className="w-full px-4 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl 
                        text-center text-lg font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 
                        focus:border-indigo-500 cursor-pointer"
                    >
                      {hourOptions.flatMap(h => 
                        minOptions.map(m => (
                          <option key={`${h}:${m}`} value={`${h}:${m}`}>{h}:{m}</option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <span className="text-xl text-gray-400 mt-5">→</span>
                  
                  {/* Bitiş */}
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 block mb-1 text-center">Bitiş</span>
                    <select
                      value={`${newPlan.end_hour}:${newPlan.end_min}`}
                      onChange={e => {
                        const [h, m] = e.target.value.split(':');
                        setNewPlan({ ...newPlan, end_hour: h, end_min: m });
                      }}
                      className="w-full px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl 
                        text-center text-lg font-bold text-purple-600 focus:ring-2 focus:ring-purple-500 
                        focus:border-purple-500 cursor-pointer"
                    >
                      {hourOptions.flatMap(h => 
                        minOptions.map(m => {
                          const startTotal = parseInt(newPlan.start_hour) * 60 + parseInt(newPlan.start_min);
                          const thisTotal = parseInt(h) * 60 + parseInt(m);
                          if (thisTotal <= startTotal) return null;
                          return <option key={`${h}:${m}`} value={`${h}:${m}`}>{h}:{m}</option>;
                        })
                      ).filter(Boolean)}
                    </select>
                  </div>
                </div>
                
                {/* Hızlı süre butonları */}
                <div className="flex gap-2 mt-3">
                  {[
                    { label: '1 saat', hours: 1 },
                    { label: '1.5 saat', hours: 1.5 },
                    { label: '2 saat', hours: 2 },
                    { label: '3 saat', hours: 3 },
                  ].map(opt => {
                    const startH = parseInt(newPlan.start_hour);
                    const startM = parseInt(newPlan.start_min);
                    const totalMins = startH * 60 + startM + opt.hours * 60;
                    const endH = Math.min(22, Math.floor(totalMins / 60));
                    const endM = totalMins % 60;
                    const isActive = newPlan.end_hour === endH.toString().padStart(2, '0') && 
                                     newPlan.end_min === endM.toString().padStart(2, '0');
                    return (
                      <button
                        key={opt.hours}
                        type="button"
                        onClick={() => setNewPlan({ 
                          ...newPlan, 
                          end_hour: endH.toString().padStart(2, '0'), 
                          end_min: endM.toString().padStart(2, '0') 
                        })}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all
                          ${isActive 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TYT / AYT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <div className="grid grid-cols-2 gap-2">
                  {['TYT', 'AYT'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewPlan({ ...newPlan, category: cat, subject: '' })}
                      className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                        ${newPlan.category === cat 
                          ? (cat === 'TYT' ? 'bg-blue-500 text-white shadow-lg' : 'bg-purple-500 text-white shadow-lg')
                          : (cat === 'TYT' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')}`}
                    >
                      {cat === 'TYT' ? '📘' : '📙'} {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Branş */}
              {newPlan.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branş</label>
                  <div className="flex flex-wrap gap-1.5">
                    {BRANCHES[newPlan.category].map(branch => (
                      <button
                        key={branch}
                        type="button"
                        onClick={() => setNewPlan({ ...newPlan, subject: branch })}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all
                          ${newPlan.subject === branch 
                            ? (newPlan.category === 'TYT' ? 'bg-blue-500 text-white border-blue-500' : 'bg-purple-500 text-white border-purple-500')
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Aktivite */}
              {newPlan.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Türü</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITY_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewPlan({ ...newPlan, activity_type: type.value })}
                        className={`py-2 px-3 text-sm rounded-xl border flex items-center justify-center gap-2 transition-all
                          ${newPlan.activity_type === type.value ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
                      >
                        {type.emoji} {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                İptal
              </button>
              <button 
                onClick={addPlan} 
                disabled={saving || !newPlan.category || !newPlan.subject || (isCoach && !newPlan.student_id)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {saving ? 'Kaydediliyor...' : 'Planla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}