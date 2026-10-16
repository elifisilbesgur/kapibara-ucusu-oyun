import { LEAF_FLUTTER_FPS, OBSTACLE_SPACING, OBSTACLE_WIDTH, WIND_FADE } from './constants';
import type { Obstacle } from './spawner';

// Rüzgârlı bir engelin bölgesi: engelin ortasından iki yana yarım engel aralığı.
// Bölgeler yan yana dizilir; oyuncu hangisinin içindeyse o engelin rüzgârını hisseder.

// Oyuncunun bulunduğu x'teki rüzgâr: -1 (tam yukarı) ile +1 (tam aşağı) arası, 0 = sakin.
// Bölgenin kenarına yakınken WIND_FADE mesafesinde yavaşça güçlenir.
export function windAt(obstacles: Obstacle[], x: number): number {
  'worklet';
  const half = OBSTACLE_SPACING / 2;
  for (const obstacle of obstacles) {
    if (obstacle.wind === 0) continue;
    const distance = Math.abs(x - (obstacle.x + OBSTACLE_WIDTH / 2));
    if (distance < half) {
      return obstacle.wind * Math.min(1, (half - distance) / WIND_FADE);
    }
  }
  return 0;
}

// Bambu yaprağının karesi (art/world.ts'teki LEAF_FRAMES sırası):
// 0 sakin, 1 sakin-ters, 2-3 yukarı rüzgâr (titreme), 4-5 aşağı rüzgâr (titreme).
// flipped: üst kamış ters çizildiği için içindeki "yukarı" ekranda aşağıdır; ekrandaki
// yöne göre seçebilmek için yönü çeviririz.
export function leafFrame(wind: number, flipped: boolean, time: number): number {
  'worklet';
  const local = flipped ? -wind : wind;
  if (local === 0) return flipped ? 1 : 0; // sakin: ekranda hep aşağı sarksın
  const flutter = Math.floor(time * LEAF_FLUTTER_FPS) % 2;
  return (local < 0 ? 2 : 4) + flutter;
}
