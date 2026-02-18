import { useState, useRef, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, Target, TrendingUp,
  Users, BookOpen, ChevronRight, Phone, Shield, KeyRound
} from "lucide-react";

export default function Login({ setUser }) {
  // Step: 'identifier' | 'password' | 'otp'
  const [step, setStep] = useState('identifier');
  const [identifier, setIdentifier] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSending, setOtpSending] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // OTP geri sayım
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Telefon mu mail mi kontrol et
  const detectType = (val) => {
    const cleaned = val.replace(/\s/g, '').replace(/[()-]/g, '');
    // Başı 0 veya + ile başlıyorsa ve sadece rakam/+ içeriyorsa telefon
    if (/^[+0]\d{9,}$/.test(cleaned)) return true;
    // Sadece rakamlardan oluşuyorsa ve 10+ karakterse telefon
    if (/^\d{10,}$/.test(cleaned)) return true;
    return false;
  };

  // Adım 1: Identifier gönder
  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Lütfen telefon numaranı veya e-posta adresini gir.');
      return;
    }

    const phone = detectType(identifier);
    setIsPhone(phone);

    if (phone) {
      // Telefon → OTP gönder
      setOtpSending(true);
      try {
        await API.post('/api/send-otp/', { phone: identifier });
        setStep('otp');
        setOtpTimer(120); // 2 dakika
        setOtpCode(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } catch (err) {
        const msg = err.response?.data?.error || 'SMS gönderilemedi. Lütfen tekrar dene.';
        setError(msg);
      } finally {
        setOtpSending(false);
      }
    } else {
      // Mail → şifre ekranına geç
      setStep('password');
    }
  };

  // Adım 2a: Şifre ile giriş
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/api/login/', {
        email: identifier,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.user);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);

      if (setUser) {
        setUser({ name: res.data.user, role: res.data.role });
      }

      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error ||
                       err.response?.data?.message ||
                       'Giriş başarısız! Bilgilerini kontrol et.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Adım 2b: OTP doğrulama
  const handleOtpVerify = async (code) => {
    const fullCode = code || otpCode.join('');
    if (fullCode.length < 6) return;

    setError('');
    setLoading(true);

    try {
      const res = await API.post('/api/verify-otp/', {
        phone: identifier,
        code: fullCode
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.user);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);

      if (setUser) {
        setUser({ name: res.data.user, role: res.data.role });
      }

      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Kod hatalı! Tekrar dene.';
      setError(errorMsg);
      setOtpCode(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    // Sonraki inputa geç
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Hepsi dolduysa otomatik doğrula
    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      handleOtpVerify(fullCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // OTP tekrar gönder
  const resendOtp = async () => {
    if (otpTimer > 0) return;
    setOtpSending(true);
    setError('');
    try {
      await API.post('/api/send-otp/', { phone: identifier });
      setOtpTimer(120);
      setOtpCode(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError('SMS gönderilemedi. Lütfen tekrar dene.');
    } finally {
      setOtpSending(false);
    }
  };

  // Geri dön
  const goBack = () => {
    setStep('identifier');
    setError('');
    setPassword('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpTimer(0);
  };

  // Telefon numarasını maskele
  const maskedPhone = () => {
    const cleaned = identifier.replace(/\s/g, '');
    if (cleaned.length < 4) return identifier;
    return cleaned.slice(0, 4) + ' *** ** ' + cleaned.slice(-2);
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
                Hedefine giden
                <br />
                yol burada
                <span className="text-warm-400">.</span>
              </h2>
              <p className="text-primary-200 text-lg mt-4 leading-relaxed max-w-md">
                Binlerce öğrenci Disiplinli ile hedeflerine ulaşıyor.
                Sıra sende.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: Target, text: "Kişiselleştirilmiş çalışma planı" },
                { icon: TrendingUp, text: "Net artışını takip et" },
                { icon: Users, text: "Birebir koç desteği" },
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

      {/* Sağ Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-[420px]">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="font-display font-bold text-xl text-surface-800">Disiplinli</span>
            </Link>
          </div>

          {/* ═══════════ ADIM 1: IDENTIFIER ═══════════ */}
          {step === 'identifier' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Tekrar hoş geldin
                </h1>
                <p className="text-surface-500 mt-2">
                  Telefon numaran veya e-posta adresinle giriş yap.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleIdentifierSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">
                    Telefon veya E-posta
                  </label>
                  <div className="relative group">
                    {detectType(identifier) ? (
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    ) : (
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    )}
                    <input
                      type="text"
                      placeholder="Telefon veya e-posta"
                      className="w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-xl bg-surface-50
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                        outline-none transition-all text-surface-800 placeholder:text-surface-400"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      autoFocus
                      required
                      disabled={otpSending}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpSending}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl
                    font-bold hover:from-primary-600 hover:to-primary-700 transition-all
                    shadow-lg shadow-primary-200/50 disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:shadow-xl hover:shadow-primary-300/40 hover:-translate-y-0.5 active:translate-y-0
                    flex items-center justify-center gap-2 group"
                >
                  {otpSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      SMS gönderiliyor...
                    </span>
                  ) : (
                    <>
                      Devam Et
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 mb-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-surface-400 font-medium">veya</span>
                <div className="flex-1 h-px bg-surface-200" />
              </div>

              {/* Register Link */}
              <Link
                to="/register"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-surface-200
                  text-surface-700 font-semibold hover:border-primary-200 hover:bg-primary-50/50
                  hover:text-primary-600 transition-all group"
              >
                Yeni hesap oluştur
                <ChevronRight size={16} className="text-surface-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </>
          )}

          {/* ═══════════ ADIM 2a: ŞİFRE (Mail) ═══════════ */}
          {step === 'password' && (
            <>
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-6 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Geri</span>
              </button>

              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Şifreni gir
                </h1>
                <p className="text-surface-500 mt-2">
                  <span className="font-medium text-surface-700">{identifier}</span> hesabına giriş yap.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-surface-700">
                      Şifre
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary-500 hover:text-primary-600 font-medium hover:underline"
                    >
                      Şifremi Unuttum
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3.5 border border-surface-200 rounded-xl bg-surface-50
                        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                        outline-none transition-all text-surface-800 placeholder:text-surface-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                      required
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl
                    font-bold hover:from-primary-600 hover:to-primary-700 transition-all
                    shadow-lg shadow-primary-200/50 disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:shadow-xl hover:shadow-primary-300/40 hover:-translate-y-0.5 active:translate-y-0
                    flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    <>
                      Giriş Yap
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ═══════════ ADIM 2b: OTP (Telefon) ═══════════ */}
          {step === 'otp' && (
            <>
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition-colors mb-6 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Geri</span>
              </button>

              <div className="mb-8">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="text-primary-500" size={28} />
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
                  Doğrulama kodu
                </h1>
                <p className="text-surface-500 mt-2">
                  <span className="font-medium text-surface-700">{maskedPhone()}</span> numarasına gönderilen 6 haneli kodu gir.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {/* OTP Inputs */}
              <div className="flex gap-3 justify-center mb-6">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      if (paste.length === 6) {
                        const newOtp = paste.split('');
                        setOtpCode(newOtp);
                        otpRefs.current[5]?.focus();
                        handleOtpVerify(paste);
                      }
                    }}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-surface-50
                      focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                      outline-none transition-all text-surface-800
                      ${digit ? 'border-primary-300 bg-primary-50/50' : 'border-surface-200'}`}
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center gap-2 text-surface-500 mb-4">
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Doğrulanıyor...</span>
                </div>
              )}

              {/* Timer ve Tekrar Gönder */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-surface-400">
                    Yeni kod gönder <span className="font-semibold text-surface-600">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
                  </p>
                ) : (
                  <button
                    onClick={resendOtp}
                    disabled={otpSending}
                    className="text-sm text-primary-500 hover:text-primary-600 font-semibold hover:underline disabled:opacity-50"
                  >
                    {otpSending ? 'Gönderiliyor...' : 'Kodu tekrar gönder'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-surface-400 text-xs mt-8">
            © 2026 Disiplinli - Tüm hakları saklıdır
          </p>
        </div>
      </div>
    </div>
  );
}
