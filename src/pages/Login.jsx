import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Target, TrendingUp, Users, BookOpen, ChevronRight } from "lucide-react";

export default function Login({ setUser }) {
  const [inputVal, setInputVal] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/api/login/", {
        email: inputVal,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.user);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);

      if (setUser) {
        setUser({
          name: res.data.user,
          role: res.data.role
        });
      }

      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.error ||
                       err.response?.data?.message ||
                       "Giriş başarısız! Bilgilerini kontrol et.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* Sol Panel - Branding */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
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
                  className="w-8 h-8 rounded-full border-2 border-primary-700 flex items-center justify-center text-[10px] font-bold text-white"
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
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-[420px]">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="font-display font-bold text-xl text-surface-800">Disiplinli</span>
            </Link>
          </div>

          {/* Baslik */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
              Tekrar hoş geldin
            </h1>
            <p className="text-surface-500 mt-2">
              Hesabına giriş yap ve kaldığın yerden devam et.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">
                E-posta veya Kullanıcı Adı
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="ornek@mail.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-surface-200 rounded-xl bg-surface-50
                    focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                    outline-none transition-all text-surface-800 placeholder:text-surface-400"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-surface-700">
                  Şifre
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
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
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 rounded-xl
                font-bold hover:from-primary-700 hover:to-primary-800 transition-all
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
              hover:text-primary-700 transition-all group"
          >
            Yeni hesap oluştur
            <ChevronRight size={16} className="text-surface-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Footer */}
          <p className="text-center text-surface-400 text-xs mt-8">
            © 2026 Disiplinli - Tüm hakları saklıdır
          </p>
        </div>
      </div>
    </div>
  );
}
