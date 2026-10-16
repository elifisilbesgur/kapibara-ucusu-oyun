import { OBSTACLE_WIDTH } from './constants';
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

// Oyuncunun çarpışma kutusu: gövdeye oturan, ortası (cx, cy) olan dikdörtgen (boyu moddan).
export function playerBox(cx: number, cy: number, size: { width: number; height: number }): Box {
  'worklet';
  return {
    x: cx - size.width / 2,
    y: cy - size.height / 2,
    width: size.width,
    height: size.height,
  };
}

// Bir engelin üst ve alt parçası iki ayrı kutu.
// inset: kutular görselden bu kadar küçük (x: yanlardan, y: geçide bakan uçtan)
// → "değmedim ki" hissi olmasın.
export type Inset = { x: number; y: number };
const NO_INSET: Inset = { x: 0, y: 0 };

export function obstacleBoxes(
  obstacle: Obstacle,
  screenHeight: number,
  inset: Inset = NO_INSET,
): [Box, Box] {
  'worklet';
  const topHeight = obstacle.gapY - obstacle.gapSize / 2 - inset.y;
  const bottomY = obstacle.gapY + obstacle.gapSize / 2 + inset.y;
  const x = obstacle.x + inset.x;
  const width = OBSTACLE_WIDTH - inset.x * 2;
  return [
    { x, y: 0, width, height: topHeight },
    { x, y: bottomY, width, height: screenHeight - bottomY },
  ];
}

export function hitsAnyObstacle(
  player: Box,
  obstacles: Obstacle[],
  screenHeight: number,
  inset: Inset = NO_INSET,
): boolean {
  'worklet';
  for (const obstacle of obstacles) {
    const [top, bottom] = obstacleBoxes(obstacle, screenHeight, inset);
    if (intersects(player, top) || intersects(player, bottom)) return true;
  }
  return false;
}

// Yere ya da tavana değdi mi?
export function isOutOfBounds(player: Box, screenHeight: number): boolean {
  'worklet';
  return player.y < 0 || player.y + player.height > screenHeight;
}
