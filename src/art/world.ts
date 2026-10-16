import type { Sprite } from './palette';

// Bir bambu boğumu: üstte boğum halkası (biraz daha geniş), altında kamış.
// Üst üste dizilince istenen uzunlukta kamış olur.
const BAMBOO_SEGMENT = [
  'DDDDDDDDDDDDDDDDDD',
  'DHHMMMMMMMMMMMMSSD',
  'DDDDDDDDDDDDDDDDDD',
  '.DHHMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHMMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHMMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
  '.DHHMMMMMMMMMMSSD.',
];

export const BAMBOO_PIXEL_WIDTH = BAMBOO_SEGMENT[0].length;
export const BAMBOO_SEGMENT_HEIGHT = BAMBOO_SEGMENT.length;

// `segments` boğumluk bir kamış. Halka en üstte: kamış geçidin kenarında halkayla biter.
export function bambooStalk(segments: number): Sprite {
  const rows: string[] = [];
  for (let i = 0; i < segments; i++) rows.push(...BAMBOO_SEGMENT);
  return { rows, offsetX: 0, offsetY: 0 };
}

// Bir çizimin harflerini başka harflerle değiştirir (aynı şekil, farklı renk).
export function recolor(sprite: Sprite, colors: Record<string, string>): Sprite {
  return {
    ...sprite,
    rows: sprite.rows.map((row) => [...row].map((char) => colors[char] ?? char).join('')),
  };
}

export const CLOUD: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '......WWWW..........',
    '....WWWWWWWW..WWW...',
    '..WWWWWWWWWWWWWWWWW.',
    '.WWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWW',
    '.cccccccccccccccccc.',
  ],
};

export const ORANGE: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '....DM..',
    '..ooDoo.',
    '.oOOOOOo',
    'oOyOOOOo',
    'oOyOOOOo',
    'oOOOOOOo',
    '.oOOOOo.',
    '..oooo..',
  ],
};
export const ORANGE_PIXEL_SIZE = ORANGE.rows.length;

export const MOON: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '..AAA..',
    '.AAAaA.',
    'AAAAAAA',
    'AaAAAAA',
    'AAAAAaA',
    '.AAAAA.',
    '..AAA..',
  ],
};

export const STAR: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: ['.A.', 'AAA', '.A.'],
};

// Deniz yüzeyi: yan yana tekrarlanan dalga karosu. Altı düz su bantları.
export const WATER_TILE: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '..hhh.....hhh...',
    'hhwwwhhhhhwwwhhh',
    'wwwwwwwwwwwwwwww',
    'wwwiwwwwwwwiwwww',
    'iiiiiiiiiiiiiiii',
  ],
};

// Suya düşünce sıçrayan damlalar
export const SPLASH: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '.h......h.',
    'h.h.hh.h.h',
    '..h.hh.h..',
    '..hhwwhh..',
    '.hwwwwwwh.',
  ],
};

// Yolcu durağı: suya oturan küçük iskele + bayrak. Bacakları suyun içinde kalır.
const DOCK_ROWS = [
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  '......d.......',
  'drrrrrrrrrrrrd',
  'dddddddddddddd',
  '.d....d....d..',
  '.d....d....d..',
  '.d....d....d..',
];
// Bayrak direğin tepesinde: yolcular inince iner (kullanılmış durak)
const FLAG = ['.......RRRRR..', '.......RYYYRR.', '.......RRRRR..'];

export const DOCK: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: DOCK_ROWS.map((row, i) => (i < FLAG.length ? mergeRow(row, FLAG[i]) : row)),
};
export const DOCK_USED: Sprite = { offsetX: 0, offsetY: 0, rows: DOCK_ROWS };

// İki satırı üst üste koyar: üstteki satırın boş olmayan pikselleri kazanır
function mergeRow(bottom: string, top: string): string {
  return [...bottom].map((char, i) => (top[i] && top[i] !== '.' ? top[i] : char)).join('');
}

// Bir çizimi dikeyde aynalar (yukarı bakan yaprak → aşağı bakan yaprak)
export function flipVertical(sprite: Sprite): Sprite {
  return { ...sprite, rows: [...sprite.rows].reverse() };
}

// Bambu yaprağı: sol kenarından kamışa tutturulur, sağa doğru uzanır.
// Sakin hava: hafifçe sarkık. Rüzgârda: rüzgârın yönüne kalkar/iner ve iki kare arasında titrer.
const LEAF_DROOP: Sprite = at0([
  'DDDD......',
  'DMMMDDD...',
  '.DDHMMMDD.',
  '...DDDMMMD',
  '......DDDD',
]);
const LEAF_DOWN_A: Sprite = at0([
  'DD......',
  'DMDD....',
  '.DHMD...',
  '..DMMD..',
  '...DMMD.',
  '....DMMD',
  '.....DDD',
]);
const LEAF_DOWN_B: Sprite = at0([
  'DDD.......',
  'DMMDD.....',
  '.DHMMDD...',
  '..DDMMMD..',
  '....DDMMD.',
  '......DDDD',
]);

// Sıra önemli: Obstacle.tsx bu sıraya göre kare seçer
export const LEAF_FRAMES: Sprite[] = [
  LEAF_DROOP, // 0: sakin, ekranda aşağı sarkar
  flipVertical(LEAF_DROOP), // 1: sakin, ama ters çevrilmiş (üst kamış için)
  flipVertical(LEAF_DOWN_A), // 2: yukarı rüzgâr, titreme A
  flipVertical(LEAF_DOWN_B), // 3: yukarı rüzgâr, titreme B
  LEAF_DOWN_A, // 4: aşağı rüzgâr, titreme A
  LEAF_DOWN_B, // 5: aşağı rüzgâr, titreme B
];

function at0(rows: string[]): Sprite {
  return { offsetX: 0, offsetY: 0, rows };
}
