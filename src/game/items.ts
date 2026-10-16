import type { ItemRule, ModeRules } from '@/modes/types';

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

// Eşya ya engelin önündeki boşluğun tam ortasında (önceki engelin sağ kenarı ile bu engelin
// sol kenarı arası) ya da geçidin içinde, engelle aynı hizada durur.
export function itemCenterX(obstacle: Obstacle): number {
  'worklet';
  if (obstacle.itemInGap) return obstacle.x + OBSTACLE_WIDTH / 2;
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

function findItem(rules: ModeRules, id: string): ItemRule | undefined {
  'worklet';
  for (const item of rules.items) {
    if (item.id === id) return item;
  }
  return undefined;
}

// Oyuncunun değdiği eşyaları toplar ve rollerine göre ayırır:
// currency → kumbaraya, passenger → sırta (sırt doluysa alınmaz), part → puan.
// Maymun sırttaysa para (portakal) uzaktan da toplanır.
export function collectItems(
  obstacles: Obstacle[],
  player: Box,
  passengers: PassengerKind[],
  rules: ModeRules,
): {
  obstacles: Obstacle[];
  currency: number;
  newPassengers: PassengerKind[];
  parts: string[];
  partPoints: number;
} {
  'worklet';
  const magnet = passengers.includes('monkey') ? MAGNET_RANGE : 0;
  let room = MAX_PASSENGERS - passengers.length;
  let currency = 0;
  let partPoints = 0;
  const newPassengers: PassengerKind[] = [];
  const parts: string[] = [];

  const updated = obstacles.map((obstacle) => {
    const item = findItem(rules, obstacle.item);
    if (!item) return obstacle; // 'none'

    if (item.role === 'currency') {
      if (!intersects(player, itemBox(obstacle, magnet))) return obstacle;
      currency++;
    } else if (item.role === 'passenger') {
      if (room === 0 || !intersects(player, itemBox(obstacle))) return obstacle;
      room--;
      newPassengers.push(item.id as PassengerKind);
    } else {
      if (!intersects(player, itemBox(obstacle))) return obstacle;
      parts.push(item.id);
      partPoints += item.points;
    }
    return { ...obstacle, item: 'none' };
  });

  return { obstacles: updated, currency, newPassengers, parts, partPoints };
}
