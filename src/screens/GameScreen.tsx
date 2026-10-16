import { Canvas, Circle, Fill } from '@shopify/react-native-skia';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { COLORS, PLAYER_RADIUS, PLAYER_X_RATIO } from '@/game/constants';

export default function GameScreen() {
  const { width, height } = useWindowDimensions();

  const playerX = width * PLAYER_X_RATIO;
  const playerY = height / 2;

  return (
    <Canvas style={styles.canvas}>
      <Fill color={COLORS.sky} />
      <Circle cx={playerX} cy={playerY} r={PLAYER_RADIUS} color={COLORS.player} />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
