import { Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { BODY, FLAME_BIG, FLAME_SMALL, PIVOT, PROPELLER_FRAMES } from '@/art/capybara';
import { PixelSprite, SpriteFrames } from '@/components/PixelSprite';
import { tiltFor } from '@/game/animation';
import { FLAME_FLICKER_FPS, PIXEL_SIZE } from '@/game/constants';

const FLAME_FRAMES = [...FLAME_SMALL, ...FLAME_BIG]; // 0-1 küçük, 2-3 büyük
const PROPELLER_COUNT = PROPELLER_FRAMES.length;

type Props = {
  x: number;
  y: SharedValue<number>;
  velocity: SharedValue<number>;
  thrust: SharedValue<number>;
  propellerPhase: SharedValue<number>;
  clock: SharedValue<number>;
};

export function Capybara({ x, y, velocity, thrust, propellerPhase, clock }: Props) {
  // Dönüşümler sırayla: yerine taşı → eğ → büyüt → gövde ortasını merkeze al
  const transform = useDerivedValue(() => [
    { translateX: x },
    { translateY: y.get() },
    { rotate: tiltFor(velocity.get()) },
    { scale: PIXEL_SIZE },
    { translateX: -PIVOT.x },
    { translateY: -PIVOT.y },
  ]);

  const propellerFrame = useDerivedValue(
    () => Math.floor(propellerPhase.get()) % PROPELLER_COUNT,
  );

  // Dokunuştan hemen sonra büyük alev, sonra küçük; ikisi de kendi içinde titrer
  const flameFrame = useDerivedValue(() => {
    const flicker = Math.floor(clock.get() * FLAME_FLICKER_FPS) % 2;
    return (thrust.get() > 0.3 ? 2 : 0) + flicker;
  });

  return (
    <Group transform={transform}>
      <SpriteFrames frames={FLAME_FRAMES} current={flameFrame} />
      <PixelSprite sprite={BODY} />
      <SpriteFrames frames={PROPELLER_FRAMES} current={propellerFrame} />
    </Group>
  );
}
