import { Group, Rect } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import type { Sprite } from '@/art/palette';
import type { Sky } from '@/art/skies';
import { MOON, STAR } from '@/art/world';
import { PixelSprite } from '@/components/PixelSprite';
import { PIXEL_SIZE, WATER_HEIGHT } from '@/game/constants';

// Bulut, yıldız ve ayın yeri ekranın oranı olarak: her ekran boyunda benzer dağılım.
// depth: kayma hızı, engellere göre (küçük = uzak = yavaş). Her bulut biraz farklı → derinlik hissi.
const CLOUDS = [
  { x: 0.08, y: 0.1, depth: 0.12 },
  { x: 0.62, y: 0.2, depth: 0.16 },
  { x: 0.3, y: 0.42, depth: 0.2 },
  { x: 0.75, y: 0.62, depth: 0.24 },
  { x: 0.12, y: 0.78, depth: 0.22 },
];
const STARS = [
  { x: 0.05, y: 0.04 },
  { x: 0.4, y: 0.08 },
  { x: 0.9, y: 0.3 },
  { x: 0.2, y: 0.33 },
  { x: 0.55, y: 0.5 },
  { x: 0.85, y: 0.72 },
  { x: 0.35, y: 0.88 },
];
const MOON_POSITION = { x: 0.72, y: 0.06 };
const SKYLINE_GAP = 3; // Kıyıdaki şeyler arasında bu kadar piksel boşluk
const SKYLINE_DEPTH = 0.35; // Kıyı bulutlardan yakın, engellerden uzak

// Kıyı silüeti: sprite'ları soldan sağa ekranı dolduracak kadar sırayla diz.
// Toplam uzunluğu da döndürür: kayarken aynı diziden ikinci bir kopya hemen arkasına konur.
function layoutSkyline(sprites: Sprite[], screenWidth: number) {
  const placed: { sprite: Sprite; x: number }[] = [];
  let x = 0;
  for (let i = 0; x * PIXEL_SIZE < screenWidth; i++) {
    const sprite = sprites[i % sprites.length];
    placed.push({ sprite, x });
    x += sprite.rows[0].length + SKYLINE_GAP;
  }
  return { placed, length: x * PIXEL_SIZE };
}

type Props = {
  width: number;
  height: number;
  skies: Sky[]; // Modun seviye başına gökyüzleri
  levelBlend: SharedValue<number>; // 0 → son seviye arası yumuşak seviye
  scroll: SharedValue<number>; // Dünyanın ne kadar kaydığı (dp); arka plan bunun kesri kadar kayar
};

// Her seviyenin gökyüzü üst üste çizilir; yenisi, levelBlend ilerledikçe görünür hale gelir.
export function Background({ width, height, skies, levelBlend, scroll }: Props) {
  return skies.map((sky, level) => (
    <SkyLayer
      key={level}
      sky={sky}
      level={level}
      levelBlend={levelBlend}
      scroll={scroll}
      width={width}
      height={height}
    />
  ));
}

function SkyLayer({
  sky,
  level,
  levelBlend,
  scroll,
  width,
  height,
}: {
  sky: Sky;
  level: number;
  levelBlend: SharedValue<number>;
  scroll: SharedValue<number>;
  width: number;
  height: number;
}) {
  // Seviye 0 hep tam görünür (en altta). Seviye 2: blend 1→2 giderken 0→1 belirginleşir.
  const opacity = useDerivedValue(() =>
    level === 0 ? 1 : Math.min(1, Math.max(0, levelBlend.get() - (level - 1))),
  );
  const bandHeight = Math.ceil(height / sky.bands.length);

  const at = (position: { x: number; y: number }) => [
    { translateX: Math.round(position.x * width) },
    { translateY: Math.round(position.y * height) },
    { scale: PIXEL_SIZE },
  ];

  return (
    <Group opacity={opacity}>
      {sky.bands.map((color, i) => (
        <Rect key={i} x={0} y={i * bandHeight} width={width} height={bandHeight} color={color} />
      ))}
      {sky.night && (
        <>
          {STARS.map((star, i) => (
            <Group key={i} transform={at(star)}>
              <PixelSprite sprite={STAR} />
            </Group>
          ))}
          <Group transform={at(MOON_POSITION)}>
            <PixelSprite sprite={MOON} />
          </Group>
        </>
      )}
      {CLOUDS.map((cloud, i) => (
        <Drifting
          key={i}
          sprite={sky.floaters[i % sky.floaters.length]}
          start={cloud}
          depth={cloud.depth}
          scroll={scroll}
          width={width}
          height={height}
        />
      ))}
      {sky.skyline && (
        <Skyline sprites={sky.skyline} scroll={scroll} width={width} height={height} />
      )}
    </Group>
  );
}

// Uzakta süzülen tek bir şey (bulut, disket...). Soldan çıkınca sağdan geri girer.
function Drifting({
  sprite,
  start,
  depth,
  scroll,
  width,
  height,
}: {
  sprite: Sprite;
  start: { x: number; y: number };
  depth: number;
  scroll: SharedValue<number>;
  width: number;
  height: number;
}) {
  const spriteWidth = sprite.rows[0].length * PIXEL_SIZE;
  const loop = width + spriteWidth; // Bir tur: ekranın sağından girip solundan tamamen çıkana kadar

  const transform = useDerivedValue(() => {
    // + spriteWidth: kayma 0'ken bulut tam başlangıç yerinde dursun (aşağıda geri çıkarılıyor)
    const travelled = start.x * width + spriteWidth - scroll.get() * depth;
    // Bölümden kalan (eksi sayılar için de doğru çalışan hali): 0 ile loop arası
    const wrapped = ((travelled % loop) + loop) % loop;
    return [
      { translateX: Math.round(wrapped - spriteWidth) },
      { translateY: Math.round(start.y * height) },
      { scale: PIXEL_SIZE },
    ];
  });

  return (
    <Group transform={transform}>
      <PixelSprite sprite={sprite} />
    </Group>
  );
}

// Deniz kıyısındaki dizi; iki kopya arka arkaya kayar, biri çıkınca diğeri yerini alır
function Skyline({
  sprites,
  scroll,
  width,
  height,
}: {
  sprites: Sprite[];
  scroll: SharedValue<number>;
  width: number;
  height: number;
}) {
  const { placed, length } = layoutSkyline(sprites, width);

  const transform = useDerivedValue(() => [
    { translateX: -Math.round((scroll.get() * SKYLINE_DEPTH) % length) },
  ]);

  return (
    <Group transform={transform}>
      {[0, length].map((copyX) =>
        placed.map(({ sprite, x }, i) => (
          <Group
            key={`${copyX}-${i}`}
            transform={[
              { translateX: copyX + x * PIXEL_SIZE },
              // Alt kenarı deniz yüzeyine otursun
              { translateY: height - WATER_HEIGHT - sprite.rows.length * PIXEL_SIZE },
              { scale: PIXEL_SIZE },
            ]}
          >
            <PixelSprite sprite={sprite} />
          </Group>
        )),
      )}
    </Group>
  );
}
