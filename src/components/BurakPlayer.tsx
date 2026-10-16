import { Group } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

import { BURAK_HAPPY, BURAK_NORMAL, BURAK_PIXEL } from '@/art/images';
import { PixelImage } from '@/components/PixelImage';
import { tiltFor } from '@/game/animation';
import type { PlayerProps } from '@/modes/types';

// Dönme merkezi: gövdenin ortası (jetpack hariç), sanat pikseli cinsinden.
// Çarpışma kutusu da bu noktayı ortalar.
const PIVOT = { x: 14.5, y: 16.5 };

// Burak Uçuyor modunun karakteri. Toplayınca (joyTime > 0) gülen yüz.
export function BurakPlayer({ x, y, velocity, joyTime }: PlayerProps) {
  // Kapibarayla aynı sıra: yerine taşı → eğ → büyüt → gövde ortasını merkeze al
  const transform = useDerivedValue(() => [
    { translateX: x },
    { translateY: y.get() },
    { rotate: tiltFor(velocity.get()) },
    { scale: BURAK_PIXEL },
    { translateX: -PIVOT.x },
    { translateY: -PIVOT.y },
  ]);

  const happyOpacity = useDerivedValue<number>(() => (joyTime.get() > 0 ? 1 : 0));
  const normalOpacity = useDerivedValue<number>(() => (joyTime.get() > 0 ? 0 : 1));

  return (
    <Group transform={transform}>
      <PixelImage sprite={BURAK_NORMAL} opacity={normalOpacity} />
      <PixelImage sprite={BURAK_HAPPY} opacity={happyOpacity} />
    </Group>
  );
}
