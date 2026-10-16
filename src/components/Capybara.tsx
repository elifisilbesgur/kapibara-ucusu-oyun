import { Group } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import {
  BALLOON,
  BODY,
  CAP,
  EYES_CLOSED,
  FLAME_BIG,
  FLAME_SMALL,
  JETPACK,
  LEAF_FRAMES,
  PIVOT,
  PROPELLER_FRAMES,
  SMILE,
  WING_FRAMES,
} from '@/art/capybara';
import { PASSENGER_PIXEL_HEIGHT, PASSENGER_SPRITES } from '@/art/passengers';
import { PixelSprite, SpriteFrames } from '@/components/PixelSprite';
import { tiltFor } from '@/game/animation';
import { FLAME_FLICKER_FPS, MAX_PASSENGERS, PIXEL_SIZE } from '@/game/constants';
import { PASSENGER_KINDS, type PassengerKind } from '@/game/passengers';
import type { GamePhase } from '@/game/phase';

const FLAME_FRAMES = [...FLAME_SMALL, ...FLAME_BIG]; // 0-1 küçük, 2-3 büyük
const PROPELLER_COUNT = PROPELLER_FRAMES.length;
// Yolcu yığınının sol kenarı ve dibi (gövde ızgarasında). Uçarken sırtta,
// suda sırtüstü yüzerken havaya kalkmış ayakların üstünde (güneşleniyorlar).
const STACK = { x: 3, baseY: 4 };
const STACK_FLOATING = { x: 8, baseY: 3 };
const BLINK_FPS = 12; // Kalkan varken saniyede kaç kez yanıp söner

// Seviye → mod: 0 yaprak, 1 balon, 2 pervaneli şapka, 3 kuş kanadı, 4 jetpack + şapka
const MODE = { leaf: 0, balloon: 1, propeller: 2, wings: 3, jetpack: 4 };

type Props = {
  x: number;
  y: SharedValue<number>;
  velocity: SharedValue<number>;
  thrust: SharedValue<number>;
  propellerPhase: SharedValue<number>;
  clock: SharedValue<number>;
  passengers: SharedValue<PassengerKind[]>;
  shieldTime: SharedValue<number>;
  level: SharedValue<number>;
  phase: SharedValue<GamePhase>;
  smileTime: SharedValue<number>;
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
  level,
  phase,
  smileTime,
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

  // Yaprak ve kanat: dokununca aşağı çırpılır (kare 1), sonra yukarı döner (kare 0)
  const flapFrame = useDerivedValue<number>(() => (thrust.get() > 0.3 ? 1 : 0));

  // Suda sırtüstü: gövde dikeyde aynalanır (göbek yukarı, ayaklar havada).
  // Ayna ekseni gövdenin ortası (PIVOT.y): y → 2·PIVOT.y − y
  const bodyTransform = useDerivedValue(() =>
    phase.get() === 'over'
      ? [{ translateY: 2 * PIVOT.y }, { scaleY: -1 }]
      : [{ translateY: 0 }, { scaleY: 1 }],
  );
  const floatingOpacity = useDerivedValue<number>(() => (phase.get() === 'over' ? 1 : 0));
  const flyingOpacity = useDerivedValue<number>(() => (phase.get() === 'over' ? 0 : 1));
  const smileOpacity = useDerivedValue<number>(() =>
    smileTime.get() > 0 && phase.get() !== 'over' ? 1 : 0,
  );

  // Kaplumbağa çarpmayı karşıladıysa kısa süre yanıp sön
  const opacity = useDerivedValue(() => {
    if (shieldTime.get() <= 0) return 1;
    return Math.floor(clock.get() * BLINK_FPS) % 2 === 0 ? 0.35 : 1;
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <Group transform={bodyTransform}>
        <PixelSprite sprite={BODY} />
        <PixelSprite sprite={SMILE} opacity={smileOpacity} />
        <PixelSprite sprite={EYES_CLOSED} opacity={floatingOpacity} />
      </Group>

      {/* Modun parçaları sadece uçarken; suya düşünce hepsi gider */}
      <Group opacity={flyingOpacity}>
        <Gear modes={[MODE.leaf]} level={level}>
          <SpriteFrames frames={LEAF_FRAMES} current={flapFrame} />
        </Gear>
        <Gear modes={[MODE.balloon]} level={level}>
          <PixelSprite sprite={BALLOON} />
        </Gear>
        <Gear modes={[MODE.wings]} level={level}>
          <SpriteFrames frames={WING_FRAMES} current={flapFrame} />
        </Gear>
        <Gear modes={[MODE.jetpack]} level={level}>
          <SpriteFrames frames={FLAME_FRAMES} current={flameFrame} />
          <PixelSprite sprite={JETPACK} />
        </Gear>
        <Gear modes={[MODE.propeller, MODE.jetpack]} level={level}>
          <PixelSprite sprite={CAP} />
          <SpriteFrames frames={PROPELLER_FRAMES} current={propellerFrame} />
        </Gear>
      </Group>

      {Array.from({ length: MAX_PASSENGERS }, (_, slot) => (
        <StackSlot key={slot} slot={slot} phase={phase} passengers={passengers} />
      ))}
    </Group>
  );
}

// Yığının bir katı: her kat bir öncekinin tam üstünde
function StackSlot({
  slot,
  phase,
  passengers,
}: {
  slot: number;
  phase: SharedValue<GamePhase>;
  passengers: SharedValue<PassengerKind[]>;
}) {
  const transform = useDerivedValue(() => {
    const base = phase.get() === 'over' ? STACK_FLOATING : STACK;
    return [
      { translateX: base.x },
      { translateY: base.baseY - PASSENGER_PIXEL_HEIGHT * (slot + 1) },
    ];
  });

  return (
    <Group transform={transform}>
      {PASSENGER_KINDS.map((kind) => (
        <StackedPassenger key={kind} kind={kind} slot={slot} passengers={passengers} />
      ))}
    </Group>
  );
}

// Sadece belirtilen modlarda görünen parça (şapka, balon, kanat...)
function Gear({
  modes,
  level,
  children,
}: {
  modes: number[];
  level: SharedValue<number>;
  children: ReactNode;
}) {
  const opacity = useDerivedValue<number>(() => (modes.includes(level.get()) ? 1 : 0));
  return <Group opacity={opacity}>{children}</Group>;
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
