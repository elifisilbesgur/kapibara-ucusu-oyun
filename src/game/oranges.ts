import { intersects, type Box } from './collision';
import { OBSTACLE_SPACING, OBSTACLE_WIDTH, ORANGE_SIZE } from './constants';
import type { Obstacle } from './spawner';

// Portakal, engelin önündeki boşluğun tam ortasında durur
// (önceki engelin sağ kenarı ile bu engelin sol kenarı arası).
export function orangeCenterX(obstacle: Obstacle): number {
  'worklet';
  return obstacle.x - (OBSTACLE_SPACING - OBSTACLE_WIDTH) / 2;
}

export function orangeBox(obstacle: Obstacle): Box {
  'worklet';
  return {
    x: orangeCenterX(obstacle) - ORANGE_SIZE / 2,
    y: obstacle.orangeY - ORANGE_SIZE / 2,
    width: ORANGE_SIZE,
    height: ORANGE_SIZE,
  };
}

// Oyuncunun değdiği portakalları toplar. Kaç tane toplandığını döndürür.
export function collectOranges(
  obstacles: Obstacle[],
  player: Box,
): { obstacles: Obstacle[]; collected: number } {
  'worklet';
  let collected = 0;
  const updated = obstacles.map((obstacle) => {
    if (obstacle.hasOrange && intersects(player, orangeBox(obstacle))) {
      collected++;
      return { ...obstacle, hasOrange: false };
    }
    return obstacle;
  });
  return { obstacles: updated, collected };
}
