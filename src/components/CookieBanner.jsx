import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Kısa gecikme ile göster (sayfa yüklendikten sonra)
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-fade-up">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-surface-200 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cookie size={20} className="text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-surface-900 text-sm mb-1">Çerez Kullanımı</h3>
            <p className="text-sm text-surface-500 leading-relaxed">
              Sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. Zorunlu çerezler sitenin çalışması için gereklidir.
              Detaylı bilgi için{' '}
              <Link to="/cerez-politikasi" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                Çerez Politikamızı
              </Link>{' '}
              inceleyebilirsiniz.
            </p>
          </div>
          <button
            onClick={handleReject}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={16} className="text-surface-400" />
          </button>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-800 hover:bg-surface-100 rounded-xl transition-colors"
          >
            Sadece Zorunlu
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl
              hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
