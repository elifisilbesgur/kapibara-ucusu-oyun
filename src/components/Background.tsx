import { Group, Rect } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import type { Sky } from '@/art/skies';
import { MOON, STAR } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { PIXEL_SIZE } from '@/game/constants';

// Bulut, yıldız ve ayın yeri ekranın oranı olarak: her ekran boyunda benzer dağılım.
const CLOUDS = [
  { x: 0.08, y: 0.1 },
  { x: 0.62, y: 0.2 },
  { x: 0.3, y: 0.42 },
  { x: 0.75, y: 0.62 },
  { x: 0.12, y: 0.78 },
];
const STARS = [
  { x: 0.05, y: 0.04 },
  { x: 0.4, y: 0.08 },
  { x: 0.9, y: 0.3 },
  { x: 0.2, y: 0.33 },
  { x: 0.55, y: 0.5 },
  { x: 0.85, y: 0.72 },
  { x: 0.35, y: 0.88 },
];
const MOON_POSITION = { x: 0.72, y: 0.06 };

type Props = {
  width: number;
  height: number;
  skies: Sky[]; // Modun seviye başına gökyüzleri
  levelBlend: SharedValue<number>; // 0 → son seviye arası yumuşak seviye
};

// Her seviyenin gökyüzü üst üste çizilir; yenisi, levelBlend ilerledikçe görünür hale gelir.
export function Background({ width, height, skies, levelBlend }: Props) {
  return skies.map((sky, level) => (
    <SkyLayer
      key={level}
      sky={sky}
      level={level}
      levelBlend={levelBlend}
      width={width}
      height={height}
    />
  ));
}

function SkyLayer({
  sky,
  level,
  levelBlend,
  width,
  height,
}: {
  sky: Sky;
  level: number;
  levelBlend: SharedValue<number>;
  width: number;
  height: number;
}) {
  // Seviye 0 hep tam görünür (en altta). Seviye 2: blend 1→2 giderken 0→1 belirginleşir.
  const opacity = useDerivedValue(() =>
    level === 0 ? 1 : Math.min(1, Math.max(0, levelBlend.get() - (level - 1))),
  );
  const bandHeight = Math.ceil(height / sky.bands.length);

  const at = (position: { x: number; y: number }) => [
    { translateX: Math.round(position.x * width) },
    { translateY: Math.round(position.y * height) },
    { scale: PIXEL_SIZE },
  ];

  return (
    <Group opacity={opacity}>
      {sky.bands.map((color, i) => (
        <Rect key={i} x={0} y={i * bandHeight} width={width} height={bandHeight} color={color} />
      ))}
      {sky.night && (
        <>
          {STARS.map((star, i) => (
            <Group key={i} transform={at(star)}>
              <PixelSprite sprite={STAR} />
            </Group>
          ))}
          <Group transform={at(MOON_POSITION)}>
            <PixelSprite sprite={MOON} />
          </Group>
        </>
      )}
      {CLOUDS.map((cloud, i) => (
        <Group key={i} transform={at(cloud)}>
          <PixelSprite sprite={sky.cloud} />
        </Group>
      ))}
    </Group>
  );
}
