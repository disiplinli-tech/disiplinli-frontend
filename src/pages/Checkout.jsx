import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck,
  User, Mail, Phone, Calendar, Hash
} from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, goal, goalLabel } = location.state || {};

  // Eğer state yoksa (direkt URL ile gelindiyse) landing page'e yönlendir
  if (!plan) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
            <CreditCard className="text-primary-500" size={28} />
          </div>
          <h2 className="text-xl font-display font-bold text-surface-900">Plan seçilmedi</h2>
          <p className="text-surface-500 text-sm">Lütfen önce bir plan seçin.</p>
          <Link
            to="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all"
          >
            <ArrowLeft size={18} />
            Planlara Dön
          </Link>
        </div>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Bilgiler, 2: Ödeme

  const handleChange = (field, value) => {
    // Kart numarası formatlama
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    // Son kullanma tarihi formatlama
    if (field === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    // CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    // Telefon
    if (field === 'phone') {
      value = value.replace(/[^\d+\s()-]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad soyad gerekli';
    if (!formData.email.trim()) newErrors.email = 'E-posta gerekli';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta girin';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon numarası gerekli';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.cardNumber.replace(/\s/g, '').trim() || formData.cardNumber.replace(/\s/g, '').length < 16)
      newErrors.cardNumber = 'Geçerli bir kart numarası girin';
    if (!formData.cardName.trim()) newErrors.cardName = 'Kart üzerindeki isim gerekli';
    if (!formData.expiry.trim() || formData.expiry.length < 5) newErrors.expiry = 'Geçerli bir tarih girin';
    if (!formData.cvv.trim() || formData.cvv.length < 3) newErrors.cvv = 'Geçerli bir CVV girin';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    // TODO: Ödeme API entegrasyonu
    setTimeout(() => {
      setLoading(false);
      alert('Ödeme sistemi yakında aktif olacak! Bilgileriniz kaydedildi.');
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-surface-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg text-surface-800">Disiplinli</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <Lock size={14} />
            <span>Güvenli Ödeme</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* Geri butonu */}
        <button
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{step === 2 ? 'Bilgilere Dön' : 'Geri Dön'}</span>
        </button>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-10 max-w-md">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            step >= 1 ? 'bg-primary-500 text-white' : 'bg-surface-100 text-surface-400'
          }`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
            Bilgiler
          </div>
          <div className={`h-px flex-1 ${step >= 2 ? 'bg-primary-400' : 'bg-surface-200'}`} />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            step >= 2 ? 'bg-primary-500 text-white' : 'bg-surface-100 text-surface-400'
          }`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            Ödeme
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Sol Taraf - Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 mb-1">Kişisel Bilgiler</h2>
                    <p className="text-surface-500 text-sm">Ödeme ve iletişim bilgilerinizi girin.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-card space-y-5">
                    {/* Ad Soyad */}
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">Ad Soyad</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                          type="text"
                          placeholder="Adınız Soyadınız"
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 ${
                            errors.fullName ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                          }`}
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
                    </div>

                    {/* E-posta */}
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                          type="email"
                          placeholder="ornek@mail.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 ${
                            errors.email ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">Telefon</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                          type="tel"
                          placeholder="0 (5XX) XXX XX XX"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 ${
                            errors.phone ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold
                      hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-200/50
                      hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    Devam Et
                    <ArrowLeft size={18} className="rotate-180" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 mb-1">Ödeme Bilgileri</h2>
                    <p className="text-surface-500 text-sm">Kart bilgilerinizi güvenle girin.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-card space-y-5">
                    {/* Kart Numarası */}
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">Kart Numarası</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={(e) => handleChange('cardNumber', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 font-mono tracking-wider ${
                            errors.cardNumber ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                          }`}
                        />
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1.5">{errors.cardNumber}</p>}
                    </div>

                    {/* Kart Üzerindeki İsim */}
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">Kart Üzerindeki İsim</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                          type="text"
                          placeholder="AD SOYAD"
                          value={formData.cardName}
                          onChange={(e) => handleChange('cardName', e.target.value.toUpperCase())}
                          className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 uppercase ${
                            errors.cardName ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                          }`}
                        />
                      </div>
                      {errors.cardName && <p className="text-red-500 text-xs mt-1.5">{errors.cardName}</p>}
                    </div>

                    {/* SKT ve CVV yan yana */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-2">Son Kullanma</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                          <input
                            type="text"
                            placeholder="AA/YY"
                            value={formData.expiry}
                            onChange={(e) => handleChange('expiry', e.target.value)}
                            className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 font-mono ${
                              errors.expiry ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                            }`}
                          />
                        </div>
                        {errors.expiry && <p className="text-red-500 text-xs mt-1.5">{errors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-2">CVV</label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                          <input
                            type="text"
                            placeholder="000"
                            value={formData.cvv}
                            onChange={(e) => handleChange('cvv', e.target.value)}
                            className={`w-full pl-11 pr-4 py-3.5 border rounded-xl bg-surface-50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-surface-800 placeholder:text-surface-400 font-mono ${
                              errors.cvv ? 'border-red-300 bg-red-50/50' : 'border-surface-200'
                            }`}
                          />
                        </div>
                        {errors.cvv && <p className="text-red-500 text-xs mt-1.5">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Güvenlik Notu */}
                  <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <ShieldCheck size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-emerald-700">Güvenli Ödeme</p>
                      <p className="text-emerald-600 mt-0.5">Bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz saklanmaz.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold
                      hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-200/50
                      hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        İşleniyor...
                      </span>
                    ) : (
                      <>
                        <Lock size={18} />
                        {plan.price}₺ Öde
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Sağ Taraf - Sipariş Özeti */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden sticky top-24">
              {/* Üst gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-warm-400" />

              <div className="p-6">
                <h3 className="font-display font-bold text-surface-900 text-lg mb-1">Sipariş Özeti</h3>
                <p className="text-surface-400 text-xs mb-5">Seçtiğiniz plan detayları</p>

                {/* Plan Bilgisi */}
                <div className="bg-gradient-to-br from-primary-50 to-warm-50/50 rounded-xl p-4 mb-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                        {goalLabel}
                      </span>
                      <h4 className="font-display font-bold text-surface-900 mt-2">{plan.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-surface-500 mt-1">{plan.subtitle}</p>
                </div>

                {/* Özellikler */}
                <div className="space-y-2.5 mb-6">
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Dahil Olan Özellikler</p>
                  {plan.features.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-surface-600 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Aim */}
                {plan.aim && (
                  <div className="bg-surface-50 rounded-lg p-3 mb-6">
                    <p className="text-xs text-surface-500 italic">{plan.aim}</p>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-surface-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-surface-500">Aylık Ücret</span>
                    <span className="text-sm text-surface-700 font-semibold">{plan.price}₺</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-surface-200">
                    <span className="font-display font-bold text-surface-900">Toplam</span>
                    <span className="text-2xl font-display font-bold text-primary-600">{plan.price}₺<span className="text-sm text-surface-400 font-normal">/ay</span></span>
                  </div>
                </div>
              </div>

              {/* Alt güvenlik bilgisi */}
              <div className="bg-surface-50 px-6 py-4 border-t border-surface-100">
                <div className="flex items-center gap-4 text-xs text-surface-400">
                  <div className="flex items-center gap-1.5">
                    <Lock size={12} />
                    <span>SSL Korumalı</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    <span>3D Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-100 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-surface-400 text-xs">© 2026 Disiplinli - Tüm hakları saklıdır</p>
          <div className="flex items-center gap-6 text-xs text-surface-400">
            <Link to="/kullanici-sozlesmesi" className="hover:text-surface-600 transition-colors">Kullanıcı Sözleşmesi</Link>
            <a href="/#contact" className="hover:text-surface-600 transition-colors">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
