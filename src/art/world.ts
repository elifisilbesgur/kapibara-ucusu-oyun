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
