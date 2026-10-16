import { Group } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { BAMBOO_SEGMENT_HEIGHT, bambooStalk } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { OBSTACLE_GAP, PIXEL_SIZE } from '@/game/constants';
import type { Obstacle as ObstacleData } from '@/game/spawner';

type Props = {
  obstacles: SharedValue<ObstacleData[]>;
  index: number; // Dizideki kaçıncı engeli çizeceğiz
  screenHeight: number;
};

export function Obstacle({ obstacles, index, screenHeight }: Props) {
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
      { translateY: obstacle.gapY + OBSTACLE_GAP / 2 },
      { scale: PIXEL_SIZE },
    ];
  });

  // Üst kamış: aynı kamışın baş aşağı çevrilmişi (scaleY eksi), geçidin üst kenarından yukarı uzanır
  const topTransform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return [
      { translateX: obstacle.x },
      { translateY: obstacle.gapY - OBSTACLE_GAP / 2 },
      { scaleX: PIXEL_SIZE },
      { scaleY: -PIXEL_SIZE },
    ];
  });

  return (
    <>
      <Group transform={topTransform}>
        <PixelSprite sprite={stalk} />
      </Group>
      <Group transform={bottomTransform}>
        <PixelSprite sprite={stalk} />
      </Group>
    </>
  );
}
