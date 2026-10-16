const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

// Date ya da ISO metni → "17 Ekim 2026" (cihazın dil ayarından bağımsız)
export function formatDate(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
