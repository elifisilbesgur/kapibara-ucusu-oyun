import { Canvas, Circle, Fill } from '@shopify/react-native-skia';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';

import { COLORS, JUMP_VELOCITY, PLAYER_RADIUS, PLAYER_X_RATIO } from '@/game/constants';
import { frameDeltaSeconds, stepPosition, stepVelocity } from '@/game/physics';

export default function GameScreen() {
  const { width, height } = useWindowDimensions();

  const playerX = width * PLAYER_X_RATIO;
  const playerY = useSharedValue(height / 2);
  const velocity = useSharedValue(0);

  useFrameCallback((frame) => {
    const dt = frameDeltaSeconds(frame.timeSincePreviousFrame);

    velocity.set(stepVelocity(velocity.get(), dt));
    playerY.set(stepPosition(playerY.get(), velocity.get(), dt));

    // Geçici: tavanda dur (Adım 5'te tavana değmek oyunu bitirecek)
    if (playerY.get() - PLAYER_RADIUS < 0) {
      playerY.set(PLAYER_RADIUS);
      velocity.set(0);
    }

    // Geçici: ekrandan çıkınca ortaya geri koy (Adım 5'te oyun sonu olacak)
    if (playerY.get() - PLAYER_RADIUS > height) {
      playerY.set(height / 2);
      velocity.set(0);
    }
  });

  // Parmak ekrana değdiği an (kaldırmayı beklemeden) zıpla
  const tap = Gesture.Tap().onBegin(() => {
    velocity.set(JUMP_VELOCITY);
  });

  return (
    <GestureDetector gesture={tap}>
      <Canvas style={styles.canvas}>
        <Fill color={COLORS.sky} />
        <Circle cx={playerX} cy={playerY} r={PLAYER_RADIUS} color={COLORS.player} />
      </Canvas>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
