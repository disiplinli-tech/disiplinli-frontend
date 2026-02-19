import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Users, Lock } from "lucide-react";

export default function KullaniciSozlesmesi() {
  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-surface-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">Kullanıcı Sözleşmesi ve Gizlilik Politikası</h1>
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

          {/* Giriş */}
          <section>
            <p>
              Bu Kullanıcı Sözleşmesi ("Sözleşme"), Disiplinli platformunu ("Platform") kullanan
              tüm kullanıcılar ("Kullanıcı") ile Platform sahibi arasındaki hak ve yükümlülükleri
              düzenlemektedir. Platformu kullanarak bu sözleşmeyi kabul etmiş sayılırsınız.
            </p>
          </section>

          {/* 1. Tanımlar */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                <FileText className="text-primary-500" size={18} />
              </div>
              <h2 className="text-lg font-bold text-surface-900">1. Tanımlar</h2>
            </div>
            <div className="space-y-2 text-sm pl-4 border-l-2 border-primary-100">
              <p><strong>Platform:</strong> Disiplinli web uygulaması ve ilgili tüm dijital hizmetler.</p>
              <p><strong>Koç:</strong> Öğrencilere sınav hazırlık sürecinde rehberlik eden eğitimci kullanıcılar.</p>
              <p><strong>Öğrenci:</strong> Platform üzerinden akademik koçluk hizmeti alan kullanıcılar.</p>
              <p><strong>Veli:</strong> Öğrencinin durumunu takip eden ebeveyn kullanıcılar.</p>
            </div>
          </section>

          {/* 2. Hizmet Kapsamı */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-warm-50 rounded-xl flex items-center justify-center">
                <Users className="text-warm-500" size={18} />
              </div>
              <h2 className="text-lg font-bold text-surface-900">2. Hizmet Kapsamı</h2>
            </div>
            <p className="mb-3 text-sm">Disiplinli aşağıdaki dijital hizmetleri sunmaktadır:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Koç-öğrenci eşleştirme ve iletişim platformu</li>
              <li>Deneme sınavı sonuçları takibi ve analizi</li>
              <li>Haftalık çalışma programı oluşturma</li>
              <li>Ödev atama ve takip sistemi</li>
              <li>Veli bilgilendirme paneli</li>
              <li>Dijital eğitim içerikleri</li>
              <li>Birebir canlı özel ders (Premium paketlerde)</li>
            </ul>
          </section>

          {/* 3. Kullanıcı Yükümlülükleri */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <Shield className="text-amber-500" size={18} />
              </div>
              <h2 className="text-lg font-bold text-surface-900">3. Kullanıcı Yükümlülükleri</h2>
            </div>
            <p className="mb-3 text-sm">Kullanıcılar aşağıdaki kurallara uymayı kabul eder:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Doğru ve güncel bilgiler sağlamak</li>
              <li>Hesap bilgilerini gizli tutmak ve üçüncü kişilerle paylaşmamak</li>
              <li>Platformu yalnızca yasal amaçlarla kullanmak</li>
              <li>Diğer kullanıcılara saygılı davranmak</li>
              <li>Telif hakkı veya fikri mülkiyet haklarını ihlal etmemek</li>
              <li>Platformun güvenliğini tehlikeye atacak eylemlerden kaçınmak</li>
            </ul>
          </section>

          {/* 4. Gizlilik ve KVKK */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <Lock className="text-green-500" size={18} />
              </div>
              <h2 className="text-lg font-bold text-surface-900">4. Gizlilik ve Kişisel Veriler</h2>
            </div>
            <p className="mb-3 text-sm">
              Kişisel verilerinizin işlenmesine ilişkin detaylı bilgi için{' '}
              <Link to="/kvkk" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                KVKK Aydınlatma Metni
              </Link>
              'ni inceleyebilirsiniz.
            </p>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <ul className="text-sm text-green-700 space-y-2">
                <li>Verileriniz endüstri standardı güvenlik önlemleri ile korunmaktadır</li>
                <li>Verileriniz üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz</li>
                <li>İstediğiniz zaman hesabınızı silebilir ve verilerinizin imhasını talep edebilirsiniz</li>
                <li>Sorularınız için: destek@disiplinli.com</li>
              </ul>
            </div>
          </section>

          {/* 5. Sorumluluk Reddi */}
          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Sorumluluk Reddi</h2>
            <p className="text-sm">
              Disiplinli, sunulan hizmetlerin kesintisiz veya hatasız olacağını garanti etmez.
              Platform üzerinden sağlanan sıralama tahminleri ve analizler yalnızca bilgilendirme
              amaçlıdır ve kesin sonuç garantisi içermez.
            </p>
          </section>

          {/* 6. Fikri Mülkiyet */}
          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. Fikri Mülkiyet</h2>
            <p className="text-sm">
              Platform üzerindeki tüm içerik, tasarım, logo, yazılım ve diğer materyaller
              Disiplinli'nin fikri mülkiyetindedir. İzinsiz kopyalama, dağıtma veya değiştirme yasaktır.
            </p>
          </section>

          {/* 7. Sözleşme Değişiklikleri */}
          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. Sözleşme Değişiklikleri</h2>
            <p className="text-sm">
              Disiplinli, bu sözleşmeyi önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar.
              Değişiklikler Platform üzerinden yayınlandığı anda yürürlüğe girer.
            </p>
          </section>

          {/* 8. İletişim */}
          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">8. İletişim</h2>
            <div className="bg-surface-50 rounded-xl p-4 text-sm space-y-2">
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p><strong>KEP:</strong> [KEP ADRESİ]</p>
            </div>
          </section>

          {/* İlgili Sayfalar */}
          <section className="pt-4 border-t border-surface-200">
            <h3 className="text-sm font-semibold text-surface-700 mb-3">İlgili Sayfalar</h3>
            <div className="flex flex-wrap gap-2">
              {[
                ['Mesafeli Satış Sözleşmesi', '/mesafeli-satis-sozlesmesi'],
                ['İptal ve İade Koşulları', '/iptal-iade'],
                ['KVKK Aydınlatma Metni', '/kvkk'],
                ['Çerez Politikası', '/cerez-politikasi'],
                ['Ön Bilgilendirme Formu', '/on-bilgilendirme']
              ].map(([label, href]) => (
                <Link key={href} to={href} className="text-xs bg-surface-100 hover:bg-primary-50 text-surface-600 hover:text-primary-600 px-3 py-1.5 rounded-lg transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <p className="text-center text-surface-400 text-sm mt-6">© 2026 Disiplinli - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}
