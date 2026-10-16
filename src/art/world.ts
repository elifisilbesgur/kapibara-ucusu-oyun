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
