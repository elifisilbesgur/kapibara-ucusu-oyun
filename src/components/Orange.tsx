import { Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { ORANGE } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { ORANGE_BOB, ORANGE_BOB_SPEED, ORANGE_SIZE, PIXEL_SIZE } from '@/game/constants';
import { orangeCenterX } from '@/game/oranges';
import type { Obstacle } from '@/game/spawner';

type Props = {
  obstacles: SharedValue<Obstacle[]>;
  index: number;
  clock: SharedValue<number>;
};

export function Orange({ obstacles, index, clock }: Props) {
  const transform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    // Süzülme: sinüs dalgası, piksel ızgarasına yuvarlanmış (kesik kesik, retro his).
    // "+ index": her portakal farklı anda süzülsün, hepsi aynı anda değil.
    const wave = Math.sin(clock.get() * ORANGE_BOB_SPEED + index) * ORANGE_BOB;
    const bob = Math.round(wave / PIXEL_SIZE) * PIXEL_SIZE;
    return [
      { translateX: orangeCenterX(obstacle) - ORANGE_SIZE / 2 },
      { translateY: obstacle.orangeY - ORANGE_SIZE / 2 + bob },
      { scale: PIXEL_SIZE },
    ];
  });

  const opacity = useDerivedValue<number>(() => (obstacles.get()[index].hasOrange ? 1 : 0));

  return (
    <Group transform={transform} opacity={opacity}>
      <PixelSprite sprite={ORANGE} />
    </Group>
  );
}
