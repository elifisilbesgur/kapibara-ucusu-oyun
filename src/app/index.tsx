import { Canvas, Group } from '@shopify/react-native-skia';
import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BODY, CAP, FLAME_SMALL, JETPACK, PROPELLER_FRAMES } from '@/art/capybara';
import { BURAK_NORMAL, BURAK_PIXEL } from '@/art/images';
import { SKIES } from '@/art/skies';
import { Background } from '@/components/Background';
import { PixelImage } from '@/components/PixelImage';
import { PixelSprite } from '@/components/PixelSprite';
import { Water } from '@/components/Water';
import { PIXEL_SIZE } from '@/game/constants';
import type { ModeId } from '@/modes/types';
import { useGameStore } from '@/store/useGameStore';

const DARK = '#3B2414';

// Ana menü: arkada oyunun sabah gökyüzü ve denizi, önde mod kartları ve rekorlar.
export default function MainMenu() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bestScores = useGameStore((state) => state.bestScores);

  // Arka plan bileşenleri shared value bekliyor; menüde hepsi sabit
  const levelBlend = useSharedValue(0);
  const still = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Background
          width={width}
          height={height}
          skies={[SKIES[0]]}
          levelBlend={levelBlend}
          scroll={still}
        />
        <Water width={width} height={height} scroll={still} splashX={still} splashTime={still} />
      </Canvas>

      <View style={[styles.content, { paddingTop: insets.top + 48 }]}>
        <Text style={styles.title}>Kapibara{'\n'}Uçuşu</Text>

        <ModeCard id="capybara" name="Kapibara" best={bestScores.capybara} preview={<CapybaraPreview />} />
        <ModeCard id="burak" name="Burak Uçuyor" best={bestScores.burak} preview={<BurakPreview />} />
      </View>
    </View>
  );
}

function ModeCard({
  id,
  name,
  best,
  preview,
}: {
  id: ModeId;
  name: string;
  best: number;
  preview: ReactNode;
}) {
  return (
    <Link href={{ pathname: '/game', params: { mode: id } }} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.preview}>{preview}</View>
        <View style={styles.cardText}>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={styles.cardBest}>En iyi: {best}</Text>
        </View>
        <Text style={styles.play}>▶</Text>
      </Pressable>
    </Link>
  );
}

// Jetpack'li, pervaneli kapibara (oyundaki çizimlerin aynısı, 3x)
function CapybaraPreview() {
  const width = BODY.rows[0].length * PIXEL_SIZE;
  const height = (BODY.rows.length + 2) * PIXEL_SIZE; // +2: şapkanın üstündeki pervane
  return (
    <Canvas style={{ width, height }}>
      <Group transform={[{ scale: PIXEL_SIZE }, { translateY: 2 }]}>
        <PixelSprite sprite={FLAME_SMALL[0]} />
        <PixelSprite sprite={BODY} />
        <PixelSprite sprite={JETPACK} />
        <PixelSprite sprite={CAP} />
        <PixelSprite sprite={PROPELLER_FRAMES[0]} />
      </Group>
    </Canvas>
  );
}

function BurakPreview() {
  return (
    <Canvas
      style={{ width: BURAK_NORMAL.width * BURAK_PIXEL, height: BURAK_NORMAL.height * BURAK_PIXEL }}
    >
      <Group transform={[{ scale: BURAK_PIXEL }]}>
        <PixelImage sprite={BURAK_NORMAL} />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFE6F2',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 44,
    lineHeight: 46,
    fontWeight: '900',
    textAlign: 'center',
    color: 'white',
    textShadowColor: DARK,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: DARK,
    backgroundColor: '#FFF6E8',
  },
  cardPressed: {
    backgroundColor: '#FFE7BF',
    transform: [{ translateY: 2 }],
  },
  preview: {
    width: 72,
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardName: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK,
  },
  cardBest: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A5A44',
  },
  play: {
    fontSize: 22,
    color: DARK,
  },
});
