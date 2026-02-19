import { useState, useEffect, useRef } from "react";
import API from "../api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Copy, Check, MessageCircle } from "lucide-react";

// ─── Plan label + fiyat verisi (Register ile aynı) ─────
const planLabels = { core: 'Disiplinli', plus: 'Plus', pro: 'Premium' };
const goalLabels = { ortaokul: 'Ortaokul', lise: 'Lise', lgs: 'LGS', yks: 'YKS' };

const planPrices = {
  ortaokul: { core: '1.250', plus: '2.500', pro: '4.500' },
  lise:     { core: '1.500', plus: '3.000', pro: '5.000' },
  lgs:      { core: '1.500', plus: '3.000', pro: '5.000' },
  yks:      { core: '1.750', plus: '3.500', pro: '6.000' },
};

const IBAN_INFO = {
  bank: 'Ziraat Bankası',
  name: 'Erdi Koçum',
  iban: 'TR00 0000 0000 0000 0000 0000 00', // Erdi gerçek IBAN'ı verecek
};

const WHATSAPP_NUMBER = '905551234567'; // Erdi gerçek numarayı verecek

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // State'ten veriler
  const email = location.state?.email || new URLSearchParams(location.search).get("email") || "";
  const goal = location.state?.goal || "";
  const plan = location.state?.plan || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);

  const inputRefs = useRef([]);

  // Geri sayım
  useEffect(() => {
    if (countdown > 0 && !success) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!success) {
      setCanResend(true);
    }
  }, [countdown, success]);

  // Email yoksa login'e yönlendir
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== "") && newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
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

      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();

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
      await API.post("/api/verify-email/", {
        email: email,
        code: codeString,
      });
      setSuccess(true);
    } catch (err) {
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
      const errorMsg = err.response?.data?.error || "Kod gönderilemedi. Tekrar deneyin.";
      setError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const copyIban = () => {
    navigator.clipboard.writeText(IBAN_INFO.iban.replace(/\s/g, ''));
    setIbanCopied(true);
    setTimeout(() => setIbanCopied(false), 2000);
  };

  const price = goal && plan ? planPrices[goal]?.[plan] : null;
  const planName = goal && plan
    ? `${planLabels[plan] || plan} ${goalLabels[goal] || goal}`
    : null;

  // ─── Başarı Ekranı (Tebrikler + IBAN) ─────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Tebrikler Kartı */}
          <div className="bg-white rounded-3xl shadow-xl border border-surface-100 overflow-hidden">
            {/* Üst yeşil banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Tebrikler!</h1>
              <p className="text-green-100 text-sm">Hesabın başarıyla oluşturuldu ve doğrulandı.</p>
            </div>

            {/* İçerik */}
            <div className="px-8 py-8">
              {/* Seçilen Plan Bilgisi */}
              {planName && (
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-6">
                  <p className="text-sm text-surface-500 mb-1">Seçtiğin paket</p>
                  <p className="text-lg font-bold text-surface-900">{planName}</p>
                  {price && (
                    <p className="text-primary-600 font-semibold mt-1">{price}₺ <span className="text-sm font-normal text-surface-400">/ ay</span></p>
                  )}
                </div>
              )}

              {/* IBAN Bilgileri */}
              {price && (
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-surface-700 mb-3">Ödeme Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">Banka</span>
                      <span className="text-sm font-medium text-surface-800">{IBAN_INFO.bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-500">Ad Soyad</span>
                      <span className="text-sm font-medium text-surface-800">{IBAN_INFO.name}</span>
                    </div>
                    <div className="pt-2 border-t border-surface-200">
                      <p className="text-sm text-surface-500 mb-1">IBAN</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm font-mono text-surface-900 bg-white px-3 py-2 rounded-lg border border-surface-200">
                          {IBAN_INFO.iban}
                        </code>
                        <button
                          onClick={copyIban}
                          className="p-2 rounded-lg bg-white border border-surface-200 hover:bg-surface-50 transition-colors"
                          title="Kopyala"
                        >
                          {ibanCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-surface-400" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-surface-400 mt-3">
                    Havale açıklamasına kayıtlı e-posta adresini yazmanı rica ederiz.
                  </p>
                </div>
              )}

              {/* WhatsApp Butonu */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Merhaba, ${planName || 'Disiplinli'} paketine kayıt oldum. Ödeme hakkında bilgi almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20BD5A] transition-all shadow-lg shadow-green-200/50 mb-3"
              >
                <MessageCircle size={20} />
                WhatsApp ile İletişime Geç
              </a>

              {/* Giriş Yap Butonu */}
              <Link
                to="/login"
                className="flex items-center justify-center w-full py-3.5 bg-surface-800 text-white rounded-xl font-semibold hover:bg-surface-900 transition-all"
              >
                Giriş Yap
              </Link>

              <p className="text-center text-xs text-surface-400 mt-4">
                Ödeme onaylandıktan sonra paketiniz aktif edilecektir.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-surface-400 text-xs mt-6">
            © 2025 Disiplinli — Tüm hakları saklıdır
          </p>
        </div>
      </div>
    );
  }

  // ─── Doğrulama Formu ─────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-surface-100 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900">E-posta Doğrulama</h1>
          <p className="text-surface-600 mt-3">
            <span className="font-semibold text-surface-800">{email}</span> adresine doğrulama kodu gönderildi.
          </p>
          <p className="text-surface-400 text-sm mt-2">Bulamazsan spam klasörüne göz at.</p>
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
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-surface-200 bg-surface-50 text-surface-800"}
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || code.join("").length !== 6}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl
            font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed mb-4"
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
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              {resendLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
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
            <p className="text-surface-500 text-sm">
              Tekrar kod göndermek için <span className="font-semibold text-primary-600">{countdown}</span> saniye bekle
            </p>
          )}
        </div>

        {/* Back to Register */}
        <div className="mt-6 pt-6 border-t border-surface-100 text-center">
          <Link
            to="/register"
            className="text-surface-500 hover:text-surface-700 text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Kayıt sayfasına dön
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-surface-400 text-xs mt-6">
          © 2025 Disiplinli — Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}
