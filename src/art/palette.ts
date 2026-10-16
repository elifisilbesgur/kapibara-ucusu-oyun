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
  // Gökyüzü
  c: '#D4EDF5', // bulut gölgesi
};

export type Sprite = {
  rows: string[];
  offsetX: number;
  offsetY: number;
};
