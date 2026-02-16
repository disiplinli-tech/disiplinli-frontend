import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, User, Mail, Lock, Users, GraduationCap, KeyRound, CheckSquare, Square, X, Shield, FileText } from "lucide-react";

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
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Gizlilik ve Kullanım Koşulları</h2>
              <p className="text-xs text-gray-500">Hızlıca göz at 👀</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Giriş */}
          <section>
            <p className="text-gray-600 text-sm leading-relaxed">
              Disiplinli'e hoş geldin! 🎓 Platformumuzu kullanmadan önce bilmen gereken birkaç şey var.
              Merak etme, uzun ve sıkıcı değil!
            </p>
            <p className="text-gray-400 text-xs mt-2">Son güncelleme: Şubat 2025</p>
          </section>

          {/* Ne Yapıyoruz? */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-3">🎯 Ne Yapıyoruz?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Disiplinli, YKS'ye hazırlanan öğrencilere online koçluk hizmeti sunan bir platform. Burada:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Online dersler ve koçluk seansları</li>
              <li>Deneme sonuçlarını takip</li>
              <li>Haftalık program oluşturma</li>
              <li>Ödev takibi</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">yapabilirsin.</p>

            {/* Kritik Uyarı - GİB için önemli */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-4">
              <p className="text-sm text-amber-800">
                📌 <strong>Not:</strong> Disiplinli bir aracı kurum değildir.
              </p>
            </div>
          </section>

          {/* 18 Yaş Altı */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-3">👨‍👩‍👧 18 Yaş Altı mısın?</h3>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                18 yaşından küçüksen, velinin haberi olması gerekiyor. Veli Davet Kodu ile velini platforma ekleyebilirsin.
              </p>
            </div>
          </section>

          {/* Verilerini Nasıl Kullanıyoruz? */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-green-500" size={18} />
              <h3 className="font-semibold text-gray-800">🔒 Verilerini Nasıl Kullanıyoruz?</h3>
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
            <h3 className="font-semibold text-gray-800 mb-3">⚡ Bir Şey Daha</h3>
            <p className="text-sm text-gray-600">
              Elimizden gelenin en iyisini yapıyoruz ama sıralama tahminleri garanti değil, bilgilendirme amaçlı.
            </p>
          </section>

          {/* Kapanış */}
          <section>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-center">
              <p className="text-sm text-indigo-700">
                Soruların için <strong>destek@disiplinli.com</strong> adresine yazabilirsin.
              </p>
              <p className="text-indigo-600 font-medium mt-2">Kolay gelsin! 💪</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl
              font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Tamam, Anladım! 👍
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Kayıt Ol</h1>
          <p className="text-gray-500 mt-2">Disiplinli'e hoş geldin!</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-5 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Rol Seçimi */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hesap Türü
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-medium
                ${formData.role === "student"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              <GraduationCap size={20} />
              Öğrenci
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("parent")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-medium
                ${formData.role === "parent"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              <Users size={20} />
              Veli
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ad Soyad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="fullName"
                placeholder="Adınız Soyadınız"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                  outline-none transition-all text-gray-800"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="ornek@mail.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                  outline-none transition-all text-gray-800"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                  outline-none transition-all text-gray-800"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">En az 6 karakter</p>
          </div>

          {/* Koşullu Davet Kodu - Öğrenci için */}
          {formData.role === "student" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Koç Davet Kodu <span className="text-gray-400 font-normal">(Opsiyonel)</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="coachInviteCode"
                  placeholder="Varsa koç kodunuzu girin"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all text-gray-800 uppercase"
                  value={formData.coachInviteCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, coachInviteCode: e.target.value.toUpperCase() }))}
                  disabled={loading}
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Koç kodunuz yoksa boş bırakabilirsiniz.</p>
            </div>
          )}

          {/* Koşullu Davet Kodu - Veli için */}
          {formData.role === "parent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veli Davet Kodu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="studentCode"
                  placeholder="Örn: ABC123"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all text-gray-800 uppercase"
                  value={formData.studentCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentCode: e.target.value.toUpperCase() }))}
                  disabled={loading}
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Öğrencinizin Ayarlar sayfasından aldığı Veli Davet Kodunu girin</p>
            </div>
          )}

          {/* KVKK Checkbox */}
          <div
            className="flex items-start gap-3 cursor-pointer select-none"
            onClick={() => !loading && setKvkkAccepted(!kvkkAccepted)}
          >
            <div className="mt-0.5">
              {kvkkAccepted ? (
                <CheckSquare className="text-indigo-600" size={22} />
              ) : (
                <Square className="text-gray-400" size={22} />
              )}
            </div>
            <p className="text-sm text-gray-600">
              <button
                type="button"
                className="text-indigo-600 hover:underline font-medium"
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
            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg
              ${kvkkAccepted
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"}
              disabled:opacity-50`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kayıt yapılıyor...
              </span>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Zaten hesabın var mı?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Giriş Yap
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 Disiplinli - Tüm hakları saklıdır
        </p>
      </div>

      {/* KVKK Modal */}
      <KvkkModal isOpen={showKvkkModal} onClose={() => setShowKvkkModal(false)} />
    </div>
  );
}
