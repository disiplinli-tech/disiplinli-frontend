import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function KVKK() {
  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-surface-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">KVKK Aydınlatma Metni</h1>
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
            <p className="text-sm text-surface-500 italic">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, veri sorumlusu sıfatıyla
              aşağıdaki aydınlatma metnini bilginize sunarız.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Veri Sorumlusu</h2>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <p><strong>Ad Soyad:</strong> [AD SOYAD]</p>
              <p><strong>Adres:</strong> [AÇIK ADRES]</p>
              <p><strong>VKN:</strong> [VERGİ KİMLİK NUMARASI]</p>
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p><strong>KEP:</strong> [KEP ADRESİ]</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Toplanan Kişisel Veriler</h2>
            <p className="mb-3">Platform üzerinden aşağıdaki kişisel veriler toplanmaktadır:</p>
            <div className="space-y-3">
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="font-semibold text-surface-800 mb-2 text-sm">Kimlik Bilgileri</h3>
                <p className="text-sm">Ad, soyad</p>
              </div>
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="font-semibold text-surface-800 mb-2 text-sm">İletişim Bilgileri</h3>
                <p className="text-sm">E-posta adresi, telefon numarası</p>
              </div>
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="font-semibold text-surface-800 mb-2 text-sm">Eğitim Bilgileri</h3>
                <p className="text-sm">Deneme sınavı sonuçları, akademik performans verileri, çalışma programı bilgileri, konu kazanım durumları, ödev bilgileri</p>
              </div>
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="font-semibold text-surface-800 mb-2 text-sm">Platform Kullanım Verileri</h3>
                <p className="text-sm">Giriş kayıtları, oturum bilgileri, platform içi mesajlaşma içerikleri</p>
              </div>
              <div className="bg-surface-50 rounded-xl p-4">
                <h3 className="font-semibold text-surface-800 mb-2 text-sm">Ödeme Bilgileri</h3>
                <p className="text-sm">Ödeme yöntemi, işlem kayıtları (kredi kartı bilgileri saklanmaz, ödeme altyapı sağlayıcısı tarafından işlenir)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Akademik koçluk ve eğitim hizmetinin sunulması</li>
              <li>Kullanıcı hesabının oluşturulması ve yönetilmesi</li>
              <li>Kişiselleştirilmiş çalışma planı oluşturulması</li>
              <li>Öğrenci performansının analizi ve raporlanması</li>
              <li>Veli bilgilendirme hizmetinin sağlanması</li>
              <li>Koç-öğrenci iletişiminin sağlanması</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
              <li>Platform güvenliğinin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin artırılması</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri</h2>
            <p className="mb-3">Kişisel verileriniz aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Sözleşmenin kurulması ve ifası için gerekli olması (KVKK md. 5/2-c)</li>
              <li>Hukuki yükümlülüğün yerine getirilmesi için zorunlu olması (KVKK md. 5/2-ç)</li>
              <li>Veri sorumlusunun meşru menfaati için zorunlu olması (KVKK md. 5/2-f)</li>
              <li>Açık rızanızın bulunması (KVKK md. 5/1)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Kişisel Verilerin Aktarılması</h2>
            <p className="mb-3">Kişisel verileriniz aşağıdaki durumlar dışında üçüncü kişilere aktarılmaz:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Yasal zorunluluklar kapsamında yetkili kamu kurum ve kuruluşlarına</li>
              <li>Ödeme işlemleri için ödeme hizmeti sağlayıcılarına (sadece ödeme için gerekli minimum veri)</li>
              <li>E-posta gönderimi için e-posta hizmeti sağlayıcılarına (sadece e-posta adresi)</li>
              <li>Sunucu ve altyapı hizmeti sağlayıcılarına (veri güvenliği sözleşmeleri kapsamında)</li>
            </ul>
            <p className="mt-3 text-sm">
              Kişisel verileriniz hiçbir koşulda ticari amaçla üçüncü kişilere satılmaz veya kiralanmaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. Veri Güvenliği</h2>
            <p>Kişisel verilerinizin güvenliği için aşağıdaki tedbirler uygulanmaktadır:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm mt-3">
              <li>SSL/TLS şifreleme ile veri iletimi</li>
              <li>Güvenli sunucu altyapısı</li>
              <li>Erişim kontrolü ve yetkilendirme mekanizmaları</li>
              <li>Şifrelerin hash algoritması ile saklanması</li>
              <li>Düzenli güvenlik güncellemeleri</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. Veri Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve yasal saklama yükümlülüklerinin
              öngördüğü süreler dahilinde saklanır. Hesap silindiğinde, yasal zorunluluklar dışındaki verileriniz
              makul süre içinde imha edilir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">8. İlgili Kişi Hakları (KVKK Madde 11)</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm mb-3">KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-green-800">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
                <li>Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">9. Başvuru Yöntemi</h2>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <p>Yukarıdaki haklarınızı kullanmak için aşağıdaki kanallardan başvurabilirsiniz:</p>
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p><strong>KEP:</strong> [KEP ADRESİ]</p>
              <p className="mt-2">
                Başvurunuzda kimliğinizi tespit edici bilgiler ile talebinizin açık ve anlaşılır şekilde belirtilmesi gerekmektedir.
                Başvurular en geç <strong>30 gün</strong> içinde ücretsiz olarak yanıtlanacaktır.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">10. Çocuklara İlişkin Kişisel Veriler</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p>
                Platformumuz 18 yaş altı kullanıcılara da hizmet vermektedir. 18 yaşından küçük kullanıcıların
                kayıt işlemleri velilerinin bilgisi ve onayı dahilinde gerçekleştirilir. Çocuklara ait kişisel veriler,
                yalnızca eğitim hizmetinin sunulması amacıyla işlenmekte ve özel hassasiyetle korunmaktadır.
              </p>
            </div>
          </section>

          <section className="pt-4 border-t border-surface-200 text-center">
            <p className="text-sm text-surface-500">
              Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi ve
              Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında hazırlanmıştır.
            </p>
          </section>
        </div>

        <p className="text-center text-surface-400 text-sm mt-6">© 2026 Disiplinli - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}
