import { Canvas } from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Background } from '@/components/Background';
import { Capybara } from '@/components/Capybara';
import { Hud, type GamePhase } from '@/components/Hud';
import { Item } from '@/components/Item';
import { Obstacle } from '@/components/Obstacle';
import { stepPropeller, stepThrust } from '@/game/animation';
import { hitsAnyObstacle, isOutOfBounds, playerBox } from '@/game/collision';
import {
  JUMP_VELOCITY,
  LEVEL_BANNER_TIME,
  LEVELS,
  PLAYER_HITBOX_WIDTH,
  PLAYER_X_RATIO,
  POINTS_PER_GATE,
  RESTART_DELAY_MS,
  SHIELD_TIME,
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
import { frameDeltaSeconds, stepPosition, stepVelocity } from '@/game/physics';
import { createObstacles, markPassed, obstacleCount, stepObstacles } from '@/game/spawner';
import { useGameStore } from '@/store/useGameStore';

export default function GameScreen() {
  const { width, height } = useWindowDimensions();

  // React tarafı: sadece ekrandaki yazılar için (seyrek değişir)
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [score, setScore] = useState(0);
  const [runOranges, setRunOranges] = useState(0);
  const [passengerCount, setPassengerCount] = useState(0);
  const [banner, setBanner] = useState<string | null>(null); // "Yeni mod: Balon" gibi
  const addOranges = useGameStore((state) => state.addOranges);

  // UI thread tarafı: oyunun kendisi (her karede değişir)
  const playerX = width * PLAYER_X_RATIO;
  const playerY = useSharedValue(height / 2);
  const velocity = useSharedValue(0);
  const obstacles = useSharedValue(createObstacles(width, height));
  const passengers = useSharedValue<PassengerKind[]>([]);
  const shieldTime = useSharedValue(0); // > 0 iken bambulara çarpmak zarar vermez
  const phaseSV = useSharedValue<GamePhase>('ready');
  const scoreSV = useSharedValue(0);
  const runOrangesSV = useSharedValue(0);
  const msSinceGameOver = useSharedValue(0);
  const level = useSharedValue(0); // 0-4: hangi mod
  const levelBlend = useSharedValue(0); // gökyüzü geçişi için yumuşak seviye
  const bannerTime = useSharedValue(0); // "yeni mod" yazısının kalan süresi

  // Sadece görünüm için: alev, pervane, titreme
  const thrust = useSharedValue(0);
  const propellerPhase = useSharedValue(0);
  const clock = useSharedValue(0);

  useFrameCallback((frame) => {
    const dt = frameDeltaSeconds(frame.timeSincePreviousFrame);

    // Animasyonlar her fazda çalışır (beklerken de pervane dönsün)
    clock.set(clock.get() + dt);
    thrust.set(stepThrust(thrust.get(), dt));
    propellerPhase.set(stepPropeller(propellerPhase.get(), thrust.get(), dt));
    levelBlend.set(stepLevelBlend(levelBlend.get(), level.get(), dt));
    if (bannerTime.get() > 0) {
      bannerTime.set(bannerTime.get() - dt);
      if (bannerTime.get() <= 0) scheduleOnRN(setBanner, null);
    }

    if (phaseSV.get() === 'over') {
      msSinceGameOver.set(msSinceGameOver.get() + (frame.timeSincePreviousFrame ?? 0));
      return;
    }
    if (phaseSV.get() !== 'playing') return; // Hazırken dünya donuk

    // Fizik: modun kendi hissi x yolcuların ağırlığı
    const mode = LEVELS[level.get()];
    const gravity = mode.gravity * gravityScale(passengers.get());
    velocity.set(stepVelocity(velocity.get(), dt, gravity, mode.maxFall));
    playerY.set(stepPosition(playerY.get(), velocity.get(), dt));
    obstacles.set(stepObstacles(obstacles.get(), dt, height, mode.speed));
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
      }
    }

    const box = playerBox(playerX, playerY.get());

    // Toplama: portakallar kumbaraya, yolcular sırta
    const picked = collectItems(obstacles.get(), box, passengers.get());
    obstacles.set(picked.obstacles);
    if (picked.oranges > 0) {
      runOrangesSV.set(runOrangesSV.get() + picked.oranges);
      scheduleOnRN(setRunOranges, runOrangesSV.get());
      scheduleOnRN(addOranges, picked.oranges);
    }
    if (picked.newPassengers.length > 0) {
      passengers.set([...passengers.get(), ...picked.newPassengers]);
      scheduleOnRN(setPassengerCount, passengers.get().length);
    }

    // Çarpışma: yer/tavan her zaman biter; bambuya çarpınca kaplumbağa kurtarabilir
    const hitBamboo = shieldTime.get() === 0 && hitsAnyObstacle(box, obstacles.get(), height);
    if (hitBamboo && passengers.get().includes('turtle')) {
      passengers.set(removeTopmost(passengers.get(), 'turtle'));
      shieldTime.set(SHIELD_TIME);
      scheduleOnRN(setPassengerCount, passengers.get().length);
    } else if (hitBamboo || isOutOfBounds(box, height)) {
      phaseSV.set('over');
      msSinceGameOver.set(0);
      scheduleOnRN(setPhase, 'over');
    }
  });

  // Parmak ekrana değdiği an (kaldırmayı beklemeden) tepki ver
  const tap = Gesture.Tap().onBegin(() => {
    const current = phaseSV.get();

    if (current === 'over') {
      if (msSinceGameOver.get() < RESTART_DELAY_MS) return;
      // Her şeyi başa sar ve "hazır" ekranına dön
      playerY.set(height / 2);
      velocity.set(0);
      obstacles.set(createObstacles(width, height));
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
    thrust.set(1); // Alev büyüsün, pervane hızlansın
  });

  const slots = obstacleCount(width);

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        <Canvas style={styles.container}>
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
          />
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
