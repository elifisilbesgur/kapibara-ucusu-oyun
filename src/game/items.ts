import { intersects, type Box } from './collision';
import {
  ITEM_SIZE,
  MAGNET_RANGE,
  MAX_PASSENGERS,
  OBSTACLE_SPACING,
  OBSTACLE_WIDTH,
} from './constants';
import type { PassengerKind } from './passengers';
import type { Obstacle } from './spawner';

// Portakal/yolcu, engelin önündeki boşluğun tam ortasında durur
// (önceki engelin sağ kenarı ile bu engelin sol kenarı arası).
export function itemCenterX(obstacle: Obstacle): number {
  'worklet';
  return obstacle.x - (OBSTACLE_SPACING - OBSTACLE_WIDTH) / 2;
}

// Toplama kutusu. `grow` > 0 ise kutu her yönde o kadar büyür (maymunun mıknatısı).
export function itemBox(obstacle: Obstacle, grow = 0): Box {
  'worklet';
  const half = ITEM_SIZE / 2 + grow;
  return {
    x: itemCenterX(obstacle) - half,
    y: obstacle.itemY - half,
    width: half * 2,
    height: half * 2,
  };
}

// Oyuncunun değdiği portakal ve yolcuları toplar.
// Maymun sırttaysa portakallar uzaktan da toplanır; sırt doluysa yolcu alınmaz.
export function collectItems(
  obstacles: Obstacle[],
  player: Box,
  passengers: PassengerKind[],
): { obstacles: Obstacle[]; oranges: number; newPassengers: PassengerKind[] } {
  'worklet';
  const magnet = passengers.includes('monkey') ? MAGNET_RANGE : 0;
  let room = MAX_PASSENGERS - passengers.length;
  let oranges = 0;
  const newPassengers: PassengerKind[] = [];

  const updated = obstacles.map((obstacle) => {
    const { item } = obstacle;
    if (item === 'none') return obstacle;

    if (item === 'orange') {
      if (!intersects(player, itemBox(obstacle, magnet))) return obstacle;
      oranges++;
      return { ...obstacle, item: 'none' as const };
    }

    // Buraya geldiyse item bir yolcu
    if (room === 0 || !intersects(player, itemBox(obstacle))) return obstacle;
    room--;
    newPassengers.push(item);
    return { ...obstacle, item: 'none' as const };
  });

  return { obstacles: updated, oranges, newPassengers };
}
