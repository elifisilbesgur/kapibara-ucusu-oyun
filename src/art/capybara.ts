// Kapibara piksel çizimleri. Her satır bir piksel sırası, her harf bir renk.
// '.' boş (saydam). Harflerin renkleri PALETTE'te.
// Tüm parçalar aynı ızgarada konumlanır: offsetX/offsetY gövdenin sol üstüne göre.

export const PALETTE: Record<string, string> = {
  K: '#3B2414', // çerçeve (koyu kahve)
  B: '#9C6B3F', // gövde
  L: '#C9A274', // açık karın
  N: '#2A1A0E', // burun
  E: '#16120F', // göz
  W: '#FFFFFF', // göz parıltısı
  P: '#F2899A', // pembe yanak
  G: '#A7AFBA', // jetpack gövde
  g: '#6B7380', // jetpack gölge
  R: '#E2483D', // kırmızı şerit / pervane kanadı
  Y: '#FFD23F', // sarı (şapka, alev)
  O: '#FF8A2A', // turuncu alev
  b: '#3F7FD9', // mavi pervane kanadı
};

export type Sprite = {
  rows: string[];
  offsetX: number;
  offsetY: number;
};

// Gövde + jetpack + şapka. Sağa bakıyor, jetpack sırtta (solda).
export const BODY: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '..............KKKK....',
    '.........KK..KYRYRK...',
    '........KBLKKKKKKKKKK.',
    '........KKKBBBBBBBBK..',
    '..KKKKKKBBBBBBBBBBBBK.',
    '.KgGGgKBBBBBBBBBBEWBK.',
    '.KgGRgKBBBBBBBBBBEEBBK',
    '.KgGRgKBBBBBBBBBBBBBNK',
    '.KgGGgKBBBBBBBBBBPPBBK',
    '.KgGGgKBBBBBBBBBBBBBBK',
    '..KggKLBBBBBBBBBBBBBK.',
    '..KKKKLLLLLLLBBBBBBK..',
    '...KK.KLLLLLLLLLLKK...',
    '.......KBK....KBK.....',
    '.......KKK....KKK.....',
  ],
};

// Pervane: şapkanın tepesinde döner. 4 kare sırayla gösterilince dönüyormuş gibi görünür.
const PROPELLER_X = 11;
const PROPELLER_Y = -2;
export const PROPELLER_FRAMES: Sprite[] = [
  { offsetX: PROPELLER_X, offsetY: PROPELLER_Y, rows: ['RRRRKKbbbb', '....KK....'] },
  { offsetX: PROPELLER_X, offsetY: PROPELLER_Y, rows: ['..RRKKbb..', '....KK....'] },
  { offsetX: PROPELLER_X, offsetY: PROPELLER_Y, rows: ['....KK....', '....KK....'] },
  { offsetX: PROPELLER_X, offsetY: PROPELLER_Y, rows: ['..bbKKRR..', '....KK....'] },
];

// Alev: jetpack ağzının altında. Küçük (süzülürken) ve büyük (dokununca), ikişer titreme karesi.
const FLAME_X = 2;
const FLAME_Y = 13;
export const FLAME_SMALL: Sprite[] = [
  { offsetX: FLAME_X, offsetY: FLAME_Y, rows: ['.YO.', '.O..'] },
  { offsetX: FLAME_X, offsetY: FLAME_Y, rows: ['.OY.', '..O.'] },
];
export const FLAME_BIG: Sprite[] = [
  { offsetX: FLAME_X, offsetY: FLAME_Y, rows: ['OYYO', '.YYO', '.OO.', '..O.'] },
  { offsetX: FLAME_X, offsetY: FLAME_Y, rows: ['OYYO', 'OYY.', '.OO.', '.O..'] },
];

// Dönme ve konumlama merkezi: gövdenin ortası (piksel cinsinden).
export const PIVOT = { x: 14, y: 9 };
