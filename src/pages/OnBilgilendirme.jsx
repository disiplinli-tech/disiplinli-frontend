import { Link } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";

export default function OnBilgilendirme() {
  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-surface-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Info className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">Ön Bilgilendirme Formu</h1>
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
            <p className="text-sm text-surface-500 italic mb-4">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 48. maddesi ve Mesafeli Sözleşmeler
              Yönetmeliği'nin 5. maddesi gereğince, sözleşme kurulmadan önce tüketiciye sunulan ön bilgilendirme formudur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Satıcı Bilgileri</h2>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <p><strong>Unvan/Ad Soyad:</strong> [AD SOYAD]</p>
              <p><strong>Adres:</strong> [AÇIK ADRES]</p>
              <p><strong>Telefon:</strong> [TELEFON]</p>
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p><strong>KEP:</strong> [KEP ADRESİ]</p>
              <p><strong>VKN:</strong> [VERGİ KİMLİK NUMARASI]</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Hizmetin Temel Nitelikleri</h2>
            <p className="mb-3">
              Disiplinli, internet üzerinden sunulan dijital akademik koçluk ve çalışma takip platformudur.
              Hizmet tamamen elektronik ortamda sunulmaktadır.
            </p>
            <p className="mb-3">Sunulan hizmetler pakete göre değişmekle birlikte genel olarak şunları kapsar:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Dijital çalışma ve takip sistemi</li>
              <li>Haftalık kişisel çalışma planı</li>
              <li>Konu kazanım takibi ve performans paneli</li>
              <li>Birebir akademik koçluk (Plus ve Premium paketler)</li>
              <li>Videolu koç görüşmeleri (Plus ve Premium paketler)</li>
              <li>Birebir canlı özel ders (Premium paket)</li>
              <li>Dijital eğitim içerikleri ve materyaller</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. Hizmet Bedeli</h2>
            <p className="mb-3">Hizmet bedelleri, seçilen hedef ve paket türüne göre aşağıdaki gibidir (aylık, TL):</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-50">
                    <th className="text-left p-3 font-semibold text-surface-700 border border-surface-200">Hedef</th>
                    <th className="text-center p-3 font-semibold text-surface-700 border border-surface-200">Disiplinli</th>
                    <th className="text-center p-3 font-semibold text-surface-700 border border-surface-200">Plus</th>
                    <th className="text-center p-3 font-semibold text-surface-700 border border-surface-200">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Ortaokul', '1.250₺', '2.500₺', '4.500₺'],
                    ['Lise', '1.500₺', '3.000₺', '5.000₺'],
                    ['LGS', '1.500₺', '3.000₺', '5.000₺'],
                    ['YKS', '1.750₺', '3.500₺', '6.000₺'],
                  ].map(([hedef, core, plus, pro]) => (
                    <tr key={hedef}>
                      <td className="p-3 font-medium text-surface-700 border border-surface-200">{hedef}</td>
                      <td className="p-3 text-center text-surface-600 border border-surface-200">{core}</td>
                      <td className="p-3 text-center text-surface-600 border border-surface-200">{plus}</td>
                      <td className="p-3 text-center text-surface-600 border border-surface-200">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-surface-500 mt-3">
              Fiyatlara KDV dahildir (GVK Geçici 20/B kapsamında KDV istisnası uygulanmaktadır).
              Ödeme havale/EFT veya online ödeme yöntemleriyle yapılmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. Hizmetin İfası</h2>
            <p>
              Satın alınan dijital hizmet, ödemenin onaylanmasını takiben derhal tüketicinin erişimine açılır.
              Hizmet tamamen internet üzerinden elektronik ortamda sunulur. Fiziksel teslimat bulunmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Cayma Hakkı</h2>
            <div className="bg-warm-50 border border-warm-200 rounded-xl p-4 space-y-3 text-sm">
              <p>
                Tüketici, hizmetin satın alındığı tarihten itibaren <strong>14 (on dört) gün</strong> içinde
                herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.
              </p>
              <p>
                <strong>Önemli istisna:</strong> Elektronik ortamda anında ifa edilen hizmetlerde ve tüketiciye
                anında teslim edilen gayri maddi mallarda, tüketicinin onayı ile ifaya başlandıktan sonra cayma hakkı kullanılamaz
                (Mesafeli Sözleşmeler Yönetmeliği md. 15/ğ).
              </p>
              <p>
                Dijital platforma erişim sağlanması ve hizmetin kullanılmaya başlanması halinde
                hizmetin ifasına başlanmış sayılır.
              </p>
              <p>
                Cayma hakkını kullanmak için <strong>destek@disiplinli.com</strong> adresine yazılı bildirimde bulunulması yeterlidir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. Şikayet ve İtiraz</h2>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <p>Hizmetle ilgili şikayet ve itirazlarınızı aşağıdaki kanallardan iletebilirsiniz:</p>
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p><strong>KEP:</strong> [KEP ADRESİ]</p>
              <p className="mt-2">
                Uyuşmazlık halinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri'ne başvurabilirsiniz.
                Başvurularda parasal sınırlar Ticaret Bakanlığı tarafından yıllık olarak belirlenir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. Kişisel Verilerin Korunması</h2>
            <p>
              Kişisel verilerinizin işlenmesine ilişkin detaylı bilgi için{' '}
              <Link to="/kvkk" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                KVKK Aydınlatma Metni
              </Link>
              'ni inceleyebilirsiniz.
            </p>
          </section>

          <section className="pt-4 border-t border-surface-200">
            <p className="text-sm text-surface-500 text-center">
              Bu ön bilgilendirme formu, Mesafeli Sözleşmeler Yönetmeliği'nin 5. maddesi kapsamında
              tüketicinin bilgilendirilmesi amacıyla hazırlanmıştır.
            </p>
          </section>
        </div>

        <p className="text-center text-surface-400 text-sm mt-6">© 2026 Disiplinli - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}
