import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { 
  BookOpen, Eye, EyeOff, User, Mail, Lock, Users, GraduationCap, 
  KeyRound, CheckSquare, Square, X, Check 
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student", // 'student' veya 'parent'
    coachInviteCode: "",
    studentCode: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Sözleşme ve Checkbox State'leri
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  
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

      // Validasyonlar
      if (!formData.fullName.trim()) return setError("Ad Soyad alanı zorunludur.");
      if (!formData.email.trim()) return setError("E-posta alanı zorunludur.");
      if (!formData.password || formData.password.length < 6) return setError("Şifre en az 6 karakter olmalıdır.");
      
      // DİKKAT: Öğrenci için kod zorunluluğunu KALDIRDIK.
      // Artık kodsuz da kayıt olabilirler.
      
      if (formData.role === "parent" && !formData.studentCode.trim()) {
        return setError("Veli olarak kayıt için Öğrenci Kodu zorunludur.");
      }
      if (!kvkkAccepted) {
        return setError("Devam etmek için Kullanıcı Sözleşmesi'ni kabul etmelisiniz.");
      }

      setLoading(true);

      try {
        const payload = {
          first_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          // Kod varsa gönder, yoksa boş gönder
          ...(formData.role === "student" && formData.coachInviteCode.trim() !== "" && { coach_invite_code: formData.coachInviteCode }),
          ...(formData.role === "parent" && { student_code: formData.studentCode }),
        };

        const res = await API.post("/api/register/", payload);
        console.log("Register response:", res.data);

        navigate(`/verify-email`, { state: { email: formData.email } });
        
      } catch (err) {
        console.error("Register error:", err.response?.data || err);
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
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        
        {/* Logo & Başlık */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Kayıt Ol</h1>
          <p className="text-gray-500 mt-2">KoçumNet'e hoş geldin!</p>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-5 text-center font-medium border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        {/* Rol Seçimi */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">
            Hesap Türü
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-medium
                ${formData.role === "student" 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"}`}
            >
              <GraduationCap size={20} />
              Öğrenci
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("parent")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-medium
                ${formData.role === "parent" 
                  ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm" 
                  : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"}`}
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
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Ad Soyad</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
            <p className="text-xs text-gray-400 mt-1 ml-1">En az 6 karakter</p>
          </div>

          {/* Davet Kodları (Koşullu) */}
          {formData.role === "student" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Koç Davet Kodu</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="coachInviteCode"
                  placeholder="ZORUNLU DEĞİL"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white 
                    outline-none transition-all text-gray-800 uppercase font-semibold tracking-wider"
                  value={formData.coachInviteCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, coachInviteCode: e.target.value.toUpperCase() }))}
                  disabled={loading}
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-1">Koçunuzdan aldığınız kodu girin.</p>
            </div>
          )}

          {formData.role === "parent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Öğrenci Kodu</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="studentCode"
                  placeholder="KODU GİRİN"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white 
                    outline-none transition-all text-gray-800 uppercase font-semibold tracking-wider"
                  value={formData.studentCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentCode: e.target.value.toUpperCase() }))}
                  disabled={loading}
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-1">Öğrencinizin profilindeki kodu girin.</p>
            </div>
          )}

          {/* KVKK Checkbox - İSTEDİĞİN TASARIM */}
          <div 
            className="flex items-start gap-3 cursor-pointer select-none bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
            onClick={() => !loading && setKvkkAccepted(!kvkkAccepted)}
          >
            <div className="mt-0.5 text-indigo-600">
              {kvkkAccepted ? (
                <CheckSquare size={22} className="animate-in zoom-in duration-200" />
              ) : (
                <Square size={22} className="text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600 leading-snug">
              <span 
                className="text-indigo-600 hover:underline font-bold"
                onClick={(e) => {
                  e.stopPropagation(); // Checkbox'ı tetikleme, modalı aç
                  setShowAgreement(true);
                }}
              >
                Kullanıcı Sözleşmesi
              </span>
              'ni ve Aydınlatma Metni'ni okudum, kabul ediyorum.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !kvkkAccepted}
            className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg mt-2
              ${kvkkAccepted 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200 transform hover:-translate-y-0.5" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
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
          © 2026 KoçumNet - Tüm hakları saklıdır
        </p>
      </div>

      {/* SÖZLEŞME MODALI */}
      {showAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-gray-800">Kullanıcı Sözleşmesi</h3>
              <button 
                onClick={() => setShowAgreement(false)}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4 custom-scrollbar">
              
              <p><strong>1. TARAFLAR VE KONU</strong><br/>
              İşbu sözleşme, KoçumNet platformu ("Platform") ile hizmetten yararlanan kullanıcı ("Üye") arasında akdedilmiştir. Sözleşmenin konusu, Üye'nin elektronik ortamda sunulan eğitim, akademik takip ve danışmanlık hizmetlerinden yararlanma şartlarının belirlenmesidir.</p>
              
              <p><strong>2. HİZMETİN KAPSAMI VE NİTELİĞİ</strong><br/>
              Platform; sınavlara hazırlık (YKS, LGS vb.), okul takviye ve genel akademik gelişim süreçlerinde; dijital takip, performans analizi, ödevlendirme ve online koçluk hizmetleri sunar. Bu hizmetler, <strong>193 sayılı Gelir Vergisi Kanunu Mükerrer Madde 20/B</strong> kapsamında "İnternet ve benzeri elektronik ortamlar üzerinden sunulan hizmetler" statüsündedir.</p>
              
              <p><strong>3. KULLANIM ŞARTLARI</strong><br/>
              Platform, bireysel gelişim ve akademik takip amacıyla tasarlanmıştır. Üye, Platform üzerinden sunulan içerikleri, grafikleri ve analizleri yalnızca kendi bireysel kullanımı için çoğaltabilir. Platformdaki içeriklerin ticari amaçla kopyalanması veya üçüncü şahıslara satılması yasaktır.</p>

              <p><strong>4. KİŞİSEL VERİLER VE GİZLİLİK (KVKK)</strong><br/>
              Üye'nin akademik verileri, deneme sonuçları, çalışma programları ve Koç ile gerçekleştirdiği dijital iletişim kayıtları; yalnızca eğitimin takibi ve performansın artırılması amacıyla işlenmektedir. Platform, bu verileri "Veri İşleme ve Geliştirme Hizmeti" kapsamında analiz eder. Üye verileri, yasal zorunluluklar haricinde üçüncü kişilerle paylaşılmaz.</p>
              
              <p><strong>5. VELİ VE ÖĞRENCİ İLİŞKİSİ</strong><br/>
              Veli hesabı ile eşleştirilen Öğrenci hesaplarında; Veli, öğrencinin akademik gelişimini, ödev durumunu ve sisteme girdiği verileri görüntüleme hakkına sahiptir. Üye (Öğrenci), bu veri paylaşımını peşinen kabul eder.</p>
              
              <p><strong>6. SORUMLULUK REDDİ</strong><br/>
              Platform, öğrencinin akademik başarısını artırmayı hedefler ancak sınav sonuçları üzerinde kesin bir garanti vermez. Başarı; öğrencinin bireysel çalışmasına ve disiplinine bağlıdır.</p>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                <p className="text-xs text-blue-800 font-medium leading-5">
                  ℹ️ <strong>Yasal Bilgilendirme:</strong> Bu platform Milli Eğitim Bakanlığı'na bağlı bir "Özel Öğretim Kurumu" (dershane/okul/kurs) statüsünde değildir. Hizmet sağlayıcı; sınavlara hazırlık sürecinde bireysel gelişim takibi, dijital içerik sunumu ve akademik mentörlük hizmeti veren bir dijital girişimdir.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setShowAgreement(false)}
                className="px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors text-sm"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  setKvkkAccepted(true);
                  setShowAgreement(false);
                }}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm flex items-center gap-2"
              >
                <Check size={18} />
                Okudum, Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}