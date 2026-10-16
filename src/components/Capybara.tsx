import { Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { BODY, FLAME_BIG, FLAME_SMALL, PIVOT, PROPELLER_FRAMES } from '@/art/capybara';
import { PASSENGER_PIXEL_HEIGHT, PASSENGER_SPRITES } from '@/art/passengers';
import { PixelSprite, SpriteFrames } from '@/components/PixelSprite';
import { tiltFor } from '@/game/animation';
import { FLAME_FLICKER_FPS, MAX_PASSENGERS, PIXEL_SIZE } from '@/game/constants';
import { PASSENGER_KINDS, type PassengerKind } from '@/game/passengers';

const FLAME_FRAMES = [...FLAME_SMALL, ...FLAME_BIG]; // 0-1 küçük, 2-3 büyük
const PROPELLER_COUNT = PROPELLER_FRAMES.length;
const STACK_BASE_Y = 4; // Yığının dibi: jetpack'in üst kenarı (gövde ızgarasında satır 4)
const BLINK_FPS = 12; // Kalkan varken saniyede kaç kez yanıp söner

type Props = {
  x: number;
  y: SharedValue<number>;
  velocity: SharedValue<number>;
  thrust: SharedValue<number>;
  propellerPhase: SharedValue<number>;
  clock: SharedValue<number>;
  passengers: SharedValue<PassengerKind[]>;
  shieldTime: SharedValue<number>;
};

export function Capybara({
  x,
  y,
  velocity,
  thrust,
  propellerPhase,
  clock,
  passengers,
  shieldTime,
}: Props) {
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

  // Kaplumbağa çarpmayı karşıladıysa kısa süre yanıp sön
  const opacity = useDerivedValue(() => {
    if (shieldTime.get() <= 0) return 1;
    return Math.floor(clock.get() * BLINK_FPS) % 2 === 0 ? 0.35 : 1;
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <SpriteFrames frames={FLAME_FRAMES} current={flameFrame} />
      <PixelSprite sprite={BODY} />
      <SpriteFrames frames={PROPELLER_FRAMES} current={propellerFrame} />
      {Array.from({ length: MAX_PASSENGERS }, (_, slot) => (
        // Her kat bir öncekinin tam üstünde
        <Group key={slot} transform={[{ translateY: STACK_BASE_Y - PASSENGER_PIXEL_HEIGHT * (slot + 1) }]}>
          {PASSENGER_KINDS.map((kind) => (
            <StackedPassenger key={kind} kind={kind} slot={slot} passengers={passengers} />
          ))}
        </Group>
      ))}
    </Group>
  );
}

// Yığının `slot` katında `kind` yolcusu varsa görünür
function StackedPassenger({
  kind,
  slot,
  passengers,
}: {
  kind: PassengerKind;
  slot: number;
  passengers: SharedValue<PassengerKind[]>;
}) {
  const opacity = useDerivedValue<number>(() => (passengers.get()[slot] === kind ? 1 : 0));
  return <PixelSprite sprite={PASSENGER_SPRITES[kind]} opacity={opacity} />;
}
