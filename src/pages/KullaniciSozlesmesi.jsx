import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft, Shield, FileText, Users, Lock } from "lucide-react";

export default function KullaniciSozlesmesi() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Disiplinli</h1>
              <p className="text-gray-500">Kullanıcı Sözleşmesi ve Gizlilik Politikası</p>
            </div>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft size={18} />
            Kayıt sayfasına dön
          </Link>
        </div>

        {/* İçerik */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">

          {/* Giriş */}
          <section>
            <p className="text-gray-600 leading-relaxed">
              Bu Kullanıcı Sözleşmesi ("Sözleşme"), Disiplinli platformunu ("Platform") kullanan
              tüm kullanıcılar ("Kullanıcı") ile Platform sahibi arasındaki hak ve yükümlülükleri
              düzenlemektedir. Platformu kullanarak bu sözleşmeyi kabul etmiş sayılırsınız.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Son güncelleme: 3 Şubat 2026
            </p>
          </section>

          {/* 1. Tanımlar */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">1. Tanımlar</h2>
            </div>
            <div className="space-y-3 text-gray-600 pl-4 border-l-2 border-indigo-100">
              <p><strong>Platform:</strong> Disiplinli web uygulaması ve ilgili tüm hizmetler.</p>
              <p><strong>Koç:</strong> Öğrencilere YKS hazırlık sürecinde rehberlik eden eğitimci kullanıcılar.</p>
              <p><strong>Öğrenci:</strong> YKS'ye hazırlanan ve Platform üzerinden koçluk hizmeti alan kullanıcılar.</p>
              <p><strong>Veli:</strong> Öğrencinin durumunu takip eden ebeveyn kullanıcılar.</p>
            </div>
          </section>

          {/* 2. Hizmet Kapsamı */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="text-purple-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">2. Hizmet Kapsamı</h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>Disiplinli aşağıdaki hizmetleri sunmaktadır:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Koç-öğrenci eşleştirme ve iletişim platformu</li>
                <li>Deneme sınavı sonuçları takibi ve analizi</li>
                <li>Haftalık çalışma programı oluşturma</li>
                <li>Ödev atama ve takip sistemi</li>
                <li>Veli bilgilendirme paneli</li>
                <li>Sıralama tahmini ve hedef belirleme</li>
              </ul>
            </div>
          </section>

          {/* 3. Kullanıcı Yükümlülükleri */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Shield className="text-amber-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">3. Kullanıcı Yükümlülükleri</h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>Kullanıcılar aşağıdaki kurallara uymayı kabul eder:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Doğru ve güncel bilgiler sağlamak</li>
                <li>Hesap bilgilerini gizli tutmak ve üçüncü kişilerle paylaşmamak</li>
                <li>Platformu yalnızca yasal amaçlarla kullanmak</li>
                <li>Diğer kullanıcılara saygılı davranmak</li>
                <li>Telif hakkı veya fikri mülkiyet haklarını ihlal etmemek</li>
                <li>Platformun güvenliğini tehlikeye atacak eylemlerden kaçınmak</li>
              </ul>
            </div>
          </section>

          {/* 4. Gizlilik ve Kişisel Veriler (KVKK) */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Lock className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">4. Gizlilik ve Kişisel Veriler (KVKK)</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin
                işlenmesine ilişkin aşağıdaki hususları bilgilerinize sunarız:
              </p>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">4.1 Toplanan Veriler</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Ad, soyad, e-posta adresi</li>
                  <li>Deneme sınavı sonuçları ve akademik veriler</li>
                  <li>Çalışma programı ve ödev bilgileri</li>
                  <li>Platform içi mesajlaşma içerikleri</li>
                  <li>Giriş ve kullanım kayıtları</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">4.2 Verilerin İşlenme Amaçları</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Koçluk hizmetinin sağlanması</li>
                  <li>Öğrenci performansının analizi ve raporlanması</li>
                  <li>Veli bilgilendirmesi</li>
                  <li>Platform güvenliğinin sağlanması</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">4.3 Veri Güvenliği</h3>
                <p className="text-sm">
                  Kişisel verileriniz, endüstri standardı güvenlik önlemleri (SSL şifreleme,
                  güvenli sunucular, erişim kontrolü) ile korunmaktadır. Verileriniz üçüncü
                  taraflarla paylaşılmaz, satılmaz veya kiralanmaz.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">4.4 Kullanıcı Hakları</h3>
                <p className="text-sm mb-2">KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                  <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
                  <li>İşlemenin kısıtlanmasını talep etme</li>
                  <li>Verilerin aktarılmasını isteme</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Sorumluluk Reddi */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">5. Sorumluluk Reddi</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Disiplinli, sunulan hizmetlerin kesintisiz veya hatasız olacağını garanti etmez.
                Platform üzerinden sağlanan sıralama tahminleri ve analizler yalnızca bilgilendirme
                amaçlıdır ve kesin sonuç garantisi içermez.
              </p>
              <p>
                Kullanıcıların Platform üzerindeki etkileşimlerinden doğan sorunlardan
                Disiplinli sorumlu tutulamaz.
              </p>
            </div>
          </section>

          {/* 6. Fikri Mülkiyet */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">6. Fikri Mülkiyet</h2>
            <p className="text-gray-600">
              Platform üzerindeki tüm içerik, tasarım, logo, yazılım ve diğer materyaller
              Disiplinli'in fikri mülkiyetindedir. İzinsiz kopyalama, dağıtma veya değiştirme yasaktır.
            </p>
          </section>

          {/* 7. Sözleşme Değişiklikleri */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">7. Sözleşme Değişiklikleri</h2>
            <p className="text-gray-600">
              Disiplinli, bu sözleşmeyi önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar.
              Değişiklikler Platform üzerinden yayınlandığı anda yürürlüğe girer. Kullanıcıların
              sözleşmeyi düzenli olarak kontrol etmeleri önerilir.
            </p>
          </section>

          {/* 8. İletişim */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">8. İletişim</h2>
            <p className="text-gray-600">
              Bu sözleşme veya kişisel verilerinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="mt-3 bg-indigo-50 rounded-xl p-4">
              <p className="text-indigo-700">
                <strong>E-posta:</strong> destek@disiplinli.com
              </p>
            </div>
          </section>

          {/* Kabul */}
          <section className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-center">
              Platformu kullanarak bu Kullanıcı Sözleşmesi'ni ve Gizlilik Politikası'nı
              okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
            </p>
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700
                  transition-all shadow-lg shadow-indigo-200"
              >
                <ArrowLeft size={18} />
                Kayıt sayfasına dön
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6">
          © 2026 Disiplinli - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}
