import { useState, useEffect, useRef } from 'react';
import API from '../api';
import {
  Sparkles, Upload, X, Check, Loader2, Image as ImageIcon,
  ThumbsUp, ThumbsDown, RotateCcw, Trash2
} from 'lucide-react';

// Backend URL
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://web-production-fe7c.up.railway.app';

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

  // Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Refs
  const carouselRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Görsel URL'ini düzelt
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

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

      // Backend'den gelen items'ı al
      let items = res.data.animation_items || [];

      // Eğer items az ise, çoğalt (minimum 15 item olsun ki animasyon güzel görünsün)
      if (items.length < 15) {
        const originalItems = [...items];
        while (items.length < 20) {
          items = [...items, ...originalItems];
        }
        items = items.slice(0, 20);
      }

      setAnimationItems(items);
      setSelectedQuestion(res.data.selected);

      // Reset carousel position
      if (carouselRef.current) {
        carouselRef.current.style.transition = 'none';
        carouselRef.current.style.transform = 'translateX(0)';
      }

      // Animasyon başlat (bir sonraki frame'de)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (carouselRef.current) {
            // Kart genişliği + gap = 160 + 16 = 176px (mobilde daha dar)
            const cardWidth = window.innerWidth < 640 ? 136 : 176;
            const targetIndex = items.length - 3; // Sondan 3. kart ortada olsun

            carouselRef.current.style.transition = 'transform 4s cubic-bezier(0.15, 0.85, 0.3, 1)';
            carouselRef.current.style.transform = `translateX(-${targetIndex * cardWidth}px)`;
          }
        });
      });

      // Animasyon bitince sonucu göster
      setTimeout(() => {
        setShowResult(true);
        setIsSpinning(false);
      }, 4200);

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
      fetchQuestions(); // Stats güncelle
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
            <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden">
              {/* Carousel Container */}
              {isSpinning && animationItems.length > 0 ? (
                <div className="relative h-32 sm:h-40 mb-4 sm:mb-6">
                  {/* Indicator Arrow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-yellow-400" />
                  </div>

                  {/* Carousel Track - OVERFLOW HIDDEN İÇİNDE */}
                  <div className="overflow-hidden mt-5 mx-auto" style={{ maxWidth: '100%' }}>
                    <div
                      ref={carouselRef}
                      className="flex gap-4"
                      style={{ transform: 'translateX(0)' }}
                    >
                      {animationItems.map((item, idx) => (
                        <div
                          key={`${item.id}-${idx}`}
                          className="flex-shrink-0 w-[120px] sm:w-[160px] h-24 sm:h-32 rounded-xl overflow-hidden bg-white/10 border-2 border-white/30"
                        >
                          {item.image ? (
                            <img
                              src={getImageUrl(item.image)}
                              alt="Soru"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full items-center justify-center text-white/50 hidden">
                            <span className="text-sm">Soru</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                {selectedQuestion?.image && (
                  <img
                    src={getImageUrl(selectedQuestion.image)}
                    alt="Soru"
                    className="w-full max-h-96 object-contain rounded-xl border border-gray-200"
                  />
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
                  className={`relative group rounded-xl overflow-hidden border-2 aspect-square ${
                    q.is_solved
                      ? q.could_solve ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {q.image ? (
                    <img
                      src={getImageUrl(q.image)}
                      alt="Soru"
                      className={`w-full h-full object-cover ${q.is_solved ? 'opacity-50' : ''}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <ImageIcon size={24} />
                    </div>
                  )}

                  {/* Solved Overlay */}
                  {q.is_solved && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {q.could_solve ? (
                        <Check className="text-green-500" size={32} />
                      ) : (
                        <X className="text-red-500" size={32} />
                      )}
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* Unsolved Indicator */}
                  {!q.is_solved && !q.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                      Soru
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
