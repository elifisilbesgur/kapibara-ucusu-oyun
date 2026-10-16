import type { ComponentType } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { Sky } from '@/art/skies';
import type { PassengerKind } from '@/game/passengers';
import type { GamePhase } from '@/game/phase';
import type { Obstacle } from '@/game/spawner';

export type ModeId = 'capybara' | 'burak';

// --- Kurallar: sadece sayı ve liste. Oyun döngüsü (UI thread) bunları okur.

// currency: kumbaraya giden para (portakal), passenger: sırta biner, part: puan + kasa,
// stop: yolcu durağı (değince yolcular iner, sırttaki bonus kasaya girer)
export type ItemRole = 'currency' | 'passenger' | 'part' | 'stop';

export type ItemRule = {
  id: string;
  role: ItemRole;
  chance: number; // Bir engelin önünde bu eşyanın çıkma olasılığı (0-1)
  points: number; // Toplayınca kazanılan puan
  box?: { width: number; height: number }; // Toplama kutusu (dp); yoksa ITEM_SIZE kare
};

// Seviye: skor eşiği geçilince uçuş hissi ve hız değişir
export type LevelRule = {
  name: string;
  minScore: number;
  gravity: number; // GRAVITY ile çarpılır
  jump: number; // JUMP_VELOCITY ile çarpılır
  maxFall: number; // En yüksek düşüş hızı (dp/s)
  speed: number; // Engel kayma hızı çarpanı
};

export type ModeRules = {
  hitbox: { width: number; height: number }; // Oyuncunun çarpışma kutusu (dp)
  gap: { start: number; min: number; shrinkPerPoint: number }; // Geçit boyu skorla daralır
  // Engelin çarpışma kutusu görselden bu kadar küçük (dp): x yanlardan, y geçide bakan uçtan
  obstacleInset: { x: number; y: number };
  pointsPerGate: number; // Geçilen her engel
  items: ItemRule[];
  itemInGapChance: number; // Eşyanın engellerin arası yerine geçidin içinde çıkma olasılığı
  levels: LevelRule[];
  joyTime: number; // Toplayınca sevinme (gülümseme) süresi (sn)
  floatLift: number; // Suda yüzerken gövde ortası su yüzeyinin bu kadar üstünde (dp)
  // Kasa (isteğe bağlı): bu parçaların her birinden en az biri toplanınca bonus
  kit?: { parts: string[]; bonus: number };
  // Uykululuk (isteğe bağlı): para (portakal) yemeden geçen sürede 0 → 1 birikir, para yiyince sıfırlanır.
  // fullAfter: kaç saniyede tamamen uykulu; tam uykuluyken zıplama jumpLoss kadar zayıf,
  // yerçekimi gravityGain kadar güçlü (ör. 0.12 → %12)
  drowsiness?: { fullAfter: number; jumpLoss: number; gravityGain: number };
  // Rüzgâr (isteğe bağlı): skor minScore'u geçince engellerin `chance` kadarı rüzgârlı olur;
  // rüzgâr bölgesinde oyuncu accel (dp/s²) ile yukarı ya da aşağı itilir
  wind?: { chance: number; accel: number; minScore: number };
};

// --- Görünüm: React bileşenleri. Sadece çizim tarafı kullanır.

export type PlayerProps = {
  x: number;
  y: SharedValue<number>;
  velocity: SharedValue<number>;
  thrust: SharedValue<number>;
  propellerPhase: SharedValue<number>;
  clock: SharedValue<number>;
  passengers: SharedValue<PassengerKind[]>;
  shieldTime: SharedValue<number>;
  level: SharedValue<number>;
  phase: SharedValue<GamePhase>;
  joyTime: SharedValue<number>;
  drowsiness: SharedValue<number>; // 0 = dinç, 1 = uyuyor
};

export type ObstacleViewProps = {
  obstacles: SharedValue<Obstacle[]>;
  index: number;
  screenHeight: number;
  clock: SharedValue<number>; // Yaprak titremesi gibi animasyonlar için
};

export type ItemViewProps = {
  obstacles: SharedValue<Obstacle[]>;
  index: number;
  clock: SharedValue<number>;
};

export type ModeView = {
  Player: ComponentType<PlayerProps>;
  Obstacle: ComponentType<ObstacleViewProps>;
  Item: ComponentType<ItemViewProps>;
  skies: Sky[]; // Seviye başına gökyüzü (tek eleman = hiç değişmez)
};

export type GameMode = {
  id: ModeId;
  name: string;
  rules: ModeRules;
  view: ModeView;
};
