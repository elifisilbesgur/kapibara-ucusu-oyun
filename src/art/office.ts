import type { Sprite } from './palette';

// Burak Uçuyor arka planı: bilgisayarlar. Hepsi soluk mavi (k, C, F, e, u), gökyüzüne yakın.
const at0 = (rows: string[]): Sprite => ({ offsetX: 0, offsetY: 0, rows });

export const MONITOR = at0([
  'kkkkkkkkkkkkkkkk',
  'kCCCCCCCCCCCCCCk',
  'kCkkkkkkkkkkkkCk',
  'kCkeeeeeeeeeekCk',
  'kCkeuuuueeeeekCk',
  'kCkeeeeeeeeeekCk',
  'kCkeuuuuuuueekCk',
  'kCkeeeeeeeeeekCk',
  'kCkeuuueeeeeekCk',
  'kCkkkkkkkkkkkkCk',
  'kCCCCCCCCCCCCeCk',
  'kkkkkkkkkkkkkkkk',
  '......kFFk......',
  '....kkkkkkkk....',
]);

export const TOWER = at0([
  'kkkkkkkkkk',
  'kCCCCCCCCk',
  'kCFFFFFFCk',
  'kCCCCCCCCk',
  'kCFFFFFFCk',
  'kCCCCCCCCk',
  'kCCCCCCCCk',
  'kCCCCCeCCk',
  'kCCCCCCCCk',
  'kCFCFCFCCk',
  'kCCCCCCCCk',
  'kCFCFCFCCk',
  'kCCCCCCCCk',
  'kCFCFCFCCk',
  'kCCCCCCCCk',
  'kCCCCCCCCk',
  'kkkkkkkkkk',
  '.kk....kk.',
]);

const RACK_UNIT = ['kFFFFFFFFFFFFk', 'kCeCeCCCCuuCCk', 'kFFFFFFFFFFFFk'];
export const SERVER = at0([
  'kkkkkkkkkkkkkk',
  ...RACK_UNIT,
  ...RACK_UNIT,
  ...RACK_UNIT,
  ...RACK_UNIT,
  ...RACK_UNIT,
  ...RACK_UNIT,
  ...RACK_UNIT,
  'kkkkkkkkkkkkkk',
  '.kk........kk.',
]);

export const LAPTOP = at0([
  '..kkkkkkkkkkkk..',
  '..kCCCCCCCCCCk..',
  '..kCeeeeeeeeCk..',
  '..kCeuuueeeeCk..',
  '..kCeeeeeeeeCk..',
  '..kCeuuuuueeCk..',
  '..kkkkkkkkkkkk..',
  'kkFFFFFFFFFFFFkk',
  'kkkkkkkkkkkkkkkk',
]);

export const FLOPPY = at0([
  'kkkkkkkkk',
  'kFCeeeCFk',
  'kFCeeeCFk',
  'kFFFFFFFk',
  'kFeeeeeFk',
  'kFeuuueFk',
  'kFeeeeeFk',
  'kFeeeeeFk',
  'kkkkkkkkk',
]);

export const CURSOR = at0([
  'k.....',
  'kk....',
  'kek...',
  'keek..',
  'keeek.',
  'keekkk',
  'kkek..',
  'k.kek.',
  '...kk.',
]);
