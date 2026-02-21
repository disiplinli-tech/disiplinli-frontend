import { useEffect, useState } from 'react';
import { Flame, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import API from '../api';

const DIFFICULTY_LABELS = {
  odak: 'Odak sorunu',
  stres: 'Stres',
  konu: 'Konu zorluğu',
  erteleme: 'Erteleme',
  baska: 'Başka',
};

const DIFFICULTY_COLORS = {
  odak: { bg: 'bg-blue-100', text: 'text-blue-700', bar: '#3B82F6' },
  stres: { bg: 'bg-red-100', text: 'text-red-700', bar: '#EF4444' },
  konu: { bg: 'bg-purple-100', text: 'text-purple-700', bar: '#8B5CF6' },
  erteleme: { bg: 'bg-amber-100', text: 'text-amber-700', bar: '#F59E0B' },
  baska: { bg: 'bg-gray-100', text: 'text-gray-700', bar: '#6B7280' },
};

export default function StudentProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await API.get('/api/student/progress/');
      setData(res.data);
    } catch (err) {
      console.error('İlerleme verisi yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">Veri yüklenemedi.</p>
      </div>
    );
  }

  // Grafik verileri hazırla
  const complianceChart = (data.compliance_chart || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  }));

  const durationChart = (data.duration_chart || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  }));

  // Sapma nedenleri sıralı
  const deviationCauses = Object.entries(data.deviation_causes || {})
    .sort(([, a], [, b]) => b - a);
  const totalDeviations = deviationCauses.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">İlerlemem</h1>

        {/* Streak Kartı */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame size={28} />
              <div>
                <p className="text-2xl font-bold">{data.streak?.current || 0} gün</p>
                <p className="text-sm opacity-80">Mevcut serin</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{data.streak?.longest || 0}</p>
              <p className="text-sm opacity-80">En uzun seri</p>
            </div>
          </div>
        </div>

        {/* Plan Uyum Grafiği */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Plan Uyum %</h2>
            <span className="text-xs text-gray-400 ml-auto">Son 14 gün</span>
          </div>

          {complianceChart.some((d) => d.has_data) ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={complianceChart}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`%${v}`, 'Uyum']}
                />
                <Area
                  type="monotone"
                  dataKey="pct"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#compGrad)"
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Henüz check-in verisi yok</p>
                <p className="text-xs text-gray-400 mt-1">Bugün sayfasından günlük check-in yap.</p>
              </div>
            </div>
          )}
        </div>

        {/* Çalışma Süresi Trendi */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-purple-500" />
            <h2 className="font-semibold text-gray-800">Çalışma Süresi</h2>
            <span className="text-xs text-gray-400 ml-auto">Son 14 gün (dk)</span>
          </div>

          {durationChart.some((d) => d.minutes > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={durationChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${v} dk`, 'Süre']}
                />
                <Bar dataKey="minutes" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Clock size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Henüz tamamlanmış görev yok</p>
              </div>
            </div>
          )}
        </div>

        {/* Sapma Nedenleri */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-amber-500" />
            <h2 className="font-semibold text-gray-800">Sapma Nedenleri</h2>
            <span className="text-xs text-gray-400 ml-auto">Son 30 gün</span>
          </div>

          {deviationCauses.length > 0 ? (
            <div className="space-y-3">
              {deviationCauses.map(([tag, count]) => {
                const colors = DIFFICULTY_COLORS[tag] || DIFFICULTY_COLORS.baska;
                const pct = totalDeviations > 0 ? Math.round((count / totalDeviations) * 100) : 0;

                return (
                  <div key={tag} className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${colors.bg} ${colors.text} min-w-[100px] text-center`}>
                      {DIFFICULTY_LABELS[tag] || tag}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: colors.bar }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 min-w-[40px] text-right">%{pct}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-sm py-6">Henüz check-in verisi yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
