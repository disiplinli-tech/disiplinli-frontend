import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Target, Users, TrendingUp, Calendar, MessageCircle,
  ChevronRight, Sparkles, Award, Clock,
  ArrowRight, Zap, Shield, BarChart3, Brain
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Kişiselleştirilmiş Hedefler',
      description: 'Hedef belirleme ve takip sistemi ile hayalinizdeki üniversiteye ulaşın.',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: Brain,
      title: 'Akıllı Konu Takibi',
      description: 'TYT ve AYT müfredatını tam kapsamlı takip edin. Eksik konularınızı anında görün.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Detaylı Analizler',
      description: 'Deneme sonuçlarınızı analiz edin, güçlü ve zayıf yönlerinizi keşfedin.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: MessageCircle,
      title: 'Anlık İletişim',
      description: 'Koçunuzla gerçek zamanlı mesajlaşın, sorularınıza anında yanıt alın.',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      icon: Calendar,
      title: 'Akıllı Planlama',
      description: 'Haftalık çalışma programınızı oluşturun, verimliliğinizi artırın.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Zap,
      title: 'Puanlaştırma Sistemi',
      description: 'Puan toplama sistemi ile öğrenmeyi eğlenceli hale getirin.',
      gradient: 'from-indigo-500 to-violet-500'
    }
  ];

  // Stats kaldırıldı - gerçek veri olmadan gösterilmemeli

  // Testimonials kaldırıldı - henüz gerçek kullanıcı yorumu yok

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden m-0 p-0">
      {/* Animated Background - Hidden on mobile for performance */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Simple gradient for mobile */}
      <div className="fixed inset-0 pointer-events-none md:hidden bg-gradient-to-b from-purple-900/20 via-transparent to-indigo-900/20" />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BookOpen className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                KoçumNet
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Özellikler</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Nasıl Çalışır</a>
              <a href="#why-us" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Neden Biz</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-semibold
                  hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
              >
                Ücretsiz Başla
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-sm text-gray-300">YKS 2026 ve 2027 için hazırlan</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Hayalindeki
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Üniversiteye
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Ulaş
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                Modern YKS koçluk platformu ile hedeflerine ulaş.
                Kişiselleştirilmiş çalışma planları, koç desteği ve akıllı analiz araçları.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-semibold
                    hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Hemen Başla
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="group px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold
                    hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ChevronRight size={20} className="text-indigo-400" />
                  Özellikleri Keşfet
                </button>
              </div>
            </div>

            {/* Right - Hero Image/3D */}
            <div className="relative lg:h-[600px] hidden lg:block">
              {/* Floating Cards */}
              <div className="absolute top-10 right-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl
                border border-white/20 rounded-2xl p-4 shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Bu Hafta</p>
                    <p className="text-xl font-bold">+12.5 Net</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl
                border border-white/20 rounded-2xl p-4 shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Sıralama</p>
                    <p className="text-xl font-bold">Top 1%</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gradient-to-br from-white/10 to-white/5
                backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">E</div>
                  <div>
                    <p className="text-sm font-medium">Erdi Koç</p>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
                </div>
                <p className="text-sm text-gray-300 bg-indigo-500/20 px-3 py-2 rounded-lg">
                  Matematik çalışman harika gidiyor! 💪
                </p>
              </div>

              {/* Main Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full blur-3xl" />
                <div className="absolute w-64 h-64 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl
                  shadow-2xl shadow-indigo-500/30 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <BookOpen size={80} className="text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Özellikleri Özet - Premium Strip */}
      <section className="py-16 border-y border-white/5 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-indigo-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {[
              { icon: BarChart3, text: 'Deneme Analizi', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Calendar, text: 'Haftalık Program', gradient: 'from-violet-500 to-purple-500' },
              { icon: MessageCircle, text: 'Koç İletişimi', gradient: 'from-orange-500 to-amber-500' },
              { icon: Brain, text: 'Konu Takibi', gradient: 'from-emerald-500 to-teal-500' },
              { icon: Target, text: 'Hedef Sıralama', gradient: 'from-pink-500 to-rose-500' }
            ].map((item, i) => (
              <div key={i} className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors text-center">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
              <Zap size={16} className="text-indigo-400" />
              <span className="text-sm text-indigo-300">Güçlü Özellikler</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Başarı İçin İhtiyacın Olan
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Her Şey Burada
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Modern teknoloji ve uzman koç desteği ile YKS hazırlığını bir üst seviyeye taşı.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white/5 to-transparent border border-white/10
                  rounded-2xl p-6 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-indigo-500/5
                  hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5
                  shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon size={26} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} className="text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                3 Adımda Başla
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Kayıt Ol', desc: 'Ücretsiz hesabını oluştur ve hedeflerini belirle.', icon: Users },
              { step: '02', title: 'Koçunu Seç', desc: 'Sana uygun uzman koçunla eşleş.', icon: Award },
              { step: '03', title: 'Çalışmaya Başla', desc: 'Kişiselleştirilmiş planınla hedefine ulaş.', icon: Target }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 text-center">
                  <div className="text-6xl font-bold text-indigo-500/20 mb-4">{item.step}</div>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <item.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight size={24} className="text-indigo-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neden KoçumNet? */}
      <section id="why-us" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Neden KoçumNet?
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              YKS yolculuğunda yanında olacak profesyonel bir platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Güvenli & Gizli',
                description: 'Tüm verileriniz güvenle saklanır. Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz.'
              },
              {
                icon: Clock,
                title: 'Zaman Tasarrufu',
                description: 'Otomatik analiz ve raporlama ile manuel işlemlere veda edin.'
              },
              {
                icon: TrendingUp,
                title: 'Sürekli Gelişim',
                description: 'Platform sürekli güncellenir ve yeni özellikler eklenir.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5">
                  <item.icon size={26} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Hayallerine Bir Adım Daha Yaklaş
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                Hemen ücretsiz hesabını oluştur ve modern YKS koçluk platformunu deneyimle.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg
                  hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                Ücretsiz Başla
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="font-bold text-lg">KoçumNet</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="/kullanici-sozlesmesi" className="hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-white transition-colors">İletişim</a>
            </div>

            <p className="text-sm text-gray-500">
              © 2026 KoçumNet. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
