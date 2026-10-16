import { BURAK_PIXEL, PART_SPRITES } from '@/art/images';
import { OFFICE_SKY } from '@/art/skies';
import { BurakPlayer } from '@/components/BurakPlayer';
import { CableObstacle } from '@/components/CableObstacle';
import { PartItem } from '@/components/PartItem';
import { PIXEL_SIZE } from '@/game/constants';

import type { GameMode } from './types';

// Parçanın toplama kutusu = görselin ekrandaki boyu (2x)
const partBox = (id: string) => ({
  width: PART_SPRITES[id].width * BURAK_PIXEL,
  height: PART_SPRITES[id].height * BURAK_PIXEL,
});

// Burak Uçuyor: CAT6 kablolar arasından uç, bilgisayar parçası topla, kasayı tamamla.
export const BURAK_MODE: GameMode = {
  id: 'burak',
  name: 'Burak Uçuyor',
  rules: {
    // Gövde + kafa (jetpack hariç), her yandan 1-2 piksel tolerans: 13 x 28 piksel (Burak 2x çizilir)
    hitbox: { width: 13 * BURAK_PIXEL, height: 28 * BURAK_PIXEL },
    // Geçit başta rahat, her puanda 1 dp daralır, 200'ün altına inmez
    gap: { start: 260, min: 200, shrinkPerPoint: 1 },
    // Kablo karosu 18 piksel ama konnektör 13, gövde 9 piksel: yandan 4, uçtan 2 piksel tolerans
    obstacleInset: { x: 4 * PIXEL_SIZE, y: 2 * PIXEL_SIZE },
    pointsPerGate: 1,
    // Her engelin önünde %60 ihtimalle bir parça; parçalar arasında RAM %40, SSD %30, CPU %20, GPU %10
    items: [
      { id: 'ram', role: 'part', chance: 0.24, points: 1, box: partBox('ram') },
      { id: 'ssd', role: 'part', chance: 0.18, points: 2, box: partBox('ssd') },
      { id: 'cpu', role: 'part', chance: 0.12, points: 3, box: partBox('cpu') },
      { id: 'gpu', role: 'part', chance: 0.06, points: 5, box: partBox('gpu') },
    ],
    itemInGapChance: 0.3, // Parçaların %30'u kabloların arasındaki geçidin içinde
    // Tek seviye: Burak evrimleşmez, gökyüzü değişmez
    levels: [{ name: 'Burak', minScore: 0, gravity: 1, jump: 1, maxFall: 900, speed: 1 }],
    joyTime: 0.5, // Parçaya değince 500 ms gülme
    floatLift: 13, // Suda dik sallanırken bacaklar suyun içinde
    // Kasa: her türden en az bir parça → +10 bonus, kutlama, kasa sıfırlanır
    kit: { parts: ['cpu', 'ram', 'gpu', 'ssd'], bonus: 10 },
  },
  view: {
    Player: BurakPlayer,
    Obstacle: CableObstacle,
    Item: PartItem,
    skies: [OFFICE_SKY],
  },
};
