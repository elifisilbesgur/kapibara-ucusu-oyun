import { OBSTACLE_GAP, OBSTACLE_WIDTH, PLAYER_HITBOX_INSET } from './constants';
import type { Obstacle } from './spawner';

// Ekrandaki bir dikdörtgen: sol üst köşesi (x, y) ve boyutları.
export type Box = { x: number; y: number; width: number; height: number };

// İki dikdörtgen üst üste biniyor mu?
export function intersects(a: Box, b: Box): boolean {
  'worklet';
  return (
    a.x < b.x + b.width && // a'nın solu, b'nin sağından önce
    a.x + a.width > b.x && // a'nın sağı, b'nin solundan sonra
    a.y < b.y + b.height && // a'nın üstü, b'nin altından yukarıda
    a.y + a.height > b.y // a'nın altı, b'nin üstünden aşağıda
  );
}

// Oyuncunun çarpışma kutusu: dairenin içine oturan, biraz küçültülmüş kare.
export function playerBox(cx: number, cy: number, radius: number): Box {
  'worklet';
  const half = radius - PLAYER_HITBOX_INSET;
  return { x: cx - half, y: cy - half, width: half * 2, height: half * 2 };
}

// Bir engelin üst ve alt bambusu iki ayrı kutu.
export function obstacleBoxes(obstacle: Obstacle, screenHeight: number): [Box, Box] {
  'worklet';
  const topHeight = obstacle.gapY - OBSTACLE_GAP / 2;
  const bottomY = obstacle.gapY + OBSTACLE_GAP / 2;
  return [
    { x: obstacle.x, y: 0, width: OBSTACLE_WIDTH, height: topHeight },
    { x: obstacle.x, y: bottomY, width: OBSTACLE_WIDTH, height: screenHeight - bottomY },
  ];
}

export function hitsAnyObstacle(player: Box, obstacles: Obstacle[], screenHeight: number): boolean {
  'worklet';
  for (const obstacle of obstacles) {
    const [top, bottom] = obstacleBoxes(obstacle, screenHeight);
    if (intersects(player, top) || intersects(player, bottom)) return true;
  }
  return false;
}

// Yere ya da tavana değdi mi?
export function isOutOfBounds(player: Box, screenHeight: number): boolean {
  'worklet';
  return player.y < 0 || player.y + player.height > screenHeight;
}
