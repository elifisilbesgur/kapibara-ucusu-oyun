import type { Sprite } from './palette';

// Kapibara piksel çizimleri. Her satır bir piksel sırası, her harf bir renk (bkz. palette.ts).
// Tüm parçalar aynı ızgarada konumlanır: offsetX/offsetY gövdenin sol üstüne göre.

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
