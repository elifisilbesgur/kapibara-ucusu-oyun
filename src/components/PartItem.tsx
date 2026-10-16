import { Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { BURAK_PIXEL, PART_SPRITES, type ImageSprite } from '@/art/images';
import { PixelImage } from '@/components/PixelImage';
import { ITEM_BOB, ITEM_BOB_SPEED } from '@/game/constants';
import { itemCenterX } from '@/game/items';
import type { Obstacle } from '@/game/spawner';
import type { ItemViewProps } from '@/modes/types';

const PART_IDS = Object.keys(PART_SPRITES);

// Burak Uçuyor modunun eşyası: bilgisayar parçası. Dört parça da çizilir, sadece doğru olan görünür.
export function PartItem({ obstacles, index, clock }: ItemViewProps) {
  return PART_IDS.map((id) => (
    <Part
      key={id}
      id={id}
      sprite={PART_SPRITES[id]}
      obstacles={obstacles}
      index={index}
      clock={clock}
    />
  ));
}

function Part({
  id,
  sprite,
  obstacles,
  index,
  clock,
}: {
  id: string;
  sprite: ImageSprite;
  obstacles: SharedValue<Obstacle[]>;
  index: number;
  clock: SharedValue<number>;
}) {
  const transform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    // Süzülme, piksel ızgarasına yuvarlanmış (portakallardaki gibi)
    const wave = Math.sin(clock.get() * ITEM_BOB_SPEED + index) * ITEM_BOB;
    const bob = Math.round(wave / BURAK_PIXEL) * BURAK_PIXEL;
    // Görselin ortası eşyanın konumuna gelsin; tam piksele yuvarla ki bulanıklaşmasın
    const left = Math.round(itemCenterX(obstacle) - (sprite.width * BURAK_PIXEL) / 2);
    const top = Math.round(obstacle.itemY - (sprite.height * BURAK_PIXEL) / 2 + bob);
    return [{ translateX: left }, { translateY: top }, { scale: BURAK_PIXEL }];
  });

  const opacity = useDerivedValue<number>(() => (obstacles.get()[index].item === id ? 1 : 0));

  return (
    <Group transform={transform}>
      <PixelImage sprite={sprite} opacity={opacity} />
    </Group>
  );
}
