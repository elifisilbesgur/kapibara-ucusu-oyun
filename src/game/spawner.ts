import {
  GAP_MARGIN,
  OBSTACLE_GAP,
  OBSTACLE_SPACING,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
} from './constants';

// Bir engel = üst ve alt bambu çifti.
// x: engelin sol kenarı, gapY: geçidin ortasının yüksekliği,
// passed: oyuncu bu engeli geçti mi (puan bir kez sayılsın diye).
export type Obstacle = { x: number; gapY: number; passed: boolean };

// Ekranı dolduracak kadar engel var; fazlası gereksiz.
export function obstacleCount(screenWidth: number): number {
  'worklet';
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
    obstacles.push({
      x: screenWidth + i * OBSTACLE_SPACING,
      gapY: randomGapY(screenHeight),
      passed: false,
    });
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
      return { x: x + loopLength, gapY: randomGapY(screenHeight), passed: false };
    }
    return { ...obstacle, x };
  });
}

// Sağ kenarı oyuncunun soluna geçen her engel bir puan. Kaç yeni puan kazanıldığını döndürür.
export function markPassed(
  obstacles: Obstacle[],
  playerLeft: number,
): { obstacles: Obstacle[]; newlyPassed: number } {
  'worklet';
  let newlyPassed = 0;
  const updated = obstacles.map((obstacle) => {
    if (!obstacle.passed && obstacle.x + OBSTACLE_WIDTH < playerLeft) {
      newlyPassed++;
      return { ...obstacle, passed: true };
    }
    return obstacle;
  });
  return { obstacles: updated, newlyPassed };
}
