import type { PassengerKind } from '../game/passengers';
import type { Sprite } from './palette';

// Yolcular: hepsi 8x6 piksel, sağa bakıyor. Aynı boyda olunca sırtta düzgün yığılırlar.
export const PASSENGER_PIXEL_WIDTH = 8;
export const PASSENGER_PIXEL_HEIGHT = 6;

export const BIRD: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '...KKK..',
    '..KbbEK.',
    '.KbbbbKY',
    'KbWWbbK.',
    '.KWWbK..',
    '..KOOK..',
  ],
};

export const TURTLE: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '..KKKK..',
    '.KTtTtK.',
    'KTtTtTtK',
    'KKKKKKUK',
    '.KUK.KEU',
    '.KK..KKK',
  ],
};

export const MONKEY: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '..KKKK..',
    '.KmmmmK.',
    'KfmffmfK',
    '.KfEfEK.',
    '.KmffmK.',
    '..KKKK..',
  ],
};

export const PASSENGER_SPRITES: Record<PassengerKind, Sprite> = {
  bird: BIRD,
  turtle: TURTLE,
  monkey: MONKEY,
};
