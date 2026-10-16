import { Canvas, Group } from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Background } from '@/components/Background';
import { Capybara } from '@/components/Capybara';
import { Hud } from '@/components/Hud';
import { Item } from '@/components/Item';
import { Obstacle } from '@/components/Obstacle';
import { Water } from '@/components/Water';
import {
  hapticHit,
  hapticLevelUp,
  hapticOrange,
  hapticPassenger,
  hapticSplash,
} from '@/feedback/haptics';
import { stepPropeller, stepThrust } from '@/game/animation';
import { hitsAnyObstacle, isOutOfBounds, playerBox } from '@/game/collision';
import {
  FLOAT_BOB,
  FLOAT_BOB_SPEED,
  FLOAT_LIFT,
  HIT_BOUNCE,
  JUMP_VELOCITY,
  LEVEL_BANNER_TIME,
  LEVELS,
  OBSTACLE_SPEED,
  PLAYER_HITBOX_HEIGHT,
  PLAYER_HITBOX_WIDTH,
  PLAYER_X_RATIO,
  POINTS_PER_GATE,
  RESTART_DELAY_MS,
  SHAKE_AMOUNT,
  SHAKE_TIME,
  SHIELD_TIME,
  SMILE_TIME,
  SPLASH_TIME,
  WATER_HEIGHT,
} from '@/game/constants';
import { collectItems } from '@/game/items';
import { levelFor, stepLevelBlend } from '@/game/levels';
import {
  gravityScale,
  jumpScale,
  multiplierFor,
  removeTopmost,
  type PassengerKind,
} from '@/game/passengers';
import type { GamePhase } from '@/game/phase';
import { frameDeltaSeconds, stepPosition, stepVelocity } from '@/game/physics';
import { createObstacles, markPassed, obstacleCount, stepObstacles } from '@/game/spawner';
import { useGameStore } from '@/store/useGameStore';

export default function GameScreen() {
  const { width, height } = useWindowDimensions();
  const waterY = height - WATER_HEIGHT; // Oyun alanının dibi: deniz yüzeyi
  const floatY = waterY - FLOAT_LIFT; // Sırtüstü yüzerken gövde ortasının yüksekliği

  // React tarafı: sadece ekrandaki yazılar için (seyrek değişir)
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [score, setScore] = useState(0);
  const [runOranges, setRunOranges] = useState(0);
  const [passengerCount, setPassengerCount] = useState(0);
  const [banner, setBanner] = useState<string | null>(null); // "Yeni mod: Balon" gibi
  const addOranges = useGameStore((state) => state.addOranges);

  // UI thread tarafı: oyunun kendisi (her karede değişir)
  const playerX = width * PLAYER_X_RATIO;
  const playerY = useSharedValue(waterY / 2);
  const velocity = useSharedValue(0);
  const obstacles = useSharedValue(createObstacles(width, waterY));
  const passengers = useSharedValue<PassengerKind[]>([]);
  const shieldTime = useSharedValue(0); // > 0 iken bambulara çarpmak zarar vermez
  const phaseSV = useSharedValue<GamePhase>('ready');
  const scoreSV = useSharedValue(0);
  const runOrangesSV = useSharedValue(0);
  const msSinceGameOver = useSharedValue(0);
  const level = useSharedValue(0); // 0-4: hangi mod
  const levelBlend = useSharedValue(0); // gökyüzü geçişi için yumuşak seviye
  const bannerTime = useSharedValue(0); // "yeni mod" yazısının kalan süresi

  // Sadece görünüm için
  const thrust = useSharedValue(0); // alev, pervane, kanat çırpma
  const propellerPhase = useSharedValue(0);
  const clock = useSharedValue(0);
  const waterScroll = useSharedValue(0); // dalgaların kayması
  const splashX = useSharedValue(0);
  const splashTime = useSharedValue(0);
  const shakeTime = useSharedValue(0);
  const smileTime = useSharedValue(0);

  // Suya değdi: sıçrat, sırtüstü yüzme pozisyonuna geç
  const fallIntoWater = () => {
    'worklet';
    phaseSV.set('over');
    msSinceGameOver.set(0);
    velocity.set(0);
    playerY.set(floatY);
    splashX.set(playerX);
    splashTime.set(SPLASH_TIME);
    scheduleOnRN(hapticSplash);
    scheduleOnRN(setPhase, 'over');
  };

  useFrameCallback((frame) => {
    const dt = frameDeltaSeconds(frame.timeSincePreviousFrame);

    // Görünüm sayaçları her fazda çalışır (beklerken de pervane dönsün)
    clock.set(clock.get() + dt);
    thrust.set(stepThrust(thrust.get(), dt));
    propellerPhase.set(stepPropeller(propellerPhase.get(), thrust.get(), dt));
    levelBlend.set(stepLevelBlend(levelBlend.get(), level.get(), dt));
    splashTime.set(Math.max(0, splashTime.get() - dt));
    shakeTime.set(Math.max(0, shakeTime.get() - dt));
    smileTime.set(Math.max(0, smileTime.get() - dt));
    if (bannerTime.get() > 0) {
      bannerTime.set(bannerTime.get() - dt);
      if (bannerTime.get() <= 0) scheduleOnRN(setBanner, null);
    }

    const current = phaseSV.get();

    if (current === 'over') {
      // Suda sallan
      playerY.set(floatY + Math.sin(clock.get() * FLOAT_BOB_SPEED) * FLOAT_BOB);
      msSinceGameOver.set(msSinceGameOver.get() + (frame.timeSincePreviousFrame ?? 0));
      return;
    }

    if (current === 'falling') {
      // Çarptı: dünya durdu, sadece kapibara düşüyor
      velocity.set(stepVelocity(velocity.get(), dt));
      playerY.set(stepPosition(playerY.get(), velocity.get(), dt));
      if (playerY.get() + PLAYER_HITBOX_HEIGHT / 2 >= waterY) fallIntoWater();
      return;
    }

    if (current !== 'playing') return; // Hazırken dünya donuk

    // Fizik: modun kendi hissi x yolcuların ağırlığı
    const mode = LEVELS[level.get()];
    const gravity = mode.gravity * gravityScale(passengers.get());
    velocity.set(stepVelocity(velocity.get(), dt, gravity, mode.maxFall));
    playerY.set(stepPosition(playerY.get(), velocity.get(), dt));
    obstacles.set(stepObstacles(obstacles.get(), dt, waterY, mode.speed));
    waterScroll.set(waterScroll.get() + OBSTACLE_SPEED * mode.speed * dt);
    shieldTime.set(Math.max(0, shieldTime.get() - dt));

    // Puan: geçilen her engel, yolcu çarpanıyla
    const scored = markPassed(obstacles.get(), playerX - PLAYER_HITBOX_WIDTH / 2);
    obstacles.set(scored.obstacles);
    if (scored.newlyPassed > 0) {
      const multiplier = multiplierFor(passengers.get().length);
      scoreSV.set(scoreSV.get() + Math.round(scored.newlyPassed * POINTS_PER_GATE * multiplier));
      scheduleOnRN(setScore, scoreSV.get());

      // Seviye atladı mı? Kapibara yeni moda evrimleşir
      const newLevel = levelFor(scoreSV.get());
      if (newLevel > level.get()) {
        level.set(newLevel);
        bannerTime.set(LEVEL_BANNER_TIME);
        scheduleOnRN(setBanner, LEVELS[newLevel].name);
        scheduleOnRN(hapticLevelUp);
      }
    }

    const box = playerBox(playerX, playerY.get());

    // Toplama: portakallar kumbaraya (ve minicik bir gülümseme), yolcular sırta
    const picked = collectItems(obstacles.get(), box, passengers.get());
    obstacles.set(picked.obstacles);
    if (picked.oranges > 0) {
      runOrangesSV.set(runOrangesSV.get() + picked.oranges);
      smileTime.set(SMILE_TIME);
      scheduleOnRN(setRunOranges, runOrangesSV.get());
      scheduleOnRN(addOranges, picked.oranges);
      scheduleOnRN(hapticOrange);
    }
    if (picked.newPassengers.length > 0) {
      passengers.set([...passengers.get(), ...picked.newPassengers]);
      scheduleOnRN(setPassengerCount, passengers.get().length);
      scheduleOnRN(hapticPassenger);
    }

    // Suya değdi: doğrudan sırtüstü
    if (box.y + box.height >= waterY) {
      fallIntoWater();
      return;
    }

    // Bambu ya da tavan: kaplumbağa kurtarabilir (sadece bambuda), yoksa sekip denize düş
    const hitBamboo = shieldTime.get() === 0 && hitsAnyObstacle(box, obstacles.get(), waterY);
    if (hitBamboo && passengers.get().includes('turtle')) {
      passengers.set(removeTopmost(passengers.get(), 'turtle'));
      shieldTime.set(SHIELD_TIME);
      shakeTime.set(SHAKE_TIME / 2);
      scheduleOnRN(setPassengerCount, passengers.get().length);
      scheduleOnRN(hapticPassenger);
    } else if (hitBamboo || isOutOfBounds(box, waterY)) {
      phaseSV.set('falling');
      velocity.set(HIT_BOUNCE);
      shakeTime.set(SHAKE_TIME);
      scheduleOnRN(hapticHit);
      scheduleOnRN(setPhase, 'falling');
    }
  });

  // Parmak ekrana değdiği an (kaldırmayı beklemeden) tepki ver
  const tap = Gesture.Tap().onBegin(() => {
    const current = phaseSV.get();

    if (current === 'falling') return; // Düşerken dokunuşlar yok sayılır

    if (current === 'over') {
      if (msSinceGameOver.get() < RESTART_DELAY_MS) return;
      // Her şeyi başa sar ve "hazır" ekranına dön
      playerY.set(waterY / 2);
      velocity.set(0);
      obstacles.set(createObstacles(width, waterY));
      passengers.set([]);
      shieldTime.set(0);
      level.set(0);
      levelBlend.set(0);
      bannerTime.set(0);
      scoreSV.set(0);
      runOrangesSV.set(0);
      phaseSV.set('ready');
      scheduleOnRN(setScore, 0);
      scheduleOnRN(setRunOranges, 0);
      scheduleOnRN(setPassengerCount, 0);
      scheduleOnRN(setBanner, null);
      scheduleOnRN(setPhase, 'ready');
      return;
    }

    if (current === 'ready') {
      phaseSV.set('playing');
      scheduleOnRN(setPhase, 'playing');
    }

    // Zıplama gücü: modun kendi itişi x yolcular (kuş güçlendirir, diğerleri zayıflatır)
    velocity.set(JUMP_VELOCITY * LEVELS[level.get()].jump * jumpScale(passengers.get()));
    thrust.set(1); // Alev büyüsün, pervane hızlansın, kanat çırpsın
  });

  // Ekran sarsıntısı: sarsıntı süresi azaldıkça sönen titreşim
  const shake = useDerivedValue(() => {
    const strength = (shakeTime.get() / SHAKE_TIME) * SHAKE_AMOUNT;
    return [
      { translateX: Math.sin(clock.get() * 70) * strength },
      { translateY: Math.cos(clock.get() * 55) * strength },
    ];
  });

  const slots = obstacleCount(width);

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        <Canvas style={styles.container}>
          <Group transform={shake}>
            <Background width={width} height={height} levelBlend={levelBlend} />
            {Array.from({ length: slots }, (_, i) => (
              <Obstacle key={i} obstacles={obstacles} index={i} screenHeight={height} />
            ))}
            {Array.from({ length: slots }, (_, i) => (
              <Item key={i} obstacles={obstacles} index={i} clock={clock} />
            ))}
            <Capybara
              x={playerX}
              y={playerY}
              velocity={velocity}
              thrust={thrust}
              propellerPhase={propellerPhase}
              clock={clock}
              passengers={passengers}
              shieldTime={shieldTime}
              level={level}
              phase={phaseSV}
              smileTime={smileTime}
            />
            {/* Deniz en önde: yüzen kapibaranın alt yarısı suyun içinde kalsın */}
            <Water
              width={width}
              height={height}
              scroll={waterScroll}
              splashX={splashX}
              splashTime={splashTime}
            />
          </Group>
        </Canvas>
        <Hud
          phase={phase}
          score={score}
          runOranges={runOranges}
          multiplier={multiplierFor(passengerCount)}
          banner={banner}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
