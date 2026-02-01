import { useState } from "react";
import { User, Bell, Shield, Palette, Copy, CheckCheck } from "lucide-react";
import axios from "axios";

export default function Settings({ user }) {
  const [notifications, setNotifications] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ayarlar</h2>
        <p className="text-gray-500 text-sm mt-1">Hesap ayarlarını yönet</p>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <User className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Profil Bilgileri</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Hesap Türü</span>
            <span className="font-medium text-gray-800">
              {user?.role === 'coach' ? '🎓 Koç Hesabı' : '📚 Öğrenci Hesabı'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Üyelik Durumu</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Aktif</span>
          </div>
        </div>
      </div>

      {/* Bildirimler */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-xl">
            <Bell className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Bildirimler</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">E-posta Bildirimleri</p>
            <p className="text-sm text-gray-500">Önemli güncellemelerden haberdar ol</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-14 h-7 rounded-full transition-colors ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Güvenlik */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Shield className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Güvenlik</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
            Şifre Değiştir
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
            İki Faktörlü Doğrulama
          </button>
        </div>
      </div>

      {/* Tema */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Palette className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Görünüm</h3>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-medium flex items-center justify-center gap-2">
            ☀️ Açık Tema
          </button>
          <button className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
            🌙 Koyu Tema
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Koyu tema yakında eklenecek</p>
      </div>

      {/* Destek */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Yardıma mı ihtiyacın var?</h3>
        <p className="text-blue-100 text-sm mb-4">Sorularını bize ilet, en kısa sürede yardımcı olalım.</p>
        <button className="px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
          Destek Al
        </button>
      </div>
    </div>
  );
}