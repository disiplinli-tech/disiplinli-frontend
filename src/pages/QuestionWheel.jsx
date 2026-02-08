import { useState, useEffect, useRef } from 'react';
import API from '../api';
import {
  Sparkles, Upload, X, Check, Loader2, Image as ImageIcon,
  ThumbsUp, ThumbsDown, RotateCcw, Trash2, AlertCircle, Camera
} from 'lucide-react';

// Branş renkleri
const SUBJECT_COLORS = {
  turkce: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', bgSolid: 'bg-orange-500' },
  matematik: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', bgSolid: 'bg-blue-500' },
  geometri: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', bgSolid: 'bg-indigo-500' },
  fizik: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', bgSolid: 'bg-purple-500' },
  kimya: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', bgSolid: 'bg-green-500' },
  biyoloji: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', bgSolid: 'bg-emerald-500' },
  tarih: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', bgSolid: 'bg-amber-500' },
  cografya: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', bgSolid: 'bg-teal-500' },
  felsefe: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300', bgSolid: 'bg-pink-500' },
  din: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', bgSolid: 'bg-yellow-500' },
  edebiyat: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', bgSolid: 'bg-rose-500' },
};

const SUBJECT_LABELS = {
  turkce: 'Türkçe',
  matematik: 'Matematik',
  geometri: 'Geometri',
  fizik: 'Fizik',
  kimya: 'Kimya',
  biyoloji: 'Biyoloji',
  tarih: 'Tarih',
  cografya: 'Coğrafya',
  felsefe: 'Felsefe',
  din: 'Din',
  edebiyat: 'Edebiyat',
};

export default function QuestionWheel() {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadExamType, setUploadExamType] = useState('tyt');
  const [uploadSubject, setUploadSubject] = useState('matematik');

  // Spin state
  const [isSpinning, setIsSpinning] = useState(false);
  const [animationItems, setAnimationItems] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Modal state
  const [modalImage, setModalImage] = useState(null);

  // Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Refs
  const carouselRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sabit animasyon süresi (ms)
  const SPIN_DURATION = 2800;

  // TYT branşları
  const TYT_SUBJECTS = ['turkce', 'matematik', 'fizik', 'kimya', 'biyoloji', 'tarih', 'cografya', 'felsefe', 'din'];
  // AYT branşları
  const AYT_SUBJECTS = ['matematik', 'geometri', 'fizik', 'kimya', 'biyoloji', 'edebiyat', 'tarih', 'cografya', 'felsefe'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await API.get('/api/questions/');
      setQuestions(res.data.questions || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error('Sorular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadPreview(null);
    setUploadExamType('tyt');
    setUploadSubject('matematik');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitUpload = async () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('image', uploadFile);
    formData.append('exam_type', uploadExamType);
    formData.append('subject', uploadSubject);

    setUploading(true);
    try {
      await API.post('/api/questions/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchQuestions();
      closeUploadModal();
    } catch (err) {
      alert('Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  };

  const spinWheel = async () => {
    if (isSpinning) return;

    const unsolved = questions.filter(q => !q.is_solved);
    if (unsolved.length === 0) {
      alert('Çözülmemiş soru yok! Yeni soru ekleyin.');
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    setFeedbackGiven(false);

    try {
      const res = await API.get('/api/questions/spin/');

      if (res.data.empty) {
        alert('Çözülmemiş soru yok!');
        setIsSpinning(false);
        return;
      }

      const selected = res.data.selected;
      setSelectedQuestion(selected);

      let items = res.data.animation_items || [];
      const originalItems = items.length > 0 ? [...items] : [selected];

      while (items.length < 25) {
        items = [...items, ...originalItems];
      }
      items = items.slice(0, 25);
      items[items.length - 3] = selected;

      setAnimationItems(items);

      if (carouselRef.current) {
        carouselRef.current.style.transition = 'none';
        carouselRef.current.style.transform = 'translateX(0)';
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (carouselRef.current) {
            const isMobile = window.innerWidth < 640;
            const cardWidth = isMobile ? 100 : 140;
            const gap = isMobile ? 8 : 12;
            const itemWidth = cardWidth + gap;
            const targetIndex = items.length - 3;
            const containerWidth = carouselRef.current.parentElement?.offsetWidth || 300;
            const offset = (containerWidth / 2) - (cardWidth / 2);
            const translateX = (targetIndex * itemWidth) - offset;

            carouselRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0.85, 0.25, 1)`;
            carouselRef.current.style.transform = `translateX(-${translateX}px)`;
          }
        });
      });

      setTimeout(() => {
        setShowResult(true);
        setIsSpinning(false);
      }, SPIN_DURATION + 400);

      // Aktivite kaydet - çark döndürüldü
      try {
        await API.post('/api/activity/record/', {
          action_type: 'wheel_spin',
          metadata: { subject: selected?.subject, exam_type: selected?.exam_type }
        });
      } catch (e) {
        // Aktivite kaydı başarısız olsa da devam et
      }

    } catch (err) {
      console.error('Spin hatası:', err);
      setIsSpinning(false);
    }
  };

  const giveFeedback = async (couldSolve) => {
    if (!selectedQuestion) return;

    try {
      const res = await API.post(`/api/questions/${selectedQuestion.id}/feedback/`, {
        could_solve: couldSolve
      });

      setFeedbackGiven(true);
      await fetchQuestions();

      // Çözüldüyse (silindi) 1.5 sn sonra otomatik sıfırla
      if (res.data.deleted) {
        setTimeout(() => {
          resetSpin();
        }, 1500);
      }
    } catch (err) {
      alert('Feedback kaydedilemedi');
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;

    try {
      await API.delete(`/api/questions/${id}/delete/`);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      alert('Silinemedi');
    }
  };

  const resetSpin = () => {
    setSelectedQuestion(null);
    setShowResult(false);
    setFeedbackGiven(false);
    setAnimationItems([]);
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = 'translateX(0)';
    }
  };

  // Çark kartı - meta gösterimli (BÜYÜK YAZILAR)
  const WheelCard = ({ item }) => {
    const colors = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS.matematik;
    return (
      <div className={`flex-shrink-0 w-[100px] sm:w-[140px] h-20 sm:h-28 rounded-xl overflow-hidden ${colors.bg} ${colors.border} border-2 flex flex-col items-center justify-center p-2`}>
        <span className="text-sm sm:text-base font-bold text-gray-700 uppercase">{item.exam_type || 'TYT'}</span>
        <span className={`text-base sm:text-lg font-bold ${colors.text} text-center leading-tight`}>
          {SUBJECT_LABELS[item.subject] || 'Matematik'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Çözülmemiş sorular
  const unsolvedQuestions = questions.filter(q => !q.is_solved);
  // Çözemediklerim (is_solved=true ve could_solve=false)
  const failedQuestions = questions.filter(q => q.is_solved && q.could_solve === false);

  const unsolvedCount = unsolvedQuestions.length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Soru Ekle</h3>
              <button onClick={closeUploadModal} className="p-1 hover:bg-white/20 rounded-lg">
                <X className="text-white" size={20} />
              </button>
            </div>

            <div className="p-5">
              {/* Preview */}
              {uploadPreview && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
                  <img src={uploadPreview} alt="Önizleme" className="w-full h-48 object-contain bg-gray-50" />
                </div>
              )}

              {/* TYT / AYT Seçimi */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sınav Türü</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setUploadExamType('tyt'); setUploadSubject('matematik'); }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      uploadExamType === 'tyt'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    TYT
                  </button>
                  <button
                    onClick={() => { setUploadExamType('ayt'); setUploadSubject('matematik'); }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      uploadExamType === 'ayt'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    AYT
                  </button>
                </div>
              </div>

              {/* Branş Seçimi */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Branş</label>
                <div className="grid grid-cols-3 gap-2">
                  {(uploadExamType === 'tyt' ? TYT_SUBJECTS : AYT_SUBJECTS).map(sub => {
                    const colors = SUBJECT_COLORS[sub];
                    const isSelected = uploadSubject === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => setUploadSubject(sub)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? `${colors.bg} ${colors.text} ${colors.border} border-2`
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {SUBJECT_LABELS[sub]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kaydet */}
              <button
                onClick={submitUpload}
                disabled={uploading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setModalImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
            onClick={() => setModalImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={modalImage}
            alt="Soru"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Soru Çarkı</h1>
            <p className="text-gray-500 text-sm">Rastgele soru çöz, kendini test et!</p>
          </div>
        </div>

        <label className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer">
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
          <span className="hidden sm:inline">Soru</span> Ekle
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-2 sm:p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.total || 0}</p>
          <p className="text-xs text-purple-600">Toplam</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.unsolved || 0}</p>
          <p className="text-xs text-blue-600">Bekleyen</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-2 sm:p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.correct || 0}</p>
          <p className="text-xs text-green-600">Çözüldü</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-2 sm:p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.wrong || 0}</p>
          <p className="text-xs text-red-600">Çözemedim</p>
        </div>
      </div>

      {/* Main Area */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-purple-400" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz soru yok</h3>
          <p className="text-gray-500 mb-6">Çözmek istediğin soruların fotoğraflarını yükle!</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors cursor-pointer">
            <Camera size={20} />
            İlk Soruyu Yükle
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <>
          {/* Spin Area */}
          {!showResult ? (
            <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-2xl p-4 sm:p-6 mb-6">
              {isSpinning && animationItems.length > 0 ? (
                <div className="relative h-28 sm:h-36 mb-4 sm:mb-6 overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-yellow-400" />
                  </div>

                  <div className="absolute top-5 left-0 right-0 overflow-hidden">
                    <div
                      ref={carouselRef}
                      className="flex gap-2 sm:gap-3"
                      style={{ transform: 'translateX(0)', willChange: 'transform' }}
                    >
                      {animationItems.map((item, idx) => (
                        <WheelCard key={`${item.id}-${idx}`} item={item} />
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-5 left-0 w-12 h-full bg-gradient-to-r from-purple-900 to-transparent z-10 pointer-events-none" />
                  <div className="absolute top-5 right-0 w-12 h-full bg-gradient-to-l from-purple-900 to-transparent z-10 pointer-events-none" />
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="text-yellow-400" size={40} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Çarkı Çevir!</h3>
                  <p className="text-white/70 mb-4 sm:mb-6">{unsolvedCount} adet çözülmemiş sorun var</p>
                </div>
              )}

              <button
                onClick={spinWheel}
                disabled={isSpinning || unsolvedCount === 0}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-bold text-base sm:text-lg hover:from-yellow-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSpinning ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Çevriliyor...
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    ÇEVİR!
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Senin Sorun!</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs text-white font-medium">
                      {selectedQuestion?.exam_type?.toUpperCase() || 'TYT'}
                    </span>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs text-white font-medium">
                      {SUBJECT_LABELS[selectedQuestion?.subject] || 'Matematik'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={resetSpin}
                  className="px-3 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  <span className="text-sm font-medium">Tekrar Çevir</span>
                </button>
              </div>

              <div className="p-4">
                {selectedQuestion?.image ? (
                  <img
                    src={selectedQuestion.image}
                    alt="Soru"
                    className="w-full max-h-96 object-contain rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setModalImage(selectedQuestion.image)}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                    <AlertCircle size={40} />
                    <span className="mt-2">Görsel yüklenemedi</span>
                  </div>
                )}

                {!feedbackGiven ? (
                  <div className="mt-6 space-y-4">
                    <p className="text-center text-gray-600 font-medium">Çözdün mü?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => giveFeedback(true)}
                        className="flex-1 py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <ThumbsUp size={20} />
                        Çözdüm
                      </button>
                      <button
                        onClick={() => giveFeedback(false)}
                        className="flex-1 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <ThumbsDown size={20} />
                        Çözemedim
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 text-center py-6 bg-green-50 rounded-xl">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Kaydedildi!</p>
                    <button
                      onClick={resetSpin}
                      className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw size={18} />
                      Tekrar Çevir
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Soru Bankam - Bekleyen Sorular */}
          {unsolvedQuestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Soru Bankam ({unsolvedQuestions.length})</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-4">
                {unsolvedQuestions.map(q => {
                  const colors = SUBJECT_COLORS[q.subject] || SUBJECT_COLORS.matematik;
                  return (
                    <div
                      key={q.id}
                      className={`relative group rounded-xl overflow-hidden border-2 aspect-square cursor-pointer flex flex-col items-center justify-center ${colors.border} ${colors.bg}`}
                      onClick={() => q.image && setModalImage(q.image)}
                    >
                      {/* Meta info - ORTALI VE BÜYÜK */}
                      <span className="text-base sm:text-lg font-bold text-gray-700">
                        {q.exam_type?.toUpperCase() || 'TYT'}
                      </span>
                      <span className={`text-sm sm:text-base font-semibold ${colors.text}`}>
                        {SUBJECT_LABELS[q.subject] || 'Matematik'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuestion(q.id);
                        }}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Çözemediklerim */}
          {failedQuestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-red-100 bg-red-50">
                <h3 className="font-semibold text-red-700 flex items-center gap-2">
                  <X size={18} />
                  Çözemediklerim ({failedQuestions.length})
                </h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-4">
                {failedQuestions.map(q => {
                  const colors = SUBJECT_COLORS[q.subject] || SUBJECT_COLORS.matematik;
                  return (
                    <div
                      key={q.id}
                      className={`relative group rounded-xl overflow-hidden border-2 aspect-square cursor-pointer flex flex-col items-center justify-center border-red-300 bg-red-50`}
                      onClick={() => q.image && setModalImage(q.image)}
                    >
                      {/* Üstünde X işareti */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <X className="text-red-300" size={48} />
                      </div>

                      {/* Meta info */}
                      <span className="text-base sm:text-lg font-bold text-gray-600 z-10">
                        {q.exam_type?.toUpperCase() || 'TYT'}
                      </span>
                      <span className={`text-sm sm:text-base font-semibold text-red-600 z-10`}>
                        {SUBJECT_LABELS[q.subject] || 'Matematik'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuestion(q.id);
                        }}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
