import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Mail, Lock } from "lucide-react";

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
      
      console.log("Login response:", res.data);
      
      // TOKEN'I VE BİLGİLERİ KAYDET
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.user);
      localStorage.setItem('role', res.data.role); // coach, student, veya parent
      localStorage.setItem('user_id', res.data.user_id);
      
      if (setUser) {
        setUser({ 
          name: res.data.user,
          role: res.data.role
        });
      }
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.message ||
                       "Giriş başarısız! Bilgilerini kontrol et.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">KoçumNet</h1>
          <p className="text-gray-500 mt-2">YKS Koçluk Platformu</p>
        </div>
        
        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta veya Kullanıcı Adı
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="ornek@mail.com" 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white 
                  outline-none transition-all text-gray-800"
                value={inputVal} 
                onChange={(e) => setInputVal(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white 
                  outline-none transition-all text-gray-800"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
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
          </div>

          {/* Şifremi Unuttum */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Şifremi Unuttum
            </Link>
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
                Giriş yapılıyor...
              </span>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Hesabın yok mu?{" "}
            <Link 
              to="/register" 
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Kayıt Ol
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 KoçumNet - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}