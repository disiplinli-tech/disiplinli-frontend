import { useEffect, useState } from "react";
import API from "../api";
import { formatRanking } from "../utils/formatters";
import {
  Plus, X, TrendingUp, Target, Award, ChevronDown, ChevronUp,
  BookOpen, Calculator, FlaskConical, Globe, History, Brain, Check,
  Trophy, Calendar
} from "lucide-react";

// Soru sayıları
const QUESTION_COUNTS = {
  TYT_TURKCE: 40, TYT_SOSYAL: 20, TYT_MATEMATIK: 40, TYT_FEN: 20,
  AYT_MAT: 40, AYT_FIZIK: 14, AYT_KIMYA: 13, AYT_BIYOLOJI: 13,
  AYT_EDEBIYAT: 24, AYT_TARIH1: 10, AYT_COGRAFYA1: 6,
  AYT_TARIH2: 11, AYT_COGRAFYA2: 11, AYT_FELSEFE: 12, AYT_DIN: 6,
};

// TYT Branşları
const TYT_SUBJECTS = [
  { key: 'TYT_TURKCE', name: 'Türkçe', icon: BookOpen, color: 'blue', maxQ: 40 },
  { key: 'TYT_SOSYAL', name: 'Sosyal Bilimler', icon: Globe, color: 'green', maxQ: 20 },
  { key: 'TYT_MATEMATIK', name: 'Temel Matematik', icon: Calculator, color: 'purple', maxQ: 40 },
  { key: 'TYT_FEN', name: 'Fen Bilimleri', icon: FlaskConical, color: 'orange', maxQ: 20 },
];

// AYT Sayısal
const AYT_SAY_SUBJECTS = [
  { key: 'AYT_MAT', name: 'Matematik', icon: Calculator, color: 'purple', maxQ: 40 },
  { key: 'AYT_FIZIK', name: 'Fizik', icon: FlaskConical, color: 'blue', maxQ: 14 },
  { key: 'AYT_KIMYA', name: 'Kimya', icon: FlaskConical, color: 'green', maxQ: 13 },
  { key: 'AYT_BIYOLOJI', name: 'Biyoloji', icon: FlaskConical, color: 'pink', maxQ: 13 },
];

// AYT EA
const AYT_EA_SUBJECTS = [
  { key: 'AYT_MAT', name: 'Matematik', icon: Calculator, color: 'purple', maxQ: 40 },
  { key: 'AYT_EDEBIYAT', name: 'Edebiyat', icon: BookOpen, color: 'pink', maxQ: 24 },
  { key: 'AYT_TARIH1', name: 'Tarih-1', icon: History, color: 'orange', maxQ: 10 },
  { key: 'AYT_COGRAFYA1', name: 'Coğrafya-1', icon: Globe, color: 'green', maxQ: 6 },
];

// AYT Sözel
const AYT_SOZ_SUBJECTS = [
  { key: 'AYT_EDEBIYAT', name: 'Edebiyat', icon: BookOpen, color: 'pink', maxQ: 24 },
  { key: 'AYT_TARIH1', name: 'Tarih-1', icon: History, color: 'orange', maxQ: 10 },
  { key: 'AYT_COGRAFYA1', name: 'Coğrafya-1', icon: Globe, color: 'green', maxQ: 6 },
  { key: 'AYT_TARIH2', name: 'Tarih-2', icon: History, color: 'red', maxQ: 11 },
  { key: 'AYT_COGRAFYA2', name: 'Coğrafya-2', icon: Globe, color: 'teal', maxQ: 11 },
  { key: 'AYT_FELSEFE', name: 'Felsefe Grubu', icon: Brain, color: 'purple', maxQ: 12 },
  { key: 'AYT_DIN', name: 'Din Kültürü', icon: BookOpen, color: 'amber', maxQ: 6 },
];

const EXAM_TYPES = [
  { key: 'TYT', name: 'TYT', subjects: TYT_SUBJECTS, color: 'blue', maxNet: 120 },
  { key: 'AYT_SAY', name: 'AYT Sayısal', subjects: AYT_SAY_SUBJECTS, color: 'purple', maxNet: 80 },
  { key: 'AYT_EA', name: 'AYT Eşit Ağırlık', subjects: AYT_EA_SUBJECTS, color: 'emerald', maxNet: 80 },
  { key: 'AYT_SOZ', name: 'AYT Sözel', subjects: AYT_SOZ_SUBJECTS, color: 'orange', maxNet: 80 },
];

// MEB OGM Materyal YKS Sıralama Tahmini - Diploma 85 baz alınarak
// Kaynak: MEB OGM Materyal Puan Hesaplayıcı
const TYT_RANKING_TABLE = [
  { net: 120, rank: 50 },
  { net: 115, rank: 250 },
  { net: 110, rank: 1450 },
  { net: 105, rank: 4550 },
  { net: 100, rank: 10500 },
  { net: 90, rank: 34500 },
  { net: 80, rank: 81500 },
  { net: 70, rank: 155500 },
  { net: 60, rank: 265500 },
  { net: 50, rank: 437500 },
  { net: 40, rank: 686500 },
  { net: 30, rank: 1047000 },
  { net: 20, rank: 1460500 },
  { net: 10, rank: 1903500 },
];

// AYT tabloları (TYT 80 net baz alınarak)
const AYT_SAY_TABLE = [
  { net: 70, rank: 3150 },
  { net: 60, rank: 13500 },
  { net: 50, rank: 40500 },
  { net: 40, rank: 76500 },
  { net: 35, rank: 126500 },
  { net: 25, rank: 200000 },
  { net: 15, rank: 350000 },
];

const AYT_EA_TABLE = [
  { net: 66, rank: 5150 },
  { net: 60, rank: 12500 },
  { net: 50, rank: 35000 },
  { net: 40, rank: 70000 },
  { net: 30, rank: 130000 },
  { net: 20, rank: 250000 },
];

const AYT_SOZ_TABLE = [
  { net: 70, rank: 2000 },
  { net: 60, rank: 8000 },
  { net: 50, rank: 25000 },
  { net: 40, rank: 55000 },
  { net: 30, rank: 100000 },
  { net: 20, rank: 180000 },
];

const estimateRanking = (net, type) => {
  const tables = {
    'TYT': TYT_RANKING_TABLE,
    'AYT_SAY': AYT_SAY_TABLE,
    'AYT_EA': AYT_EA_TABLE,
    'AYT_SOZ': AYT_SOZ_TABLE,
    'AYT': AYT_SAY_TABLE,
  };

  const table = tables[type] || TYT_RANKING_TABLE;
  if (!net || net <= 0) return null;

  // Tabloda interpolasyon yap
  for (let i = 0; i < table.length; i++) {
    if (net >= table[i].net) {
      if (i === 0) return table[0].rank;
      // Linear interpolation
      const higher = table[i - 1];
      const lower = table[i];
      const ratio = (net - lower.net) / (higher.net - lower.net);
      return Math.round(lower.rank - (lower.rank - higher.rank) * ratio);
    }
  }

  // Tablonun altındaysa extrapolate et
  const last = table[table.length - 1];
  const secondLast = table[table.length - 2];
  const slope = (last.rank - secondLast.rank) / (secondLast.net - last.net);
  return Math.round(last.rank + slope * (last.net - net));
};


// Branş Detayları Component
function SubjectDetails({ examType, examDate, subjectResults }) {
  const examInfo = EXAM_TYPES.find(e => e.key === examType);
  const subjects = examInfo?.subjects || [];

  if (subjectResults.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-700 flex items-center gap-2">
          <span>⚠️</span>
          Bu deneme için branş detayı kaydedilmemiş. Yeni denemelerde branş bazlı sonuçlar otomatik kaydedilir.
        </p>
      </div>
    );
  }

  // Branş sonuçlarını subject key'e göre eşleştir
  const getSubjectResult = (subjectKey) => {
    return subjectResults.find(r => r.subject === subjectKey);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-gray-700 mb-3">Branş Detayları</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subjects.map(subject => {
          const result = getSubjectResult(subject.key);
          const Icon = subject.icon;

          if (!result) return null;

          const colorClasses = {
            blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
            green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-600' },
            purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600' },
            orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600' },
            pink: { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'bg-pink-100 text-pink-600' },
            red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100 text-red-600' },
            teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'bg-teal-100 text-teal-600' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600' },
          };

          const colors = colorClasses[subject.color] || colorClasses.blue;
          const net = result.net || (result.correct - (result.wrong / 4));

          return (
            <div key={subject.key} className={`${colors.bg} border ${colors.border} rounded-lg p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{subject.name}</p>
                    <p className="text-xs text-gray-500">
                      <span className="text-green-600">{result.correct}D</span>
                      {' / '}
                      <span className="text-red-500">{result.wrong}Y</span>
                      {result.blank > 0 && <span className="text-gray-400"> / {result.blank}B</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {net.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">net</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulunamayan branşlar için de sonuçları göster */}
      {subjectResults
        .filter(r => !subjects.find(s => s.key === r.subject))
        .map(result => (
          <div key={result.id} className="bg-gray-100 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-sm">{result.subject_display || result.subject}</p>
                <p className="text-xs text-gray-500">
                  <span className="text-green-600">{result.correct}D</span>
                  {' / '}
                  <span className="text-red-500">{result.wrong}Y</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{result.net?.toFixed(2) || '-'}</p>
                <p className="text-xs text-gray-400">net</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [subjectResults, setSubjectResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedExam, setExpandedExam] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  // Form state
  const [examType, setExamType] = useState('TYT');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    fetchExams();
    fetchSubjectResults();
    fetchStudentProfile();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await API.get("/api/exams/");
      setExams(res.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectResults = async () => {
    try {
      const res = await API.get("/api/subject-results/");
      setSubjectResults(res.data || []);
    } catch (err) {
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await API.get("/api/dashboard-stats/");
      setStudentProfile(res.data);
    } catch (err) {
    }
  };

  // Bir denemenin branş sonuçlarını getir (tarihe göre)
  const getExamSubjectResults = (examDate) => {
    return subjectResults.filter(r => r.date === examDate);
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
      await API.post("/api/exams/add/", {
        exam_type: examType,
        net_score: totalNet,
        date: examDate,
      });
      
      // Branş sonuçlarını da kaydet
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
          date: examDate,
        }));
      
      if (subjectScores.length > 0) {
        try {
          await API.post("/api/subject-results/add/", { results: subjectScores });
        } catch (e) {
        }
      }
      
      fetchExams();
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || "Deneme kaydedilemedi"));
    } finally {
      setSaving(false);
    }
  };

  const currentExamInfo = EXAM_TYPES.find(e => e.key === examType);
  const currentSubjects = currentExamInfo?.subjects || [];
  const totalNet = getTotalNet();
  const estimatedRank = estimateRanking(totalNet, examType);

  // Özet istatistikler
  const getStats = () => {
    const tytExams = exams.filter(e => e.exam_type === 'TYT');
    const aytExams = exams.filter(e => e.exam_type?.startsWith('AYT'));

    // TYT istatistikleri
    const tytAvg = tytExams.length > 0 ? (tytExams.reduce((a, e) => a + e.net_score, 0) / tytExams.length) : null;
    const tytRanking = tytAvg ? estimateRanking(tytAvg, 'TYT') : null;

    // AYT istatistikleri
    const aytAvg = aytExams.length > 0 ? (aytExams.reduce((a, e) => a + e.net_score, 0) / aytExams.length) : null;
    const aytRanking = aytAvg ? estimateRanking(aytAvg, 'AYT_SAY') : null;

    // Momentum: Son 3 deneme vs genel ortalama
    const allExamsSorted = [...exams].sort((a, b) => new Date(b.date) - new Date(a.date));
    const last3 = allExamsSorted.slice(0, 3);
    const last3Avg = last3.length > 0 ? last3.reduce((a, e) => a + e.net_score, 0) / last3.length : null;
    const overallAvg = exams.length > 0 ? exams.reduce((a, e) => a + e.net_score, 0) / exams.length : null;
    const momentum = (last3Avg !== null && overallAvg !== null) ? (last3Avg - overallAvg) : null;

    // Hedefe kalan (AYT yerleşme sıralaması kullan)
    const targetRanking = studentProfile?.target_ranking || null;
    // AYT sıralaması varsa onu kullan, yoksa TYT
    const currentRanking = aytRanking || tytRanking;
    const rankingDiff = (targetRanking && currentRanking) ? (currentRanking - targetRanking) : null;

    return {
      tytCount: tytExams.length,
      tytAvg: tytAvg ? tytAvg.toFixed(1) : null,
      tytMax: tytExams.length > 0 ? Math.max(...tytExams.map(e => e.net_score)) : null,
      tytRanking,
      aytCount: aytExams.length,
      aytAvg: aytAvg ? aytAvg.toFixed(1) : null,
      aytRanking,
      momentum: momentum !== null ? momentum.toFixed(1) : null,
      targetRanking,
      currentRanking,
      rankingDiff,
    };
  };
  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Deneme Sonuçları</h1>
            <p className="text-gray-500 text-sm mt-1">Branş bazlı sonuçlarını gir, sıralamını takip et</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl 
              hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium"
          >
            <Plus size={20} />
            Yeni Deneme Ekle
          </button>
        </div>

        {/* Özet Kartları */}
        {exams.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {/* TYT Sıralama */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                <Trophy size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm opacity-90">TYT Sıralama</span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{stats.tytRanking ? formatRanking(stats.tytRanking) : '-'}</p>
              <p className="text-[10px] md:text-xs opacity-70 mt-1">{stats.tytAvg || '-'} net ort.</p>
            </div>

            {/* AYT Sıralama */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                <Award size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm opacity-90">AYT Sıralama</span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{stats.aytRanking ? formatRanking(stats.aytRanking) : '-'}</p>
              <p className="text-[10px] md:text-xs opacity-70 mt-1">{stats.aytAvg ? `${stats.aytAvg} net ort.` : 'Henüz AYT yok'}</p>
            </div>

            {/* Momentum - Son 3 deneme vs genel ortalama */}
            <div className={`bg-gradient-to-br ${
              stats.momentum > 0 ? 'from-green-500 to-emerald-600' :
              stats.momentum < 0 ? 'from-red-500 to-rose-600' :
              'from-gray-500 to-gray-600'
            } rounded-xl md:rounded-2xl p-3 md:p-4 text-white`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                <TrendingUp size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm opacity-90">Momentum</span>
              </div>
              <p className="text-xl md:text-2xl font-bold">
                {stats.momentum !== null ? (
                  <>
                    {parseFloat(stats.momentum) > 0 ? '+' : ''}{stats.momentum}
                    <span className="text-sm font-normal ml-1">net</span>
                  </>
                ) : '-'}
              </p>
              <p className="text-[10px] md:text-xs opacity-70 mt-1">Son 3 deneme farkı</p>
            </div>

            {/* Hedefe Kalan */}
            <div className={`bg-gradient-to-br ${
              stats.rankingDiff !== null ? (
                stats.rankingDiff <= 0 ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-amber-500'
              ) : 'from-gray-500 to-gray-600'
            } rounded-xl md:rounded-2xl p-3 md:p-4 text-white`}>
              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                <Target size={14} className="opacity-80 md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm opacity-90">Hedefe Kalan</span>
              </div>
              {stats.targetRanking ? (
                <>
                  <p className="text-xl md:text-2xl font-bold">
                    {stats.rankingDiff !== null ? formatRanking(Math.abs(stats.rankingDiff)) : '-'}
                  </p>
                  <p className="text-[10px] md:text-xs opacity-70 mt-1">
                    {stats.rankingDiff !== null ? (
                      stats.rankingDiff <= 0 ? '🎯 İleridesin!' : 'Geridesin'
                    ) : 'Hesaplanamadı'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg md:text-xl font-bold">-</p>
                  <p className="text-[10px] md:text-xs opacity-70 mt-1">Hedef belirlenmedi</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Deneme Ekleme Formu */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className={`bg-gradient-to-r ${
              examType === 'TYT' ? 'from-blue-500 to-blue-600' :
              examType === 'AYT_SAY' ? 'from-purple-500 to-purple-600' :
              examType === 'AYT_EA' ? 'from-emerald-500 to-emerald-600' :
              'from-orange-500 to-orange-600'
            } px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Yeni Deneme Sonucu</h2>
                  <p className="text-white/80 text-sm mt-1">Branş bazlı doğru/yanlış girin</p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-white/80 hover:text-white p-1">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Sınav Türü ve Tarih */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sınav Türü</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXAM_TYPES.map(type => (
                      <button
                        key={type.key}
                        onClick={() => { setExamType(type.key); setScores({}); }}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border-2
                          ${examType === type.key 
                            ? type.key === 'TYT' ? 'bg-blue-500 text-white border-blue-500' :
                              type.key === 'AYT_SAY' ? 'bg-purple-500 text-white border-purple-500' :
                              type.key === 'AYT_EA' ? 'bg-emerald-500 text-white border-emerald-500' :
                              'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={examDate}
                      onChange={e => setExamDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Branş Girişleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Branş Sonuçları
                  <span className="text-gray-400 font-normal ml-2">( Doğru - Yanlış / 4 = Net )</span>
                </label>
                
                <div className="space-y-3">
                  {currentSubjects.map(subject => {
                    const score = scores[subject.key] || {};
                    const net = getSubjectNet(subject.key);
                    const blank = getSubjectBlank(subject.key);
                    const Icon = subject.icon;
                    
                    const colorClasses = {
                      blue: 'bg-blue-50 border-blue-200',
                      green: 'bg-green-50 border-green-200',
                      purple: 'bg-purple-50 border-purple-200',
                      orange: 'bg-orange-50 border-orange-200',
                      pink: 'bg-pink-50 border-pink-200',
                      red: 'bg-red-50 border-red-200',
                      teal: 'bg-teal-50 border-teal-200',
                      amber: 'bg-amber-50 border-amber-200',
                    };
                    
                    return (
                      <div key={subject.key} className={`rounded-xl p-4 border ${colorClasses[subject.color] || 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Branş Adı */}
                          <div className="flex items-center gap-3 md:w-48">
                            <div className={`w-10 h-10 rounded-lg bg-${subject.color}-100 flex items-center justify-center`}>
                              <Icon size={20} className={`text-${subject.color}-600`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{subject.name}</p>
                              <p className="text-xs text-gray-400">{subject.maxQ} soru</p>
                            </div>
                          </div>
                          
                          {/* Doğru/Yanlış/Boş */}
                          <div className="flex-1 grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-green-600 mb-1 font-medium">✓ Doğru</label>
                              <input
                                type="number"
                                min="0"
                                max={subject.maxQ}
                                value={score.correct || ''}
                                onChange={e => updateScore(subject.key, 'correct', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2.5 border-2 border-green-200 rounded-lg text-center text-lg font-bold
                                  focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-700"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-red-500 mb-1 font-medium">✗ Yanlış</label>
                              <input
                                type="number"
                                min="0"
                                max={subject.maxQ}
                                value={score.wrong || ''}
                                onChange={e => updateScore(subject.key, 'wrong', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2.5 border-2 border-red-200 rounded-lg text-center text-lg font-bold
                                  focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-red-700"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-400 mb-1 font-medium">○ Boş</label>
                              <div className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-center text-lg font-bold bg-gray-100 text-gray-500">
                                {blank}
                              </div>
                            </div>
                          </div>
                          
                          {/* Net */}
                          <div className="md:w-24 text-center md:text-right">
                            <p className="text-xs text-gray-400 mb-1">Net</p>
                            <p className={`text-xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {net.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Özet */}
              <div className={`rounded-xl p-5 ${
                examType === 'TYT' ? 'bg-blue-50' :
                examType === 'AYT_SAY' ? 'bg-purple-50' :
                examType === 'AYT_EA' ? 'bg-emerald-50' :
                'bg-orange-50'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Toplam Net</p>
                      <p className={`text-3xl font-bold ${
                        examType === 'TYT' ? 'text-blue-600' :
                        examType === 'AYT_SAY' ? 'text-purple-600' :
                        examType === 'AYT_EA' ? 'text-emerald-600' :
                        'text-orange-600'
                      }`}>{totalNet.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-300"></div>
                    <div>
                      <p className="text-sm text-gray-500">Tahmini Sıralama</p>
                      <p className="text-2xl font-bold text-gray-800">~{formatRanking(estimatedRank)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      İptal
                    </button>
                    <button
                      onClick={saveExam}
                      disabled={saving || totalNet <= 0}
                      className={`px-6 py-3 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2
                        ${totalNet <= 0 ? 'bg-gray-300 cursor-not-allowed' : 
                          examType === 'TYT' ? 'bg-blue-600 hover:bg-blue-700' :
                          examType === 'AYT_SAY' ? 'bg-purple-600 hover:bg-purple-700' :
                          examType === 'AYT_EA' ? 'bg-emerald-600 hover:bg-emerald-700' :
                          'bg-orange-600 hover:bg-orange-700'
                        }`}
                    >
                      {saving ? 'Kaydediliyor...' : <><Check size={18} /> Kaydet</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Geçmiş Denemeler */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Geçmiş Denemeler</h2>
          </div>

          {exams.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <Award size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Henüz deneme sonucu yok</p>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                İlk denemeni ekle →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {exams.map((exam, idx) => {
                const examInfo = EXAM_TYPES.find(e => e.key === exam.exam_type) || { name: exam.exam_type, color: 'gray' };
                // Backend'den gelen MEB sıralamasını kullan, yoksa frontend hesaplaması
                const ranking = exam.ranking || estimateRanking(exam.net_score, exam.exam_type);
                const isExpanded = expandedExam === exam.id;

                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-700',
                  purple: 'bg-purple-100 text-purple-700',
                  emerald: 'bg-emerald-100 text-emerald-700',
                  orange: 'bg-orange-100 text-orange-700',
                  gray: 'bg-gray-100 text-gray-700',
                };

                return (
                  <div key={exam.id || idx}>
                    <div
                      className="p-4 md:p-5 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedExam(isExpanded ? null : exam.id)}
                    >
                      {/* Mobil Layout */}
                      <div className="flex md:hidden flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${colorClasses[examInfo.color] || colorClasses.gray} flex items-center justify-center`}>
                              <Award size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{examInfo.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(exam.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                        <div className="flex items-center justify-around bg-gray-50 rounded-xl py-2">
                          <div className="text-center">
                            <p className="text-xl font-bold text-gray-800">{exam.net_score}</p>
                            <p className="text-[10px] text-gray-500">net</p>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-indigo-600">~{formatRanking(ranking)}</p>
                            <p className="text-[10px] text-gray-500">sıralama</p>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${colorClasses[examInfo.color] || colorClasses.gray} flex items-center justify-center`}>
                            <Award size={24} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{examInfo.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(exam.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                          <div className="text-gray-400">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - Branş Detayları */}
                    {isExpanded && (
                      <div className="px-4 pb-4 md:px-5 md:pb-5">
                        <SubjectDetails
                          examType={exam.exam_type}
                          examDate={exam.date}
                          subjectResults={getExamSubjectResults(exam.date)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}