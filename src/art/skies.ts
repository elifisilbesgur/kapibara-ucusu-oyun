import type { Sprite } from './palette';
import { CLOUD, recolor } from './world';

// Her seviyenin gökyüzü: yukarıdan aşağı renk bantları + o saate uygun bulut rengi.
export type Sky = {
  bands: string[];
  cloud: Sprite;
  night?: boolean; // ay ve yıldızlar çıksın mı
};

export const SKIES: Sky[] = [
  // 0 sabah
  {
    bands: ['#7FC8E3', '#94D3E9', '#AADDEE', '#BFE6F2', '#D3EEF5'],
    cloud: CLOUD,
  },
  // 1 öğle
  {
    bands: ['#3E9BE0', '#55AAE6', '#6DBAEC', '#86C9F1', '#A0D7F5'],
    cloud: CLOUD,
  },
  // 2 akşam üstü
  {
    bands: ['#E9785A', '#F08F63', '#F5A86E', '#F9C27F', '#FCDA98'],
    cloud: recolor(CLOUD, { W: 'Q', c: 'j' }),
  },
  // 3 alacakaranlık
  {
    bands: ['#2F2A63', '#4A367A', '#6B468E', '#94589A', '#BF6C9C'],
    cloud: recolor(CLOUD, { W: 'Z', c: 'z' }),
  },
  // 4 gece
  {
    bands: ['#0B1030', '#10173B', '#162047', '#1D2955', '#253364'],
    cloud: recolor(CLOUD, { W: 'X', c: 'x' }),
    night: true,
  },
];
