import { Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { PASSENGER_SPRITES } from '@/art/passengers';
import { ORANGE } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { ITEM_BOB, ITEM_BOB_SPEED, ITEM_SIZE, PIXEL_SIZE } from '@/game/constants';
import { itemCenterX } from '@/game/items';
import { PASSENGER_KINDS } from '@/game/passengers';
import type { Obstacle } from '@/game/spawner';
import type { ItemViewProps } from '@/modes/types';

// Kapibara modunun eşyası: portakal ya da bekleyen yolcu. Hepsi çizilir, sadece doğru olan görünür.
export function Item({ obstacles, index, clock }: ItemViewProps) {
  const transform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    // Süzülme: sinüs dalgası, piksel ızgarasına yuvarlanmış (kesik kesik, retro his).
    // "+ index": her biri farklı anda süzülsün, hepsi aynı anda değil.
    const wave = Math.sin(clock.get() * ITEM_BOB_SPEED + index) * ITEM_BOB;
    const bob = Math.round(wave / PIXEL_SIZE) * PIXEL_SIZE;
    return [
      { translateX: itemCenterX(obstacle) - ITEM_SIZE / 2 },
      { translateY: obstacle.itemY - ITEM_SIZE / 2 + bob },
      { scale: PIXEL_SIZE },
    ];
  });

  return (
    <Group transform={transform}>
      <ItemSprite kind="orange" obstacles={obstacles} index={index} />
      {/* Yolcular 6 piksel boyunda, portakal 8: bir piksel aşağı alıp ortalıyoruz */}
      <Group transform={[{ translateY: 1 }]}>
        {PASSENGER_KINDS.map((kind) => (
          <ItemSprite key={kind} kind={kind} obstacles={obstacles} index={index} />
        ))}
      </Group>
    </Group>
  );
}

function ItemSprite({
  kind,
  obstacles,
  index,
}: {
  kind: 'orange' | (typeof PASSENGER_KINDS)[number];
  obstacles: SharedValue<Obstacle[]>;
  index: number;
}) {
  const opacity = useDerivedValue<number>(() => (obstacles.get()[index].item === kind ? 1 : 0));
  const sprite = kind === 'orange' ? ORANGE : PASSENGER_SPRITES[kind];
  return <PixelSprite sprite={sprite} opacity={opacity} />;
}
