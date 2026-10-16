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

// --- Nadir yolcular (günün yolcusu)

export const OWL: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '.K....K.',
    '.KmmmmK.',
    'KYYmmYYK',
    'KYKmmKYK',
    '.KmmOmK.',
    '..KffK..',
  ],
};

export const FLAMINGO: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '....JPPJ',
    '....JPJK',
    '....JP..',
    '.JJJJP..',
    'JPPPPJ..',
    '.JJJJ...',
  ],
};

export const PENGUIN: Sprite = {
  offsetX: 0,
  offsetY: 0,
  rows: [
    '..KKKK..',
    '.KKWKKK.',
    'KKWWWKOO',
    'KKWWWWK.',
    '.KWWWWK.',
    '..OO.OO.',
  ],
};

export const PASSENGER_SPRITES: Record<PassengerKind, Sprite> = {
  bird: BIRD,
  turtle: TURTLE,
  monkey: MONKEY,
  owl: OWL,
  flamingo: FLAMINGO,
  penguin: PENGUIN,
};

// Arkadaş defteri için adlar ve yetenekler
export const PASSENGER_NAMES: Record<PassengerKind, string> = {
  bird: 'Kuş',
  turtle: 'Kaplumbağa',
  monkey: 'Maymun',
  owl: 'Baykuş',
  flamingo: 'Flamingo',
  penguin: 'Minik Penguen',
};

export const PASSENGER_ABILITIES: Record<PassengerKind, string> = {
  bird: 'Hafif; itişi güçlendirir',
  turtle: 'Ağır; bir çarpmayı kabuğuyla karşılar',
  monkey: 'Portakalları uzaktan toplar',
  owl: 'Gece kuşu; kapibara uykulanmaz',
  flamingo: 'Gösterişli; çarpanda iki yolcu sayılır',
  penguin: 'Soğukkanlı; rüzgârdan etkilenmez',
};

// Henüz tanışılmamış arkadaş: aynı şekil, dolu siluet
export function silhouette(sprite: Sprite): Sprite {
  return { ...sprite, rows: sprite.rows.map((row) => row.replace(/[^.]/g, 'K')) };
}
