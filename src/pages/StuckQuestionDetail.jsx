import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, AlertCircle, FileText, ClipboardList,
  BookOpen, Library, Trash2, X, Loader2, Camera, ChevronLeft, ChevronRight
} from 'lucide-react';
import API from '../api';

const SOURCE_LABELS = {
  exam: { label: 'Deneme', color: 'bg-blue-100 text-blue-700' },
  homework: { label: 'Ödev', color: 'bg-green-100 text-green-700' },
  lesson: { label: 'Ders', color: 'bg-purple-100 text-purple-700' },
  book: { label: 'Kitap', color: 'bg-amber-100 text-amber-700' },
};

export default function StuckQuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  // Çözüm formu
  const [showSolveForm, setShowSolveForm] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [solving, setSolving] = useState(false);

  // Silme
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await API.get(`/api/stuck/${id}/`);
      setQuestion(res.data);
    } catch (err) {
      alert('Soru bulunamadı');
      navigate('/stuck');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestion(); }, [id]);

  const handleSolve = async () => {
    setSolving(true);
    try {
      await API.put(`/api/stuck/${id}/`, {
        status: 'solved',
        solution_text: solutionText,
      });
      fetchQuestion();
      setShowSolveForm(false);
    } catch (err) {
      alert('Hata oluştu');
    } finally {
      setSolving(false);
    }
  };

  const handleMarkSolved = async () => {
    setSolving(true);
    try {
      await API.put(`/api/stuck/${id}/`, { status: 'solved' });
      fetchQuestion();
    } catch (err) {
      alert('Hata oluştu');
    } finally {
      setSolving(false);
    }
  };

  const handleReopen = async () => {
    try {
      await API.put(`/api/stuck/${id}/`, { status: 'open' });
      fetchQuestion();
    } catch (err) {
      alert('Hata oluştu');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/api/stuck/${id}/`);
      navigate('/stuck');
    } catch (err) {
      alert('Silinemedi');
    } finally {
      setDeleting(false);
    }
  };

  const scrollToImage = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const imgWidth = container.offsetWidth;
    container.scrollTo({ left: imgWidth * index, behavior: 'smooth' });
    setActiveImage(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveImage(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!question) return null;

  const questionImages = question.images.filter(i => i.image_type === 'question');
  const solutionImages = question.images.filter(i => i.image_type === 'solution');
  const isSolved = question.status === 'solved';
  const src = SOURCE_LABELS[question.source_type] || { label: question.source_type, color: 'bg-gray-100 text-gray-600' };
  const formatDate = (ds) => ds ? new Date(ds).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-2xl mx-auto pb-32">
      {/* Header */}
      <button onClick={() => navigate('/stuck')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Geri</span>
      </button>

      {/* Görsel Carousel */}
      {questionImages.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {questionImages.map((img, i) => (
                <div
                  key={img.id}
                  className="min-w-full snap-center"
                  onClick={() => setLightbox(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Soru ${i + 1}`}
                    className="w-full max-h-80 object-contain bg-gray-50 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            {questionImages.length > 1 && (
              <>
                {activeImage > 0 && (
                  <button
                    onClick={() => scrollToImage(activeImage - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                {activeImage < questionImages.length - 1 && (
                  <button
                    onClick={() => scrollToImage(activeImage + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Dots */}
          {questionImages.length > 1 && (
            <div className="flex justify-center gap-1.5 py-2">
              {questionImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToImage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? 'bg-orange-500 w-4' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700">
            {question.subject}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${src.color}`}>
            {src.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border
            ${isSolved ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {isSolved ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {isSolved ? 'Çözüldü' : 'Çözülmedi'}
          </span>
        </div>

        {/* Detay bilgiler */}
        {question.topic && question.topic !== 'Emin degilim' && (
          <div className="mb-2">
            <span className="text-xs text-gray-500">Konu: </span>
            <span className="text-sm font-medium text-gray-700">{question.topic}</span>
          </div>
        )}
        {question.exam_name && (
          <div className="mb-2">
            <span className="text-xs text-gray-500">Deneme: </span>
            <span className="text-sm font-medium text-gray-700">
              {question.exam_name}
              {question.exam_section ? ` — ${question.exam_section}` : ''}
            </span>
          </div>
        )}
        {question.note && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-500 block mb-1">Not:</span>
            <p className="text-sm text-gray-700">{question.note}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">{formatDate(question.created_at)}</p>
      </div>

      {/* Çözüm Bölümü */}
      {isSolved ? (
        <div className="bg-green-50 rounded-2xl border border-green-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <h3 className="text-sm font-semibold text-green-800">Çözüm</h3>
          </div>
          {question.solution_text && (
            <p className="text-sm text-green-700 mb-2">{question.solution_text}</p>
          )}
          {solutionImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {solutionImages.map(img => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="Çözüm"
                  className="w-full aspect-square object-cover rounded-xl cursor-pointer border border-green-200"
                  onClick={() => setLightbox(img.url)}
                />
              ))}
            </div>
          )}
          {question.solved_at && (
            <p className="text-xs text-green-500 mt-2">Çözüldü: {formatDate(question.solved_at)}</p>
          )}
          <button
            onClick={handleReopen}
            className="mt-3 px-4 py-2 text-xs font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50"
          >
            Tekrar Aç
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          {!showSolveForm ? (
            <div className="flex gap-2">
              <button
                onClick={handleMarkSolved}
                disabled={solving}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                {solving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Çözdüm İşaretle
              </button>
              <button
                onClick={() => setShowSolveForm(true)}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Çözüm Ekle
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Çözüm Yaz</h3>
              <textarea
                placeholder="Çözümünü yaz..."
                value={solutionText}
                onChange={e => setSolutionText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSolveForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleSolve}
                  disabled={solving}
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  {solving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Kaydet & Çözdüm
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sil Butonu */}
      <div className="mt-4">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-2.5 text-red-500 text-sm font-medium border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Soruyu Sil
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 mb-3">Bu soruyu silmek istediğinden emin misin?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-white"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Evet, Sil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            <X size={24} />
          </button>
          <img
            src={lightbox}
            alt="Büyük görsel"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
