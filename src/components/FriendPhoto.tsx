import { Canvas, Group, Rect } from '@shopify/react-native-skia';

import { BODY, SMILE } from '@/art/capybara';
import { PASSENGER_SPRITES, silhouette } from '@/art/passengers';
import { SKIES } from '@/art/skies';
import { PixelSprite } from '@/components/PixelSprite';
import { PIXEL_SIZE } from '@/game/constants';
import type { PassengerKind } from '@/game/passengers';

// Fotoğraf karesi (piksel): kapibara 22x15 + sırtındaki yolcu 6 piksel yukarı taşar
const PHOTO = { width: 28, height: 26 };
const CAPYBARA = { x: 3, y: 9 }; // Kapibaranın karedeki yeri
const RIDER = { x: 3, y: 4 - 6 }; // Yolcu, oyundaki gibi sırtta (STACK: x 3, dip satır 4)

export const PHOTO_SIZE = { width: PHOTO.width * PIXEL_SIZE, height: PHOTO.height * PIXEL_SIZE };

// Anı fotoğrafı: sabah gökyüzü önünde, sırtında arkadaşıyla minicik gülümseyen kapibara.
// Tanışılmamışsa arkadaş siluet, kapibara gülümsemez.
export function FriendPhoto({ kind, met }: { kind: PassengerKind; met: boolean }) {
  const bands = SKIES[0].bands;
  const bandHeight = Math.ceil(PHOTO.height / bands.length);
  const rider = met ? PASSENGER_SPRITES[kind] : silhouette(PASSENGER_SPRITES[kind]);

  return (
    <Canvas style={PHOTO_SIZE}>
      <Group transform={[{ scale: PIXEL_SIZE }]}>
        {bands.map((color, i) => (
          <Rect key={i} x={0} y={i * bandHeight} width={PHOTO.width} height={bandHeight} color={color} />
        ))}
        <Group transform={[{ translateX: CAPYBARA.x }, { translateY: CAPYBARA.y }]}>
          <PixelSprite sprite={BODY} />
          {met && <PixelSprite sprite={SMILE} />}
          <Group transform={[{ translateX: RIDER.x }, { translateY: RIDER.y }]}>
            <PixelSprite sprite={rider} />
          </Group>
        </Group>
      </Group>
    </Canvas>
  );
}
