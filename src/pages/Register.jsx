import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  BookOpen, Eye, EyeOff, User, Mail, Lock, Phone, Shield, X,
  ArrowRight, ArrowLeft, Target, TrendingUp, Users, Check,
  GraduationCap, ChevronRight, Star, Zap, Crown
} from "lucide-react";

// ==================== KVKK MODAL ====================
function KvkkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-surface-800">Gizlilik ve Kullanım Koşulları</h2>
              <p className="text-xs text-surface-500">Son güncelleme: Şubat 2025</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
            <X className="text-surface-400" size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section>
            <p className="text-surface-600 text-sm leading-relaxed">
              Disiplinli'e hoş geldin! Platformumuzu kullanmadan önce bilmen gereken birkaç şey var.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-surface-800 mb-3">Ne Yapıyoruz?</h3>
            <p className="text-sm text-surface-600 mb-3">
              Disiplinli, öğrencilere online koçluk hizmeti sunan bir platform. Burada:
            </p>
            <ul className="text-sm text-surface-600 space-y-1 list-disc pl-5">
              <li>Online dersler ve koçluk seansları</li>
              <li>Deneme sonuçlarını takip</li>
              <li>Haftalık program oluşturma</li>
              <li>Ödev takibi</li>
            </ul>
            <div className="bg-warm-50 rounded-xl p-4 border border-warm-200 mt-4">
              <p className="text-sm text-warm-800"><strong>Not:</strong> Disiplinli bir aracı kurum değildir.</p>
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-surface-800 mb-3">18 Yaş Altı mısın?</h3>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
              <p className="text-sm text-primary-700">
                18 yaşından küçüksen, velinin haberi olması gerekiyor. Veli Davet Kodu ile velini platforma ekleyebilirsin.
              </p>
            </div>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-green-500" size={18} />
              <h3 className="font-semibold text-surface-800">Verilerini Nasıl Kullanıyoruz?</h3>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <ul className="text-sm text-green-700 space-y-2">
                <li>✅ Adın, e-postan ve deneme sonuçların bizde kalıyor</li>
                <li>✅ Kimseyle paylaşmıyoruz, satmıyoruz</li>
                <li>✅ İstediğin zaman hesabını silebilirsin</li>
                <li>✅ Soruların için: destek@disiplinli.com</li>
              </ul>
            </div>
          </section>
          <section>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 text-center">
              <p className="text-sm text-primary-700">Soruların için <strong>destek@disiplinli.com</strong></p>
              <p className="text-primary-600 font-medium mt-2">Kolay gelsin!</p>
            </div>
          </section>
        </div>
        <div className="p-5 border-t border-surface-100 bg-surface-50 rounded-b-2xl">
          <button onClick={onClose} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all">
            Tamam, Anladım!
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== PLAN DATA (Aynı LandingPage ile) ====================
const planData = {
  ortaokul: {
    core: {
      name: 'Disiplinli Ortaokul', price: '1.250',
      subtitle: 'Kendi kendine ilerlemek isteyen öğrenciler için temel sistem.',
      features: ['Disiplinli çalışma ve takip sistemi erişimi', 'Haftalık kişisel çalışma planı', 'Haftalık akademik görevler', 'Konu kazanım checklist takibi', 'Performans paneli ve ilerleme grafikleri', 'Dijital eğitim içerikleri']
    },
    plus: {
      name: 'Disiplinli Plus Ortaokul', price: '2.500',
      subtitle: 'Birebir koçluk ile sistemi en verimli şekilde kullan.',
      features: ['Disiplinli Ortaokul planındaki her şey', 'Birebir akademik koç', 'Haftalık 2 kez videolu koç görüşmesi', 'Koç ile mesajlaşma desteği', 'Kişiselleştirilmiş program', 'Haftalık gelişim analizi', 'Aylık veli bilgilendirme']
    },
    pro: {
      name: 'Disiplinli Premium Ortaokul', price: '4.500',
      subtitle: 'Koçluk ve özel ders ile maksimum akademik destek.',
      features: ['Plus planındaki her şey', 'Aylık 4 saat birebir canlı özel ders', 'Eksik konu kapatma çalışmaları', 'Dijital özel materyal desteği', 'Öncelikli destek', 'Detaylı veli raporu']
    }
  },
  lise: {
    core: {
      name: 'Disiplinli Lise', price: '1.500',
      subtitle: 'Kendi kendine ilerlemek isteyen öğrenciler için temel sistem.',
      features: ['Disiplinli çalışma ve takip sistemi erişimi', 'Haftalık kişisel çalışma planı', 'Haftalık akademik görevler', 'Konu kazanım checklist takibi', 'Performans paneli ve ilerleme grafikleri', 'Dijital eğitim içerikleri']
    },
    plus: {
      name: 'Disiplinli Plus Lise', price: '3.000',
      subtitle: 'Birebir koçluk ile sistemi en verimli şekilde kullan.',
      features: ['Disiplinli Lise planındaki her şey', 'Birebir akademik koç', 'Haftalık 2 kez videolu koç görüşmesi', 'Koç ile mesajlaşma desteği', 'Kişiselleştirilmiş program', 'Haftalık gelişim analizi', 'Aylık veli bilgilendirme']
    },
    pro: {
      name: 'Disiplinli Premium Lise', price: '5.000',
      subtitle: 'Koçluk ve özel ders ile maksimum akademik destek.',
      features: ['Plus planındaki her şey', 'Aylık 4 saat birebir canlı özel ders', 'Eksik konu kapatma çalışmaları', 'Dijital özel materyal desteği', 'Öncelikli destek', 'Detaylı veli raporu']
    }
  },
  lgs: {
    core: { name: 'Disiplinli LGS', price: '1.500', subtitle: 'LGS\'ye yönelik temel çalışma sistemi.', features: ['Disiplinli çalışma ve takip sistemi erişimi', 'Haftalık kişisel çalışma planı', 'Konu kazanım checklist takibi', 'Performans paneli ve ilerleme grafikleri', 'Dijital eğitim içerikleri'] },
    plus: { name: 'Disiplinli Plus LGS', price: '3.000', subtitle: 'Birebir koçluk ile LGS sürecini yönet.', features: ['Disiplinli LGS planındaki her şey', 'Birebir akademik koç', 'Haftalık 2 kez videolu koç görüşmesi', 'Koç ile mesajlaşma desteği', 'Kişiselleştirilmiş LGS programı', 'Haftalık gelişim analizi'] },
    pro: { name: 'Disiplinli Premium LGS', price: '5.000', subtitle: 'Koçluk ve özel ders ile LGS\'de maksimum başarı.', features: ['Plus planındaki her şey', 'Aylık 4 saat birebir canlı özel ders', 'Eksik konu kapatma çalışmaları', 'Dijital özel materyal desteği', 'Öncelikli destek', 'Detaylı veli raporu'] }
  },
  yks: {
    core: { name: 'Disiplinli YKS', price: '1.750', subtitle: 'YKS\'ye yönelik temel çalışma sistemi.', features: ['Disiplinli çalışma ve takip sistemi erişimi', 'Haftalık kişisel çalışma planı', 'TYT + AYT konu kazanım checklist takibi', 'Performans paneli ve ilerleme grafikleri', 'Dijital eğitim içerikleri'] },
    plus: { name: 'Disiplinli Plus YKS', price: '3.500', subtitle: 'Birebir koçluk ile YKS sürecini yönet.', features: ['Disiplinli YKS planındaki her şey', 'Birebir akademik koç', 'Haftalık 2 kez videolu koç görüşmesi', 'Koç ile mesajlaşma desteği', 'Alan bazlı kişiselleştirilmiş YKS programı', 'Haftalık gelişim analizi'] },
    pro: { name: 'Disiplinli Premium YKS', price: '6.000', subtitle: 'Koçluk ve özel ders ile YKS\'de maksimum başarı.', features: ['Plus planındaki her şey', 'Aylık 4 saat birebir canlı özel ders', 'Eksik konu kapatma çalışmaları', 'Dijital özel materyal desteği', 'Öncelikli destek', 'Detaylı veli raporu'] }
  }
};

const goalLabels = { ortaokul: 'Ortaokul', lise: 'Lise', lgs: 'LGS', yks: 'YKS' };
const planIcons = { core: Star, plus: Zap, pro: Crown };
const planLabels = { core: 'Temel', plus: 'Koçluk', pro: 'Premium' };

// ==================== ANA COMPONENT ====================
export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // Landing page'den gelen state (Satın Al butonundan)
  const preselectedGoal = location.state?.goal || '';
  const preselectedPlan = location.state?.plan || '';

  // Adımlar: 1=hedef, 2=sınıf/alan, 3=paket, 4=bilgiler
  const [step, setStep] = useState(preselectedGoal && preselectedPlan ? 4 : preselectedGoal ? 2 : 1);
  const [selectedGoal, setSelectedGoal] = useState(preselectedGoal);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedField, setSelectedField] = useState(''); // YKS alan: SAY, EA, SOZ, DIL
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [salesAccepted, setSalesAccepted] = useState(false);
  const [showKvkk, setShowKvkk] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Progress bar labels
  const stepLabel2 = selectedGoal === 'yks' ? 'Alan' : 'Sınıf';
  const steps = [
    { num: 1, label: 'Hedef' },
    { num: 2, label: stepLabel2 },
    { num: 3, label: 'Paket' },
    { num: 4, label: 'Bilgiler' }
  ];

  // Grade seçenekleri
  const gradeOptions = {
    ortaokul: [
      { value: '5', label: '5. Sınıf' },
      { value: '6', label: '6. Sınıf' },
      { value: '7', label: '7. Sınıf' },
    ],
    lise: [
      { value: '9', label: '9. Sınıf' },
      { value: '10', label: '10. Sınıf' },
      { value: '11', label: '11. Sınıf' },
    ],
  };

  // YKS alan seçenekleri
  const fieldOptions = [
    { value: 'SAY', label: 'Sayısal', emoji: '🔢' },
    { value: 'EA', label: 'Eşit Ağırlık', emoji: '⚖️' },
    { value: 'SOZ', label: 'Sözel', emoji: '📖' },
    { value: 'DIL', label: 'Yabancı Dil', emoji: '🌍' },
  ];

  // ==================== ADIM 1: HEDEF SEÇ ====================
  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setSelectedPlan(''); // Hedef değişince paket sıfırla
    setSelectedGrade(''); // Grade sıfırla
    setSelectedField(''); // Alan sıfırla

    if (goal === 'lgs') {
      // LGS direkt pakete
      setSelectedGrade('LGS');
      setStep(3);
    } else if (goal === 'yks') {
      // YKS alan seçimine
      setSelectedGrade('YKS');
      setStep(2);
    } else {
      // Ortaokul veya lise ise sınıf seçimine
      setStep(2);
    }
  };

  // ==================== ADIM 2: SINIF / ALAN SEÇ ====================
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setStep(3);
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setStep(3);
  };

  // ==================== ADIM 3: PAKET SEÇ ====================
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(4);
  };

  // ==================== ADIM 3: KAYIT ====================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) return setError('Ad Soyad zorunludur.');
    if (!phone.trim()) return setError('Telefon numarası zorunludur.');
    if (!email.trim()) return setError('E-posta zorunludur.');
    if (!password || password.length < 6) return setError('Şifre en az 6 karakter olmalıdır.');
    if (!kvkkAccepted) return setError('Gizlilik ve Kullanım Koşullarını kabul etmelisin.');
    if (!salesAccepted) return setError('Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formunu kabul etmelisin.');

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        email: email.toLowerCase().trim(),
        password,
        phone: phone.trim(),
        role: 'student',
        goal: selectedGoal,
        plan: selectedPlan,
        grade_level: selectedGrade,
        exam_goal_type: selectedField || '', // YKS alan seçimi (SAY, EA, SOZ, DIL)
      };

      const res = await API.post('/api/register/', payload);

      navigate('/verify-email', {
        state: {
          email: res.data.email,
          goal: selectedGoal,
          plan: selectedPlan,
        }
      });
    } catch (err) {
      const msg = err.response?.data?.error || 'Kayıt sırasında hata oluştu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Geri
  const goBack = () => {
    setError('');
    if (step === 4) setStep(3);
    else if (step === 3) {
      // LGS'den geri gelirken direkt hedef seçime (sınıf/alan adımı yok)
      if (selectedGoal === 'lgs') {
        setStep(1);
      } else {
        // Ortaokul, Lise, YKS → sınıf/alan adımına geri dön
        setStep(2);
      }
    }
    else if (step === 2) setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ══════ SOL PANEL — BRANDİNG ══════ */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700">
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-warm-400/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-32 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-warm-500/10 rounded-full blur-2xl animate-float-slow" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link to="/" className="inline-block group">
            <span className="text-white font-display font-bold text-xl group-hover:opacity-80 transition-opacity">Disiplinli.com</span>
          </Link>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight">
                Başarıya ilk
                <br />adımını at<span className="text-warm-400">.</span>
              </h2>
              <p className="text-primary-200 text-lg mt-4 leading-relaxed max-w-md">
                Sana özel çalışma sistemi, koç desteği ve deneme takibi ile hedeflerine ulaş.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Target, text: "Hedefine göre kişisel plan" },
                { icon: TrendingUp, text: "Haftalık ilerleme takibi" },
                { icon: Users, text: "Veli ve öğrenci birlikte" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-primary-100">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="text-warm-400" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['AK', 'EB', 'SY', 'MK'].map((initials, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-500 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: ['#f97316', '#ea580c', '#22c55e', '#3b82f6'][i] }}>
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-white font-semibold">5+ veli</span>
              <span className="text-primary-300"> tarafından önerildi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ SAĞ PANEL — FORM ══════ */}
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-12 xl:px-20 overflow-y-auto">
        <div className="w-full max-w-[520px] mx-auto flex-1">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-block">
              <span className="font-display font-bold text-xl text-surface-800">Disiplinli.com</span>
            </Link>
          </div>

          {/* ═══ PROGRESS BAR ═══ */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium
                  ${step >= s.num
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-100 text-surface-400'
                  }`}>
                  {step > s.num ? <Check size={14} /> : <span>{s.num}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full transition-colors ${step > s.num ? 'bg-primary-500' : 'bg-surface-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ═══════════ ADIM 1: HEDEFİNİ SEÇ ═══════════ */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Hedefini seç
                </h1>
                <p className="text-surface-500 mt-2">Sana uygun paketi belirleyebilmemiz için hedefini seç.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(goalLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleGoalSelect(key)}
                    className="group relative py-8 px-6 rounded-2xl border-2 border-surface-100 bg-white
                      hover:border-primary-300 hover:shadow-card transition-all duration-300 text-center cursor-pointer
                      hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-3
                      group-hover:bg-primary-100 transition-colors">
                      <GraduationCap size={24} className="text-primary-500" />
                    </div>
                    <p className="text-lg font-bold text-surface-700 group-hover:text-primary-600 transition-colors">{label}</p>
                  </button>
                ))}
              </div>

              {/* Zaten hesabın var mı */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-surface-400 font-medium">veya</span>
                <div className="flex-1 h-px bg-surface-200" />
              </div>
              <Link to="/login" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-surface-200
                text-surface-700 font-semibold hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-600 transition-all mt-4 group">
                Zaten hesabım var, giriş yap
                <ChevronRight size={16} className="text-surface-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          )}

          {/* ═══════════ ADIM 2: SINIF veya ALAN SEÇ ═══════════ */}
          {step === 2 && selectedGoal && selectedGoal !== 'yks' && gradeOptions[selectedGoal] && (
            <div className="animate-fade-up">
              <button onClick={goBack} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-6 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Geri</span>
              </button>

              <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Sınıfını seç
                </h1>
                <p className="text-surface-500 mt-2">
                  <span className="font-medium text-primary-600">{goalLabels[selectedGoal]}</span> - Hangi sınıftasın?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {gradeOptions[selectedGoal].map((grade) => (
                  <button
                    key={grade.value}
                    onClick={() => handleGradeSelect(grade.value)}
                    className="group relative py-6 px-6 rounded-2xl border-2 border-surface-100 bg-white
                      hover:border-primary-300 hover:shadow-card transition-all duration-300 text-center cursor-pointer
                      hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center
                        group-hover:bg-primary-100 transition-colors">
                        <GraduationCap size={22} className="text-primary-500" />
                      </div>
                      <p className="text-lg font-bold text-surface-700 group-hover:text-primary-600 transition-colors">{grade.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ ADIM 2: YKS ALAN SEÇ ═══════════ */}
          {step === 2 && selectedGoal === 'yks' && (
            <div className="animate-fade-up">
              <button onClick={goBack} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-6 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Geri</span>
              </button>

              <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Alanını seç
                </h1>
                <p className="text-surface-500 mt-2">
                  <span className="font-medium text-primary-600">YKS</span> - Hangi alanda hazırlanıyorsun?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {fieldOptions.map((field) => (
                  <button
                    key={field.value}
                    onClick={() => handleFieldSelect(field.value)}
                    className="group relative py-6 px-6 rounded-2xl border-2 border-surface-100 bg-white
                      hover:border-primary-300 hover:shadow-card transition-all duration-300 text-center cursor-pointer
                      hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center
                        group-hover:bg-primary-100 transition-colors">
                        <span className="text-xl">{field.emoji}</span>
                      </div>
                      <p className="text-lg font-bold text-surface-700 group-hover:text-primary-600 transition-colors">{field.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ ADIM 3: PAKET SEÇ ═══════════ */}
          {step === 3 && selectedGoal && (
            <div className="animate-fade-up">
              <button onClick={goBack} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-6 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Geri</span>
              </button>

              <div className="mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Paketini seç
                </h1>
                <p className="text-surface-500 mt-2">
                  <span className="font-medium text-primary-600">{goalLabels[selectedGoal]}</span> için uygun paketi seç.
                </p>
              </div>

              <div className="space-y-3">
                {['core', 'plus', 'pro'].map((planKey) => {
                  const plan = planData[selectedGoal]?.[planKey];
                  if (!plan) return null;
                  const Icon = planIcons[planKey];
                  const isAvailable = plan.price !== null;
                  const isPro = planKey === 'pro';

                  return (
                    <button
                      key={planKey}
                      onClick={() => isAvailable && handlePlanSelect(planKey)}
                      disabled={!isAvailable}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 relative
                        ${isPro && isAvailable
                          ? 'border-primary-300 bg-gradient-to-r from-primary-50 to-warm-50 hover:border-primary-400 hover:shadow-pricing'
                          : isAvailable
                            ? 'border-surface-100 bg-white hover:border-primary-200 hover:shadow-card'
                            : 'border-surface-100 bg-surface-50 opacity-60 cursor-not-allowed'
                        }`}
                    >
                      {isPro && isAvailable && (
                        <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-primary-500 to-warm-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          En Popüler
                        </span>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                          ${isPro ? 'bg-gradient-to-br from-primary-500 to-warm-500' : 'bg-primary-50'}`}>
                          <Icon size={20} className={isPro ? 'text-white' : 'text-primary-500'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-surface-800">{plan.name}</h3>
                            {isAvailable ? (
                              <span className="text-lg font-bold text-primary-600 whitespace-nowrap">₺{plan.price}<span className="text-sm font-normal text-surface-400">/ay</span></span>
                            ) : (
                              <span className="text-sm font-medium text-surface-400">Yakında</span>
                            )}
                          </div>
                          <p className="text-sm text-surface-500 mt-1">{plan.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════ ADIM 4: HESAP BİLGİLERİ ═══════════ */}
          {step === 4 && (
            <div className="animate-fade-up">
              <button onClick={goBack} className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-4 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Geri</span>
              </button>

              {/* Seçim özeti */}
              {selectedGoal && selectedPlan && planData[selectedGoal]?.[selectedPlan] && (
                <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-primary-700">
                      {planData[selectedGoal][selectedPlan].name}
                    </span>
                  </div>
                  {planData[selectedGoal][selectedPlan].price && (
                    <span className="text-sm font-bold text-primary-600">
                      ₺{planData[selectedGoal][selectedPlan].price}/ay
                    </span>
                  )}
                </div>
              )}

              <div className="mb-5">
                <h1 className="text-2xl font-display font-bold text-surface-900">Hesap bilgilerini gir</h1>
                <p className="text-surface-500 mt-1 text-sm">Birkaç bilgi daha ve hazırsın!</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 font-medium border border-red-100 flex items-start gap-2">
                  <span className="text-red-500 text-xs font-bold mt-0.5">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Ad Soyad */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">Ad Soyad</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={17} />
                    <input type="text" placeholder="Adınız Soyadınız" value={fullName} onChange={e => setFullName(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 text-sm" />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">Telefon Numarası</label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={17} />
                    <input type="tel" placeholder="5XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 text-sm" />
                  </div>
                  <p className="text-xs text-surface-400 mt-1">Başında 0 olmadan, 10 haneli olarak girin.</p>
                </div>

                {/* E-posta */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">E-posta</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={17} />
                    <input type="email" placeholder="ornek@mail.com" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 text-sm" />
                  </div>
                </div>

                {/* Şifre */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">Şifre</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={17} />
                    <input type={showPassword ? "text" : "password"} placeholder="En az 6 karakter" value={password} onChange={e => setPassword(e.target.value)} required
                      className="w-full pl-10 pr-11 py-3 border border-surface-200 rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* KVKK */}
                <div className="flex items-start gap-2 pt-1">
                  <button type="button" onClick={() => setKvkkAccepted(!kvkkAccepted)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                      ${kvkkAccepted ? 'bg-primary-500 border-primary-500' : 'border-surface-300 hover:border-primary-400'}`}>
                    {kvkkAccepted && <Check size={12} className="text-white" />}
                  </button>
                  <p className="text-xs text-surface-500 leading-relaxed">
                    <button type="button" onClick={() => setShowKvkk(true)} className="text-primary-500 hover:text-primary-600 font-medium hover:underline">
                      Gizlilik ve Kullanım Koşulları
                    </button>
                    'nı ve{' '}
                    <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 font-medium hover:underline">
                      KVKK Aydınlatma Metni
                    </a>
                    'ni okudum, kabul ediyorum. 18 yaşından küçüksem velimin onayıyla kayıt oluyorum.
                  </p>
                </div>

                {/* Mesafeli Satış Sözleşmesi */}
                <div className="flex items-start gap-2">
                  <button type="button" onClick={() => setSalesAccepted(!salesAccepted)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                      ${salesAccepted ? 'bg-primary-500 border-primary-500' : 'border-surface-300 hover:border-primary-400'}`}>
                    {salesAccepted && <Check size={12} className="text-white" />}
                  </button>
                  <p className="text-xs text-surface-500 leading-relaxed">
                    <a href="/mesafeli-satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 font-medium hover:underline">
                      Mesafeli Satış Sözleşmesi
                    </a>
                    'ni ve{' '}
                    <a href="/on-bilgilendirme" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 font-medium hover:underline">
                      Ön Bilgilendirme Formu
                    </a>
                    'nu okudum, kabul ediyorum.
                  </p>
                </div>

                {/* Kayıt Ol */}
                <button type="submit" disabled={loading || !kvkkAccepted || !salesAccepted}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl
                    font-bold hover:from-primary-600 hover:to-primary-700 transition-all
                    shadow-lg shadow-primary-200/50 disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:shadow-xl hover:shadow-primary-300/40 hover:-translate-y-0.5 active:translate-y-0
                    flex items-center justify-center gap-2 group">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Kayıt yapılıyor...
                    </span>
                  ) : (
                    <>
                      Kayıt Ol
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Zaten hesabın var mı */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-surface-400 font-medium">veya</span>
                <div className="flex-1 h-px bg-surface-200" />
              </div>
              <Link to="/login" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-surface-200
                text-surface-700 font-semibold hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-600 transition-all mt-3 group text-sm">
                Zaten hesabım var, giriş yap
                <ChevronRight size={14} className="text-surface-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-surface-400 text-xs mt-6 pb-4">
            © 2026 Disiplinli - Tüm hakları saklıdır
          </p>
        </div>
      </div>

      {/* KVKK Modal */}
      <KvkkModal isOpen={showKvkk} onClose={() => setShowKvkk(false)} />
    </div>
  );
}
