import { Canvas, Group } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

import {
  BURAK_HAPPY,
  BURAK_NORMAL,
  CABLE_BODY_TILE,
  CABLE_HEAD_DOWN,
  CABLE_HEAD_UP,
  PART_CPU,
  PART_GPU,
  PART_RAM,
  PART_SSD,
  type ImageSprite,
} from '@/art/images';
import { PixelImage } from '@/components/PixelImage';
import { PIXEL_SIZE } from '@/game/constants';

// GEÇİCİ test ekranı: tüm PNG'ler ×PIXEL_SIZE, nearest filtreyle. Keskin mi diye bakmak için.
const ROWS: { sprite: ImageSprite; x: number; y: number }[] = [
  { sprite: BURAK_NORMAL, x: 4, y: 4 },
  { sprite: BURAK_HAPPY, x: 34, y: 4 },
  { sprite: CABLE_HEAD_DOWN, x: 70, y: 4 },
  { sprite: CABLE_BODY_TILE, x: 70, y: 24 },
  { sprite: CABLE_HEAD_UP, x: 92, y: 4 },
  { sprite: PART_CPU, x: 4, y: 44 },
  { sprite: PART_RAM, x: 24, y: 44 },
  { sprite: PART_GPU, x: 52, y: 44 },
  { sprite: PART_SSD, x: 82, y: 44 },
];

export default function SpriteTest() {
  return (
    <Canvas style={styles.canvas}>
      {ROWS.map(({ sprite, x, y }, i) => (
        <Group key={i} transform={[{ scale: PIXEL_SIZE }, { translateX: x }, { translateY: y + 20 }]}>
          <PixelImage sprite={sprite} />
        </Group>
      ))}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#BFE6F2',
  },
});
