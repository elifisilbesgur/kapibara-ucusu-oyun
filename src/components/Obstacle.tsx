import { Group, Rect } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { BAMBOO_PIXEL_WIDTH, BAMBOO_SEGMENT_HEIGHT, LEAF_FRAMES, bambooStalk } from '@/art/world';
import { PixelSprite, SpriteFrames } from '@/components/PixelSprite';
import { OBSTACLE_SPACING, OBSTACLE_WIDTH, PIXEL_SIZE } from '@/game/constants';
import type { Obstacle as ObstacleData } from '@/game/spawner';
import { leafFrame } from '@/game/wind';
import type { ObstacleViewProps } from '@/modes/types';

// Yapraklar kamışın boğumlarına tutunur (kamış ızgarasında, geçide bakan uçtan itibaren)
const RIGHT_LEAF = { x: BAMBOO_PIXEL_WIDTH - 1, y: BAMBOO_SEGMENT_HEIGHT };
const LEFT_LEAF = { x: 1, y: BAMBOO_SEGMENT_HEIGHT * 2 };

const STREAKS = [-0.4, -0.15, 0.1, 0.35]; // Rüzgâr çizgilerinin yatay yeri (bölge genişliğinin oranı)
const STREAK_SPEED = 140; // dp/s

// Kapibara modunun engeli: bambu çifti + boğumlarında yapraklar.
// Rüzgârlı engelde yapraklar rüzgâr yönüne kalkar/iner ve titrer; geçitte hava çizgileri kayar.
export function Obstacle({ obstacles, index, screenHeight, clock }: ObstacleViewProps) {
  // Ekran boyunu kaplayacak kadar uzun bir kamış (bir kez hazırlanır)
  const stalk = useMemo(() => {
    const segments = Math.ceil(screenHeight / (BAMBOO_SEGMENT_HEIGHT * PIXEL_SIZE));
    return bambooStalk(segments);
  }, [screenHeight]);

  // Alt kamış: geçidin alt kenarından başlayıp aşağı uzanır
  const bottomTransform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return [
      { translateX: obstacle.x },
      { translateY: obstacle.gapY + obstacle.gapSize / 2 },
      { scale: PIXEL_SIZE },
    ];
  });

  // Üst kamış: aynı kamışın baş aşağı çevrilmişi (scaleY eksi), geçidin üst kenarından yukarı uzanır
  const topTransform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return [
      { translateX: obstacle.x },
      { translateY: obstacle.gapY - obstacle.gapSize / 2 },
      { scaleX: PIXEL_SIZE },
      { scaleY: -PIXEL_SIZE },
    ];
  });

  // Yaprakların karesi: rüzgârın yönüne ve titremeye göre (üst kamış ters çizildiği için flipped)
  const bottomLeaf = useDerivedValue(() =>
    leafFrame(obstacles.get()[index].wind, false, clock.get()),
  );
  const topLeaf = useDerivedValue(() => leafFrame(obstacles.get()[index].wind, true, clock.get()));

  return (
    <>
      <Group transform={topTransform}>
        <PixelSprite sprite={stalk} />
        <Leaves frame={topLeaf} />
      </Group>
      <Group transform={bottomTransform}>
        <PixelSprite sprite={stalk} />
        <Leaves frame={bottomLeaf} />
      </Group>
      {STREAKS.map((offset, i) => (
        <WindStreak
          key={i}
          offset={offset}
          seed={i}
          obstacles={obstacles}
          index={index}
          clock={clock}
        />
      ))}
    </>
  );
}

// Kamışın iki yanında birer yaprak (soldaki yatayda aynalanmış)
function Leaves({ frame }: { frame: SharedValue<number> }) {
  return (
    <>
      <Group transform={[{ translateX: RIGHT_LEAF.x }, { translateY: RIGHT_LEAF.y }]}>
        <SpriteFrames frames={LEAF_FRAMES} current={frame} />
      </Group>
      <Group transform={[{ translateX: LEFT_LEAF.x }, { translateY: LEFT_LEAF.y }, { scaleX: -1 }]}>
        <SpriteFrames frames={LEAF_FRAMES} current={frame} />
      </Group>
    </>
  );
}

// Geçidin içinde rüzgâr yönünde kayan ince hava çizgisi (sadece rüzgârlı engelde)
function WindStreak({
  offset,
  seed,
  obstacles,
  index,
  clock,
}: {
  offset: number;
  seed: number;
  obstacles: SharedValue<ObstacleData[]>;
  index: number;
  clock: SharedValue<number>;
}) {
  const x = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return Math.round(obstacle.x + OBSTACLE_WIDTH / 2 + offset * OBSTACLE_SPACING);
  });
  const y = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    const top = obstacle.gapY - obstacle.gapSize / 2;
    // Geçit boyunca kayar, sona gelince baştan; her çizgi farklı yerden başlar (seed)
    const travel = (clock.get() * STREAK_SPEED + seed * 53) % obstacle.gapSize;
    const along = obstacle.wind < 0 ? obstacle.gapSize - travel : travel; // yukarı rüzgâr: aşağıdan yukarı
    return Math.round(top + along);
  });
  const opacity = useDerivedValue(() => (obstacles.get()[index].wind === 0 ? 0 : 0.5));

  return (
    <Rect x={x} y={y} width={PIXEL_SIZE} height={PIXEL_SIZE * 4} color="white" opacity={opacity} />
  );
}
