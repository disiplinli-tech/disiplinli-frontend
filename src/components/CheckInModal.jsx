import { useState } from 'react';
import { X, Check, Clock } from 'lucide-react';
import API from '../api';

const COMPLETION_OPTIONS = [
  { value: 0, label: '%0', emoji: '😞' },
  { value: 25, label: '%25', emoji: '😐' },
  { value: 50, label: '%50', emoji: '🙂' },
  { value: 75, label: '%75', emoji: '😊' },
  { value: 100, label: '%100', emoji: '🎉' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'odak', label: 'Odak sorunu' },
  { value: 'stres', label: 'Stres' },
  { value: 'konu', label: 'Konu zorluğu' },
  { value: 'erteleme', label: 'Erteleme' },
  { value: 'yok', label: 'Zorluk çekmedim' },
];

const CORRECTION_OPTIONS = [
  { value: 'hedef_gozden_gecir', label: 'Yarınki hedefini gözden geçir' },
  { value: 'erken_basla', label: 'Güne daha erken başla' },
  { value: 'duzenli_calis', label: 'Daha düzenli çalış' },
  { value: 'telefon_uzak', label: 'Telefonu uzak tut' },
  { value: 'duzeltme_yok', label: 'Düzeltme yok' },
];

export default function CheckInModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [completionPct, setCompletionPct] = useState(null);
  const [difficultyTag, setDifficultyTag] = useState(null);
  const [correctionTag, setCorrectionTag] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (completionPct === null || !difficultyTag || !correctionTag) return;
    setSaving(true);
    try {
      await API.post('/api/student/checkin/', {
        completion_pct: completionPct,
        difficulty_tag: difficultyTag,
        correction_tag: correctionTag,
      });
      setSaved(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      alert('Check-in kaydedilemedi. Tekrar dene.');
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return completionPct !== null;
    if (step === 2) return difficultyTag !== null;
    if (step === 3) return correctionTag !== null;
    return false;
  };

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fade-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Kaydedildi!</h3>
          <p className="text-gray-500">Bugünü değerlendirdiğin için tebrikler. Yarın daha iyi olacak.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-white/80" />
            <div>
              <h3 className="text-white font-bold">Gün Sonu Değerlendirmesi</h3>
              <p className="text-white/70 text-xs">60 saniye — hızlı ve kolay</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-primary-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 min-h-[280px]">
          {/* Step 1: Tamamlanma % */}
          {step === 1 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">Bugün planının ne kadarını tamamladın?</h4>
              <p className="text-sm text-gray-500 mb-6">Kendine dürüst ol, bu sadece senin verin.</p>
              <div className="flex gap-3 flex-wrap">
                {COMPLETION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCompletionPct(opt.value)}
                    className={`flex-1 min-w-[60px] p-4 rounded-xl border-2 text-center transition-all
                      ${completionPct === opt.value
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-2xl block mb-1">{opt.emoji}</span>
                    <span className={`text-sm font-semibold ${completionPct === opt.value ? 'text-primary-600' : 'text-gray-600'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Zorluk */}
          {step === 2 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">En büyük zorluk ne oldu?</h4>
              <p className="text-sm text-gray-500 mb-6">Neyin seni engellediğini bilmek, çözümün ilk adımı.</p>
              <div className="space-y-3">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficultyTag(opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between
                      ${difficultyTag === opt.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                      }`}
                  >
                    <span className={`font-medium ${difficultyTag === opt.value ? 'text-primary-700' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    {difficultyTag === opt.value && <Check size={18} className="text-primary-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Düzeltme */}
          {step === 3 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">Yarın için tek düzeltme?</h4>
              <p className="text-sm text-gray-500 mb-6">Bir şey değiştirmek yeterli. Hepsini birden değil.</p>
              <div className="space-y-3">
                {CORRECTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCorrectionTag(opt.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between
                      ${correctionTag === opt.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                      }`}
                  >
                    <span className={`font-medium ${correctionTag === opt.value ? 'text-primary-700' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                    {correctionTag === opt.value && <Check size={18} className="text-primary-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Geri
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all
                ${canProceed()
                  ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Devam
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!canProceed() || saving}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all
                ${canProceed() && !saving
                  ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
