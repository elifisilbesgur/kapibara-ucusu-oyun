import type { Sprite } from './palette';

// Kapibara piksel çizimleri. Her satır bir piksel sırası, her harf bir renk (bkz. palette.ts).
// Tüm parçalar aynı ızgarada konumlanır: offsetX/offsetY gövdenin sol üstüne göre.
// Gövde çıplak; modlar (yaprak, balon, şapka, kanat, jetpack) üstüne giydirilir.

export const BODY: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '......................',
    '.........KK...........',
    '........KBLKKKKKKKKK..',
    '........KKKBBBBBBBBK..',
    '......KKBBBBBBBBBBBBK.',
    '......KBBBBBBBBBBEWBK.',
    '......KBBBBBBBBBBEEBBK',
    '......KBBBBBBBBBBBBBNK',
    '......KBBBBBBBBBBPPBBK',
    '......KBBBBBBBBBBBBBBK',
    '.....KLBBBBBBBBBBBBBK.',
    '.....KLLLLLLLBBBBBBK..',
    '......KLLLLLLLLLLKK...',
    '.......KBK....KBK.....',
    '.......KKK....KKK.....',
  ],
};

// Dönme ve konumlama merkezi: gövdenin ortası (piksel cinsinden).
export const PIVOT = { x: 14, y: 9 };

// Yüz ifadeleri: gövdenin üstüne çizilen küçük yamalar.
// Gülümseme (portakal yiyince) ve kapalı gözler (suda sırtüstü yüzerken).
export const SMILE: Sprite = { offsetX: 18, offsetY: 9, rows: ['K.K', '.K.'] };
export const EYES_CLOSED: Sprite = { offsetX: 17, offsetY: 5, rows: ['BB', 'KK'] };
// Uykulu: göz kapağı yarıya inmiş (üst yarı kapak, alt yarı göz)
export const EYES_HALF: Sprite = { offsetX: 17, offsetY: 5, rows: ['KK', 'EE'] };
// Esneme: burnun altında açık ağız (pembe iç)
export const YAWN: Sprite = { offsetX: 18, offsetY: 9, rows: ['.KK', 'KPK', '.KK'] };
// Uyuyunca başın üstünde süzülen "z"
export const SNORE_Z: Sprite = { offsetX: 0, offsetY: 0, rows: ['WWWW', '..W.', '.W..', 'WWWW'] };

// --- Mod 0: Yaprak kanat. İki kare: kanat yukarıda / dokununca aşağı çırpılmış.
export const LEAF_FRAMES: Sprite[] = [
  {
    offsetX: 3,
    offsetY: -3,
    rows: [
      '.......DD.',
      '......DMMD',
      '..DD.DMHMD',
      '.DSSDMHMD.',
      'DSSSDMMD..',
      'DSSDDDD...',
      '.DD.......',
    ],
  },
  {
    offsetX: 2,
    offsetY: 1,
    rows: [
      'DDDD......',
      'DSSSDDD...',
      '.DSSDMMDD.',
      '..DDMHHMMD',
      '....DDMMD.',
      '......DD..',
    ],
  },
];

// --- Mod 1: Balon. İpi sırta bağlı.
export const BALLOON: Sprite = {
  offsetX: 1,
  offsetY: -15,
  rows: [
    '..qqqq..',
    '.qRRRRq.',
    'qRPRRRRq',
    'qRPRRRRq',
    'qRRRRRRq',
    '.qRRRRq.',
    '..qqqq..',
    '...qq...',
    '....n...',
    '....n...',
    '.....n..',
    '.....n..',
    '......n.',
    '......n.',
    '.......n',
    '.......n',
    '.......n',
  ],
};

// --- Mod 2 ve 4: Pervaneli şapka
export const CAP: Sprite = {
  offsetX: 11,
  offsetY: 0,
  rows: [
    '...KKKK...',
    '..KYRYRK..',
    'KKKKKKKKKK',
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

// --- Mod 3: Kuş kanatları. İki kare: yukarıda / dokununca aşağı çırpılmış.
export const WING_FRAMES: Sprite[] = [
  {
    offsetX: 0,
    offsetY: -7,
    rows: [
      'VV.........',
      'VVVV.......',
      'vVVVVV.....',
      'vVVVVVVV...',
      '.vVVVVVVVV.',
      '..vvVVVVVVV',
      '....vvVVVVV',
      '......vvvVV',
      '.........vV',
    ],
  },
  {
    offsetX: -1,
    offsetY: 3,
    rows: [
      '.........vV',
      '......vvvVV',
      '....vvVVVVV',
      '..vVVVVVVV.',
      'vVVVVVVV...',
      'VVVVVV.....',
      'VVV........',
    ],
  },
];

// --- Mod 4: Jetpack (sırtta) + alev
export const JETPACK: Sprite = {
  offsetX: 0,
  offsetY: 4,
  rows: [
    '..KKKKK',
    '.KgGGgK',
    '.KgGRgK',
    '.KgGRgK',
    '.KgGGgK',
    '.KgGGgK',
    '..KggK.',
    '..KKKK.',
    '...KK..',
  ],
};

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
