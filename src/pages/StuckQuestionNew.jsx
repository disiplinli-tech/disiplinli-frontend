import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Camera, X, FileText, ClipboardList, BookOpen, Library,
  Upload, Loader2
} from 'lucide-react';
import API from '../api';

const SUBJECTS = [
  'Matematik', 'Türkçe', 'Fizik', 'Kimya', 'Biyoloji',
  'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü',
  'Edebiyat', 'Geometri', 'Paragraf', 'Diğer'
];

const SOURCE_TYPES = [
  { value: 'exam', label: 'Deneme', icon: FileText },
  { value: 'homework', label: 'Ödev', icon: ClipboardList },
  { value: 'lesson', label: 'Ders', icon: BookOpen },
  { value: 'book', label: 'Kitap', icon: Library },
];

export default function StuckQuestionNew() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [subject, setSubject] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [examName, setExamName] = useState('');
  const [examSection, setExamSection] = useState('');
  const [topic, setTopic] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const total = files.length + selected.length;
    if (total > 5) {
      alert('En fazla 5 görsel yükleyebilirsin');
      return;
    }
    const newFiles = [...files, ...selected];
    const newPreviews = [...previews, ...selected.map(f => URL.createObjectURL(f))];
    setFiles(newFiles);
    setPreviews(newPreviews);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) { alert('En az 1 görsel gerekli'); return; }
    if (!subject) { alert('Branş seç'); return; }
    if (!sourceType) { alert('Kaynak tipi seç'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('source_type', sourceType);
      if (examName) formData.append('exam_name', examName);
      if (examSection) formData.append('exam_section', examSection);
      if (topic) formData.append('topic', topic);
      if (note) formData.append('note', note);
      files.forEach(f => formData.append('images', f));

      await API.post('/api/stuck/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/stuck');
    } catch (err) {
      alert(err.response?.data?.error || 'Bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <button onClick={() => navigate('/stuck')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Geri</span>
      </button>

      <h1 className="text-xl font-bold text-gray-800 mb-6">Yeni Soru Ekle</h1>

      {/* 1. Görsel Yükleme */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          📸 Soru Görseli <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal ml-1">(1-5 adet)</span>
        </label>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length < 5 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-orange-300 rounded-xl text-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center gap-2"
          >
            <Camera size={28} />
            <span className="text-sm font-medium">
              {files.length === 0 ? 'Fotoğraf Çek / Seç' : 'Daha Fazla Ekle'}
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 2. Branş Seçimi */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          📚 Branş <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border
                ${subject === s
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Kaynak Tipi */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          📋 Kaynak <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SOURCE_TYPES.map(st => {
            const Icon = st.icon;
            const active = sourceType === st.value;
            return (
              <button
                key={st.value}
                onClick={() => setSourceType(st.value)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all
                  ${active
                    ? 'bg-orange-50 text-orange-700 border-orange-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
              >
                <Icon size={18} />
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Deneme Bilgisi (conditional) */}
      {sourceType === 'exam' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <label className="text-sm font-semibold text-gray-700 mb-3 block">🎯 Deneme Bilgisi</label>
          <input
            type="text"
            placeholder="Deneme adı (ör: 3D TYT-1)"
            value={examName}
            onChange={e => setExamName(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="text"
            placeholder="Bölüm (ör: Matematik 12. soru)"
            value={examSection}
            onChange={e => setExamSection(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      )}

      {/* 5. Konu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">🎓 Konu (opsiyonel)</label>
        <input
          type="text"
          placeholder="Konu yaz (ör: Türev, Olasılık, Osmanlı...)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* 6. Not */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">💬 Not (opsiyonel)</label>
        <textarea
          placeholder="Bu soruyla ilgili notun varsa yaz..."
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting || files.length === 0 || !subject || !sourceType}
        className={`w-full py-3.5 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 transition-all
          ${submitting || files.length === 0 || !subject || !sourceType
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200'
          }`}
      >
        {submitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Yükleniyor...
          </>
        ) : (
          <>
            <Upload size={20} />
            Soruyu Kaydet
          </>
        )}
      </button>
    </div>
  );
}
