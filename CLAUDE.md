# Kapibara Uçuşu (çalışma adı) — Expo mobil oyunu

Dokunarak uçulan, sonsuz kayan bir beceri oyunu. Mekanik Flappy Bird'e benzer ama
"Flappy Bird" adı, kuşu ve yeşil boru görselleri KULLANILMAYACAK; ad ve görseller özgün.
Ton: sinir bozucu ama sakinleştirici; kapibaranın sakinliği merkezde.

## Karakter
- Tombul, kahverengi, büyük gözlü, pembe yanaklı kapibara.
- Sırtında jetpack: dokununca alev büyür, bırakınca küçülür.
- Başında pervaneli şapka: pervane sürekli döner, dokunuşta hızlanır.
- Görsel stil: PİKSEL ART (Flippy Nyan'dan stil ilhamı; karakter/görsel kopyalanmaz).
  Çizimler `src/art/` altında metin ızgarası (her harf bir renk, PALETTE). `PixelSprite` ızgarayı
  renk başına tek Skia Path'e çevirir, antiAlias kapalı. Alev ve pervane ayrı kare dizileri (frame).
- Yükselirken burun hafif yukarı, düşerken aşağı döner.

## İlk sürüm mekanikleri
- Fizik: her karede `velocity += gravity * dt`, `y += velocity * dt`; dokununca velocity sabit yukarı değere ayarlanır. Hareket her zaman delta time ile çarpılır.
- Yere/tavana değmek veya engele çarpmak oyunu bitirir.
- Engeller boru değil: ilk sürümde bambu kamışları (üst-alt aralıklı). Sonra nehir taşları, uyuyan timsah, sallanan dallar.
- Portakal toplama: para birimi, AsyncStorage'da kalıcı.
- Yolcu (arkadaş) toplama — oyunun imzası:
  - Kuş, kaplumbağa, maymun gibi hayvanlar yolda bekler; içinden geçince sırta biner, sırtta üst üste görünür.
  - Her yolcu puan çarpanını artırır (1 yolcu ×1.2, 2 yolcu ×1.4 ...).
  - Her yolcu yerçekimini biraz artırır / itişi biraz zayıflatır (risk-ödül).
  - İleride can sistemi gelince çarpmada yolcular dağılır.

## Sonraki sürümler (şimdi yapılmayacak)
Zen modu (chill barı, ağır çekim), onsen güçlendirmesi (dokunulmazlık), karpuz kalkanı,
portakalla açılan kostümler ve araçlar (kanat, balon, kâğıt uçak), bölgeler (Amazon, Japon bahçesi,
karlı dağ, gece şehri), gündüz-gece döngüsü, lo-fi müzik.

## Teknik yığın
- Expo + TypeScript
- @shopify/react-native-skia (çizim)
- react-native-reanimated (useFrameCallback oyun döngüsü, useSharedValue)
- react-native-gesture-handler (dokunma)
- zustand (menü, skor, portakal, kostüm durumu)
- @react-native-async-storage/async-storage (kalıcı kayıt)
- expo-audio, expo-haptics
- Unity kullanılmayacak.

## Mimari
Fizik ve kural mantığı `src/game/` altında saf TypeScript (worklet), React'ten bağımsız.
`src/game/` içindeki HER fonksiyonun ilk satırı `'worklet';` olmalı; eksikse UI thread'den
çağrıldığında uygulama çöker (dokunuş ve frame callback UI thread'de çalışır).

```
src/
  game/        constants.ts, physics.ts, collision.ts, spawner.ts, passengers.ts
  game/        ... animation.ts (itiş, pervane fazı, eğim)
  art/         palette.ts (ortak palet + Sprite tipi), capybara.ts, world.ts (bambu, bulut)
  components/  Capybara.tsx, PixelSprite.tsx, Obstacle.tsx, Orange.tsx, Passenger.tsx, Hud.tsx
  screens/     GameScreen.tsx, MenuScreen.tsx, GameOverScreen.tsx
  store/       useGameStore.ts
assets/        svg/, sounds/
```

Çarpışma: dikdörtgen kesişimi (`intersects(a: Box, b: Box)`).

## Geliştirme adımları
1. Skia Canvas'ta bir daire çiz.
2. useFrameCallback ile yerçekimiyle düşür.
3. Dokununca zıplat.
4. Sağdan gelen bambu engeli; ekrandan çıkınca yenisi.
5. Çarpışma, skor, oyun sonu, tekrar başlat.
6. Daireyi jetpackli, şapkalı kapibarayla değiştir; alev ve pervane animasyonu.
7. Portakallar: toplama, sayaç, kalıcı kayıt.
8. Yolcular: sırtta yığılma, ağırlık etkisi, puan çarpanı.
9. His: ses, haptics, ekran sarsıntısı, parallax arka plan.
10. Cila: menü, en yüksek skor, ayarlar.

## Çalışma şekli
Geliştirici öğreniyor: her adımı birlikte yap ve kodu satır satır açıkla.
Her adım bitince aşağıdaki Durum bölümünü güncelle.

## Durum
- Adım 1 tamam: Skia kuruldu, `GameScreen` tam ekran gökyüzü + ortada kahverengi daire çiziyor.
  Şablon dosyaları (sekmeler, tema) silindi; route tek ekran (`src/app/index.tsx` → `src/screens/GameScreen.tsx`).
- Adım 2 tamam: `src/game/physics.ts` (worklet fizik) + `useFrameCallback` döngüsü; daire düşüyor,
  ekran altından çıkınca geçici olarak ortaya dönüyor (Adım 5'te oyun sonu olacak).
- Adım 3 tamam: `GestureHandlerRootView` layout'ta; `Gesture.Tap().onBegin` ile velocity = JUMP_VELOCITY.
  Tavanda geçici olarak duruyor.
- Adım 4 tamam: `src/game/spawner.ts` (engel havuzu, sola kaydırma, soldan çıkanı en arkaya taşıma)
  + `src/components/Obstacle.tsx` (useDerivedValue ile iki Rect). Görünüm şimdilik düz yeşil dikdörtgen.
- Adım 5 tamam: `collision.ts` (Box, intersects, playerBox, obstacleBoxes, isOutOfBounds),
  `markPassed` ile skor, `components/Hud.tsx` (skor + mesajlar). Faz: ready → playing → over → ready.
  Oyun durumu UI thread'de shared value; React state sadece Hud için, `scheduleOnRN` ile güncelleniyor.
- Adım 6 tamam (piksel art): kapibara + jetpack + pervaneli şapka `src/art/capybara.ts`'te.
  Eğim `tiltFor(velocity)`, alev `thrust` (dokununca 1, söner) ile küçük/büyük + titreme,
  pervane `propellerPhase` ile 4 kare. Çarpışma kutusu artık dikdörtgen (PLAYER_HITBOX_WIDTH/HEIGHT).
- Adım 6b tamam: bambu ve gökyüzü piksel art. Bambu = tekrarlanan boğum (`bambooStalk`),
  üst kamış aynı kamışın scaleY eksi ile ters çevrilmişi. Gökyüzü bantlar + sabit bulutlar
  (`Background.tsx`; parallax Adım 9'da). PixelSprite yan yana aynı renkleri tek dikdörtgende birleştirir.
- Sıradaki adım: 7 (portakallar).
