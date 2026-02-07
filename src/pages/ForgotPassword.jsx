import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, ArrowLeft, Key } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code + new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/api/forgot-password/", { email });
      setSuccess("Şifre sıfırlama kodu e-posta adresinize gönderildi.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/reset-password/", {
        email,
        code,
        new_password: newPassword
      });
      setSuccess("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Kod geçersiz veya süresi dolmuş.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
            <BookOpen className="text-white w-7 h-7 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Şifremi Unuttum</h1>
          <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">
            {step === 1 ? "E-posta adresinizi girin" : "Kodu girin ve yeni şifre belirleyin"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm mb-6 text-center font-medium border border-green-100">
            {success}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="ornek@mail.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl
                font-bold hover:from-indigo-700 hover:to-purple-700 transition-all
                shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Gönderiliyor...
                </span>
              ) : (
                "Kod Gönder"
              )}
            </button>
          </form>
        )}

        {/* Step 2: Code + New Password Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doğrulama Kodu
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="6 haneli kod"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all text-gray-800 text-center text-lg tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="En az 6 karakter"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all text-gray-800"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Şifreyi tekrar girin"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white
                    outline-none transition-all text-gray-800"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl
                font-bold hover:from-indigo-700 hover:to-purple-700 transition-all
                shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Güncelleniyor...
                </span>
              ) : (
                "Şifreyi Güncelle"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCode("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setSuccess("");
              }}
              className="w-full text-sm text-gray-500 hover:text-indigo-600 mt-2"
            >
              Farklı bir e-posta kullan
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Giriş sayfasına dön
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 KoçumNet - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}
