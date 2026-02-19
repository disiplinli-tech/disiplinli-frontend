import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function IptalIade() {
  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-surface-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <RotateCcw className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">İptal ve İade Koşulları</h1>
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
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Genel Bilgi</h2>
            <p>
              Disiplinli platformu üzerinden satın alınan dijital akademik koçluk hizmetlerine ilişkin iptal ve iade koşulları,
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği çerçevesinde belirlenmiştir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Cayma Hakkı (14 Gün)</h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 text-sm">
              <p>
                Tüketici, mesafeli sözleşmenin kurulduğu tarihten itibaren <strong>14 (on dört) gün</strong> içinde
                herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
              </p>
              <p>
                Cayma hakkını kullanmak için <strong>destek@disiplinli.com</strong> adresine ad-soyad, e-posta ve
                cayma talebi ile birlikte yazılı bildirim gönderilmesi yeterlidir.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. Cayma Hakkının Kullanılamayacağı Durumlar</h2>
            <div className="bg-warm-50 border border-warm-200 rounded-xl p-4 space-y-3 text-sm">
              <p>
                Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi gereğince, aşağıdaki durumlarda cayma hakkı kullanılamaz:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong>Elektronik ortamda anında ifa edilen hizmetler:</strong> Dijital platforma erişim sağlanması
                  ve hizmetin kullanılmaya başlanması halinde, tüketicinin onayı ile hizmetin ifasına başlanmış sayılır
                  ve cayma hakkı ortadan kalkar (md. 15/ğ).
                </li>
                <li>
                  <strong>Gayri maddi malların teslimi:</strong> Dijital eğitim içeriklerinin erişime açılması ile
                  birlikte cayma hakkı kullanılamaz.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. İade Koşulları</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Hizmet kullanılmadan yapılan cayma:</strong> 14 gün içinde cayma hakkı kullanılır ve
                dijital hizmete hiç erişim sağlanmamışsa, ödeme tutarı <strong>14 iş günü</strong> içinde
                iade edilir.
              </li>
              <li>
                <strong>Hizmet kullanıldıktan sonra:</strong> Dijital hizmete erişim sağlanmış ve kullanılmaya başlanmışsa
                iade yapılmaz (Yönetmelik md. 15/ğ gereği).
              </li>
              <li>
                <strong>Teknik sorunlar:</strong> Platform kaynaklı teknik sorunlar nedeniyle hizmet alınamadıysa,
                sorunun belgelenmesi kaydıyla iade veya telafi hizmeti sağlanır.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Abonelik İptali</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Aylık abonelikler, bir sonraki dönem başlamadan önce iptal edilebilir.</li>
              <li>İptal talebi, cari dönem sonuna kadar geçerli olur; mevcut dönemin hizmet bedeli iade edilmez.</li>
              <li>İptal talebinden sonra dönem sonuna kadar hizmet erişimi devam eder.</li>
              <li>İptal talebi destek@disiplinli.com adresine e-posta ile yapılır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. İade Yöntemi</h2>
            <p>
              İade edilmesi gereken tutarlar, ödemenin yapıldığı yöntemle (havale/EFT ise aynı banka hesabına,
              kredi kartı ise aynı karta) iade edilir. İade süresi en fazla <strong>14 iş günüdür</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. İletişim</h2>
            <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
              <p>İptal ve iade talepleriniz için:</p>
              <p><strong>E-posta:</strong> destek@disiplinli.com</p>
              <p><strong>KEP:</strong> [KEP ADRESİ]</p>
              <p className="mt-2">
                Uyuşmazlık halinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
              </p>
            </div>
          </section>

          <section className="pt-4 border-t border-surface-200 text-center">
            <p className="text-sm text-surface-500">
              Bu iptal ve iade politikası, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
              Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.
            </p>
          </section>
        </div>

        <p className="text-center text-surface-400 text-sm mt-6">© 2026 Disiplinli - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}
