import { SKIES } from '@/art/skies';
import { Capybara } from '@/components/Capybara';
import { Item } from '@/components/Item';
import { Obstacle } from '@/components/Obstacle';

import type { GameMode } from './types';

// Kapibara modu: bambular, portakal kumbarası, sırta binen yolcular,
// skorla evrimleşen modlar ve sabahtan geceye değişen gökyüzü.
export const CAPYBARA_MODE: GameMode = {
  id: 'capybara',
  name: 'Kapibara',
  rules: {
    hitbox: { width: 40, height: 30 }, // Gövdeden biraz küçük (affedici olsun)
    gap: { start: 230, min: 230, shrinkPerPoint: 0 }, // Geçit hiç daralmaz; zorluk modlardan gelir
    obstacleInset: { x: 0, y: 0 },
    pointsPerGate: 10, // Yolcu çarpanıyla çarpılır
    items: [
      { id: 'orange', role: 'currency', chance: 0.5, points: 0 },
      { id: 'bird', role: 'passenger', chance: 0.05, points: 0 },
      { id: 'turtle', role: 'passenger', chance: 0.05, points: 0 },
      { id: 'monkey', role: 'passenger', chance: 0.05, points: 0 },
      // İskele: 14x20 piksel (3x) → 42x60 dp; ona değmek için suya yaklaşmak gerekir
      { id: 'stop', role: 'stop', chance: 0.1, points: 0, box: { width: 42, height: 60 } },
    ],
    itemInGapChance: 0,
    // Skor eşiği geçilince kapibara yeni moda evrimleşir.
    // gravity/jump: GRAVITY ve JUMP_VELOCITY ile çarpılır. maxFall: en yüksek düşüş hızı.
    // speed: bambuların kayma hızı çarpanı (oyun yavaş yavaş hızlanır).
    levels: [
      { name: 'Yaprak kanat', minScore: 0, gravity: 0.85, jump: 0.85, maxFall: 700, speed: 1 },
      { name: 'Balon', minScore: 25, gravity: 0.6, jump: 0.72, maxFall: 450, speed: 1.06 },
      { name: 'Pervaneli şapka', minScore: 75, gravity: 0.95, jump: 0.95, maxFall: 850, speed: 1.12 },
      { name: 'Kuş kanatları', minScore: 150, gravity: 1.05, jump: 1.05, maxFall: 900, speed: 1.18 },
      { name: 'Jetpack + şapka', minScore: 300, gravity: 1.1, jump: 1.1, maxFall: 950, speed: 1.25 },
    ],
    joyTime: 0.9, // Portakal yiyince minicik gülümseme
    floatLift: 18, // Sırtüstü yüzerken
  },
  view: {
    Player: Capybara,
    Obstacle,
    Item,
    skies: SKIES,
  },
};
