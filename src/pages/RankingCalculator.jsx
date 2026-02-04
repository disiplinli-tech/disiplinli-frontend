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
  { key: "TYT_TURKCE", label: "Türkçe", maxQ: 40, color: "blue" },
  { key: "TYT_SOSYAL", label: "Sosyal", maxQ: 20, color: "green" },
  { key: "TYT_MATEMATIK", label: "Matematik", maxQ: 40, color: "purple" },
  { key: "TYT_FEN", label: "Fen", maxQ: 20, color: "orange" },
];

// AYT Ders Listeleri (Alana Göre)
const AYT_SUBJECTS = {
  SAY: [
    { key: "AYT_MAT", label: "Matematik", maxQ: 40, color: "purple" },
    { key: "AYT_FIZIK", label: "Fizik", maxQ: 14, color: "blue" },
    { key: "AYT_KIMYA", label: "Kimya", maxQ: 13, color: "green" },
    { key: "AYT_BIYOLOJI", label: "Biyoloji", maxQ: 13, color: "pink" },
  ],
  EA: [
    { key: "AYT_MAT", label: "Matematik", maxQ: 40, color: "purple" },
    { key: "AYT_EDEBIYAT", label: "Edebiyat", maxQ: 24, color: "pink" },
    { key: "AYT_TARIH1", label: "Tarih-1", maxQ: 10, color: "orange" },
    { key: "AYT_COGRAFYA1", label: "Coğrafya-1", maxQ: 6, color: "green" },
  ],
  SOZ: [
    { key: "AYT_EDEBIYAT", label: "Edebiyat", maxQ: 24, color: "pink" },
    { key: "AYT_TARIH1", label: "Tarih-1", maxQ: 10, color: "orange" },
    { key: "AYT_COGRAFYA1", label: "Coğrafya-1", maxQ: 6, color: "green" },
    { key: "AYT_TARIH2", label: "Tarih-2", maxQ: 11, color: "red" },
    { key: "AYT_COGRAFYA2", label: "Coğrafya-2", maxQ: 11, color: "teal" },
    { key: "AYT_FELSEFE", label: "Felsefe", maxQ: 12, color: "purple" },
  ],
  DIL: [{ key: "YDT", label: "Yabancı Dil", maxQ: 80, color: "blue" }],
};

const FIELD_TYPES = [
  { value: "SAY", label: "Sayısal", emoji: "🔢" },
  { value: "EA", label: "Eşit Ağırlık", emoji: "⚖️" },
  { value: "SOZ", label: "Sözel", emoji: "📖" },
  { value: "DIL", label: "Dil", emoji: "🌍" },
];

// Compact Subject Input Component
function CompactSubjectInput({ subject, type, nets, onChange }) {
  const [mode, setMode] = useState("net"); // net or dy
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");

  const calculateNet = (c, w) => Math.max(0, c - w * 0.25);

  const handleDYChange = (newCorrect, newWrong) => {
    const c = Math.min(parseInt(newCorrect) || 0, subject.maxQ);
    const w = Math.min(parseInt(newWrong) || 0, subject.maxQ - c);
    const net = calculateNet(c, w);
    onChange(type, subject.key, net);
  };

  const colorClasses = {
    blue: "border-blue-200 focus:ring-blue-500",
    green: "border-green-200 focus:ring-green-500",
    purple: "border-purple-200 focus:ring-purple-500",
    orange: "border-orange-200 focus:ring-orange-500",
    pink: "border-pink-200 focus:ring-pink-500",
    red: "border-red-200 focus:ring-red-500",
    teal: "border-teal-200 focus:ring-teal-500",
  };

  const borderClass = colorClasses[subject.color] || colorClasses.blue;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <div className="w-20 sm:w-24 flex-shrink-0">
        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate block">
          {subject.label}
        </span>
        <span className="text-[10px] text-gray-400">{subject.maxQ} soru</span>
      </div>

      {mode === "net" ? (
        <input
          type="number"
          step="0.25"
          placeholder="Net"
          value={nets[subject.key] || ""}
          onChange={(e) => onChange(type, subject.key, parseFloat(e.target.value) || 0)}
          className={`flex-1 min-w-0 px-2 py-1.5 border rounded-lg text-sm text-center ${borderClass}`}
          min="0"
          max={subject.maxQ}
        />
      ) : (
        <div className="flex-1 flex items-center gap-1">
          <input
            type="number"
            placeholder="D"
            value={correct}
            onChange={(e) => {
              setCorrect(e.target.value);
              handleDYChange(e.target.value, wrong);
            }}
            className="w-12 sm:w-14 px-1 py-1.5 border border-green-200 rounded-lg text-sm text-center text-green-700"
            min="0"
            max={subject.maxQ}
          />
          <input
            type="number"
            placeholder="Y"
            value={wrong}
            onChange={(e) => {
              setWrong(e.target.value);
              handleDYChange(correct, e.target.value);
            }}
            className="w-12 sm:w-14 px-1 py-1.5 border border-red-200 rounded-lg text-sm text-center text-red-700"
            min="0"
            max={subject.maxQ}
          />
          <span className="text-xs text-indigo-600 font-medium w-10 text-right">
            {(nets[subject.key] || 0).toFixed(1)}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMode(mode === "net" ? "dy" : "net")}
        className="text-[10px] text-indigo-500 hover:text-indigo-700 whitespace-nowrap"
      >
        {mode === "net" ? "D/Y" : "Net"}
      </button>
    </div>
  );
}

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

  useEffect(() => {
    fetchExamAverages();
  }, []);

  const fetchExamAverages = async () => {
    try {
      const res = await API.get("/api/exam-averages/");
      setExamAverages(res.data);

      if (res.data.obp) setObp(res.data.obp.toString());
      if (res.data.field_type) setFieldType(res.data.field_type);
      if (res.data.tyt?.subject_averages) setTytNets(res.data.tyt.subject_averages);
      if (res.data.ayt?.subject_averages) setAytNets(res.data.ayt.subject_averages);
    } catch (err) {
    }
  };

  const handleNetChange = (type, key, value) => {
    if (type === "tyt") {
      setTytNets((prev) => ({ ...prev, [key]: value }));
    } else {
      setAytNets((prev) => ({ ...prev, [key]: value }));
    }
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
    } finally {
      setLoading(false);
    }
  };

  const getTytTotalNet = () => Object.values(tytNets).reduce((sum, net) => sum + (net || 0), 0);
  const getAytTotalNet = () => Object.values(aytNets).reduce((sum, net) => sum + (net || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">

        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <Calculator size={24} className="sm:w-7 sm:h-7" />
            <h1 className="text-xl sm:text-2xl font-bold">Sıralama Hesapla</h1>
          </div>
          <p className="text-indigo-100 text-sm">
            YKS puan ve sıralama tahmini • 2024 verileriyle
          </p>
        </div>

        {/* Deneme Ortalamaları - Compact */}
        {examAverages && examAverages.exam_count > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 sm:p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-amber-600" size={18} />
              <span className="font-medium text-amber-800 text-sm">
                {examAverages.exam_count} denemenin ortalamaları yüklendi
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="text-amber-600 font-bold">{examAverages.tyt?.total_net?.toFixed(1) || 0}</div>
                <div className="text-amber-700 text-[10px] sm:text-xs">TYT Net</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="text-amber-600 font-bold text-xs sm:text-sm">{examAverages.tyt?.formatted_ranking || "-"}</div>
                <div className="text-amber-700 text-[10px] sm:text-xs">TYT Sıra</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="text-amber-600 font-bold">{examAverages.ayt?.total_net?.toFixed(1) || 0}</div>
                <div className="text-amber-700 text-[10px] sm:text-xs">AYT Net</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="text-amber-600 font-bold text-xs sm:text-sm">{examAverages.ayt?.formatted_ranking || "-"}</div>
                <div className="text-amber-700 text-[10px] sm:text-xs">AYT Sıra</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">

          {/* Sol Panel - Giriş */}
          <div className="lg:col-span-3 space-y-4">

            {/* Alan ve OBP - Compact */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Alan Türü</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FIELD_TYPES.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => { setFieldType(f.value); setAytNets({}); }}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border
                          ${fieldType === f.value
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
                          }`}
                      >
                        {f.emoji} {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    OBP <span className="text-gray-400">(0-100)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="85.50"
                    value={obp}
                    onChange={(e) => setObp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="100"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Diploma puanın (e-okul)</p>
                </div>
              </div>
            </div>

            {/* TYT Netleri */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setShowTyt(!showTyt)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-sky-600" size={18} />
                  </div>
                  <div className="text-left">
                    <h2 className="font-semibold text-gray-800 text-sm sm:text-base">TYT</h2>
                    <p className="text-xs text-gray-500">{getTytTotalNet().toFixed(1)} net</p>
                  </div>
                </div>
                {showTyt ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
              </button>

              {showTyt && (
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-2">
                  {TYT_SUBJECTS.map((subject) => (
                    <CompactSubjectInput
                      key={subject.key}
                      subject={subject}
                      type="tyt"
                      nets={tytNets}
                      onChange={handleNetChange}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* AYT Netleri */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setShowAyt(!showAyt)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Award className="text-violet-600" size={18} />
                  </div>
                  <div className="text-left">
                    <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                      AYT {FIELD_TYPES.find((f) => f.value === fieldType)?.label}
                    </h2>
                    <p className="text-xs text-gray-500">{getAytTotalNet().toFixed(1)} net</p>
                  </div>
                </div>
                {showAyt ? <ChevronUp className="text-gray-400" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
              </button>

              {showAyt && (
                <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-2">
                  {AYT_SUBJECTS[fieldType]?.map((subject) => (
                    <CompactSubjectInput
                      key={subject.key}
                      subject={subject}
                      type="ayt"
                      nets={aytNets}
                      onChange={handleNetChange}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Hesapla Butonu */}
            <button
              onClick={calculateScore}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 sm:py-4 rounded-xl
                font-bold text-base sm:text-lg hover:from-indigo-700 hover:to-violet-700 transition-all
                disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Hesaplanıyor...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Hesapla
                </>
              )}
            </button>
          </div>

          {/* Sağ Panel - Sonuçlar */}
          <div className="lg:col-span-2 space-y-4">
            {result ? (
              <>
                {/* Yerleştirme - Ana Sonuç */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-4 sm:p-5 text-white">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <TrendingUp size={18} />
                    Yerleştirme Tahmini
                  </h3>
                  <div className="text-center py-3">
                    <div className="text-4xl sm:text-5xl font-bold mb-1">
                      {result.placement.formatted_ranking}
                    </div>
                    <div className="text-indigo-200 text-sm">
                      {FIELD_TYPES.find((f) => f.value === fieldType)?.label} Sıralaması
                    </div>
                  </div>
                  {result.obp_used && (
                    <div className="mt-3 pt-3 border-t border-white/20 text-xs text-indigo-200 text-center">
                      OBP: {result.obp_used} dahil
                    </div>
                  )}
                </div>

                {/* TYT ve AYT Sonuçları - Yan Yana */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-sky-100 rounded flex items-center justify-center">
                        <BookOpen className="text-sky-600" size={14} />
                      </div>
                      <span className="font-medium text-gray-800 text-sm">TYT</span>
                    </div>
                    <div className="text-2xl font-bold text-sky-600">{result.tyt.score}</div>
                    <div className="text-xs text-gray-500 mt-1">{result.tyt.total_net} net</div>
                    <div className="text-sm font-semibold text-indigo-600 mt-2">
                      ~{result.tyt.formatted_ranking}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-violet-100 rounded flex items-center justify-center">
                        <Award className="text-violet-600" size={14} />
                      </div>
                      <span className="font-medium text-gray-800 text-sm">AYT</span>
                    </div>
                    <div className="text-2xl font-bold text-violet-600">{result.ayt.score}</div>
                    <div className="text-xs text-gray-500 mt-1">{result.ayt.total_net} net</div>
                    <div className="text-sm font-semibold text-indigo-600 mt-2">
                      ~{result.ayt.formatted_ranking}
                    </div>
                  </div>
                </div>

                {/* Hedef Karşılaştırma */}
                {examAverages?.target_ranking && (
                  <div className={`rounded-xl p-4 border ${
                    result.placement.ranking <= examAverages.target_ranking
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">Hedefin</div>
                        <div className="font-bold text-lg">{examAverages.target_ranking.toLocaleString("tr-TR")}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        result.placement.ranking <= examAverages.target_ranking
                          ? "text-green-700"
                          : "text-amber-700"
                      }`}>
                        {result.placement.ranking <= examAverages.target_ranking
                          ? "🎯 Hedeftesin!"
                          : `${(result.placement.ranking - examAverages.target_ranking).toLocaleString("tr-TR")} sıra kaldı`}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
                <Calculator className="mx-auto text-gray-300 mb-3" size={40} />
                <h3 className="font-medium text-gray-600 mb-1 text-sm">Sonuçlar</h3>
                <p className="text-gray-400 text-xs">
                  Netleri girin ve hesapla butonuna tıklayın
                </p>
              </div>
            )}

            {/* Bilgi Notu */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="flex items-start gap-2">
                <Info className="text-gray-400 flex-shrink-0 mt-0.5" size={14} />
                <p className="text-xs text-gray-500">
                  2024 YKS verileriyle tahmin. Gerçek sıralama farklılık gösterebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
