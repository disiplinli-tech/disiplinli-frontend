import { useState, useEffect } from "react";
import API from "../api";
import {
  Calculator,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  Zap,
} from "lucide-react";

// TYT Ders Listesi
const TYT_SUBJECTS = [
  { key: "TYT_TURKCE", label: "Türkçe", maxQ: 40 },
  { key: "TYT_SOSYAL", label: "Sosyal Bilimler", maxQ: 20 },
  { key: "TYT_MATEMATIK", label: "Temel Matematik", maxQ: 40 },
  { key: "TYT_FEN", label: "Fen Bilimleri", maxQ: 20 },
];

// AYT Ders Listeleri (Alana Göre)
const AYT_SUBJECTS = {
  SAY: [
    { key: "AYT_MAT", label: "Matematik", maxQ: 40 },
    { key: "AYT_FIZIK", label: "Fizik", maxQ: 14 },
    { key: "AYT_KIMYA", label: "Kimya", maxQ: 13 },
    { key: "AYT_BIYOLOJI", label: "Biyoloji", maxQ: 13 },
  ],
  EA: [
    { key: "AYT_MAT", label: "Matematik", maxQ: 40 },
    { key: "AYT_EDEBIYAT", label: "Türk Dili ve Edebiyatı", maxQ: 24 },
    { key: "AYT_TARIH1", label: "Tarih-1", maxQ: 10 },
    { key: "AYT_COGRAFYA1", label: "Coğrafya-1", maxQ: 6 },
  ],
  SOZ: [
    { key: "AYT_EDEBIYAT", label: "Türk Dili ve Edebiyatı", maxQ: 24 },
    { key: "AYT_TARIH1", label: "Tarih-1", maxQ: 10 },
    { key: "AYT_COGRAFYA1", label: "Coğrafya-1", maxQ: 6 },
    { key: "AYT_TARIH2", label: "Tarih-2", maxQ: 11 },
    { key: "AYT_COGRAFYA2", label: "Coğrafya-2", maxQ: 11 },
    { key: "AYT_FELSEFE", label: "Felsefe Grubu", maxQ: 12 },
  ],
  DIL: [{ key: "YDT", label: "Yabancı Dil", maxQ: 80 }],
};

const FIELD_TYPES = [
  { value: "SAY", label: "Sayısal" },
  { value: "EA", label: "Eşit Ağırlık" },
  { value: "SOZ", label: "Sözel" },
  { value: "DIL", label: "Yabancı Dil" },
];

export default function RankingCalculator() {
  const [fieldType, setFieldType] = useState("SAY");
  const [obp, setObp] = useState("");
  const [tytNets, setTytNets] = useState({});
  const [aytNets, setAytNets] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTyt, setShowTyt] = useState(true);
  const [showAyt, setShowAyt] = useState(true);
  const [examAverages, setExamAverages] = useState(null);
  const [loadingAverages, setLoadingAverages] = useState(false);

  // Öğrenci bilgilerini yükle
  useEffect(() => {
    fetchExamAverages();
  }, []);

  const fetchExamAverages = async () => {
    setLoadingAverages(true);
    try {
      const res = await API.get("/api/exam-averages/");
      setExamAverages(res.data);

      // Profil bilgilerini form'a yükle
      if (res.data.obp) {
        setObp(res.data.obp.toString());
      }
      if (res.data.field_type) {
        setFieldType(res.data.field_type);
      }

      // Ortalama netleri yükle
      if (res.data.tyt?.subject_averages) {
        setTytNets(res.data.tyt.subject_averages);
      }
      if (res.data.ayt?.subject_averages) {
        setAytNets(res.data.ayt.subject_averages);
      }
    } catch (err) {
      console.log("Ortalamalar yüklenemedi:", err);
    } finally {
      setLoadingAverages(false);
    }
  };

  const handleNetChange = (type, key, value) => {
    const numValue = parseFloat(value) || 0;
    if (type === "tyt") {
      setTytNets((prev) => ({ ...prev, [key]: numValue }));
    } else {
      setAytNets((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const calculateNet = (correct, wrong) => {
    return Math.max(0, correct - wrong * 0.25);
  };

  const handleQuickInput = (type, key, correct, wrong, maxQ) => {
    const c = Math.min(parseInt(correct) || 0, maxQ);
    const w = Math.min(parseInt(wrong) || 0, maxQ - c);
    const net = calculateNet(c, w);
    handleNetChange(type, key, net);
  };

  const calculateScore = async () => {
    setLoading(true);
    try {
      const res = await API.post("/api/calculate-score/", {
        tyt_nets: tytNets,
        ayt_nets: aytNets,
        field_type: fieldType,
        obp: obp ? parseFloat(obp) : null,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Hesaplama hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTytTotalNet = () => {
    return Object.values(tytNets).reduce((sum, net) => sum + (net || 0), 0);
  };

  const getAytTotalNet = () => {
    return Object.values(aytNets).reduce((sum, net) => sum + (net || 0), 0);
  };

  const SubjectInput = ({ subject, type, nets }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [correct, setCorrect] = useState("");
    const [wrong, setWrong] = useState("");

    return (
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {subject.label}
            <span className="text-gray-400 text-xs ml-1">
              (max {subject.maxQ} soru)
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowDetail(!showDetail)}
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            {showDetail ? "Net Gir" : "D/Y Gir"}
          </button>
        </div>

        {showDetail ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Doğru"
              value={correct}
              onChange={(e) => {
                setCorrect(e.target.value);
                handleQuickInput(
                  type,
                  subject.key,
                  e.target.value,
                  wrong,
                  subject.maxQ
                );
              }}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
              min="0"
              max={subject.maxQ}
            />
            <span className="text-gray-400">D</span>
            <input
              type="number"
              placeholder="Yanlış"
              value={wrong}
              onChange={(e) => {
                setWrong(e.target.value);
                handleQuickInput(
                  type,
                  subject.key,
                  correct,
                  e.target.value,
                  subject.maxQ
                );
              }}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center"
              min="0"
              max={subject.maxQ}
            />
            <span className="text-gray-400">Y</span>
            <span className="text-indigo-600 font-medium ml-2">
              = {(nets[subject.key] || 0).toFixed(2)} net
            </span>
          </div>
        ) : (
          <input
            type="number"
            step="0.25"
            placeholder="Net girin"
            value={nets[subject.key] || ""}
            onChange={(e) => handleNetChange(type, subject.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            min="0"
            max={subject.maxQ}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator size={28} />
          <h1 className="text-2xl font-bold">Sıralama Hesapla</h1>
        </div>
        <p className="text-indigo-100">
          YKS puan ve sıralama tahmini hesapla. Deneme sonuçlarını girerek
          potansiyel sıralamani gör!
        </p>
      </div>

      {/* Deneme Ortalamaları Bilgisi */}
      {examAverages && examAverages.exam_count > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-amber-600" size={20} />
            <span className="font-medium text-amber-800">
              Deneme Ortalamalarına Göre Tahmin
            </span>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            Son {examAverages.exam_count} denemenin ortalamaları yüklendi.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-amber-600 font-bold">
                {examAverages.tyt?.total_net?.toFixed(1) || 0}
              </div>
              <div className="text-amber-700 text-xs">TYT Ort. Net</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-amber-600 font-bold">
                {examAverages.tyt?.formatted_ranking || "-"}
              </div>
              <div className="text-amber-700 text-xs">TYT Sıralama</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-amber-600 font-bold">
                {examAverages.ayt?.total_net?.toFixed(1) || 0}
              </div>
              <div className="text-amber-700 text-xs">AYT Ort. Net</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-amber-600 font-bold">
                {examAverages.ayt?.formatted_ranking || "-"}
              </div>
              <div className="text-amber-700 text-xs">
                {examAverages.field_type_display} Sıralama
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol Panel - Giriş Alanları */}
        <div className="lg:col-span-2 space-y-4">
          {/* Alan Tipi ve OBP */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target size={20} className="text-indigo-600" />
              Temel Bilgiler
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alan Türü
                </label>
                <select
                  value={fieldType}
                  onChange={(e) => {
                    setFieldType(e.target.value);
                    setAytNets({});
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {FIELD_TYPES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OBP (Ortaöğretim Başarı Puanı)
                  <span className="text-gray-400 text-xs ml-1">(0-100)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Örn: 85.50"
                  value={obp}
                  onChange={(e) => setObp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* TYT Netleri */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowTyt(!showTyt)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold text-gray-800">TYT Netleri</h2>
                  <p className="text-sm text-gray-500">
                    Toplam: {getTytTotalNet().toFixed(2)} net
                  </p>
                </div>
              </div>
              {showTyt ? (
                <ChevronUp className="text-gray-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </button>

            {showTyt && (
              <div className="p-5 pt-0 grid md:grid-cols-2 gap-3">
                {TYT_SUBJECTS.map((subject) => (
                  <SubjectInput
                    key={subject.key}
                    subject={subject}
                    type="tyt"
                    nets={tytNets}
                  />
                ))}
              </div>
            )}
          </div>

          {/* AYT Netleri */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowAyt(!showAyt)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="text-purple-600" size={20} />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold text-gray-800">
                    AYT Netleri ({FIELD_TYPES.find((f) => f.value === fieldType)?.label})
                  </h2>
                  <p className="text-sm text-gray-500">
                    Toplam: {getAytTotalNet().toFixed(2)} net
                  </p>
                </div>
              </div>
              {showAyt ? (
                <ChevronUp className="text-gray-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </button>

            {showAyt && (
              <div className="p-5 pt-0 grid md:grid-cols-2 gap-3">
                {AYT_SUBJECTS[fieldType]?.map((subject) => (
                  <SubjectInput
                    key={subject.key}
                    subject={subject}
                    type="ayt"
                    nets={aytNets}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Hesapla Butonu */}
          <button
            onClick={calculateScore}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl
              font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all
              disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Hesaplanıyor...
              </>
            ) : (
              <>
                <Calculator size={20} />
                Puan ve Sıralama Hesapla
              </>
            )}
          </button>
        </div>

        {/* Sağ Panel - Sonuçlar */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* TYT Sonucu */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-blue-600" size={16} />
                  </div>
                  TYT Sonucu
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Toplam Net</span>
                    <span className="font-bold text-lg">{result.tyt.total_net}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">TYT Puanı</span>
                    <span className="font-bold text-lg text-blue-600">
                      {result.tyt.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tahmini Sıralama</span>
                    <span className="font-bold text-xl text-indigo-600">
                      {result.tyt.formatted_ranking}
                    </span>
                  </div>
                </div>
              </div>

              {/* AYT Sonucu */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="text-purple-600" size={16} />
                  </div>
                  {FIELD_TYPES.find((f) => f.value === fieldType)?.label} Sonucu
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Toplam Net</span>
                    <span className="font-bold text-lg">{result.ayt.total_net}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">AYT Puanı</span>
                    <span className="font-bold text-lg text-purple-600">
                      {result.ayt.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tahmini Sıralama</span>
                    <span className="font-bold text-xl text-indigo-600">
                      {result.ayt.formatted_ranking}
                    </span>
                  </div>
                </div>
              </div>

              {/* Yerleştirme Puanı */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Yerleştirme Tahmini
                </h3>

                <div className="text-center py-4">
                  <div className="text-5xl font-bold mb-2">
                    {result.placement.formatted_ranking}
                  </div>
                  <div className="text-indigo-200">
                    Tahmini {FIELD_TYPES.find((f) => f.value === fieldType)?.label} Sıralaması
                  </div>
                </div>

                {result.obp_used && (
                  <div className="mt-4 pt-4 border-t border-white/20 text-sm text-indigo-200">
                    <Info size={14} className="inline mr-1" />
                    OBP: {result.obp_used} puan olarak hesaplandı
                  </div>
                )}
              </div>

              {/* Hedef Karşılaştırma */}
              {examAverages?.target_ranking && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Hedef Karşılaştırma
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Hedefin</div>
                      <div className="font-bold text-lg">
                        {examAverages.target_ranking.toLocaleString("tr-TR")}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.placement.ranking <= examAverages.target_ranking
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {result.placement.ranking <= examAverages.target_ranking
                        ? "Hedefe Ulaşıyorsun! 🎯"
                        : `${(result.placement.ranking - examAverages.target_ranking).toLocaleString("tr-TR")} sıra uzakta`}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <Calculator className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="font-medium text-gray-600 mb-2">
                Sonuçları Görmek İçin
              </h3>
              <p className="text-gray-400 text-sm">
                Netleri girin ve "Hesapla" butonuna tıklayın
              </p>
            </div>
          )}

          {/* Bilgi Notu */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <Info className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Bilgilendirme</p>
                <p>
                  Bu hesaplama 2024 YKS verileri baz alınarak yapılmaktadır.
                  Gerçek sıralama, sınav zorluk derecesine ve tercih
                  dönemindeki verilere göre farklılık gösterebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
