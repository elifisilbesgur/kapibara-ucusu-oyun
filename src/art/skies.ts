import { CURSOR, FLOPPY, LAPTOP, MONITOR, SERVER, TOWER } from './office';
import type { Sprite } from './palette';
import { CLOUD, recolor } from './world';

// Bir gökyüzü: yukarıdan aşağı renk bantları + süzülen şeyler (bulut ya da başka) + isteğe bağlı
// deniz kıyısı silüeti.
export type Sky = {
  bands: string[];
  floaters: Sprite[]; // Bulut yerlerinde sırayla bunlar çizilir
  skyline?: Sprite[]; // Deniz kıyısında soldan sağa, ekran dolana kadar tekrar ederek dizilir
  night?: boolean; // ay ve yıldızlar çıksın mı
};

export const SKIES: Sky[] = [
  // 0 sabah
  {
    bands: ['#7FC8E3', '#94D3E9', '#AADDEE', '#BFE6F2', '#D3EEF5'],
    floaters: [CLOUD],
  },
  // 1 öğle
  {
    bands: ['#3E9BE0', '#55AAE6', '#6DBAEC', '#86C9F1', '#A0D7F5'],
    floaters: [CLOUD],
  },
  // 2 akşam üstü
  {
    bands: ['#E9785A', '#F08F63', '#F5A86E', '#F9C27F', '#FCDA98'],
    floaters: [recolor(CLOUD, { W: 'Q', c: 'j' })],
  },
  // 3 alacakaranlık
  {
    bands: ['#2F2A63', '#4A367A', '#6B468E', '#94589A', '#BF6C9C'],
    floaters: [recolor(CLOUD, { W: 'Z', c: 'z' })],
  },
  // 4 gece
  {
    bands: ['#0B1030', '#10173B', '#162047', '#1D2955', '#253364'],
    floaters: [recolor(CLOUD, { W: 'X', c: 'x' })],
    night: true,
  },
];

// Burak Uçuyor: teknolojik açık mavi gökyüzü, süzülen disket/imleç/monitör, kıyıda bilgisayarlar
export const OFFICE_SKY: Sky = {
  bands: ['#A7D7EA', '#B3DDEE', '#BFE3F1', '#CBE9F4', '#D7EFF7'],
  floaters: [FLOPPY, CURSOR, MONITOR, FLOPPY, CURSOR],
  skyline: [SERVER, MONITOR, TOWER, LAPTOP, SERVER, TOWER, MONITOR, LAPTOP],
};
