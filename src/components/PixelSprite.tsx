import { Group, Path, Skia, type SkPath } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { PALETTE, type Sprite } from '@/art/capybara';

// Izgarayı renk başına tek bir Path'e çevirir: 300 kare yerine ~10 şekil çizilir.
// Her piksel 1x1 birim; büyütme işini dışarıdaki Group'un scale'i yapar.
function buildLayers(sprite: Sprite): { color: string; path: SkPath }[] {
  const paths = new Map<string, SkPath>();
  sprite.rows.forEach((row, y) => {
    [...row].forEach((char, x) => {
      if (char === '.') return;
      const color = PALETTE[char];
      let path = paths.get(color);
      if (!path) {
        path = Skia.Path.Make();
        paths.set(color, path);
      }
      path.addRect(Skia.XYWHRect(sprite.offsetX + x, sprite.offsetY + y, 1, 1));
    });
  });
  return [...paths].map(([color, path]) => ({ color, path }));
}

type Props = {
  sprite: Sprite;
  opacity?: SharedValue<number>;
};

export function PixelSprite({ sprite, opacity }: Props) {
  const layers = useMemo(() => buildLayers(sprite), [sprite]);

  return (
    <Group opacity={opacity}>
      {layers.map(({ color, path }) => (
        // antiAlias kapalı: kenarlar yumuşamasın, pikseller keskin kalsın
        <Path key={color} path={path} color={color} antiAlias={false} />
      ))}
    </Group>
  );
}

// Birkaç kareden sadece `current` sıradaki görünür (eski usul animasyon).
export function SpriteFrames({ frames, current }: { frames: Sprite[]; current: SharedValue<number> }) {
  return frames.map((frame, index) => (
    <SpriteFrame key={index} sprite={frame} index={index} current={current} />
  ));
}

function SpriteFrame({
  sprite,
  index,
  current,
}: {
  sprite: Sprite;
  index: number;
  current: SharedValue<number>;
}) {
  const opacity = useDerivedValue<number>(() => (current.get() === index ? 1 : 0));
  return <PixelSprite sprite={sprite} opacity={opacity} />;
}
