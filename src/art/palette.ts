// Tüm piksel çizimlerinin ortak paleti. Her harf bir renk; '.' boş (saydam).

export const PALETTE: Record<string, string> = {
  // Kapibara
  K: '#3B2414', // çerçeve (koyu kahve)
  B: '#9C6B3F', // gövde
  L: '#C9A274', // açık karın
  N: '#2A1A0E', // burun
  E: '#16120F', // göz
  W: '#FFFFFF', // beyaz (göz parıltısı, bulut)
  P: '#F2899A', // pembe yanak
  G: '#A7AFBA', // jetpack gövde
  g: '#6B7380', // jetpack gölge
  R: '#E2483D', // kırmızı şerit / pervane kanadı
  Y: '#FFD23F', // sarı (şapka, alev)
  O: '#FF8A2A', // turuncu alev
  b: '#3F7FD9', // mavi pervane kanadı
  // Bambu
  D: '#2E5527', // bambu çerçeve
  M: '#6FAE3E', // bambu gövde
  H: '#A9DB6C', // bambu parlaklık
  S: '#4D8A33', // bambu gölge
  // Portakal (O turuncu yukarıda)
  o: '#C2551A', // portakal çerçeve
  y: '#FFC27A', // portakal parlaklık
  // Yolcular
  T: '#5E9E4A', // kaplumbağa kabuk
  t: '#3B6B30', // kabuk deseni
  U: '#A6CF72', // kaplumbağa derisi
  m: '#7A4A2A', // maymun tüyü
  f: '#EBC79E', // maymun yüzü
  // Modlar
  q: '#A3271F', // balon çerçeve (koyu kırmızı)
  n: '#7A5A44', // balon ipi
  V: '#F3EEE0', // kuş kanadı (krem)
  v: '#BDB39A', // kuş kanadı gölge/çerçeve
  // Gökyüzü ve bulutlar (her seviyenin kendi bulut rengi)
  c: '#D4EDF5', // gündüz bulut gölgesi
  Q: '#FFE3D0', // akşam bulutu
  j: '#F2B49A', // akşam bulut gölgesi
  Z: '#B48BB8', // alacakaranlık bulutu
  z: '#8C6A9E', // alacakaranlık bulut gölgesi
  X: '#34437E', // gece bulutu
  x: '#27336A', // gece bulut gölgesi
  A: '#F6EDC4', // ay / yıldız
  a: '#D8CA94', // ay gölgesi
};

export type Sprite = {
  rows: string[];
  offsetX: number;
  offsetY: number;
};
