import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Target, Users, TrendingUp, Calendar, MessageCircle,
  ChevronRight, Star, Sparkles, Award, Clock, CheckCircle,
  ArrowRight, Play, Zap, Shield, BarChart3, Brain
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
      description: 'Yapay zeka destekli hedef belirleme ve takip sistemi ile hayalinizdeki üniversiteye ulaşın.',
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
      title: 'Soru Çarkı',
      description: 'Gamification ile öğrenmeyi eğlenceli hale getirin, puan toplayın.',
      gradient: 'from-indigo-500 to-violet-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Çözülen Soru' },
    { value: '500+', label: 'Aktif Öğrenci' },
    { value: '50+', label: 'Uzman Koç' },
    { value: '%94', label: 'Memnuniyet' }
  ];

  const testimonials = [
    {
      name: 'Elif Yılmaz',
      role: 'Tıp Fakültesi Öğrencisi',
      image: '👩‍🎓',
      text: 'KoçumNet sayesinde TYT\'de 112 net yaptım. Konu takip sistemi muhteşem!',
      university: 'Hacettepe Üniversitesi'
    },
    {
      name: 'Ahmet Kaya',
      role: 'Mühendislik Öğrencisi',
      image: '👨‍🎓',
      text: 'Koçumla sürekli iletişim haliydik. Bu beni çok motive etti.',
      university: 'ODTÜ'
    },
    {
      name: 'Zeynep Demir',
      role: 'Hukuk Öğrencisi',
      image: '👩‍⚖️',
      text: 'Deneme analizleri sayesinde zayıf yönlerimi gördüm ve geliştirdim.',
      university: 'Ankara Üniversitesi'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
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
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Başarı Hikayeleri</a>
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
                <span className="text-sm text-gray-300">YKS 2025 için hazırlan</span>
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
                Türkiye'nin en gelişmiş YKS koçluk platformu ile hedeflerine ulaş.
                Kişiselleştirilmiş çalışma planları, uzman koç desteği ve akıllı analiz araçları.
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
                <button className="group px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold
                  hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Play size={20} className="text-indigo-400" />
                  Nasıl Çalışır?
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 md:flex md:flex-wrap md:gap-8 pt-8 border-t border-white/10">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
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

      {/* Trusted By */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-8">Türkiye'nin önde gelen eğitim kurumları güveniyor</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['🏛️ Koç Üniversitesi', '🎓 Sabancı', '📚 Bilkent', '🌟 ODTÜ', '🏆 İTÜ'].map((uni, i) => (
              <span key={i} className="text-lg font-semibold text-gray-400">{uni}</span>
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

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Başarı Hikayeleri
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Binlerce öğrenci KoçumNet ile hayallerine ulaştı.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 leading-relaxed">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                    {t.image}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-indigo-400">{t.university}</p>
                  </div>
                </div>
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
                Hemen ücretsiz hesabını oluştur ve Türkiye'nin en gelişmiş YKS koçluk platformunu deneyimle.
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
              © 2025 KoçumNet. Tüm hakları saklıdır.
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
