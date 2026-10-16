import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type GamePhase = 'ready' | 'playing' | 'over';

type Props = {
  phase: GamePhase;
  score: number;
};

// Oyunun üstündeki yazılar. pointerEvents="none": dokunuşlar alttaki oyuna geçsin.
export function Hud({ phase, score }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      <Text style={[styles.score, { marginTop: insets.top + 24 }]}>{score}</Text>

      {phase === 'ready' && <Text style={styles.message}>Uçmak için dokun</Text>}

      {phase === 'over' && (
        <View style={styles.panel}>
          <Text style={styles.title}>Oyun bitti</Text>
          <Text style={styles.message}>Tekrar için dokun</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  score: {
    fontSize: 56,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  panel: {
    marginTop: '40%',
    alignItems: 'center',
    gap: 8,
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
