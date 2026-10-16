import { Group, Rect } from '@shopify/react-native-skia';

import { CLOUD } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { COLORS, PIXEL_SIZE } from '@/game/constants';

// Bulutların yeri ekranın oranı olarak: her ekran boyunda benzer dağılım.
const CLOUDS = [
  { x: 0.08, y: 0.1 },
  { x: 0.62, y: 0.2 },
  { x: 0.3, y: 0.42 },
  { x: 0.75, y: 0.62 },
  { x: 0.12, y: 0.78 },
];

type Props = { width: number; height: number };

export function Background({ width, height }: Props) {
  const bandHeight = Math.ceil(height / COLORS.skyBands.length);

  return (
    <>
      {COLORS.skyBands.map((color, i) => (
        <Rect key={color} x={0} y={i * bandHeight} width={width} height={bandHeight} color={color} />
      ))}
      {CLOUDS.map((cloud, i) => (
        <Group
          key={i}
          transform={[
            { translateX: Math.round(cloud.x * width) },
            { translateY: Math.round(cloud.y * height) },
            { scale: PIXEL_SIZE },
          ]}
        >
          <PixelSprite sprite={CLOUD} />
        </Group>
      ))}
    </>
  );
}
