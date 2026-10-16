import { Group, Rect } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { COLORS, OBSTACLE_GAP, OBSTACLE_WIDTH } from '@/game/constants';
import type { Obstacle as ObstacleData } from '@/game/spawner';

type Props = {
  obstacles: SharedValue<ObstacleData[]>;
  index: number; // Dizideki kaçıncı engeli çizeceğiz
  screenHeight: number;
};

export function Obstacle({ obstacles, index, screenHeight }: Props) {
  // Engelin verisinden çizim için gereken sayıları her karede hesapla
  const x = useDerivedValue(() => obstacles.get()[index].x);
  const topHeight = useDerivedValue(() => obstacles.get()[index].gapY - OBSTACLE_GAP / 2);
  const bottomY = useDerivedValue(() => obstacles.get()[index].gapY + OBSTACLE_GAP / 2);
  const bottomHeight = useDerivedValue(() => screenHeight - bottomY.get());

  return (
    <Group color={COLORS.bamboo}>
      <Rect x={x} y={0} width={OBSTACLE_WIDTH} height={topHeight} />
      <Rect x={x} y={bottomY} width={OBSTACLE_WIDTH} height={bottomHeight} />
    </Group>
  );
}
