import { useState, useEffect, useRef } from "react";
import API from "../api";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { BookOpen, Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Geri sayım
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Email yoksa login'e yönlendir
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Başarılı doğrulamadan sonra login'e yönlendir
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleCodeChange = (index, value) => {
    // Sadece rakam kabul et
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Sonraki input'a geç
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Tüm kod girildi mi kontrol et
    if (newCode.every(digit => digit !== "") && newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace ile önceki input'a dön
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      
      // Son dolu input'a focus
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();

      // Tam kod yapıştırıldıysa doğrula
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = async (codeString = code.join("")) => {
    if (codeString.length !== 6) {
      setError("Lütfen 6 haneli kodu eksiksiz girin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/verify-email/", {
        email: email,
        code: codeString,
      });

      console.log("Verify response:", res.data);
      setSuccess(true);
    } catch (err) {
      console.error("Verify error:", err.response?.data || err);
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.message || 
                       "Doğrulama başarısız. Kodu kontrol edin.";
      setError(errorMsg);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");

    try {
      await API.post("/api/resend-verification/", { email });
      setCountdown(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend error:", err.response?.data || err);
      const errorMsg = err.response?.data?.error || "Kod gönderilemedi. Tekrar deneyin.";
      setError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  // Başarı Ekranı
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hesap Doğrulandı!</h1>
          <p className="text-gray-500 mb-6">
            E-posta adresin başarıyla doğrulandı. Şimdi giriş yapabilirsin.
          </p>
          <p className="text-sm text-gray-400">
            3 saniye içinde giriş sayfasına yönlendirileceksin...
          </p>
          <Link 
            to="/login"
            className="inline-block mt-4 text-indigo-600 font-semibold hover:underline"
          >
            Hemen Giriş Yap →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">E-posta Doğrulama</h1>
          <p className="text-gray-500 mt-2 text-sm">
            <span className="font-medium text-gray-700">{email}</span> adresine gönderilen 6 haneli kodu gir
          </p>
        </div>

        {/* Brevo Uyarısı */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">Mail kutunu kontrol et!</p>
              <p className="text-amber-700 mt-1">
                Kod <strong>Brevo</strong> üzerinden gönderildi. Gelen kutunda bulamazsan 
                <strong> Spam</strong> veya <strong>Gereksiz</strong> klasörünü de kontrol et.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-5 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* 6-Digit Code Input */}
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none
                ${digit 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                  : "border-gray-200 bg-gray-50 text-gray-800"}
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || code.join("").length !== 6}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl 
            font-bold hover:from-indigo-700 hover:to-purple-700 transition-all 
            shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Doğrulanıyor...
            </span>
          ) : (
            "Doğrula"
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              {resendLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Tekrar Kod Gönder
                </>
              )}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Tekrar kod göndermek için <span className="font-semibold text-indigo-600">{countdown}</span> saniye bekle
            </p>
          )}
        </div>

        {/* Back to Register */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link 
            to="/register"
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Kayıt sayfasına dön
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 KoçumNet - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}