import { Rect } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { CELEBRATION_TIME, PIXEL_SIZE } from '@/game/constants';

const COUNT = 28;
const GRAVITY = 900; // Konfetinin düşüşü (dp/s²)
const COLORS = ['#FFD23F', '#E2483D', '#3F7FD9', '#6FAE3E', '#FFFFFF'];

// Sözde rastgele ama hep aynı: 0-1 arası sayı. (Math.random render'da kullanılmaz.)
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Her parçacığın yönü (radyan), hızı (dp/s) ve rengi bir kez belirlenir
const PARTICLES = Array.from({ length: COUNT }, (_, i) => ({
  angle: -Math.PI / 2 + (pseudoRandom(i + 1) - 0.5) * Math.PI * 1.4, // çoğu yukarı doğru, yelpaze gibi
  speed: 220 + pseudoRandom(i + 101) * 260,
  color: COLORS[i % COLORS.length],
}));

type Props = {
  time: SharedValue<number>; // Kutlamanın kalan süresi; > 0 iken görünür
  originX: SharedValue<number>;
  originY: SharedValue<number>;
};

// Kasa tamamlanınca karakterin etrafında patlayan piksel konfeti
export function Confetti(props: Props) {
  return PARTICLES.map((particle, i) => <Particle key={i} particle={particle} {...props} />);
}

function Particle({
  particle,
  time,
  originX,
  originY,
}: Props & { particle: (typeof PARTICLES)[number] }) {
  // t: kutlama başladığından beri geçen süre. Konum = başlangıç + hız·t + ½·g·t²
  const x = useDerivedValue(() => {
    const t = CELEBRATION_TIME - time.get();
    return Math.round(originX.get() + Math.cos(particle.angle) * particle.speed * t);
  });
  const y = useDerivedValue(() => {
    const t = CELEBRATION_TIME - time.get();
    return Math.round(
      originY.get() + Math.sin(particle.angle) * particle.speed * t + 0.5 * GRAVITY * t * t,
    );
  });
  // Sona doğru solar
  const opacity = useDerivedValue(() => Math.min(1, (time.get() / CELEBRATION_TIME) * 2));

  return (
    <Rect
      x={x}
      y={y}
      width={PIXEL_SIZE * 2}
      height={PIXEL_SIZE * 2}
      color={particle.color}
      opacity={opacity}
    />
  );
}
