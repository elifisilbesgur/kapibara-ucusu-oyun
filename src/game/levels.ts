import type { LevelRule } from '@/modes/types';

import { LEVEL_TRANSITION } from './constants';

// Skora göre seviye: eşiği geçilen en yüksek seviye.
export function levelFor(score: number, levels: LevelRule[]): number {
  'worklet';
  let level = 0;
  for (let i = 0; i < levels.length; i++) {
    if (score >= levels[i].minScore) level = i;
  }
  return level;
}

// Gökyüzü geçişi için yumuşak seviye: 1'den 2'ye anında değil, 1.0 → 1.3 → 1.7 → 2.0 diye ilerler.
export function stepLevelBlend(blend: number, level: number, dt: number): number {
  'worklet';
  return Math.min(level, blend + dt / LEVEL_TRANSITION);
}
