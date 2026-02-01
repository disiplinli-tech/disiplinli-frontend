import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [inputVal, setInputVal] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Backend'e login istegi at
      const res = await API.post("/api/login/", { 
        email: inputVal, 
        password 
      });
      
      console.log("Login response:", res.data);
      
      // KRITIK DUZELTME: Backend'den gelen role'u kullan!
      setUser({ 
        name: res.data.user,
        role: res.data.role  // 'coach' veya 'student'
      });
      
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.error || "Giris basarisiz! Bilgilerini kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">KocumNet Giris</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Hesabina erismek icin giris yap</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanici Adi veya Email</label>
            <input 
              type="text"
              placeholder="Orn: ahmet123 veya ahmet@mail.com" 
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={inputVal} 
              onChange={(e) => setInputVal(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sifre</label>
            <input 
              type="password" 
              placeholder="********" 
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}