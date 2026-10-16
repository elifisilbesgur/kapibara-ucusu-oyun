import { FilterMode, Image, MipmapMode, useImage } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

import type { ImageSprite } from '@/art/images';

// En yakın komşu örnekleme: büyütürken pikseller yumuşatılmaz, keskin kare kalır.
const NEAREST = { filter: FilterMode.Nearest, mipmap: MipmapMode.None };

type Props = {
  sprite: ImageSprite;
  opacity?: SharedValue<number>;
};

// PNG'yi sanat pikseli biriminde çizer (1 birim = 1 sanat pikseli).
// Büyütme işini dışarıdaki Group'un tam sayı scale'i yapar, tıpkı PixelSprite gibi.
export function PixelImage({ sprite, opacity }: Props) {
  const image = useImage(sprite.source); // Dosya yüklenene kadar null
  if (!image) return null;

  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={sprite.width}
      height={sprite.height}
      fit="fill"
      sampling={NEAREST}
      opacity={opacity}
    />
  );
}
