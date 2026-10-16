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
  PLAYER_HITBOX_WIDTH,
  PLAYER_X_RATIO,
  POINTS_PER_GATE,
  RESTART_DELAY_MS,
  SHIELD_TIME,
} from '@/game/constants';
import { collectItems } from '@/game/items';
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

    if (phaseSV.get() === 'over') {
      msSinceGameOver.set(msSinceGameOver.get() + (frame.timeSincePreviousFrame ?? 0));
      return;
    }
    if (phaseSV.get() !== 'playing') return; // Hazırken dünya donuk

    // Fizik: yolcular ağırlaştırır
    velocity.set(stepVelocity(velocity.get(), dt, gravityScale(passengers.get())));
    playerY.set(stepPosition(playerY.get(), velocity.get(), dt));
    obstacles.set(stepObstacles(obstacles.get(), dt, height));
    shieldTime.set(Math.max(0, shieldTime.get() - dt));

    // Puan: geçilen her engel, yolcu çarpanıyla
    const scored = markPassed(obstacles.get(), playerX - PLAYER_HITBOX_WIDTH / 2);
    obstacles.set(scored.obstacles);
    if (scored.newlyPassed > 0) {
      const multiplier = multiplierFor(passengers.get().length);
      scoreSV.set(scoreSV.get() + Math.round(scored.newlyPassed * POINTS_PER_GATE * multiplier));
      scheduleOnRN(setScore, scoreSV.get());
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
      scoreSV.set(0);
      runOrangesSV.set(0);
      phaseSV.set('ready');
      scheduleOnRN(setScore, 0);
      scheduleOnRN(setRunOranges, 0);
      scheduleOnRN(setPassengerCount, 0);
      scheduleOnRN(setPhase, 'ready');
      return;
    }

    if (current === 'ready') {
      phaseSV.set('playing');
      scheduleOnRN(setPhase, 'playing');
    }

    // Yolcular zıplamayı zayıflatır (kuş güçlendirir)
    velocity.set(JUMP_VELOCITY * jumpScale(passengers.get()));
    thrust.set(1); // Alev büyüsün, pervane hızlansın
  });

  const slots = obstacleCount(width);

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        <Canvas style={styles.container}>
          <Background width={width} height={height} />
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
          />
        </Canvas>
        <Hud
          phase={phase}
          score={score}
          runOranges={runOranges}
          multiplier={multiplierFor(passengerCount)}
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
