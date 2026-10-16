import { Canvas, Circle, Fill } from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Hud, type GamePhase } from '@/components/Hud';
import { Obstacle } from '@/components/Obstacle';
import { hitsAnyObstacle, isOutOfBounds, playerBox } from '@/game/collision';
import {
  COLORS,
  JUMP_VELOCITY,
  PLAYER_RADIUS,
  PLAYER_X_RATIO,
  RESTART_DELAY_MS,
} from '@/game/constants';
import { frameDeltaSeconds, stepPosition, stepVelocity } from '@/game/physics';
import { createObstacles, markPassed, obstacleCount, stepObstacles } from '@/game/spawner';

export default function GameScreen() {
  const { width, height } = useWindowDimensions();

  // React tarafı: sadece ekrandaki yazılar için (seyrek değişir)
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [score, setScore] = useState(0);

  // UI thread tarafı: oyunun kendisi (her karede değişir)
  const playerX = width * PLAYER_X_RATIO;
  const playerY = useSharedValue(height / 2);
  const velocity = useSharedValue(0);
  const obstacles = useSharedValue(createObstacles(width, height));
  const phaseSV = useSharedValue<GamePhase>('ready');
  const scoreSV = useSharedValue(0);
  const msSinceGameOver = useSharedValue(0);

  useFrameCallback((frame) => {
    if (phaseSV.get() === 'over') {
      msSinceGameOver.set(msSinceGameOver.get() + (frame.timeSincePreviousFrame ?? 0));
      return;
    }
    if (phaseSV.get() !== 'playing') return; // Hazırken dünya donuk

    const dt = frameDeltaSeconds(frame.timeSincePreviousFrame);

    velocity.set(stepVelocity(velocity.get(), dt));
    playerY.set(stepPosition(playerY.get(), velocity.get(), dt));
    obstacles.set(stepObstacles(obstacles.get(), dt, height));

    // Puan: geçilen engeller
    const scored = markPassed(obstacles.get(), playerX - PLAYER_RADIUS);
    obstacles.set(scored.obstacles);
    if (scored.newlyPassed > 0) {
      scoreSV.set(scoreSV.get() + scored.newlyPassed);
      scheduleOnRN(setScore, scoreSV.get());
    }

    // Çarpışma: yer, tavan ya da bambu
    const box = playerBox(playerX, playerY.get(), PLAYER_RADIUS);
    if (isOutOfBounds(box, height) || hitsAnyObstacle(box, obstacles.get(), height)) {
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
      scoreSV.set(0);
      phaseSV.set('ready');
      scheduleOnRN(setScore, 0);
      scheduleOnRN(setPhase, 'ready');
      return;
    }

    if (current === 'ready') {
      phaseSV.set('playing');
      scheduleOnRN(setPhase, 'playing');
    }

    velocity.set(JUMP_VELOCITY);
  });

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        <Canvas style={styles.container}>
          <Fill color={COLORS.sky} />
          {Array.from({ length: obstacleCount(width) }, (_, i) => (
            <Obstacle key={i} obstacles={obstacles} index={i} screenHeight={height} />
          ))}
          <Circle cx={playerX} cy={playerY} r={PLAYER_RADIUS} color={COLORS.player} />
        </Canvas>
        <Hud phase={phase} score={score} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
