import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";

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
      
      // TOKEN'I KAYDET (en önemli kısım!)
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
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.error || "Giriş başarısız! Bilgilerini kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">KoçumNet</h1>
          <p className="text-gray-500 mt-2">YKS Koçluk Platformu</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Adı veya E-posta
            </label>
            <input 
              type="text"
              placeholder="ornek@mail.com" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white 
                outline-none transition-all text-gray-800"
              value={inputVal} 
              onChange={(e) => setInputVal(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white 
                  outline-none transition-all text-gray-800 pr-12"
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

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl 
              font-bold hover:from-indigo-700 hover:to-purple-700 transition-all 
              shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="text-center text-gray-400 text-sm mt-8">
          © 2026 KoçumNet - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}