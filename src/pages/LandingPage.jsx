import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import {
  BookOpen, ChevronRight, ArrowRight, Calendar, BarChart3,
  ClipboardList, Users, MessageCircle, CheckCircle2, Layers,
  Star, TrendingUp, Clock, Compass, Menu, X, Play,
  Phone, GraduationCap, Target, Shield, Zap, Heart, Send
} from 'lucide-react';

// ─── Scroll fade-in hook ────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Section({ children, className = '', id }) {
  const ref = useFadeIn();
  return (
    <section id={id} ref={ref} className={`fade-section ${className}`}>
      {children}
    </section>
  );
}

// ─── Main Landing Page ──────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // ─── Hedefini Seç State ──────
  const [selectedGoal, setSelectedGoal] = useState('');

  // ─── Sizi Arayalım Form State ──────
  const [callForm, setCallForm] = useState({ name: '', phone: '', role: '' });
  const [callFormStatus, setCallFormStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-surface-900 overflow-x-hidden font-sans">

      {/* ───────── Ambient Background Blobs ───────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] blob-purple rounded-full opacity-60" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] blob-orange rounded-full opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] blob-purple rounded-full opacity-40" />
      </div>

      {/* ───────── Navbar ───────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-surface-100'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-display font-bold text-surface-900">Disiplinli.com</span>
            </div>

            {/* Desktop nav — centered with slight left offset */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-[55%]">
              {[
                ['Nasıl Çalışır', 'how-it-works'],
                ['Planlar', 'goal-selection'],
                ['Referanslar', 'testimonials'],
                ['İletişim', 'contact']
              ].map(([label, id]) => (
                <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-surface-500 hover:text-surface-900 transition-colors text-sm font-medium cursor-pointer">
                  {label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => document.getElementById('goal-selection')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold
                  hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                Paket Seç
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-surface-700 p-2">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-surface-100 px-6 py-6 space-y-4 shadow-lg">
            {[
              ['Nasıl Çalışır', 'how-it-works'],
              ['Planlar', 'goal-selection'],
              ['Referanslar', 'testimonials'],
              ['İletişim', 'contact']
            ].map(([label, id]) => (
              <button key={id} onClick={() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false); }}
                className="block text-surface-700 hover:text-surface-900 text-base font-medium cursor-pointer">
                {label}
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-surface-100">
              <button onClick={() => navigate('/login')} className="py-3 text-surface-600 text-sm font-medium">
                Giriş Yap
              </button>
              <button onClick={() => { document.getElementById('goal-selection')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false); }}
                className="py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold text-center block w-full cursor-pointer rounded-xl">
                Paket Seç
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════
           HERO
         ═══════════════════════════════════════════════════ */}
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full animate-fade-up">
                <GraduationCap size={16} className="text-primary-500" />
                <span className="text-sm text-primary-700 font-medium">Sınav, okul veya bireysel hedefler için sürdürülebilir çalışma sistemi.</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] animate-fade-up-d1">
                <span className="text-surface-900">Sana Özel </span>
                <span className="bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">
                  Çalışma Sistemi
                </span>
              </h1>

              <p className="text-lg text-surface-500 max-w-lg leading-relaxed animate-fade-up-d2">
                Disiplinli, motivasyona değil sisteme dayanan bir çalışma yapısı sunar. Kişiselleştirilmiş plan, düzenli takip ve ölçülebilir ilerleme ile hedefine ulaş — gerektiğinde özel ders desteğiyle eksiklerini kapat.
              </p>

              <div className="flex flex-wrap items-center gap-4 animate-fade-up-d3">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-7 py-3.5 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-2xl font-semibold text-base
                    shadow-cta hover:shadow-lg hover:shadow-warm-500/30 transition-all hover:scale-[1.03] active:scale-[0.98]
                    flex items-center gap-2"
                >
                  <Play size={18} className="fill-white" />
                  Ücretsiz Tanıtım Görüşmesi
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3.5 bg-surface-50 border border-surface-200 text-surface-700 rounded-2xl font-semibold text-base
                    hover:bg-surface-100 transition-all flex items-center gap-2"
                >
                  <ChevronRight size={18} className="text-primary-500" />
                  Keşfet
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4 animate-fade-up-d3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['bg-primary-400', 'bg-warm-400', 'bg-emerald-400', 'bg-blue-400'].map((bg, i) => (
                      <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-white flex items-center justify-center`}>
                        <span className="text-[10px] font-bold text-white">{['AK', 'EB', 'SY', 'MK'][i]}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-surface-500"><strong className="text-surface-700">5+</strong> Veli Yorumu</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-sm text-surface-500 ml-1"><strong className="text-surface-700">5</strong>/5</span>
                </div>
              </div>
            </div>

            {/* Right — Visual Cards */}
            <div className="relative h-[420px] hidden lg:block">
              {/* Main Card */}
              <div className="absolute top-4 left-8 right-8 bg-white rounded-3xl shadow-card p-6 border border-surface-100 animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <Calendar size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-800">Haftalık Plan</p>
                    <p className="text-sm text-surface-400">Bu hafta 5/6 görev tamamlandı</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">%83</span>
                  </div>
                </div>
                <div className="w-full bg-surface-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-warm-500 h-2 rounded-full" style={{ width: '83%' }} />
                </div>
              </div>

              {/* Net Artışı Card */}
              <div className="absolute top-48 right-4 bg-white rounded-2xl shadow-card p-5 border border-surface-100 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Son 4 Hafta</p>
                    <p className="text-xl font-bold text-emerald-600">+18.5 Net</p>
                  </div>
                </div>
              </div>

              {/* Koç Mesajı Card */}
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-card p-4 border border-surface-100 max-w-[260px] animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">AK</div>
                  <div>
                    <p className="text-sm font-medium text-surface-800">Akademik Koç</p>
                    <p className="text-xs text-surface-400">2 dk önce</p>
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full ml-auto" />
                </div>
                <p className="text-sm text-surface-600 bg-primary-50 px-3 py-2 rounded-xl">
                  Matematik netlerinde harika ilerleme! 👏🔥
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
           PROBLEM → SOLUTION BRIDGE
         ═══════════════════════════════════════════════════ */}
      <Section className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-surface-900">
              Çalışıyorsun ama <span className="bg-gradient-to-r from-warm-500 to-warm-600 gradient-text">ilerleme yok mu?</span>
            </h2>
            <p className="text-surface-500 text-lg">Sorun sende değil, sisteminde. Doğru rehberlik ile her şey değişir.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Nereden başlayacağını bilmiyorsun',
                desc: 'Hangi konuya ne kadar zaman ayıracağın belirsiz. Plan yok, yön yok.'
              },
              {
                title: 'Motivasyon gelip gidiyor',
                desc: 'İyi başlıyorsun ama birkaç gün sonra her şey bozuluyor.'
              },
              {
                title: 'Yalnız çalışmak zor',
                desc: 'Eksiklerini fark etmek, düzeltmek ve takibini yapmak kendi başına çok zor.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-surface-100 shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-surface-800">{item.title}</h3>
                <p className="text-surface-500 leading-relaxed text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 rounded-2xl">
              <Heart size={18} className="text-primary-500" />
              <p className="text-primary-700 font-medium">
                Motivasyon seni başlatır. <strong>Sistem</strong> seni sürdürür.
              </p>
            </div>
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           HOW IT WORKS
         ═══════════════════════════════════════════════════ */}
      <Section id="how-it-works" className="py-12 md:py-16 px-6 bg-surface-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-5">
              <Layers size={16} className="text-primary-500" />
              <span className="text-sm text-primary-700 font-medium">Nasıl Çalışır?</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900">
              4 adımda hedefine <span className="bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">ulaş</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                icon: ClipboardList,
                title: 'Ücretsiz Ön Görüşme',
                desc: 'Mevcut durumunu değerlendiriyoruz. Güçlü ve zayıf yönlerini belirleyip sana özel bir harita çıkarıyoruz.',
                gradient: 'from-primary-500 to-primary-600'
              },
              {
                step: '02',
                icon: Calendar,
                title: 'Kişisel Çalışma Planı',
                desc: 'Koçun sana özel haftalık program oluşturuyor. Hangi gün, hangi ders, kaç saat — her şey planlanmış.',
                gradient: 'from-primary-500 to-warm-500'
              },
              {
                step: '03',
                icon: BarChart3,
                title: 'Haftalık Takip & Koçluk',
                desc: 'Koçun ilerlemeyi takip ediyor, performans analizi yapıyor ve seni doğru yönlendiriyor.',
                gradient: 'from-warm-500 to-warm-600'
              },
              {
                step: '04',
                icon: BookOpen,
                title: 'Özel Ders',
                desc: 'Gerekirse, eksik olduğun konulara özel birebir ders ile açıklarını kapat.',
                gradient: 'from-warm-600 to-red-500'
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-card hover:shadow-card-hover transition-all duration-300 text-center
                  group-hover:-translate-y-1 h-full flex flex-col">
                  <div className="text-4xl font-bold text-surface-100 mb-3 font-display">{item.step}</div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4
                    shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 font-display text-surface-800">{item.title}</h3>
                  <p className="text-surface-500 leading-relaxed text-sm flex-1">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3.5 transform -translate-y-1/2 z-10">
                    <ChevronRight size={18} className="text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           SEGMENTATION — Hedefini Seç
         ═══════════════════════════════════════════════════ */}
      <Section id="goal-selection" className="pt-24 md:pt-32 pb-12 md:pb-16 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-3">
              Hedefini <span className="bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">seç</span>
            </h2>
            <p className="text-surface-500 text-lg">Paketlerimiz seçtiğin hedefe göre şekillenir.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { key: 'ortaokul', label: 'Ortaokul' },
              { key: 'lise', label: 'Lise' },
              { key: 'lgs', label: 'LGS' },
              { key: 'yks', label: 'YKS' }
            ].map((goal) => (
              <button
                key={goal.key}
                onClick={() => setSelectedGoal(goal.key === selectedGoal ? '' : goal.key)}
                className={`group relative py-5 px-6 rounded-2xl border-2 transition-all duration-300 text-center cursor-pointer
                  ${selectedGoal === goal.key
                    ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10 scale-[1.03]'
                    : 'border-surface-100 bg-white hover:border-primary-200 hover:shadow-card'
                  }`}
              >
                <p className={`text-lg font-bold transition-colors ${
                  selectedGoal === goal.key ? 'text-primary-700' : 'text-surface-700'
                }`}>{goal.label}</p>
              </button>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           PRICING
         ═══════════════════════════════════════════════════ */}
      {selectedGoal && (() => {
        const goalLabel = { ortaokul: 'Ortaokul', lise: 'Lise', lgs: 'LGS', yks: 'YKS' }[selectedGoal];

        const planData = {
          ortaokul: {
            core: {
              name: `Disiplinli ${goalLabel}`,
              subtitle: 'Kendi kendine ilerlemek isteyen öğrenciler için temel sistem.',
              aim: 'Öğrencinin düzenli çalışma alışkanlığı kazanması.',
              price: '1.250',
              features: [
                'Disiplinli çalışma ve takip sistemi erişimi',
                'Haftalık kişisel çalışma planı',
                'Haftalık akademik görevler',
                'Konu kazanım checklist takibi',
                'Performans paneli ve ilerleme grafikleri',
                'Tüm dersler haftalık analiz föyü 32\'li set'
              ]
            },
            plus: {
              name: `Disiplinli Plus ${goalLabel}`,
              subtitle: 'Birebir koçluk ile sistemi en verimli şekilde kullan.',
              aim: 'Düzenli takip ile disiplin ve not artışı.',
              price: '2.500',
              features: [
                'Disiplinli Ortaokul planındaki her şey',
                'Birebir akademik koç',
                'Haftalık 2 kez videolu koç görüşmesi',
                'Koç ile mesajlaşma desteği',
                'Kişiselleştirilmiş program',
                'Haftalık gelişim analizi',
                'Aylık veli bilgilendirme'
              ]
            },
            pro: {
              name: `Disiplinli Premium ${goalLabel}`,
              subtitle: 'Koçluk ve özel ders ile maksimum akademik destek.',
              aim: 'Hem alışkanlık hem de akademik başarıyı hızlandırmak.',
              price: '4.500',
              features: [
                'Plus planındaki her şey',
                'Aylık 4 saat birebir canlı özel ders hakkı',
                'Eksik konu kapatma çalışmaları',
                'Derse özel materyal desteği',
                'Öncelikli destek',
                'Detaylı veli raporu'
              ]
            }
          },
          lise: {
            core: {
              name: 'Disiplinli Lise',
              subtitle: 'Kendi kendine ilerlemek isteyen öğrenciler için temel sistem.',
              aim: 'Öğrencinin düzenli çalışma alışkanlığı kazanması.',
              price: '1.500',
              features: [
                'Disiplinli çalışma ve takip sistemi erişimi',
                'Haftalık kişisel çalışma planı',
                'Haftalık akademik görevler',
                'Konu kazanım checklist takibi',
                'Performans paneli ve ilerleme grafikleri',
                'Tüm dersler haftalık analiz föyü 32\'li set'
              ]
            },
            plus: {
              name: 'Disiplinli Plus Lise',
              subtitle: 'Birebir koçluk ile sistemi en verimli şekilde kullan.',
              aim: 'Düzenli takip ile disiplin ve not artışı.',
              price: '3.000',
              features: [
                'Disiplinli Lise planındaki her şey',
                'Birebir akademik koç',
                'Haftalık 2 kez videolu koç görüşmesi',
                'Koç ile mesajlaşma desteği',
                'Kişiselleştirilmiş program',
                'Haftalık gelişim analizi',
                'Aylık veli bilgilendirme'
              ]
            },
            pro: {
              name: 'Disiplinli Premium Lise',
              subtitle: 'Koçluk ve özel ders ile maksimum akademik destek.',
              aim: 'Hem alışkanlık hem de akademik başarıyı hızlandırmak.',
              price: '5.000',
              features: [
                'Plus planındaki her şey',
                'Aylık 4 saat birebir canlı özel ders hakkı',
                'Eksik konu kapatma çalışmaları',
                'Derse özel materyal desteği',
                'Öncelikli destek',
                'Detaylı veli raporu'
              ]
            }
          },
          lgs: {
            core: {
              name: 'Disiplinli LGS',
              subtitle: 'Kendi kendine ilerlemek isteyen öğrenciler için temel sistem.',
              aim: 'Öğrencinin düzenli çalışma alışkanlığı kazanması.',
              price: null,
              features: [
                'Yakında detaylar paylaşılacak'
              ]
            },
            plus: {
              name: 'Disiplinli Plus LGS',
              subtitle: 'Birebir koçluk ile sistemi en verimli şekilde kullan.',
              aim: 'Düzenli takip ile disiplin ve not artışı.',
              price: null,
              features: [
                'Yakında detaylar paylaşılacak'
              ]
            },
            pro: {
              name: 'Disiplinli Premium LGS',
              subtitle: 'Koçluk ve özel ders ile maksimum akademik destek.',
              aim: 'Hem alışkanlık hem de akademik başarıyı hızlandırmak.',
              price: null,
              features: [
                'Yakında detaylar paylaşılacak'
              ]
            }
          },
          yks: {
            core: {
              name: 'Disiplinli YKS',
              subtitle: 'Kendi kendine ilerlemek isteyen öğrenciler için temel sistem.',
              aim: 'Öğrencinin düzenli çalışma alışkanlığı kazanması.',
              price: null,
              features: [
                'Yakında detaylar paylaşılacak'
              ]
            },
            plus: {
              name: 'Disiplinli Plus YKS',
              subtitle: 'Birebir koçluk ile sistemi en verimli şekilde kullan.',
              aim: 'Düzenli takip ile disiplin ve not artışı.',
              price: null,
              features: [
                'Yakında detaylar paylaşılacak'
              ]
            },
            pro: {
              name: 'Disiplinli Premium YKS',
              subtitle: 'Koçluk ve özel ders ile maksimum akademik destek.',
              aim: 'Hem alışkanlık hem de akademik başarıyı hızlandırmak.',
              price: null,
              features: [
                'Yakında detaylar paylaşılacak'
              ]
            }
          }
        };

        const plans = planData[selectedGoal];

        return (
      <Section id="pricing" className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-3">
              İhtiyacına uygun <span className="bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">planı seç</span>
            </h2>
            <p className="text-surface-500 text-lg">Her plan aynı sistemi kullanır. Fark, koçluk ve ders desteğinin yoğunluğunda.</p>
          </div>

          <div key={selectedGoal} className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto pt-4 pricing-grid-animated">
            {/* ── Core Plan ── */}
            <div className="pricing-card bg-white rounded-3xl p-7 border border-surface-100 shadow-card flex flex-col">
              <div className="mb-5">
                <h3 className="text-xl font-display font-bold text-surface-900 mb-1">{plans.core.name}</h3>
                <p className="text-sm text-surface-400">{plans.core.subtitle}</p>
              </div>
              {plans.core.price && (
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold text-surface-900">{plans.core.price}₺</span>
                    <span className="text-sm text-surface-400">/ay</span>
                  </div>
                </div>
              )}
              <ul className="space-y-3 mb-5 flex-1">
                {plans.core.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-surface-600">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {plans.core.aim && (
                <p className="text-xs text-surface-400 italic mb-5 px-1">{plans.core.aim}</p>
              )}
              <button
                onClick={() => plans.core.price
                  ? navigate('/register', { state: { goal: selectedGoal, plan: 'core' } })
                  : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="w-full py-3.5 bg-surface-800 text-white rounded-xl text-sm font-semibold
                  hover:bg-surface-900 transition-all hover:shadow-lg text-center cursor-pointer"
              >
                Satın Al
              </button>
            </div>

            {/* ── Plus ── */}
            <div className="pricing-card bg-white rounded-3xl p-7 border border-surface-100 shadow-card flex flex-col">
              <div className="mb-5">
                <h3 className="text-xl font-display font-bold text-surface-900 mb-1">{plans.plus.name}</h3>
                <p className="text-sm text-surface-400">{plans.plus.subtitle}</p>
              </div>
              {plans.plus.price && (
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold text-surface-900">{plans.plus.price}₺</span>
                    <span className="text-sm text-surface-400">/ay</span>
                  </div>
                </div>
              )}
              <ul className="space-y-3 mb-5 flex-1">
                {plans.plus.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-surface-600">
                    <CheckCircle2 size={18} className="text-primary-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {plans.plus.aim && (
                <p className="text-xs text-surface-400 italic mb-5 px-1">{plans.plus.aim}</p>
              )}
              <button
                onClick={() => plans.plus.price
                  ? navigate('/register', { state: { goal: selectedGoal, plan: 'plus' } })
                  : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="w-full py-3.5 bg-surface-800 text-white rounded-xl text-sm font-semibold
                  hover:bg-surface-900 transition-all hover:shadow-lg text-center cursor-pointer"
              >
                Satın Al
              </button>
            </div>

            {/* ── Pro / Premium (Featured + Glow) ── */}
            <div className="pricing-card pricing-featured relative bg-white rounded-3xl flex flex-col"
              style={{ padding: 0 }}
            >
              {/* Animated glow border wrapper */}
              <div className="absolute -inset-[2px] rounded-3xl z-0 overflow-hidden">
                <div
                  className="absolute inset-[-50%] animate-glow-spin"
                  style={{
                    background: 'conic-gradient(from 0deg, #f97316, #fbbf24, #fb923c, #ea580c, #f59e0b, #f97316)',
                  }}
                />
              </div>
              {/* White inner background */}
              <div className="absolute inset-[2px] rounded-[22px] bg-white z-[1]" />

              {/* En Popüler badge — dışarıda, kartın üstünde */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[3] px-5 py-1.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-lg shadow-primary-300/40">
                <span className="text-xs font-bold text-white whitespace-nowrap">En Popüler</span>
              </div>

              {/* Content on top */}
              <div className="relative z-[2] flex flex-col flex-1 p-7 pt-8">
                <div className="mb-5">
                  <h3 className="text-xl font-display font-bold text-surface-900 mb-1">{plans.pro.name}</h3>
                  <p className="text-sm text-surface-400">{plans.pro.subtitle}</p>
                </div>
                {plans.pro.price && (
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-bold text-primary-600">{plans.pro.price}₺</span>
                      <span className="text-sm text-surface-400">/ay</span>
                    </div>
                  </div>
                )}
                <ul className="space-y-3 mb-5 flex-1">
                  {plans.pro.features.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-surface-600">
                      <CheckCircle2 size={18} className="text-primary-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {plans.pro.aim && (
                  <p className="text-xs text-surface-400 italic mb-5 px-1">{plans.pro.aim}</p>
                )}
                <button
                  onClick={() => plans.pro.price
                    ? navigate('/register', { state: { goal: selectedGoal, plan: 'pro' } })
                    : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-semibold
                    hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-center cursor-pointer"
                >
                  Satın Al
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
      );})()}


      {/* ═══════════════════════════════════════════════════
           TESTIMONIALS
         ═══════════════════════════════════════════════════ */}
      <Section id="testimonials" className="py-12 md:py-16 px-6 bg-surface-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-5">
              <Star size={16} className="text-amber-500" />
              <span className="text-sm text-amber-700 font-medium">Kullanıcı Deneyimleri</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900">
              Disiplinli kullananlar <span className="bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">ne diyor?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: 'Daha önce hiç bu kadar düzenli çalışamamıştım. Koçum sayesinde her gün ne yapacağımı biliyorum ve netlerde ciddi artış var.',
                name: 'Melisa H.',
                detail: 'TYT Öğrencisi • +32 Net Artış',
                avatar: 'MH',
                color: 'bg-primary-500'
              },
              {
                quote: 'Haftalık görüşmeler çok faydalı. Eksiklerimi görüyorum ve hemen aksiyon alıyorum. Artık motive olmak için dışarıdan bir şey aramıyorum.',
                name: 'Mehmet A. Ç.',
                detail: 'AYT Sayısal',
                avatar: 'MÇ',
                color: 'bg-warm-500'
              },
              {
                quote: 'Çocuğumun ne yaptığını değil, nasıl ilerlediğini görebiliyorum. İlk kez gerçekten içim rahat.',
                name: 'Ayşe Ç.',
                detail: 'Veli',
                avatar: 'AÇ',
                color: 'bg-emerald-500'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-surface-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-surface-600 leading-relaxed mb-6 text-[15px] flex-1">"{item.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{item.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{item.name}</p>
                    <p className="text-xs text-surface-400">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: '10+', label: 'Aktif Öğrenci' },
              { value: '%100', label: 'Memnuniyet' },
              { value: '500+', label: 'Tamamlanan Görev' }
            ].map((stat, i) => (
              <div key={i} className="text-center bg-white rounded-2xl py-5 border border-surface-100 shadow-card">
                <p className="text-2xl md:text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           SIZI ARAYALIM — CONTACT FORM
         ═══════════════════════════════════════════════════ */}
      <Section id="contact" className="py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left — Motivasyon Yazısı */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warm-50 border border-warm-100 rounded-full">
                <Phone size={16} className="text-warm-500" />
                <span className="text-sm text-warm-700 font-medium">Ücretsiz Görüşme</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-surface-900 leading-tight">
                Hedefine ulaşmak için
                <br /><span className="bg-gradient-to-r from-primary-600 to-warm-500 gradient-text">ilk adımı bugün at.</span>
              </h2>
              <p className="text-surface-500 text-lg leading-relaxed max-w-md">
                Formu doldur, seni arayalım. Ücretsiz tanıtım görüşmesinde koçunu tanı ve sana özel planını al.
              </p>
              <div className="flex flex-col gap-4 pt-2">
                {[
                  { icon: CheckCircle2, text: 'Tamamen ücretsiz tanıtım görüşmesi' },
                  { icon: Shield, text: 'Bilgilerin gizli tutulur' },
                  { icon: Clock, text: '24 saat içinde geri dönüş' },
                  { icon: Heart, text: 'Zorunluluk yok, sadece tanışma' },
                  { icon: Compass, text: 'Sana özel yol haritası' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon size={20} className="text-primary-500 shrink-0" />
                    <span className="text-surface-600 text-[15px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form Kartı */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary-200/30 rounded-full blur-[60px]" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-warm-200/30 rounded-full blur-[50px]" />

              <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-surface-100 shadow-pricing">
                <div className="text-center mb-8">
                  <h3 className="font-display text-xl font-bold text-surface-900 mb-1">Sizi Arayalım</h3>
                  <p className="text-sm text-surface-400">Bilgilerini bırak, sana ulaşalım</p>
                </div>

                {callFormStatus === 'sent' ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-surface-900">Talebiniz Alındı!</h4>
                    <p className="text-surface-500 text-sm max-w-xs mx-auto">
                      En kısa sürede sizi arayacağız. Teşekkürler!
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!callForm.name || !callForm.phone || !callForm.role) return;
                      setCallFormStatus('sending');
                      try {
                        await API.post('/api/contact/', {
                          name: callForm.name,
                          phone: callForm.phone,
                          role: callForm.role,
                        });
                        setCallFormStatus('sent');
                      } catch {
                        setCallFormStatus('error');
                      }
                    }}
                    className="space-y-5"
                  >
                    {/* Ad Soyad */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">Ad Soyad</label>
                      <input
                        type="text"
                        placeholder="Adınız ve soyadınız"
                        value={callForm.name}
                        onChange={(e) => setCallForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm"
                      />
                    </div>

                    {/* Veliyim / Öğrenciyim Toggle */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">Ben bir...</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCallForm(prev => ({ ...prev, role: 'veli' }))}
                          className={`py-3.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                            callForm.role === 'veli'
                              ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                              : 'bg-surface-50 border-surface-200 text-surface-500 hover:border-surface-300'
                          }`}
                        >
                          <Users size={18} className="inline mr-2 -mt-0.5" />
                          Veliyim
                        </button>
                        <button
                          type="button"
                          onClick={() => setCallForm(prev => ({ ...prev, role: 'ogrenci' }))}
                          className={`py-3.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                            callForm.role === 'ogrenci'
                              ? 'bg-warm-50 border-warm-500 text-warm-700 shadow-sm'
                              : 'bg-surface-50 border-surface-200 text-surface-500 hover:border-surface-300'
                          }`}
                        >
                          <GraduationCap size={18} className="inline mr-2 -mt-0.5" />
                          Öğrenciyim
                        </button>
                      </div>
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">Telefon Numarası</label>
                      <input
                        type="tel"
                        placeholder="05XX XXX XX XX"
                        value={callForm.phone}
                        onChange={(e) => setCallForm(prev => ({ ...prev, phone: e.target.value }))}
                        required
                        className="w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder-surface-400
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={callFormStatus === 'sending' || !callForm.name || !callForm.phone || !callForm.role}
                      className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold text-base
                        hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                        flex items-center justify-center gap-2"
                    >
                      {callFormStatus === 'sending' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Gönder
                        </>
                      )}
                    </button>

                    {callFormStatus === 'error' && (
                      <p className="text-center text-sm text-red-500">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           FOOTER
         ═══════════════════════════════════════════════════ */}
      <footer className="bg-surface-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

              {/* ── Marka ── */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <span className="font-display font-bold text-xl text-white">Disiplinli.com</span>
                <p className="text-sm text-surface-400 leading-relaxed max-w-xs">
                  Öğrenciye çalışma disiplini ve sınavları kazandıran sistem.
                </p>
              </div>

              {/* ── Ürünler ── */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">Planlar</h4>
                <ul className="space-y-2.5">
                  {[
                    ['Core', '#pricing'],
                    ['Plus', '#pricing'],
                    ['Pro', '#pricing']
                  ].map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-surface-400 hover:text-white transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Sözleşme ve Koşullar ── */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">Sözleşme ve Koşullar</h4>
                <ul className="space-y-2.5">
                  {[
                    ['Kullanım Şartları', '/kullanici-sozlesmesi'],
                    ['Gizlilik Sözleşmesi', '#'],
                    ['İptal ve İade Koşulları', '#']
                  ].map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-surface-400 hover:text-white transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Disiplinli + Sosyal Medya ── */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">Disiplinli</h4>
                <ul className="space-y-2.5">
                  {[
                    ['Bize Ulaşın', '#contact'],
                    ['Nasıl Çalışır?', '#how-it-works']
                  ].map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-surface-400 hover:text-white transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold text-white text-sm pt-2">Bizi Takip Edin</h4>
                <div className="flex items-center gap-3">
                  {/* Instagram */}
                  <a href="https://www.instagram.com/disiplinlicom" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                    title="Instagram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400 group-hover:text-white">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a href="https://www.tiktok.com/@disiplinlicom" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors group"
                    title="TikTok"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-surface-400 group-hover:text-white">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.22 8.22 0 0 0 4.76 1.52V7.05a4.84 4.84 0 0 1-1-.36z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Alt çizgi ── */}
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-surface-400">
                destek@disiplinli.com
              </p>
              <p className="text-sm text-surface-500">
                Copyright © 2026 Disiplinli. Tüm hakları saklıdır.
              </p>
            </div>
        </div>
      </footer>


      {/* ═══════════════════════════════════════════════════
           FLOATING CALL CTA BUTTON
         ═══════════════════════════════════════════════════ */}
      <a
        href="#contact"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full
          flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40
          hover:scale-110 active:scale-95 transition-all"
        title="Sizi Arayalım"
      >
        <Phone size={24} className="text-white" />
      </a>
    </div>
  );
}
