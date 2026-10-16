import { SKIES } from '@/art/skies';
import { BurakPlayer } from '@/components/BurakPlayer';
import { CableObstacle } from '@/components/CableObstacle';
import { PIXEL_SIZE } from '@/game/constants';

import type { GameMode, ItemViewProps } from './types';

// B4'te bilgisayar parçalarıyla değişecek
function NoItem(_props: ItemViewProps) {
  return null;
}

// Burak Uçuyor: CAT6 kablolar arasından uç, bilgisayar parçası topla, kasayı tamamla.
export const BURAK_MODE: GameMode = {
  id: 'burak',
  name: 'Burak Uçuyor',
  rules: {
    // Gövde + kafa (jetpack hariç), her yandan 1-2 piksel tolerans: 13 x 28 piksel
    hitbox: { width: 13 * PIXEL_SIZE, height: 28 * PIXEL_SIZE },
    // Geçit başta rahat, her puanda 1 dp daralır, 230'un altına inmez
    gap: { start: 290, min: 230, shrinkPerPoint: 1 },
    // Kablo karosu 18 piksel ama konnektör 13, gövde 9 piksel: yandan 4, uçtan 2 piksel tolerans
    obstacleInset: { x: 4 * PIXEL_SIZE, y: 2 * PIXEL_SIZE },
    pointsPerGate: 1,
    items: [],
    itemInGapChance: 0,
    // Tek seviye: Burak evrimleşmez, gökyüzü değişmez
    levels: [{ name: 'Burak', minScore: 0, gravity: 1, jump: 1, maxFall: 900, speed: 1 }],
    joyTime: 0.5, // Parçaya değince 500 ms gülme
    floatLift: 22, // Suda dik sallanırken bacaklar suyun içinde
  },
  view: {
    Player: BurakPlayer,
    Obstacle: CableObstacle,
    Item: NoItem,
    skies: [SKIES[0]],
  },
};
