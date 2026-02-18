import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, User, Mail, Lock, Users, GraduationCap, KeyRound, CheckSquare, Square, X, Shield, ArrowRight, Target, TrendingUp, ChevronLeft } from "lucide-react";

// KVKK Modal Component
function KvkkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 rounded-xl transition-colors"
          >
            <X className="text-surface-400" size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Giriş */}
          <section>
            <p className="text-surface-600 text-sm leading-relaxed">
              Disiplinli'e hoş geldin! Platformumuzu kullanmadan önce bilmen gereken birkaç şey var.
              Merak etme, uzun ve sıkıcı değil!
            </p>
          </section>

          {/* Ne Yapıyoruz? */}
          <section>
            <h3 className="font-semibold text-surface-800 mb-3">Ne Yapıyoruz?</h3>
            <p className="text-sm text-surface-600 mb-3">
              Disiplinli, YKS'ye hazırlanan öğrencilere online koçluk hizmeti sunan bir platform. Burada:
            </p>
            <ul className="text-sm text-surface-600 space-y-1 list-disc pl-5">
              <li>Online dersler ve koçluk seansları</li>
              <li>Deneme sonuçlarını takip</li>
              <li>Haftalık program oluşturma</li>
              <li>Ödev takibi</li>
            </ul>
            <p className="text-sm text-surface-600 mt-2">yapabilirsin.</p>

            {/* Kritik Uyarı */}
            <div className="bg-warm-50 rounded-xl p-4 border border-warm-200 mt-4">
              <p className="text-sm text-warm-800">
                <strong>Not:</strong> Disiplinli bir aracı kurum değildir.
              </p>
            </div>
          </section>

          {/* 18 Yaş Altı */}
          <section>
            <h3 className="font-semibold text-surface-800 mb-3">18 Yaş Altı mısın?</h3>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
              <p className="text-sm text-primary-700">
                18 yaşından küçüksen, velinin haberi olması gerekiyor. Veli Davet Kodu ile velini platforma ekleyebilirsin.
              </p>
            </div>
          </section>

          {/* Verilerini Nasıl Kullanıyoruz? */}
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

          {/* Sorumluluk */}
          <section>
            <h3 className="font-semibold text-surface-800 mb-3">Bir Şey Daha</h3>
            <p className="text-sm text-surface-600">
              Elimizden gelenin en iyisini yapıyoruz ama sıralama tahminleri garanti değil, bilgilendirme amaçlı.
            </p>
          </section>

          {/* Kapanış */}
          <section>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 text-center">
              <p className="text-sm text-primary-700">
                Soruların için <strong>destek@disiplinli.com</strong> adresine yazabilirsin.
              </p>
              <p className="text-primary-600 font-medium mt-2">Kolay gelsin!</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-surface-100 bg-surface-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl
              font-bold hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            Tamam, Anladım!
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================== ESKİ DETAYLI KVKK METNİ (Yasal Referans) ==================
   Aşağıdaki metin yasal uyumluluk için saklanmıştır. Gerektiğinde ayrı bir sayfa olarak kullanılabilir.

   Veri Sorumlusu: [İSİM SOYISIM] - destek@disiplinli.com
   6698 sayılı KVKK kapsamında bilgilendirme

   Toplanan Veriler: Ad, soyad, e-posta, deneme sonuçları, çalışma programı
   Hukuki Sebepler (KVKK Madde 5): Açık rıza, sözleşme ifası, hukuki yükümlülük, meşru menfaat
   Saklama Süresi: 10 yıl
   Veri Güvenliği: SSL şifreleme, üçüncü taraflarla paylaşılmaz
   Kullanıcı Hakları (KVKK Madde 11): Bilgi edinme, düzeltme/silme, kısıtlama, taşıma
   Hesap Silme: 30 gün içinde veriler silinir
   Uygulanacak Hukuk: Ankara Mahkemeleri yetkili
=================================================================================== */

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    coachInviteCode: "",
    studentCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      coachInviteCode: "",
      studentCode: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Ad Soyad alanı zorunludur.");
      return;
    }
    if (!formData.email.trim()) {
      setError("E-posta alanı zorunludur.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (formData.role === "parent" && !formData.studentCode.trim()) {
      setError("Veli olarak kayıt için Öğrenci Kodu zorunludur.");
      return;
    }
    if (!kvkkAccepted) {
      setError("Devam etmek için Gizlilik ve Kullanım Koşullarını kabul etmelisiniz.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "student" && formData.coachInviteCode) {
        payload.coach_invite_code = formData.coachInviteCode;
      } else if (formData.role === "parent") {
        payload.student_code = formData.studentCode;
      }

      await API.post("/api/register/", payload);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const errorMsg = err.response?.data?.error ||
                       err.response?.data?.message ||
                       "Kayıt sırasında bir hata oluştu.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* Sol Panel - Branding */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700">
        {/* Dekoratif arka plan elementleri */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-warm-400/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-32 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-warm-500/10 rounded-full blur-2xl animate-float-slow" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/25 transition-all">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="text-white font-display font-bold text-xl">Disiplinli</span>
            </Link>
          </div>

          {/* Ana Mesaj */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight">
                Başarıya ilk
                <br />
                adımını at
                <span className="text-warm-400">.</span>
              </h2>
              <p className="text-primary-200 text-lg mt-4 leading-relaxed max-w-md">
                Sana özel çalışma sistemi, koç desteği ve deneme takibi ile hedeflerine ulaş.
              </p>
            </div>

            {/* Feature highlights */}
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

          {/* Alt kısım - sosyal kanıt */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['AK', 'EB', 'SY', 'MK'].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-primary-500 flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: ['#f97316', '#ea580c', '#22c55e', '#3b82f6'][i] }}
                >
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

      {/* Sag Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-[440px]">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="font-display font-bold text-xl text-surface-800">Disiplinli</span>
            </Link>
          </div>

          {/* Baslik */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
              Hesap oluştur
            </h1>
            <p className="text-surface-500 mt-2">
              Disiplinli'e katıl, hedeflerine giden yolculuğa başla.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-5 font-medium border border-red-100 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Rol Seçimi */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-surface-700 mb-2">
              Hesap Türü
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 transition-all font-medium text-sm
                  ${formData.role === "student"
                    ? "border-primary-400 bg-primary-50 text-primary-600 shadow-sm shadow-primary-100"
                    : "border-surface-200 text-surface-500 hover:border-surface-300 hover:bg-surface-50"}`}
              >
                <GraduationCap size={18} />
                Öğrenci
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("parent")}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 transition-all font-medium text-sm
                  ${formData.role === "parent"
                    ? "border-primary-400 bg-primary-50 text-primary-600 shadow-sm shadow-primary-100"
                    : "border-surface-200 text-surface-500 hover:border-surface-300 hover:bg-surface-50"}`}
              >
                <Users size={18} />
                Veli
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ad Soyad */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">
                Ad Soyad
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Adınız Soyadınız"
                  className="w-full pl-11 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                    outline-none transition-all text-surface-800 placeholder:text-surface-400"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">
                E-posta
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="ornek@mail.com"
                  className="w-full pl-11 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                    outline-none transition-all text-surface-800 placeholder:text-surface-400"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">
                Şifre
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 border border-surface-200 rounded-xl bg-surface-50
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                    outline-none transition-all text-surface-800 placeholder:text-surface-400"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-surface-400 mt-1.5">En az 6 karakter</p>
            </div>

            {/* Koşullu Davet Kodu - Öğrenci için */}
            {formData.role === "student" && (
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">
                  Koç Davet Kodu <span className="text-surface-400 font-normal text-xs">(Opsiyonel)</span>
                </label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="coachInviteCode"
                    placeholder="Varsa koç kodunuzu girin"
                    className="w-full pl-11 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50
                      focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                      outline-none transition-all text-surface-800 placeholder:text-surface-400 uppercase"
                    value={formData.coachInviteCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, coachInviteCode: e.target.value.toUpperCase() }))}
                    disabled={loading}
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-surface-400 mt-1.5">Koç kodunuz yoksa boş bırakabilirsiniz.</p>
              </div>
            )}

            {/* Koşullu Davet Kodu - Veli için */}
            {formData.role === "parent" && (
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">
                  Veli Davet Kodu <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="studentCode"
                    placeholder="Örn: ABC123"
                    className="w-full pl-11 pr-4 py-3 border border-surface-200 rounded-xl bg-surface-50
                      focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                      outline-none transition-all text-surface-800 placeholder:text-surface-400 uppercase"
                    value={formData.studentCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentCode: e.target.value.toUpperCase() }))}
                    disabled={loading}
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-surface-400 mt-1.5">Öğrencinizin Ayarlar sayfasından aldığı Veli Davet Kodunu girin</p>
              </div>
            )}

            {/* KVKK Checkbox */}
            <div
              className="flex items-start gap-3 cursor-pointer select-none py-1"
              onClick={() => !loading && setKvkkAccepted(!kvkkAccepted)}
            >
              <div className="mt-0.5 flex-shrink-0">
                {kvkkAccepted ? (
                  <CheckSquare className="text-primary-600" size={20} />
                ) : (
                  <Square className="text-surface-400" size={20} />
                )}
              </div>
              <p className="text-sm text-surface-600 leading-relaxed">
                <button
                  type="button"
                  className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowKvkkModal(true);
                  }}
                >
                  Gizlilik ve Kullanım Koşulları
                </button>
                'nı okudum, kabul ediyorum. 18 yaşından küçüksem velimin onayıyla kayıt oluyorum.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !kvkkAccepted}
              className={`w-full py-3.5 rounded-xl font-bold transition-all
                flex items-center justify-center gap-2 group
                ${kvkkAccepted
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/40 hover:-translate-y-0.5 active:translate-y-0 transform"
                  : "bg-surface-200 text-surface-400 cursor-not-allowed shadow-none"}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kayıt yapılıyor...
                </span>
              ) : (
                <>
                  Kayıt Ol
                  <ArrowRight size={18} className={kvkkAccepted ? "group-hover:translate-x-0.5 transition-transform" : ""} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-5 flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 font-medium">veya</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-surface-200
              text-surface-700 font-semibold hover:border-primary-200 hover:bg-primary-50/50
              hover:text-primary-600 transition-all group"
          >
            <ChevronLeft size={16} className="text-surface-400 group-hover:text-primary-500 group-hover:-translate-x-0.5 transition-all" />
            Zaten hesabım var, giriş yap
          </Link>

          {/* Footer */}
          <p className="text-center text-surface-400 text-xs mt-6">
            © 2026 Disiplinli - Tüm hakları saklıdır
          </p>
        </div>
      </div>

      {/* KVKK Modal */}
      <KvkkModal isOpen={showKvkkModal} onClose={() => setShowKvkkModal(false)} />
    </div>
  );
}
