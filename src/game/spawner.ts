import {
  GAP_MARGIN,
  OBSTACLE_GAP,
  OBSTACLE_SPACING,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
} from './constants';

// Bir engel = üst ve alt bambu çifti. Sadece iki sayı yeterli:
// x: engelin sol kenarı, gapY: geçidin ortasının yüksekliği.
export type Obstacle = { x: number; gapY: number };

// Ekranı dolduracak kadar engel var; fazlası gereksiz.
export function obstacleCount(screenWidth: number): number {
  return Math.ceil((screenWidth + OBSTACLE_WIDTH) / OBSTACLE_SPACING);
}

// Geçidin ortası için ekranın üst/alt kenarına fazla yaklaşmayan rastgele bir yükseklik.
export function randomGapY(screenHeight: number): number {
  'worklet';
  const min = GAP_MARGIN + OBSTACLE_GAP / 2;
  const max = screenHeight - GAP_MARGIN - OBSTACLE_GAP / 2;
  return min + Math.random() * (max - min);
}

// Başlangıç dizilimi: ilk engel ekranın hemen sağında, diğerleri arkasında sıralı.
export function createObstacles(screenWidth: number, screenHeight: number): Obstacle[] {
  'worklet';
  const obstacles: Obstacle[] = [];
  for (let i = 0; i < obstacleCount(screenWidth); i++) {
    obstacles.push({ x: screenWidth + i * OBSTACLE_SPACING, gapY: randomGapY(screenHeight) });
  }
  return obstacles;
}

// Her karede engelleri sola kaydırır. Soldan tamamen çıkan engel,
// sıranın en arkasına (sağa) taşınır ve yeni bir geçit yüksekliği alır.
export function stepObstacles(obstacles: Obstacle[], dt: number, screenHeight: number): Obstacle[] {
  'worklet';
  const loopLength = obstacles.length * OBSTACLE_SPACING;
  return obstacles.map((obstacle) => {
    const x = obstacle.x - OBSTACLE_SPEED * dt;
    if (x + OBSTACLE_WIDTH < 0) {
      return { x: x + loopLength, gapY: randomGapY(screenHeight) };
    }
    return { x, gapY: obstacle.gapY };
  });
}
