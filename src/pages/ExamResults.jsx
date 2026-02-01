import { useEffect, useState } from "react";
import API from "../api";
import { 
  Plus, X, TrendingUp, Target, Award, ChevronDown, ChevronRight,
  BookOpen, Calculator, FlaskConical, Globe, History, Brain, Check
} from "lucide-react";

// Soru sayıları
const QUESTION_COUNTS = {
  TYT_TURKCE: 40,
  TYT_SOSYAL: 20,
  TYT_MATEMATIK: 40,
  TYT_FEN: 20,
  AYT_MAT: 40,
  AYT_FIZIK: 14,
  AYT_KIMYA: 13,
  AYT_BIYOLOJI: 13,
  AYT_EDEBIYAT: 24,
  AYT_TARIH1: 10,
  AYT_COGRAFYA1: 6,
  AYT_TARIH2: 11,
  AYT_COGRAFYA2: 11,
  AYT_FELSEFE: 12,
  AYT_DIN: 6,
};

// TYT Branşları
const TYT_SUBJECTS = [
  { key: 'TYT_TURKCE', name: 'Türkçe', icon: BookOpen, color: 'blue' },
  { key: 'TYT_SOSYAL', name: 'Sosyal Bilimler', icon: Globe, color: 'green' },
  { key: 'TYT_MATEMATIK', name: 'Temel Matematik', icon: Calculator, color: 'purple' },
  { key: 'TYT_FEN', name: 'Fen Bilimleri', icon: FlaskConical, color: 'orange' },
];

// AYT Sayısal Branşları
const AYT_SAY_SUBJECTS = [
  { key: 'AYT_MAT', name: 'Matematik', icon: Calculator, color: 'purple' },
  { key: 'AYT_FIZIK', name: 'Fizik', icon: FlaskConical, color: 'blue' },
  { key: 'AYT_KIMYA', name: 'Kimya', icon: FlaskConical, color: 'green' },
  { key: 'AYT_BIYOLOJI', name: 'Biyoloji', icon: FlaskConical, color: 'pink' },
];

// AYT EA Branşları
const AYT_EA_SUBJECTS = [
  { key: 'AYT_MAT', name: 'Matematik', icon: Calculator, color: 'purple' },
  { key: 'AYT_EDEBIYAT', name: 'Edebiyat', icon: BookOpen, color: 'pink' },
  { key: 'AYT_TARIH1', name: 'Tarih-1', icon: History, color: 'orange' },
  { key: 'AYT_COGRAFYA1', name: 'Coğrafya-1', icon: Globe, color: 'green' },
];

// AYT Sözel Branşları
const AYT_SOZ_SUBJECTS = [
  { key: 'AYT_EDEBIYAT', name: 'Edebiyat', icon: BookOpen, color: 'pink' },
  { key: 'AYT_TARIH1', name: 'Tarih-1', icon: History, color: 'orange' },
  { key: 'AYT_COGRAFYA1', name: 'Coğrafya-1', icon: Globe, color: 'green' },
  { key: 'AYT_TARIH2', name: 'Tarih-2', icon: History, color: 'red' },
  { key: 'AYT_COGRAFYA2', name: 'Coğrafya-2', icon: Globe, color: 'teal' },
  { key: 'AYT_FELSEFE', name: 'Felsefe Grubu', icon: Brain, color: 'purple' },
  { key: 'AYT_DIN', name: 'Din Kültürü', icon: BookOpen, color: 'amber' },
];

const EXAM_TYPES = [
  { key: 'TYT', name: 'TYT', subjects: TYT_SUBJECTS, color: 'blue', totalQ: 120 },
  { key: 'AYT_SAY', name: 'AYT Sayısal', subjects: AYT_SAY_SUBJECTS, color: 'purple', totalQ: 80 },
  { key: 'AYT_EA', name: 'AYT Eşit Ağırlık', subjects: AYT_EA_SUBJECTS, color: 'green', totalQ: 80 },
  { key: 'AYT_SOZ', name: 'AYT Sözel', subjects: AYT_SOZ_SUBJECTS, color: 'orange', totalQ: 80 },
];

// Sıralama tahmini
const estimateRanking = (totalNet, examType) => {
  const tables = {
    'TYT': { maxNet: 120, base: 3000000 },
    'AYT_SAY': { maxNet: 80, base: 500000 },
    'AYT_EA': { maxNet: 80, base: 400000 },
    'AYT_SOZ': { maxNet: 80, base: 300000 },
  };
  
  const table = tables[examType] || tables['TYT'];
  if (!totalNet || totalNet <= 0) return null;
  
  const ratio = 1 - (totalNet / table.maxNet);
  return Math.max(1, Math.round(ratio * ratio * table.base));
};

const formatRanking = (rank) => rank ? rank.toLocaleString('tr-TR') : '-';

export default function ExamResults() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedExam, setExpandedExam] = useState(null);
  
  // Yeni deneme form state
  const [examType, setExamType] = useState('TYT');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await API.get("/api/exams/");
      setExams(res.data || []);
    } catch (err) {
      console.error("Denemeler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setExamType('TYT');
    setExamDate(new Date().toISOString().split('T')[0]);
    setScores({});
  };

  const updateScore = (subjectKey, field, value) => {
    const maxQ = QUESTION_COUNTS[subjectKey] || 40;
    let numValue = parseInt(value) || 0;
    numValue = Math.max(0, Math.min(numValue, maxQ));
    
    setScores(prev => {
      const current = prev[subjectKey] || { correct: 0, wrong: 0 };
      const newScore = { ...current, [field]: numValue };
      
      // Doğru + Yanlış > Soru sayısı olamaz
      if (newScore.correct + newScore.wrong > maxQ) {
        if (field === 'correct') {
          newScore.wrong = Math.max(0, maxQ - newScore.correct);
        } else {
          newScore.correct = Math.max(0, maxQ - newScore.wrong);
        }
      }
      
      return { ...prev, [subjectKey]: newScore };
    });
  };

  const getSubjectNet = (subjectKey) => {
    const score = scores[subjectKey] || {};
    const correct = score.correct || 0;
    const wrong = score.wrong || 0;
    return Math.round((correct - (wrong / 4)) * 100) / 100;
  };

  const getSubjectBlank = (subjectKey) => {
    const maxQ = QUESTION_COUNTS[subjectKey] || 40;
    const score = scores[subjectKey] || {};
    return maxQ - (score.correct || 0) - (score.wrong || 0);
  };

  const getTotalNet = () => {
    const currentSubjects = EXAM_TYPES.find(e => e.key === examType)?.subjects || [];
    let total = 0;
    currentSubjects.forEach(sub => {
      total += Math.max(0, getSubjectNet(sub.key));
    });
    return Math.round(total * 100) / 100;
  };

  const saveExam = async () => {
    const totalNet = getTotalNet();
    
    if (totalNet <= 0) {
      alert("Lütfen en az bir branşa sonuç girin.");
      return;
    }
    
    setSaving(true);
    
    try {
      // Ana deneme sonucunu kaydet
      await API.post("/api/exams/add/", {
        exam_type: examType,
        net_score: totalNet,
        date: examDate,
      });
      
      // Branş sonuçlarını kaydet (yeni endpoint gerekecek)
      const currentSubjects = EXAM_TYPES.find(e => e.key === examType)?.subjects || [];
      const subjectScores = currentSubjects
        .filter(sub => {
          const score = scores[sub.key];
          return score && (score.correct > 0 || score.wrong > 0);
        })
        .map(sub => ({
          subject: sub.key,
          correct: scores[sub.key]?.correct || 0,
          wrong: scores[sub.key]?.wrong || 0,
          blank: getSubjectBlank(sub.key),
          net: getSubjectNet(sub.key),
          date: examDate,
        }));
      
      // Branş sonuçlarını kaydet (backend endpoint varsa)
      try {
        await API.post("/api/subject-results/add/", { results: subjectScores });
      } catch (e) {
        console.log("Branş sonuçları kaydedilemedi (endpoint yok olabilir):", e);
      }
      
      fetchExams();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Deneme kaydedilemedi:", err);
      alert("Hata: " + (err.response?.data?.error || "Deneme kaydedilemedi"));
    } finally {
      setSaving(false);
    }
  };

  const currentSubjects = EXAM_TYPES.find(e => e.key === examType)?.subjects || [];
  const totalNet = getTotalNet();
  const estimatedRank = estimateRanking(totalNet, examType);
  const currentExamInfo = EXAM_TYPES.find(e => e.key === examType);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Deneme Sonuçları</h1>
          <p className="text-gray-500 text-sm mt-1">Branş bazlı sonuçlarını gir, gelişimini takip et</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl 
            hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Deneme Ekle
        </button>
      </div>

      {/* Özet Kartları */}
      {exams.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EXAM_TYPES.map(type => {
            const typeExams = exams.filter(e => e.exam_type === type.key);
            if (typeExams.length === 0) return null;
            
            const lastExam = typeExams[0];
            const lastRanking = estimateRanking(lastExam.net_score, type.key);
            
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
              green: 'from-green-500 to-emerald-600',
              orange: 'from-orange-500 to-amber-500',
            };
            
            return (
              <div key={type.key} className={`bg-gradient-to-br ${colorClasses[type.color]} rounded-2xl p-4 text-white`}>
                <p className="text-sm opacity-80">{type.name}</p>
                <p className="text-3xl font-bold mt-1">{lastExam.net_score}</p>
                <p className="text-xs opacity-70 mt-1">
                  ~{formatRanking(lastRanking)} sıralama
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Deneme Listesi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Geçmiş Denemeler</h2>
        </div>
        
        {exams.length === 0 ? (
          <div className="p-12 text-center">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Henüz deneme sonucu yok</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              İlk denemeni ekle →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {exams.map((exam, idx) => {
              const examInfo = EXAM_TYPES.find(e => e.key === exam.exam_type);
              const ranking = estimateRanking(exam.net_score, exam.exam_type);
              
              return (
                <div key={exam.id || idx} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${examInfo?.color || 'gray'}-100 flex items-center justify-center`}>
                      <Award className={`text-${examInfo?.color || 'gray'}-600`} size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{examInfo?.name || exam.exam_type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(exam.date).toLocaleDateString('tr-TR', { 
                          day: 'numeric', month: 'long', year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{exam.net_score}</p>
                      <p className="text-xs text-gray-500">net</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-indigo-600">~{formatRanking(ranking)}</p>
                      <p className="text-xs text-gray-500">sıralama</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deneme Ekleme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={`bg-gradient-to-r from-${currentExamInfo?.color || 'indigo'}-500 to-${currentExamInfo?.color || 'indigo'}-600 px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Deneme Sonucu Ekle</h3>
                  <p className="text-white/80 text-sm mt-1">{currentExamInfo?.name} - Branş Bazlı Giriş</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Sınav Türü */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sınav Türü</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {EXAM_TYPES.map(type => (
                    <button
                      key={type.key}
                      onClick={() => { setExamType(type.key); setScores({}); }}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2
                        ${examType === type.key 
                          ? `bg-${type.color}-500 text-white border-${type.color}-500` 
                          : `bg-white text-gray-600 border-gray-200 hover:border-${type.color}-300`}`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarih */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Branş Girişleri */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Branş Sonuçları (Doğru / Yanlış)</label>
                
                {currentSubjects.map(subject => {
                  const score = scores[subject.key] || {};
                  const net = getSubjectNet(subject.key);
                  const blank = getSubjectBlank(subject.key);
                  const maxQ = QUESTION_COUNTS[subject.key];
                  const Icon = subject.icon;
                  
                  return (
                    <div key={subject.key} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon size={18} className={`text-${subject.color}-500`} />
                          <span className="font-medium text-gray-700">{subject.name}</span>
                          <span className="text-xs text-gray-400">({maxQ} soru)</span>
                        </div>
                        <div className={`text-lg font-bold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {net.toFixed(2)} net
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {/* Doğru */}
                        <div>
                          <label className="block text-xs text-green-600 mb-1 font-medium">✓ Doğru</label>
                          <input
                            type="number"
                            min="0"
                            max={maxQ}
                            value={score.correct || ''}
                            onChange={e => updateScore(subject.key, 'correct', e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2.5 border-2 border-green-200 rounded-lg text-center text-lg font-bold
                              focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50 text-green-700"
                          />
                        </div>
                        
                        {/* Yanlış */}
                        <div>
                          <label className="block text-xs text-red-500 mb-1 font-medium">✗ Yanlış</label>
                          <input
                            type="number"
                            min="0"
                            max={maxQ}
                            value={score.wrong || ''}
                            onChange={e => updateScore(subject.key, 'wrong', e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2.5 border-2 border-red-200 rounded-lg text-center text-lg font-bold
                              focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50 text-red-700"
                          />
                        </div>
                        
                        {/* Boş (otomatik) */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1 font-medium">○ Boş</label>
                          <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-center text-lg font-bold
                            bg-gray-100 text-gray-500">
                            {blank}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer - Özet */}
            <div className="border-t border-gray-100">
              <div className={`bg-gradient-to-r from-${currentExamInfo?.color || 'indigo'}-500 to-${currentExamInfo?.color || 'indigo'}-600 px-6 py-4`}>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm opacity-80">Toplam Net</p>
                    <p className="text-3xl font-bold">{totalNet.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Tahmini Sıralama</p>
                    <p className="text-2xl font-bold">~{formatRanking(estimatedRank)}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  İptal
                </button>
                <button
                  onClick={saveExam}
                  disabled={saving || totalNet <= 0}
                  className={`flex-1 py-3 bg-${currentExamInfo?.color || 'indigo'}-600 hover:bg-${currentExamInfo?.color || 'indigo'}-700 
                    disabled:bg-gray-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2`}
                >
                  {saving ? 'Kaydediliyor...' : <><Check size={18} /> Kaydet</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}