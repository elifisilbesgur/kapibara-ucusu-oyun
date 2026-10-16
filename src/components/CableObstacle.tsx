import { Group, ImageShader, Rect, Skia, useImage } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

import { CABLE_BODY_TILE, CABLE_HEAD_DOWN, CABLE_HEAD_UP } from '@/art/images';
import { NEAREST, PixelImage } from '@/components/PixelImage';
import { PIXEL_SIZE } from '@/game/constants';
import type { ObstacleViewProps } from '@/modes/types';

const HEAD_HEIGHT = CABLE_HEAD_UP.height; // 19 piksel
// Kablo gövdesinin tek karosu (sanat pikseli cinsinden); gövde bununla döşenir
const TILE_RECT = Skia.XYWHRect(0, 0, CABLE_BODY_TILE.width, CABLE_BODY_TILE.height);

// Burak Uçuyor modunun engeli: CAT6 kablo çifti. Üstten sarkan kablonun konnektörü aşağı,
// alttan yükselen kablonun konnektörü yukarı bakar; ikisinin arası geçit.
export function CableObstacle({ obstacles, index, screenHeight }: ObstacleViewProps) {
  const tile = useImage(CABLE_BODY_TILE.source);
  const bodyLength = Math.ceil(screenHeight / PIXEL_SIZE); // Ekran boyunu kaplayacak kadar (piksel)

  // Alt kablo: (0,0) noktası geçidin alt kenarında; konnektör orada, gövde aşağı uzanır
  const bottomTransform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return [
      { translateX: obstacle.x },
      { translateY: obstacle.gapY + obstacle.gapSize / 2 },
      { scale: PIXEL_SIZE },
    ];
  });

  // Üst kablo: (0,0) noktası geçidin üst kenarında; konnektör hemen üstünde, gövde yukarı uzanır
  const topTransform = useDerivedValue(() => {
    const obstacle = obstacles.get()[index];
    return [
      { translateX: obstacle.x },
      { translateY: obstacle.gapY - obstacle.gapSize / 2 },
      { scale: PIXEL_SIZE },
    ];
  });

  // Gövde: tek bir dikdörtgen, karo görseliyle dikeyde tekrar ederek dolar
  const body = (y: number) =>
    tile && (
      <Rect x={0} y={y} width={CABLE_BODY_TILE.width} height={bodyLength}>
        <ImageShader
          image={tile}
          tx="decal"
          ty="repeat"
          rect={TILE_RECT}
          fit="fill"
          sampling={NEAREST}
        />
      </Rect>
    );

  return (
    <>
      <Group transform={topTransform}>
        {body(-HEAD_HEIGHT - bodyLength)}
        <PixelImage sprite={CABLE_HEAD_DOWN} y={-HEAD_HEIGHT} />
      </Group>
      <Group transform={bottomTransform}>
        {body(HEAD_HEIGHT)}
        <PixelImage sprite={CABLE_HEAD_UP} />
      </Group>
    </>
  );
}
