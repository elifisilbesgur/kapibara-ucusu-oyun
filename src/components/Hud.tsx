import { Canvas, Group } from '@shopify/react-native-skia';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ORANGE } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { ITEM_SIZE, PIXEL_SIZE } from '@/game/constants';
import { useGameStore } from '@/store/useGameStore';

export type GamePhase = 'ready' | 'playing' | 'over';

type Props = {
  phase: GamePhase;
  score: number;
  runOranges: number; // Bu oyunda toplanan portakal
  multiplier: number; // Yolculardan gelen puan çarpanı (1 = yolcusuz)
  banner: string | null; // Yeni moda geçince kısa süre görünen mod adı
};

// Oyunun üstündeki yazılar. pointerEvents="none": dokunuşlar alttaki oyuna geçsin.
export function Hud({ phase, score, runOranges, multiplier, banner }: Props) {
  const insets = useSafeAreaInsets();
  const totalOranges = useGameStore((state) => state.totalOranges);

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <View style={[styles.wallet, { top: insets.top + 16 }]}>
        <OrangeIcon />
        <Text style={styles.walletText}>{totalOranges}</Text>
      </View>

      <Text style={[styles.score, { marginTop: insets.top + 24 }]}>{score}</Text>
      {multiplier > 1 && <Text style={styles.multiplier}>×{multiplier.toFixed(1)}</Text>}

      {banner && phase === 'playing' && (
        <View style={styles.banner}>
          <Text style={styles.bannerLabel}>Yeni mod</Text>
          <Text style={styles.bannerName}>{banner}</Text>
        </View>
      )}

      {phase === 'ready' && <Text style={styles.message}>Uçmak için dokun</Text>}

      {phase === 'over' && (
        <View style={styles.panel}>
          <Text style={styles.title}>Oyun bitti</Text>
          {runOranges > 0 && (
            <View style={styles.row}>
              <Text style={styles.message}>+{runOranges}</Text>
              <OrangeIcon />
            </View>
          )}
          <Text style={styles.message}>Tekrar için dokun</Text>
        </View>
      )}
    </View>
  );
}

// Küçük bir Skia tuvalinde piksel portakal
function OrangeIcon() {
  return (
    <Canvas style={styles.icon}>
      <Group transform={[{ scale: PIXEL_SIZE }]}>
        <PixelSprite sprite={ORANGE} />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wallet: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletText: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  icon: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  score: {
    fontSize: 56,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  multiplier: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFD23F',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  banner: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 36, 20, 0.75)',
    alignItems: 'center',
  },
  bannerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD23F',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerName: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  panel: {
    marginTop: '40%',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#5A3B22',
  },
  message: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#5A3B22',
  },
});
