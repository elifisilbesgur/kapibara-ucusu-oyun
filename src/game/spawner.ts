import type { ItemRule, ModeRules } from '@/modes/types';

import {
  DOCK_LIFT,
  GAP_MARGIN,
  ITEM_SIZE,
  ITEM_Y_SPREAD,
  OBSTACLE_SPACING,
  OBSTACLE_SPEED,
  OBSTACLE_WIDTH,
} from './constants';

// Bir engel = üst ve alt parça (bambu/kablo) + önündeki boşlukta belki bir eşya.
// x: sol kenar, gapY/gapSize: geçidin ortası ve boyu (skorla daraldığı için her engelin kendi boyu),
// passed: oyuncu geçti mi (puan bir kez sayılsın), item: eşyanın id'si ('none' = boş),
// itemY: eşyanın yüksekliği, itemInGap: eşya engellerin arasında değil geçidin içinde mi.
export type Obstacle = {
  x: number;
  gapY: number;
  gapSize: number;
  passed: boolean;
  item: string;
  itemY: number;
  itemInGap: boolean;
};

// Ekranı dolduracak kadar engel + bir fazlası: böylece en arkaya taşınan engelin
// önündeki eşya da ekranın dışında belirir.
export function obstacleCount(screenWidth: number): number {
  'worklet';
  return Math.ceil((screenWidth + OBSTACLE_WIDTH + OBSTACLE_SPACING) / OBSTACLE_SPACING);
}

// Skor arttıkça geçit daralır, ama alt sınırın altına inmez.
export function gapSizeFor(score: number, rules: ModeRules): number {
  'worklet';
  return Math.max(rules.gap.min, rules.gap.start - score * rules.gap.shrinkPerPoint);
}

// Geçidin ortası için ekranın üst/alt kenarına fazla yaklaşmayan rastgele bir yükseklik.
export function randomGapY(screenHeight: number, gapSize: number): number {
  'worklet';
  const min = GAP_MARGIN + gapSize / 2;
  const max = screenHeight - GAP_MARGIN - gapSize / 2;
  return min + Math.random() * (max - min);
}

// Bir zar at: modun eşya listesindeki olasılıklara göre bir eşya ya da hiçbiri (undefined).
// Sayı doğrusu dilimlere bölünür: [portakal 0.5][kuş 0.05][kaplumbağa 0.05]...[boş]
function randomItem(rules: ModeRules): ItemRule | undefined {
  'worklet';
  let roll = Math.random();
  for (const item of rules.items) {
    if (roll < item.chance) return item;
    roll -= item.chance;
  }
  return undefined;
}

// Yeni bir engel: rastgele geçit, belki bir eşya (geçidin hizasına yakın ya da içinde).
function newObstacle(x: number, screenHeight: number, gapSize: number, rules: ModeRules): Obstacle {
  'worklet';
  const gapY = randomGapY(screenHeight, gapSize);
  const item = randomItem(rules);

  // Durak (iskele) hep suyun üstünde, engellerin arasında durur
  if (item?.role === 'stop') {
    return {
      x,
      gapY,
      gapSize,
      passed: false,
      item: item.id,
      itemY: screenHeight - DOCK_LIFT,
      itemInGap: false,
    };
  }

  const itemInGap = Math.random() < rules.itemInGapChance;
  // Geçidin içindeyse kenarlara değmesin diye yayılım geçitle sınırlı
  const spread = itemInGap ? Math.max(0, gapSize / 2 - ITEM_SIZE) : ITEM_Y_SPREAD;
  const itemY = gapY + (Math.random() * 2 - 1) * spread;
  return {
    x,
    gapY,
    gapSize,
    passed: false,
    item: item?.id ?? 'none',
    itemY: Math.min(screenHeight - GAP_MARGIN, Math.max(GAP_MARGIN, itemY)),
    itemInGap,
  };
}

// Başlangıç dizilimi: ilk engel (ve önündeki eşya) ekranın hemen sağında, diğerleri arkasında.
export function createObstacles(
  screenWidth: number,
  screenHeight: number,
  rules: ModeRules,
): Obstacle[] {
  'worklet';
  const firstX = screenWidth + OBSTACLE_SPACING / 2;
  const obstacles: Obstacle[] = [];
  for (let i = 0; i < obstacleCount(screenWidth); i++) {
    obstacles.push(newObstacle(firstX + i * OBSTACLE_SPACING, screenHeight, rules.gap.start, rules));
  }
  return obstacles;
}

// Her karede engelleri sola kaydırır. Soldan tamamen çıkan engel, sıranın en arkasına
// (sağa) taşınır ve o anki geçit boyuyla (gapSize) yeniden rastgele kurulur.
// speedScale: seviyeyle artan hız çarpanı.
export function stepObstacles(
  obstacles: Obstacle[],
  dt: number,
  screenHeight: number,
  rules: ModeRules,
  speedScale: number,
  gapSize: number,
): Obstacle[] {
  'worklet';
  const loopLength = obstacles.length * OBSTACLE_SPACING;
  return obstacles.map((obstacle) => {
    const x = obstacle.x - OBSTACLE_SPEED * speedScale * dt;
    if (x + OBSTACLE_WIDTH < 0) {
      return newObstacle(x + loopLength, screenHeight, gapSize, rules);
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
