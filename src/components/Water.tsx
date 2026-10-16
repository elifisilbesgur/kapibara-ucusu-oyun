import { Group, Rect } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { PALETTE } from '@/art/palette';
import { SPLASH, WATER_TILE } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { PIXEL_SIZE, WATER_HEIGHT } from '@/game/constants';

const TILE_WIDTH = WATER_TILE.rows[0].length * PIXEL_SIZE; // Bir dalga karosunun ekrandaki genişliği
const TILE_HEIGHT = WATER_TILE.rows.length * PIXEL_SIZE;
const SPLASH_WIDTH = SPLASH.rows[0].length * PIXEL_SIZE;
const SPLASH_HEIGHT = SPLASH.rows.length * PIXEL_SIZE;

type Props = {
  width: number;
  height: number;
  scroll: SharedValue<number>; // Dalgaların ne kadar kaydığı (dp)
  splashX: SharedValue<number>; // Sıçramanın ortası
  splashTime: SharedValue<number>; // > 0 iken sıçrama görünür
};

export function Water({ width, height, scroll, splashX, splashTime }: Props) {
  const top = height - WATER_HEIGHT;
  const tileCount = Math.ceil(width / TILE_WIDTH) + 1; // kayarken boşluk kalmasın diye bir fazla

  // Karolar sola kayar; bir karo boyu kayınca başa sarar (göz fark etmez, karolar aynı)
  const wavesTransform = useDerivedValue(() => [
    { translateX: -(scroll.get() % TILE_WIDTH) },
    { translateY: top },
  ]);

  const splashTransform = useDerivedValue(() => [
    { translateX: splashX.get() - SPLASH_WIDTH / 2 },
    { translateY: top - SPLASH_HEIGHT + PIXEL_SIZE * 2 },
    { scale: PIXEL_SIZE },
  ]);
  const splashOpacity = useDerivedValue(() => (splashTime.get() > 0 ? 1 : 0));

  return (
    <>
      <Group transform={wavesTransform}>
        {Array.from({ length: tileCount }, (_, i) => (
          <Group key={i} transform={[{ translateX: i * TILE_WIDTH }, { scale: PIXEL_SIZE }]}>
            <PixelSprite sprite={WATER_TILE} />
          </Group>
        ))}
      </Group>
      <Rect x={0} y={top + TILE_HEIGHT} width={width} height={PIXEL_SIZE * 3} color={PALETTE.i} />
      <Rect
        x={0}
        y={top + TILE_HEIGHT + PIXEL_SIZE * 3}
        width={width}
        height={WATER_HEIGHT}
        color={PALETTE.I}
      />
      <Group transform={splashTransform} opacity={splashOpacity}>
        <PixelSprite sprite={SPLASH} />
      </Group>
    </>
  );
}
