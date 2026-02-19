import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function MesafeliSatisSozlesmesi() {
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
              <h1 className="text-xl font-bold text-surface-900">Mesafeli Satış Sözleşmesi</h1>
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
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Taraflar</h2>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <p><strong>SATICI (Hizmet Sağlayıcı):</strong></p>
              <p>Ad Soyad: [AD SOYAD]</p>
              <p>Adres: [AÇIK ADRES]</p>
              <p>VKN: [VERGİ KİMLİK NUMARASI]</p>
              <p>E-posta: destek@disiplinli.com</p>
              <p>KEP: [KEP ADRESİ]</p>
              <p>Platform: disiplinli.com</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm mt-3">
              <p><strong>ALICI (Tüketici):</strong></p>
              <p>Üyelik esnasında beyan edilen ad-soyad, e-posta, telefon ve adres bilgileri geçerlidir.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Sözleşmenin Konusu</h2>
            <p>
              İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait disiplinli.com internet sitesinden elektronik ortamda satın aldığı
              dijital akademik koçluk hizmetinin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun
              ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. Hizmetin Temel Nitelikleri</h2>
            <p className="mb-3">Disiplinli platformu üzerinden sunulan dijital akademik koçluk hizmeti aşağıdaki içerikleri kapsamaktadır:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Dijital çalışma ve takip sistemi erişimi</li>
              <li>Haftalık kişisel çalışma planı oluşturma</li>
              <li>Konu kazanım takibi ve performans analizleri</li>
              <li>Birebir akademik koçluk görüşmeleri (pakete göre)</li>
              <li>Dijital eğitim içerikleri ve materyal desteği (pakete göre)</li>
              <li>Birebir canlı özel ders (Premium paketlerde)</li>
              <li>Veli bilgilendirme hizmeti (pakete göre)</li>
            </ul>
            <p className="mt-3 text-sm">
              Hizmetin kapsamı, ALICI'nın seçtiği paket türüne (Disiplinli, Disiplinli Plus, Disiplinli Premium) ve
              hedefe (Ortaokul, Lise, LGS, YKS) göre değişkenlik gösterir. Paket detayları satın alma sırasında ALICI'ya açıkça sunulur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. Hizmet Bedeli ve Ödeme</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Hizmet bedeli, seçilen paket ve hedefe göre belirlenir ve satın alma ekranında Türk Lirası cinsinden gösterilir.</li>
              <li>Tüm fiyatlar aylık abonelik bedelidir.</li>
              <li>Ödeme, havale/EFT veya online ödeme yöntemleriyle yapılır.</li>
              <li>Fiyatlara KDV dahildir (20/B kapsamında KDV istisnası uygulanmaktadır).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Hizmetin İfası ve Teslimatı</h2>
            <p>
              Satın alınan dijital hizmet, ödemenin onaylanmasını takiben derhal ALICI'nın erişimine açılır.
              Hizmet tamamen elektronik ortamda (internet üzerinden) sunulmakta olup fiziksel teslimat söz konusu değildir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. Cayma Hakkı</h2>
            <div className="bg-warm-50 border border-warm-200 rounded-xl p-4 space-y-3 text-sm">
              <p>
                6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, ALICI mesafeli sözleşmenin kurulduğu tarihten
                itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
                cayma hakkını kullanabilir.
              </p>
              <p>
                <strong>Cayma hakkının istisnası:</strong> Mesafeli Sözleşmeler Yönetmeliği'nin 15/ğ maddesi gereğince,
                elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayri maddi mallarda,
                hizmetin ifasına tüketicinin onayı ile başlanmışsa cayma hakkı kullanılamaz.
              </p>
              <p>
                ALICI, dijital hizmete erişim sağladığı ve hizmeti kullanmaya başladığı andan itibaren,
                hizmetin ifasına başlanmış sayılacağını ve bu durumda cayma hakkının kullanılamayacağını kabul ve beyan eder.
              </p>
              <p>
                <strong>Cayma hakkını kullanmak için:</strong> destek@disiplinli.com adresine veya [KEP ADRESİ] adresine
                yazılı bildirimde bulunulması yeterlidir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. Genel Hükümler</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>ALICI, hizmeti yalnızca kişisel kullanım amacıyla satın aldığını kabul eder.</li>
              <li>SATICI, hizmet kapsamında değişiklik yapma hakkını saklı tutar. Esaslı değişiklikler ALICI'ya bildirilir.</li>
              <li>ALICI'nın platform kurallarına aykırı davranması halinde hesabı askıya alınabilir veya sözleşme feshedilebilir.</li>
              <li>Platform üzerindeki tüm içerik SATICI'nın fikri mülkiyetindedir. İzinsiz kopyalama ve dağıtma yasaktır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">8. Uyuşmazlık Çözümü</h2>
            <p>
              İşbu sözleşmeden doğan uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
              Başvurularda parasal sınırlar, her yıl Ticaret Bakanlığı tarafından ilan edilen değerlere göre belirlenir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">9. Yürürlük</h2>
            <p>
              ALICI, işbu sözleşmeyi ve ön bilgilendirme formunu elektronik ortamda okuyup kabul ettiği tarihte sözleşme kurulmuş sayılır.
              Sözleşme, hizmet süresi boyunca veya taraflardan birinin fesih bildirimi yapmasına kadar yürürlükte kalır.
            </p>
          </section>

          <section className="pt-4 border-t border-surface-200 text-center">
            <p className="text-sm text-surface-500">
              Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
              kapsamında düzenlenmiştir.
            </p>
          </section>
        </div>

        <p className="text-center text-surface-400 text-sm mt-6">© 2026 Disiplinli - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}
