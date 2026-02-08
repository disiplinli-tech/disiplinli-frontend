import { useState, useEffect, useRef } from 'react';
import API from '../api';
import {
  Sparkles, Upload, X, Check, Loader2, Image as ImageIcon,
  ThumbsUp, ThumbsDown, RotateCcw, Trash2, AlertCircle
} from 'lucide-react';

export default function QuestionWheel() {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const uploadQuestion = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await API.post('/api/questions/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchQuestions();
    } catch (err) {
      alert('Yükleme başarısız');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

      // Backend'den gelen seçili soru
      const selected = res.data.selected;
      setSelectedQuestion(selected);

      // Animasyon için item listesi oluştur
      // Her zaman en az 25 item olsun (soru sayısından bağımsız)
      let items = res.data.animation_items || [];
      const originalItems = items.length > 0 ? [...items] : [selected];

      // 25 item'a tamamla (döngüsel)
      while (items.length < 25) {
        items = [...items, ...originalItems];
      }
      items = items.slice(0, 25);

      // Son item her zaman seçili soru olsun
      items[items.length - 3] = selected;

      setAnimationItems(items);

      // Reset carousel position
      if (carouselRef.current) {
        carouselRef.current.style.transition = 'none';
        carouselRef.current.style.transform = 'translateX(0)';
      }

      // Animasyon başlat
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (carouselRef.current) {
            // Kart genişliği + gap hesapla
            const isMobile = window.innerWidth < 640;
            const cardWidth = isMobile ? 100 : 140;
            const gap = isMobile ? 8 : 12;
            const itemWidth = cardWidth + gap;

            // Hedef: sondan 3. kart (seçili soru) ortada olsun
            const targetIndex = items.length - 3;

            // Container genişliğinin yarısını çıkar (ortalamak için)
            const containerWidth = carouselRef.current.parentElement?.offsetWidth || 300;
            const offset = (containerWidth / 2) - (cardWidth / 2);

            const translateX = (targetIndex * itemWidth) - offset;

            carouselRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0.85, 0.25, 1)`;
            carouselRef.current.style.transform = `translateX(-${translateX}px)`;
          }
        });
      });

      // Animasyon bitince sonucu göster
      setTimeout(() => {
        setShowResult(true);
        setIsSpinning(false);
      }, SPIN_DURATION + 400);

    } catch (err) {
      console.error('Spin hatası:', err);
      setIsSpinning(false);
    }
  };

  const giveFeedback = async (couldSolve, difficulty) => {
    if (!selectedQuestion) return;

    try {
      await API.post(`/api/questions/${selectedQuestion.id}/feedback/`, {
        could_solve: couldSolve,
        difficulty: difficulty
      });

      setFeedbackGiven(true);
      fetchQuestions();
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

  // Thumbnail component with fallback
  const QuestionThumbnail = ({ src, alt, className, onClick }) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    if (!src || imgError) {
      return (
        <div
          className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}
          onClick={onClick}
        >
          <AlertCircle size={20} />
          <span className="text-xs mt-1">Görsel yok</span>
        </div>
      );
    }

    return (
      <div className={`relative ${className}`} onClick={onClick}>
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="animate-spin text-gray-400" size={20} />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
        />
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

  const unsolvedCount = questions.filter(q => !q.is_solved).length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
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
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          <span className="hidden sm:inline">Soru</span> Yükle
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={uploadQuestion}
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
          <p className="text-xs text-green-600">Doğru</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-2 sm:p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.wrong || 0}</p>
          <p className="text-xs text-red-600">Yanlış</p>
        </div>
      </div>

      {/* Main Area */}
      {questions.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-purple-400" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz soru yok</h3>
          <p className="text-gray-500 mb-6">Çözmek istediğin soruların fotoğraflarını yükle!</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors cursor-pointer">
            <Upload size={20} />
            İlk Soruyu Yükle
            <input
              type="file"
              accept="image/*"
              onChange={uploadQuestion}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <>
          {/* Spin Area */}
          {!showResult ? (
            <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-2xl p-4 sm:p-6 mb-6">
              {/* Carousel Container - TAM OVERFLOW KONTROLÜ */}
              {isSpinning && animationItems.length > 0 ? (
                <div className="relative h-28 sm:h-36 mb-4 sm:mb-6 overflow-hidden">
                  {/* Indicator Arrow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-yellow-400" />
                  </div>

                  {/* Carousel Track */}
                  <div
                    className="absolute top-5 left-0 right-0 overflow-hidden"
                    style={{
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  >
                    <div
                      ref={carouselRef}
                      className="flex gap-2 sm:gap-3"
                      style={{
                        transform: 'translateX(0)',
                        willChange: 'transform'
                      }}
                    >
                      {animationItems.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="flex-shrink-0 w-[100px] sm:w-[140px] h-20 sm:h-28 rounded-xl overflow-hidden bg-white/20 border-2 border-white/30 flex items-center justify-center"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt="Soru"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full items-center justify-center bg-white/10 ${item.image ? 'hidden' : 'flex'}`}
                          >
                            <ImageIcon className="text-white/40" size={28} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edge Gradients */}
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

              {/* Spin Button */}
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
            // Result Screen
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white">Senin Sorun!</h3>
                <button
                  onClick={resetSpin}
                  className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              {/* Question Image */}
              <div className="p-4">
                {selectedQuestion?.image ? (
                  <img
                    src={selectedQuestion.image}
                    alt="Soru"
                    className="w-full max-h-96 object-contain rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setModalImage(selectedQuestion.image)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                    <AlertCircle size={40} />
                    <span className="mt-2">Görsel yüklenemedi</span>
                  </div>
                )}

                {/* Feedback Section */}
                {!feedbackGiven ? (
                  <div className="mt-6 space-y-4">
                    <p className="text-center text-gray-600 font-medium">Çözdün mü?</p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => giveFeedback(true, null)}
                        className="flex-1 py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <ThumbsUp size={20} />
                        Çözdüm
                      </button>
                      <button
                        onClick={() => giveFeedback(false, null)}
                        className="flex-1 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <ThumbsDown size={20} />
                        Çözemedim
                      </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm">Zorluk (opsiyonel):</p>
                    <div className="flex gap-2">
                      {[
                        { value: 'easy', label: 'Kolay', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
                        { value: 'medium', label: 'Orta', color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
                        { value: 'hard', label: 'Zor', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
                      ].map(d => (
                        <button
                          key={d.value}
                          onClick={() => giveFeedback(null, d.value)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${d.color}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 text-center py-6 bg-green-50 rounded-xl">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Feedback kaydedildi!</p>
                    <button
                      onClick={resetSpin}
                      className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                    >
                      Tekrar Çevir
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Soru Bankam ({questions.length})</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-4">
              {questions.map(q => (
                <div
                  key={q.id}
                  className={`relative group rounded-xl overflow-hidden border-2 aspect-square cursor-pointer ${
                    q.is_solved
                      ? q.could_solve ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => q.image && setModalImage(q.image)}
                >
                  <QuestionThumbnail
                    src={q.image}
                    alt="Soru"
                    className={`w-full h-full ${q.is_solved ? 'opacity-50' : ''}`}
                  />

                  {/* Solved Overlay */}
                  {q.is_solved && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {q.could_solve ? (
                        <Check className="text-green-500" size={32} />
                      ) : (
                        <X className="text-red-500" size={32} />
                      )}
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(q.id);
                    }}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
