import { Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { PASSENGER_SPRITES } from '@/art/passengers';
import type { Sprite } from '@/art/palette';
import { DOCK, DOCK_USED, ORANGE } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { ITEM_BOB, ITEM_BOB_SPEED, ITEM_SIZE, PIXEL_SIZE } from '@/game/constants';
import { itemCenterX } from '@/game/items';
import { PASSENGER_KINDS } from '@/game/passengers';
import type { Obstacle } from '@/game/spawner';
import type { ItemViewProps } from '@/modes/types';

const DOCK_WIDTH = DOCK.rows[0].length * PIXEL_SIZE;
const DOCK_HEIGHT = DOCK.rows.length * PIXEL_SIZE;

// Kapibara modunun eşyası: portakal, bekleyen yolcu ya da durak (iskele).
// Hepsi çizilir, sadece doğru olan görünür.
export function Item({ obstacles, index, clock }: ItemViewProps) {
  // İskele süzülmez: suya oturur
  const dockTransform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return [
      { translateX: Math.round(itemCenterX(obstacle) - DOCK_WIDTH / 2) },
      { translateY: Math.round(obstacle.itemY - DOCK_HEIGHT / 2) },
      { scale: PIXEL_SIZE },
    ];
  });

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
    <>
      <Group transform={dockTransform}>
        <ItemSprite kind="stop" sprite={DOCK} obstacles={obstacles} index={index} />
        <ItemSprite kind="stop_used" sprite={DOCK_USED} obstacles={obstacles} index={index} />
      </Group>
      <Group transform={transform}>
        <ItemSprite kind="orange" sprite={ORANGE} obstacles={obstacles} index={index} />
        {/* Yolcular 6 piksel boyunda, portakal 8: bir piksel aşağı alıp ortalıyoruz */}
        <Group transform={[{ translateY: 1 }]}>
          {PASSENGER_KINDS.map((kind) => (
            <ItemSprite
              key={kind}
              kind={kind}
              sprite={PASSENGER_SPRITES[kind]}
              obstacles={obstacles}
              index={index}
            />
          ))}
        </Group>
      </Group>
    </>
  );
}

// Engelin eşyası `kind` ise görünür
function ItemSprite({
  kind,
  sprite,
  obstacles,
  index,
}: {
  kind: string;
  sprite: Sprite;
  obstacles: SharedValue<Obstacle[]>;
  index: number;
}) {
  const opacity = useDerivedValue<number>(() => (obstacles.get()[index].item === kind ? 1 : 0));
  return <PixelSprite sprite={sprite} opacity={opacity} />;
}
