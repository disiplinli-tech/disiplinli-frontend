/**
 * Sayısal değerleri Türkçe formatında gösterir
 */

// Sıralamayı formatla (1000 -> 1.000)
export const formatRanking = (rank) => {
  if (!rank) return '-';
  return rank.toLocaleString('tr-TR');
};

// Tarihi formatla
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '-';
  const defaultOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('tr-TR', { ...defaultOptions, ...options });
};

// Kısa tarih formatı
export const formatShortDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

// Net skorunu formatla
export const formatNet = (net) => {
  if (net === null || net === undefined) return '-';
  return typeof net === 'number' ? net.toFixed(1) : net;
};

// Süreyi formatla (dakika -> saat:dakika)
export const formatDuration = (minutes) => {
  if (!minutes) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}dk`;
  if (mins === 0) return `${hours}s`;
  return `${hours}s ${mins}dk`;
};
