import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Target, ChevronRight, ArrowRight,
  Calendar, BarChart3, ClipboardList, Users, MessageCircle,
  CheckCircle2, Layers, Sparkles, Star, TrendingUp,
  Clock, Compass, Menu, X
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Section wrapper with fade ──────────────────────────
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden font-sans">

      {/* ───────── Ambient Background ───────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Desktop orbs */}
        <div className="hidden md:block">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-brand-700/15 rounded-full blur-[160px] animate-pulse-soft" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-deep-600/12 rounded-full blur-[140px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '4s' }} />
        </div>
        {/* Mobile gradient */}
        <div className="md:hidden bg-gradient-to-b from-brand-950/40 via-transparent to-deep-950/30 absolute inset-0" />
      </div>

      {/* ───────── Navbar ───────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-navy-950/80 backdrop-blur-xl border-b border-white/[0.06]' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-deep-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-deep-500/20">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="text-xl font-display font-bold text-white">Disiplinli</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                ['Problem', '#problem'],
                ['Nasıl Çalışır', '#how-it-works'],
                ['Sistem', '#system'],
                ['Referanslar', '#social-proof']
              ].map(([label, href]) => (
                <a key={href} href={href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  {label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 bg-gradient-to-r from-deep-500 to-brand-600 rounded-xl text-sm font-semibold
                  hover:shadow-lg hover:shadow-deep-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Ücretsiz Başla
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white p-2">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-navy-950/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-6 space-y-4">
            {[
              ['Problem', '#problem'],
              ['Nasıl Çalışır', '#how-it-works'],
              ['Sistem', '#system'],
              ['Referanslar', '#social-proof']
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMobileMenu(false)}
                className="block text-gray-300 hover:text-white text-base font-medium">
                {label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
              <button onClick={() => navigate('/login')} className="py-3 text-gray-300 text-sm font-medium">
                Giriş Yap
              </button>
              <button onClick={() => navigate('/register')}
                className="py-3 bg-gradient-to-r from-deep-500 to-brand-600 rounded-xl text-sm font-semibold">
                Ücretsiz Başla
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════
           SECTION 1 — HERO
         ═══════════════════════════════════════════════════ */}
      <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 animate-fade-up">
              <Sparkles size={16} className="text-deep-400" />
              <span className="text-sm text-gray-300 font-medium">Motivasyon değil, sistem.</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 gradient-text">
                Çalışmayı sürdürülebilir
              </span>
              <br />
              <span className="bg-gradient-to-r from-deep-400 via-deep-300 to-brand-400 gradient-text">
                hale getiren sistem.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              Disiplinli; planlama, takip ve rehberlik ile öğrencilere sürdürülebilir ilerleme sağlayan bir akademik koçluk sistemidir.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.45s' }}>
              <button
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-deep-500 to-brand-600 rounded-2xl font-semibold text-lg
                  hover:shadow-2xl hover:shadow-deep-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]
                  flex items-center justify-center gap-3"
              >
                Ücretsiz eksik analizi al
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 glass rounded-2xl font-semibold text-base
                  hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 text-gray-200"
              >
                <ChevronRight size={18} className="text-deep-400" />
                Sistemi keşfet
              </button>
            </div>
          </div>

          {/* Hero visual — floating glass cards */}
          <div className="relative mt-20 max-w-5xl mx-auto hidden md:block h-[300px]">
            {/* Card 1 — Planlama */}
            <div className="absolute top-0 left-[5%] glass-strong rounded-2xl p-5 shadow-2xl animate-float max-w-[220px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-deep-500 to-deep-600 rounded-xl flex items-center justify-center">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Haftalık Plan</p>
                  <p className="text-sm font-semibold">%94 Tamamlandı</p>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                <div className="bg-gradient-to-r from-deep-400 to-deep-500 h-1.5 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* Card 2 — Net artışı */}
            <div className="absolute top-8 right-[5%] glass-strong rounded-2xl p-5 shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Son 4 Hafta</p>
                  <p className="text-lg font-bold text-green-400">+18.5 Net</p>
                </div>
              </div>
            </div>

            {/* Card 3 — Koç mesajı */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 glass-strong rounded-2xl p-5 shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-xs font-bold">AK</div>
                <div>
                  <p className="text-sm font-medium">Akademik Koç</p>
                  <p className="text-xs text-gray-400">Şimdi</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 bg-white/[0.06] px-3 py-2 rounded-lg">
                Bu hafta matematik netlerinde güzel bir ilerleme var 👏
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
           SECTION 2 — PROBLEM
         ═══════════════════════════════════════════════════ */}
      <Section id="problem" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <span className="text-sm text-red-300 font-medium">Tanıdık geldi mi?</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 gradient-text">
                Çalışıyorsun ama ilerleme yok.
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Motivasyon gelip geçici. Asıl sorun, neyi ne zaman yapacağını bilmemek ve yalnız kalmak.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: 'Yön belirsizliği',
                description: 'Nereden başlayacağını, hangi konuya ne kadar zaman ayıracağını bilmiyorsun.',
                gradient: 'from-red-500/20 to-orange-500/20',
                iconColor: 'text-red-400'
              },
              {
                icon: Clock,
                title: 'Tutarsız çalışma',
                description: 'İyi başlıyorsun ama birkaç gün sonra motivasyon düşüyor, plan bozuluyor.',
                gradient: 'from-amber-500/20 to-yellow-500/20',
                iconColor: 'text-amber-400'
              },
              {
                icon: Users,
                title: 'Rehberlik eksikliği',
                description: 'Yalnız çalışıyorsun. Eksiklerini fark etmek ve düzeltmek zor.',
                gradient: 'from-orange-500/20 to-red-500/20',
                iconColor: 'text-orange-400'
              }
            ].map((item, i) => (
              <div key={i}
                className="group glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6
                  group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={26} className={item.iconColor} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Transition line */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-500 italic">
              "Motivasyon seni başlatır. <span className="text-deep-400 font-medium not-italic">Sistem</span> seni sürdürür."
            </p>
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           SECTION 3 — HOW IT WORKS
         ═══════════════════════════════════════════════════ */}
      <Section id="how-it-works" className="py-24 md:py-32 px-6 relative">
        {/* Subtle gradient band */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-950/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-500/10 border border-deep-500/20 rounded-full mb-6">
              <Layers size={16} className="text-deep-400" />
              <span className="text-sm text-deep-300 font-medium">3 Adımda Sistem</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 gradient-text">
                Sistem nasıl çalışır?
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Disiplinli, akademik koçluk sürecini üç temel adıma ayırır.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line — desktop */}
            <div className="hidden md:block absolute top-[100px] left-[16.5%] right-[16.5%] h-[2px] bg-gradient-to-r from-deep-500/30 via-deep-500/60 to-deep-500/30" />

            {[
              {
                step: '01',
                icon: ClipboardList,
                title: 'Eksik Analizi',
                description: 'Mevcut durumunu değerlendiriyoruz. Hangi konularda eksiğin var, nereden başlamalısın — net bir harita çıkarıyoruz.',
                gradient: 'from-deep-500 to-deep-600'
              },
              {
                step: '02',
                icon: Calendar,
                title: 'Kişisel Plan',
                description: 'Sana özel haftalık çalışma programı oluşturuyoruz. Hangi gün, hangi ders, kaç saat — her şey planlanmış.',
                gradient: 'from-deep-500 to-brand-600'
              },
              {
                step: '03',
                icon: BarChart3,
                title: 'Takip & Rehberlik',
                description: 'Koçun, ilerlemeyi haftalık takip eder. Performans analizi, geri bildirim ve yön düzeltmeleri ile sürekli gelişirsin.',
                gradient: 'from-brand-600 to-brand-700'
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Step circle on the line */}
                <div className="hidden md:flex absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-12 h-12 bg-navy-950 border-2 border-deep-500/50 rounded-full items-center justify-center z-10
                  group-hover:border-deep-400 group-hover:shadow-lg group-hover:shadow-deep-500/20 transition-all">
                  <span className="text-deep-400 text-sm font-bold">{item.step}</span>
                </div>

                <div className="glass rounded-2xl p-8 pt-12 md:pt-14 text-center hover:bg-white/[0.06] transition-all duration-300
                  group-hover:-translate-y-1">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6
                    shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-display">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           SECTION 4 — SYSTEM LAYERS (Tiers)
         ═══════════════════════════════════════════════════ */}
      <Section id="system" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full mb-6">
              <Layers size={16} className="text-brand-400" />
              <span className="text-sm text-brand-300 font-medium">Sistem Katmanları</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 gradient-text">
                Senin için doğru sistem hangisi?
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              İhtiyacına göre bir katman seç, istediğin zaman yükselt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* ── Tier 1: Disiplinli ── */}
            <div className="tier-card glass rounded-3xl p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-display font-bold mb-1">Disiplinli</h3>
                <p className="text-sm text-gray-400">Kendi kendine düzenli çalışmak isteyenler için</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-white">Ücretsiz</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Konu takip sistemi',
                  'Haftalık planlama aracı',
                  'Deneme analizi',
                  'İlerleme göstergeleri'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={18} className="text-deep-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3.5 glass rounded-xl text-sm font-semibold hover:bg-white/[0.08] transition-all"
              >
                Ücretsiz Başla
              </button>
            </div>

            {/* ── Tier 2: Disiplinli+ (Featured) ── */}
            <div className="tier-card tier-card-featured relative glass rounded-3xl p-8 flex flex-col border-deep-500/30">
              {/* Featured badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-deep-500 to-deep-600 rounded-full">
                <span className="text-xs font-bold text-white">En Popüler</span>
              </div>
              <div className="mb-6 mt-2">
                <h3 className="text-xl font-display font-bold mb-1">Disiplinli+</h3>
                <p className="text-sm text-gray-400">Koç desteği ile fark yaratmak isteyenler için</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-white">Koç Eşleşmesi</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Disiplinli\'deki her şey',
                  'Birebir akademik koç',
                  'Haftalık görüşme & takip',
                  'Kişiselleştirilmiş program',
                  'Eksik analizi raporu',
                  'Koç ile anlık mesajlaşma'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={18} className="text-deep-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3.5 bg-gradient-to-r from-deep-500 to-brand-600 rounded-xl text-sm font-semibold
                  hover:shadow-lg hover:shadow-deep-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Koç ile Başla
              </button>
            </div>

            {/* ── Tier 3: Disiplinli Pro ── */}
            <div className="tier-card glass rounded-3xl p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-display font-bold mb-1">Disiplinli Pro</h3>
                <p className="text-sm text-gray-400">Tam kapsamlı destek ile hedefe kilitlenmek isteyenler için</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-white">Premium</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Disiplinli+\'daki her şey',
                  'Yoğunlaştırılmış takip',
                  'Günlük çalışma kontrolü',
                  'Online ders desteği',
                  'Veli bilgilendirme paneli',
                  'Öncelikli koç erişimi'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={18} className="text-brand-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3.5 glass rounded-xl text-sm font-semibold hover:bg-white/[0.08] transition-all"
              >
                Pro Başvurusu Yap
              </button>
            </div>
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           SECTION 5 — SOCIAL PROOF
         ═══════════════════════════════════════════════════ */}
      <Section id="social-proof" className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-950/15 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <Star size={16} className="text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Öğrenci Deneyimleri</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 gradient-text">
                Sistemi kullananlar ne diyor?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: 'Daha önce hiç bu kadar düzenli çalışamamıştım. Sistem sayesinde her gün ne yapacağımı biliyorum.',
                name: 'Elif Y.',
                detail: 'TYT Öğrencisi',
                avatar: 'EY'
              },
              {
                quote: 'Koçumla haftalık görüşmeler çok faydalı. Eksiklerimi görüyorum ve hemen aksiyon alıyorum.',
                name: 'Burak K.',
                detail: 'AYT Sayısal',
                avatar: 'BK'
              },
              {
                quote: 'Veli paneli ile çocuğumun gelişimini takip edebiliyorum. Sonunda gerçek bir ilerleme görüyoruz.',
                name: 'Ayşe T.',
                detail: 'Veli',
                avatar: 'AT'
              }
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-[15px]">"{item.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-deep-500 to-brand-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{item.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '500+', label: 'Aktif Öğrenci' },
              { value: '%92', label: 'Memnuniyet Oranı' },
              { value: '15+', label: 'Uzman Koç' },
              { value: '10K+', label: 'Tamamlanan Görev' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-bold font-display bg-gradient-to-r from-deep-400 to-brand-400 gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           SECTION 6 — FINAL CTA
         ═══════════════════════════════════════════════════ */}
      <Section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-deep-600 via-deep-700 to-brand-800" />
            {/* Glass overlay shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.06] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/[0.04] rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-deep-400/10 rounded-full blur-[80px]" />

            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">
                Sürdürülebilir ilerleme
                <br className="hidden sm:block" />
                {' '}bugün başlar.
              </h2>
              <p className="text-deep-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Ücretsiz eksik analizini tamamla, sana özel çalışma planını al ve sisteme adım at.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="group px-10 py-4 bg-white text-deep-800 rounded-2xl font-bold text-lg
                  hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-[1.03] active:scale-[0.98]
                  inline-flex items-center gap-3"
              >
                Ücretsiz Başla
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </Section>


      {/* ═══════════════════════════════════════════════════
           FOOTER
         ═══════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-deep-500 to-brand-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="font-display font-bold text-lg">Disiplinli</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Gizlilik Politikası</a>
              <a href="/kullanici-sozlesmesi" className="hover:text-gray-300 transition-colors">Kullanım Şartları</a>
              <a href="mailto:destek@disiplinli.com" className="hover:text-gray-300 transition-colors">İletişim</a>
            </div>

            <p className="text-sm text-gray-600">
              © 2026 Disiplinli. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
