import { Link } from "react-router-dom";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CerezPolitikasi() {
  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-surface-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Cookie className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">Çerez Politikası</h1>
              <p className="text-surface-500 text-sm">Son güncelleme: Şubat 2026</p>
            </div>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
            <ArrowLeft size={16} />
            Ana sayfaya dön
          </Link>
        </div>

        {/* İçerik */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 border border-surface-100 space-y-8 text-surface-700 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Çerez (Cookie) Nedir?</h2>
            <p>
              Çerezler, web sitelerinin kullanıcı cihazına (bilgisayar, telefon, tablet) yerleştirdiği küçük metin dosyalarıdır.
              Bu dosyalar, sitenin düzgün çalışması, kullanıcı deneyiminin iyileştirilmesi ve site kullanımının analiz edilmesi
              amacıyla kullanılmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Kullandığımız Çerez Türleri</h2>

            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-2 text-sm">Zorunlu Çerezler</h3>
                <p className="text-sm text-emerald-700">
                  Sitenin temel işlevleri için gereklidir. Oturum yönetimi, güvenlik ve kimlik doğrulama
                  gibi işlemleri sağlar. Bu çerezler olmadan site düzgün çalışmaz.
                  Bu çerezler için ayrıca onay alınmasına gerek yoktur.
                </p>
                <div className="mt-2 text-xs text-emerald-600">
                  <strong>Örnekler:</strong> Oturum çerezi (auth token), CSRF koruma çerezi
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm">Tercih Çerezleri</h3>
                <p className="text-sm text-blue-700">
                  Kullanıcı tercihlerini (dil, tema gibi) hatırlamak için kullanılır.
                  Sitenin kişiselleştirilmiş bir deneyim sunmasını sağlar.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 mb-2 text-sm">Analitik Çerezler</h3>
                <p className="text-sm text-amber-700">
                  Site trafiğini ve kullanıcı davranışlarını anonim olarak analiz etmek için kullanılır.
                  Bu çerezler kişisel veri toplamaz; yalnızca toplu istatistiksel veriler oluşturur.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm">
              <strong>Not:</strong> Disiplinli platformunda reklam çerezi veya üçüncü taraf pazarlama çerezi kullanılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. Çerezlerin Hukuki Dayanağı</h2>
            <p>
              Çerez kullanımımız, 6698 sayılı KVKK ve Kişisel Verileri Koruma Kurulu kararları çerçevesinde yürütülmektedir.
              Zorunlu çerezler dışındaki çerezler için kullanıcının açık rızası alınmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. Çerez Tercihleri</h2>
            <p>
              Sitemizi ilk ziyaretinizde çerez tercih banneri aracılığıyla zorunlu olmayan çerezleri kabul edip etmeyeceğinizi
              seçebilirsiniz. Tercihlerinizi istediğiniz zaman tarayıcı ayarlarınızdan değiştirebilirsiniz.
            </p>

            <div className="bg-surface-50 rounded-xl p-4 mt-3 text-sm space-y-2">
              <p className="font-semibold text-surface-800">Tarayıcı ayarlarından çerez yönetimi:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler</li>
                <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                <li><strong>Edge:</strong> Ayarlar → Gizlilik → Çerezler</li>
              </ul>
              <p className="text-surface-500 mt-2">
                Zorunlu çerezlerin devre dışı bırakılması halinde sitenin bazı işlevleri düzgün çalışmayabilir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. İletişim</h2>
            <div className="bg-surface-50 rounded-xl p-4 text-sm space-y-2">
              <p>Çerez politikamız hakkında sorularınız için:</p>
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p>
                Kişisel verilerinizle ilgili detaylı bilgi için{' '}
                <Link to="/kvkk" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                  KVKK Aydınlatma Metni
                </Link>
                'ni inceleyebilirsiniz.
              </p>
            </div>
          </section>

          <section className="pt-4 border-t border-surface-200 text-center">
            <p className="text-sm text-surface-500">
              Bu çerez politikası, 6698 sayılı KVKK ve Kişisel Verileri Koruma Kurulu kararları kapsamında hazırlanmıştır.
            </p>
          </section>
        </div>

        <p className="text-center text-surface-400 text-sm mt-6">© 2026 Disiplinli - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}
