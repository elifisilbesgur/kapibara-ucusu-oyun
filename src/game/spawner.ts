import {
  GAP_MARGIN,
  OBSTACLE_GAP,
  OBSTACLE_SPACING,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
  ITEM_Y_SPREAD,
  ORANGE_CHANCE,
  PASSENGER_CHANCE,
} from './constants';
import { randomPassenger, type PassengerKind } from './passengers';

// Engelin önündeki boşlukta ne var?
export type ItemKind = 'none' | 'orange' | PassengerKind;

// Bir engel = üst ve alt bambu çifti + önündeki boşlukta (belki) bir portakal ya da yolcu.
// x: engelin sol kenarı, gapY: geçidin ortasının yüksekliği,
// passed: oyuncu bu engeli geçti mi (puan bir kez sayılsın diye),
// item / itemY: önündeki şey (toplanınca 'none') ve yüksekliği.
export type Obstacle = {
  x: number;
  gapY: number;
  passed: boolean;
  item: ItemKind;
  itemY: number;
};

// Ekranı dolduracak kadar engel + bir fazlası: böylece en arkaya taşınan engelin
// önündeki portakal/yolcu da ekranın dışında belirir.
export function obstacleCount(screenWidth: number): number {
  'worklet';
  return Math.ceil((screenWidth + OBSTACLE_WIDTH + OBSTACLE_SPACING) / OBSTACLE_SPACING);
}

// Geçidin ortası için ekranın üst/alt kenarına fazla yaklaşmayan rastgele bir yükseklik.
export function randomGapY(screenHeight: number): number {
  'worklet';
  const min = GAP_MARGIN + OBSTACLE_GAP / 2;
  const max = screenHeight - GAP_MARGIN - OBSTACLE_GAP / 2;
  return min + Math.random() * (max - min);
}

// Bir zar at: önce yolcu mu, sonra portakal mı, yoksa boş mu?
function randomItem(): ItemKind {
  'worklet';
  const roll = Math.random();
  if (roll < PASSENGER_CHANCE) return randomPassenger();
  if (roll < PASSENGER_CHANCE + ORANGE_CHANCE) return 'orange';
  return 'none';
}

// Yeni bir engel: rastgele geçit, belki bir portakal/yolcu (geçidin hizasına yakın).
function newObstacle(x: number, screenHeight: number): Obstacle {
  'worklet';
  const gapY = randomGapY(screenHeight);
  const itemY = gapY + (Math.random() * 2 - 1) * ITEM_Y_SPREAD;
  return {
    x,
    gapY,
    passed: false,
    item: randomItem(),
    itemY: Math.min(screenHeight - GAP_MARGIN, Math.max(GAP_MARGIN, itemY)),
  };
}

// Başlangıç dizilimi: ilk engel (ve önündeki şey) ekranın hemen sağında, diğerleri arkasında.
export function createObstacles(screenWidth: number, screenHeight: number): Obstacle[] {
  'worklet';
  const firstX = screenWidth + OBSTACLE_SPACING / 2;
  const obstacles: Obstacle[] = [];
  for (let i = 0; i < obstacleCount(screenWidth); i++) {
    obstacles.push(newObstacle(firstX + i * OBSTACLE_SPACING, screenHeight));
  }
  return obstacles;
}

// Her karede engelleri sola kaydırır. Soldan tamamen çıkan engel,
// sıranın en arkasına (sağa) taşınır ve yeniden rastgele kurulur.
export function stepObstacles(obstacles: Obstacle[], dt: number, screenHeight: number): Obstacle[] {
  'worklet';
  const loopLength = obstacles.length * OBSTACLE_SPACING;
  return obstacles.map((obstacle) => {
    const x = obstacle.x - OBSTACLE_SPEED * dt;
    if (x + OBSTACLE_WIDTH < 0) {
      return newObstacle(x + loopLength, screenHeight);
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
