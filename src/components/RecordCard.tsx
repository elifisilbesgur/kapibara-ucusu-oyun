import {
  Canvas,
  Group,
  ImageFormat,
  matchFont,
  Rect,
  Text as SkiaText,
  useCanvasRef,
  type SkFont,
} from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BALLOON,
  BODY,
  CAP,
  FLAME_BIG,
  JETPACK,
  LEAF_FRAMES,
  PROPELLER_FRAMES,
  SMILE,
  WING_FRAMES,
} from '@/art/capybara';
import { BURAK_NORMAL } from '@/art/images';
import type { Sprite } from '@/art/palette';
import { PALETTE } from '@/art/palette';
import { PASSENGER_PIXEL_HEIGHT, PASSENGER_SPRITES } from '@/art/passengers';
import { PixelImage } from '@/components/PixelImage';
import { PixelSprite } from '@/components/PixelSprite';
import type { PassengerKind } from '@/game/passengers';
import type { ModeId } from '@/modes/types';
import { formatDate } from '@/utils/formatDate';

// Biten rekor oyunun karta basılacak bilgileri
export type RecordInfo = {
  modeId: ModeId;
  modeName: string;
  score: number;
  passengers: PassengerKind[];
  level: number;
  levelName: string;
  skyBands: string[];
};

const CARD = { width: 300, height: 420 };
const FEET_Y = 340; // Karakterin ayaklarının karttaki yüksekliği
const WATER_Y = 345;
const CAPYBARA_SCALE = 4;
const BURAK_SCALE = 3;
const DARK = '#3B2414';

// Ulaşılan seviyenin kıyafeti (Capybara.tsx'teki modların donmuş hali)
const GEAR: Sprite[][] = [
  [LEAF_FRAMES[0]],
  [BALLOON],
  [CAP, PROPELLER_FRAMES[0]],
  [WING_FRAMES[0]],
  [FLAME_BIG[0], JETPACK, CAP, PROPELLER_FRAMES[0]],
];

type Props = {
  record: RecordInfo | null; // null: bu oyunda rekor yok, düğme de çıkmaz
};

// Rekor kırılınca: "📸 Rekor kartı" düğmesi → kart önizlemesi → Paylaş (PNG).
// Oyunun dokunma algılayıcısının DIŞINDA durur (GameMenu gibi): dokunmak oyunu yeniden başlatmaz.
export function RecordCard({ record }: Props) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const canvasRef = useCanvasRef();

  if (!record) return null;

  // Kartın anlık görüntüsü → PNG dosyası → telefonun paylaşma menüsü
  const share = async () => {
    setSharing(true);
    try {
      const image = await canvasRef.current?.makeImageSnapshotAsync();
      if (!image) return;
      const file = new File(Paths.cache, `kapibara-rekor-${Date.now()}.png`);
      file.create();
      file.write(image.encodeToBytes(ImageFormat.PNG));
      await Sharing.shareAsync(file.uri, {
        mimeType: 'image/png',
        dialogTitle: 'Rekor kartını paylaş',
        UTI: 'public.png',
      });
    } catch {
      // Kullanıcı paylaşmayı iptal ettiyse ya da paylaşım yoksa sessizce geç
    } finally {
      setSharing(false);
    }
  };

  if (!open) {
    return (
      <Pressable
        style={[styles.openButton, { bottom: insets.bottom + 96 }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text style={styles.openText}>📸 Rekor kartı</Text>
      </Pressable>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.backdrop]}>
      <Canvas ref={canvasRef} style={CARD}>
        <CardArt record={record} />
      </Canvas>
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={share} disabled={sharing}>
          <Text style={styles.actionText}>{sharing ? 'Hazırlanıyor…' : 'Paylaş'}</Text>
        </Pressable>
        <Pressable style={[styles.action, styles.secondary]} onPress={() => setOpen(false)}>
          <Text style={[styles.actionText, styles.secondaryText]}>Kapat</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Kartın kendisi (hepsi Skia: anlık görüntüye her şey girsin diye yazılar da Skia'da)
function CardArt({ record }: { record: RecordInfo }) {
  const fonts = useMemo(() => {
    const family = Platform.select({ ios: 'Helvetica', default: 'sans-serif' });
    return {
      title: matchFont({ fontFamily: family, fontSize: 26, fontWeight: 'bold' }),
      score: matchFont({ fontFamily: family, fontSize: 72, fontWeight: 'bold' }),
      small: matchFont({ fontFamily: family, fontSize: 15, fontWeight: 'bold' }),
    };
  }, []);

  const bandHeight = Math.ceil(CARD.height / record.skyBands.length);

  return (
    <>
      {record.skyBands.map((color, i) => (
        <Rect key={i} x={0} y={i * bandHeight} width={CARD.width} height={bandHeight} color={color} />
      ))}

      <ShadowText text="YENİ REKOR!" y={56} font={fonts.title} color="#FFD23F" />
      <ShadowText text={String(record.score)} y={136} font={fonts.score} color="white" />

      {record.modeId === 'capybara' ? (
        <CardCapybara level={record.level} passengers={record.passengers} />
      ) : (
        <Group
          transform={[
            { translateX: Math.round((CARD.width - BURAK_NORMAL.width * BURAK_SCALE) / 2) },
            { translateY: FEET_Y - BURAK_NORMAL.height * BURAK_SCALE },
            { scale: BURAK_SCALE },
          ]}
        >
          <PixelImage sprite={BURAK_NORMAL} />
        </Group>
      )}

      {/* Alttaki deniz şeridi */}
      <Rect x={0} y={WATER_Y} width={CARD.width} height={6} color={PALETTE.w} />
      <Rect x={0} y={WATER_Y + 6} width={CARD.width} height={CARD.height} color={PALETTE.I} />

      <ShadowText
        text={`${record.modeName} · ${record.levelName}`}
        y={382}
        font={fonts.small}
        color="white"
      />
      <ShadowText
        text={`${formatDate(new Date())} · Kapibara Uçuşu`}
        y={404}
        font={fonts.small}
        color="#BFE6F2"
      />
    </>
  );
}

// Ulaştığı modun kıyafetiyle, sırtında bütün yolcularla gülümseyen kapibara
function CardCapybara({ level, passengers }: { level: number; passengers: PassengerKind[] }) {
  const width = BODY.rows[0].length * CAPYBARA_SCALE;
  const height = BODY.rows.length * CAPYBARA_SCALE;
  return (
    <Group
      transform={[
        { translateX: Math.round((CARD.width - width) / 2) },
        { translateY: FEET_Y - height },
        { scale: CAPYBARA_SCALE },
      ]}
    >
      <PixelSprite sprite={BODY} />
      <PixelSprite sprite={SMILE} />
      {(GEAR[level] ?? []).map((sprite, i) => (
        <PixelSprite key={i} sprite={sprite} />
      ))}
      {passengers.map((kind, slot) => (
        <Group key={slot} transform={[{ translateX: 3 }, { translateY: 4 - PASSENGER_PIXEL_HEIGHT * (slot + 1) }]}>
          <PixelSprite sprite={PASSENGER_SPRITES[kind]} />
        </Group>
      ))}
    </Group>
  );
}

// Ortalanmış, koyu gölgeli yazı (gölge 2 dp sağ-aşağıda)
function ShadowText({ text, y, font, color }: { text: string; y: number; font: SkFont; color: string }) {
  const x = Math.round((CARD.width - font.measureText(text).width) / 2);
  return (
    <>
      <SkiaText x={x + 2} y={y + 2} text={text} font={font} color={DARK} />
      <SkiaText x={x} y={y} text={text} font={font} color={color} />
    </>
  );
}

const styles = StyleSheet.create({
  openButton: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: DARK,
    backgroundColor: '#FFD23F',
  },
  openText: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
  },
  backdrop: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: DARK,
    backgroundColor: '#FFD23F',
  },
  actionText: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
  },
  secondary: {
    backgroundColor: '#FFF6E8',
  },
  secondaryText: {
    color: DARK,
  },
});
