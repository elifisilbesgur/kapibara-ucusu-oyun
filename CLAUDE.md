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
- Modlar (oyun içinde skorla evrim): Yaprak kanat → Balon (25) → Pervaneli şapka (75) →
  Kuş kanatları (150) → Jetpack + şapka (300). Her modun uçuş hissi farklı; arka plan da
  sabahtan geceye değişir. Her yeni oyun yaprak kanatla başlar.

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
Worklet'te varsayılan parametre DIŞ bir sabite bakmasın (`maxFall = MAX_FALL_SPEED` YASAK): derlenmiş
kodda parametre, `this.__closure` açılmadan önce değerlendirilir → sabit tanımsız → uygulama kapanır
(çarpınca kapanma hatası buydu). Varsayılanı gövdede ver: `maxFall ?? MAX_FALL_SPEED`. Sayı sabiti (`= 1`) sorun değil.
Tedbir olarak bileşen gövdesinde ayrı `'worklet'` fonksiyonu da tanımlama (React Compiler açık);
yardımcı gerekiyorsa `src/game/` içine ya da useFrameCallback'in içine koy.

```
src/
  app/         _layout.tsx, index.tsx (ana menü), game.tsx (?mode=capybara|burak)
  game/        (worklet) constants, physics, collision, spawner, items, passengers, levels, kit,
               animation, phase
  modes/       types.ts (GameMode = rules + view), capybara.ts, burak.ts, index.ts (MODES)
  art/         palette.ts (ortak palet + Sprite tipi), capybara.ts, passengers.ts, world.ts,
               skies.ts, office.ts (metin ızgaraları); images.ts (PNG sprite'lar)
  components/  Capybara, BurakPlayer, Obstacle (bambu), CableObstacle, Item, PartItem, Background,
               Water, Confetti, Hud, GameMenu, PixelSprite, PixelImage
  screens/     GameScreen.tsx (tek motor, `mode` prop'u alır)
  store/       useGameStore.ts (portakal + moda göre rekor, AsyncStorage)
  feedback/    haptics.ts, sounds.ts
scripts/       make-sounds.py (ses efektlerini üretir)
assets/        sprites/ (Burak Uçuyor PNG'leri), sounds/ (üretilmiş WAV'lar)
```

Çarpışma: dikdörtgen kesişimi (`intersects(a: Box, b: Box)`).

## Burak Uçuyor modu
Kapibara ile aynı motor; fark yalnızca `src/modes/burak.ts` yapılandırmasında.
- Karakter: `burak_normal` / `burak_happy` PNG (`assets/sprites/`). Parçaya değince 500 ms gülen yüz
  (`joyTime`), yeni parça süreyi sıfırlar. Kapibarayla aynı eğim (`tiltFor`).
- Görseller 1x PNG + Skia nearest filtre, TAM SAYI ölçek: Burak ve parçalar 2x (`BURAK_PIXEL`),
  kablo/deniz/arka plan 3x (`PIXEL_SIZE`). Boyutlar `art/images.ts`'te sabit (Metro @6x/@8x'i
  ekrana göre seçebilir; boyutu dosyadan okumayız).
- Engel: CAT6 kablo çifti (`CableObstacle.tsx`). Uçlar `cable_head_down/up`, gövde `cable_body_tile`
  ImageShader ile dikeyde döşenir. Geçit 260 → 200 (puan başına 1 dp daralır, engel doğarken belirlenir).
  Çarpışma toleransı `obstacleInset` {x: 4px, y: 2px} (karo 18 px, kablo 9-13 px).
- Parçalar (`PartItem.tsx`): RAM 1p, SSD 2p, CPU 3p, GPU 5p (nadir); %30'u geçidin içinde.
  Engel başına 1 puan.
- Kasa (`game/kit.ts`, bit maskesi): her türden bir parça → +10 bonus, konfeti, titreşim, kasa sıfırlanır.
- Arka plan `OFFICE_SKY`: soluk mavi bilgisayarlar (kıyıda), süzülen disket/imleç/monitör.
- Yolcular, portakal, mod evrimi ve gökyüzü değişimi bu modda yok (kurallarda tanımlı değil).
- Ana menüde mod kartları; oyun içinde sol üstte hamburger menü (mod değiştir / ana menü).
  Her modun rekoru ayrı (`bestScores`), oyun sonunda "Yeni rekor!".

## Geliştirme adımları
1. Skia Canvas'ta bir daire çiz.
2. useFrameCallback ile yerçekimiyle düşür.
3. Dokununca zıplat.
4. Sağdan gelen bambu engeli; ekrandan çıkınca yenisi.
5. Çarpışma, skor, oyun sonu, tekrar başlat.
6. Daireyi jetpackli, şapkalı kapibarayla değiştir; alev ve pervane animasyonu.
7. Portakallar: toplama, sayaç, kalıcı kayıt.
8. Yolcular: sırtta yığılma, ağırlık etkisi, puan çarpanı + özel yetenekler
   (kuş: itişi güçlendirir; kaplumbağa: ağır ama bir çarpmayı kabuğuyla karşılar;
   maymun: yakındaki portakalları kendisi toplar).
9. His: ses, haptics, ekran sarsıntısı, parallax arka plan.
   + Tepkisiz kapibara: yüz ifadesi hiç değişmez, yalnızca portakal yerken minicik gülümser.
   + Kayıp ekranı: çarpınca dramatik değil; yavaşça suya düşer, sırtüstü yüzer, yolcular
     üstünde güneşlenir (ekranın altına su/nehir şeridi gerekir).
10. Cila: menü, en yüksek skor, ayarlar.
11. Esneme: uzun süre dokunulmazsa esneyip gözlerini kapatır, kontrol hafifçe ağırlaşır;
    portakal yiyince ayılır.
12. Yolcu bırakma durakları: nehir kenarında duraklar; yolcuları indirirsen o ana kadarki
    puan "kasaya" girer, indirmezsen çarpan büyür ama risk de ("devam mı, bırak mı").
13. Rüzgâr ve akıntılar: bazı bölgelerde hafif yukarı/aşağı rüzgâr; bambu yapraklarının
    savrulmasından fark edilir.
14. Arkadaş defteri: toplanan her hayvan türü albüme "anı fotoğrafı" olarak kaydedilir.
15. Günün yolcusu: her gün farklı nadir bir hayvan (baykuş, flamingo, minik penguen).
16. Fotoğraf modu: rekor kırınca sırttaki yolcularla paylaşılabilir bir kart.

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
- Adım 7 tamam: portakal her engelin ÖNÜNDEKİ boşluğun ortasında (`Obstacle.hasOrange/orangeY`,
  `game/oranges.ts`). obstacleCount bir fazla engel tutar ki portakal ekran dışında belirsin.
  Toplam portakal `store/useGameStore.ts` (zustand persist + AsyncStorage, anahtar 'kapibara-ucusu').
  Hud: sağ üstte kumbara, oyun sonunda "+N".
- Adım 8 tamam: engel önündeki şey artık `item: 'none'|'orange'|PassengerKind` (`game/items.ts`,
  oranges.ts silindi). Yolcular `passengers` shared value'da, sırtta en fazla 5 kat (Capybara.tsx).
  Ağırlık/zıplama `PASSENGER_STATS` (constants), puan = 10 x çarpan (1 + 0.2 x yolcu).
  Kuş: jump x1.06. Kaplumbağa: bambu çarpmasında en üstteki kaplumbağa iner, 1.2 sn dokunulmazlık
  (yanıp sönme). Maymun: portakal toplama kutusu +60 dp (görsel çekim efekti henüz yok).
- Adım 8b tamam (modlar + seviyeler): oyun içinde evrim, her oyun yaprakla başlar.
  `LEVELS` (constants): Yaprak 0 / Balon 25 / Pervaneli şapka 75 / Kuş kanatları 150 / Jetpack 300;
  her modun gravity/jump/maxFall'u ve bambu hız çarpanı var. Gövde artık çıplak (`BODY`),
  modlar `Gear` ile giydirilir (Capybara.tsx). Gökyüzü `art/skies.ts`: sabah/öğle/akşam/alacakaranlık/gece;
  `levelBlend` ile 1.5 sn'de yumuşak geçiş. Seviye atlayınca Hud'da "Yeni mod" yazısı.
- Adım 9a tamam: ekranın altında deniz (`Water.tsx`, WATER_HEIGHT=60, dalgalar kayar). Oyun alanı
  artık `waterY` (height − WATER_HEIGHT) ile sınırlı. Faz eklendi: `falling` (`game/phase.ts`).
  Bambu/tavan → sekip düşer (HIT_BOUNCE) + sarsıntı + ağır titreşim → suya değince sıçrama,
  `over`: gövde dikey aynalanır (sırtüstü), gözler kapalı, mod parçaları gizli, yolcular ayakların
  üstünde güneşlenir, suda sallanır. Portakal yiyince SMILE (0.9 sn). Titreşimler `feedback/haptics.ts`.
- Burak Uçuyor modu (B1–B7) tamam.
  - B1 tamam: `assets/sprites/` (1x + @6x/@8x PNG), `art/images.ts` (sanat pikseli boyutları sabit),
    `components/PixelImage.tsx` (Skia Image, FilterMode.Nearest; Group scale ile tam sayı büyütme).
    Geçici menü `app/index.tsx`, oyun `app/game.tsx?mode=...`, görsel testi `app/sprites.tsx`.
  - B2 tamam: `src/modes/` (types.ts, capybara.ts, index.ts). GameMode = rules (sadece veri, worklet'ler
    okur) + view (bileşenler). GameScreen `mode` prop'u alır. Engeller kendi `gapSize`'ını taşır
    (`gapSizeFor(score)`), eşyalar id + rol (currency/passenger/part), `itemInGap`, `obstacleInset`.
  - B3 tamam: `modes/burak.ts`, `components/BurakPlayer.tsx` (normal/happy, kapibarayla aynı eğim,
    PIVOT gövde ortası 14.5,16.5), `components/CableObstacle.tsx` (uçlar PixelImage, gövde tek Rect +
    ImageShader ty="repeat"). Hitbox 13x28 px (jetpack hariç). Geçit 290 → 230 (puan başına 1 dp).
    `obstacleInset` artık {x, y}: kabloda yandan 4, uçtan 2 piksel (karo 18 px ama kablo 9-13 px).
  - Çarpınca kapanma düzeltildi: sebep `stepVelocity`'deki `maxFall = MAX_FALL_SPEED` varsayılan parametresi
    (düşerken bu varsayılan kullanılıyordu; worklet'te tanımsız). Varsayılanlar gövdeye alındı (physics, collision).
  - Burak küçüldü: Burak ve parçalar `BURAK_PIXEL` = 2 ile çizilir (kablo/deniz/arka plan 3).
    Hitbox 26x56 dp, geçit 260 → 200, floatLift 13.
  - B4 tamam: parçalar `components/PartItem.tsx`; kurallar RAM 0.24/1p, SSD 0.18/2p, CPU 0.12/3p,
    GPU 0.06/5p, %30'u geçidin içinde. `ItemRule.box` = parçanın kendi toplama kutusu.
    Toplayınca joyTime 0.5 sn (burak_happy), yeni parça süreyi sıfırlar. Kumbara sadece para olan modda.
  - Arka plan: `Sky` artık `floaters` (bulut yerleri) + `skyline` (kıyıda dizilen) alır.
    `art/office.ts` (monitör, kasa, sunucu, laptop, disket, imleç; soluk mavi), `OFFICE_SKY`.
  - Oyun içi menü: `components/GameMenu.tsx`, sol üstte hamburger; açıkken `paused` shared value oyunu
    dondurur. Mod seçince `router.replace('/game?mode=...')`; `app/game.tsx` GameScreen'e `key={mode.id}`
    verir ki oyun sıfırdan kurulsun. Menü GestureDetector'ın DIŞINDA (kardeş), dokunuşu zıplatmaz.
  - B5 tamam: kasa `rules.kit` (isteğe bağlı; Burak: cpu/ram/gpu/ssd, bonus 10). Mantık `game/kit.ts`
    (bit maskesi: addToKit/hasPart/fullMask). Hud'da skorun altında KitBar (1x ikonlar, eksikler soluk).
    Tamamlanınca: +bonus, `Confetti.tsx` (28 piksel parçacık, sözde rastgele, CELEBRATION_TIME 1.2 sn),
    başarı titreşimi, banner. Banner artık { label, title } (yeni mod / kasa tamam).
  - B6 tamam: `app/index.tsx` ana menü (sabah gökyüzü + deniz arka planı, mod kartları, önizleme,
    rekor). Store'da `bestScores` + `submitScore` (özel `merge`: eski kayıtlar korunur). Oyun sonunda
    `handleGameOver` skoru kaydeder; Hud "Yeni rekor!" / "En iyi: N". Görsel testi ekranı silindi.
    Hamburger menüde "Ana menü".
  - B7 tamam: bu dosyaya "Burak Uçuyor modu" bölümü, dizin ağacı güncellendi.
- Adım 9b tamam: ses efektleri `scripts/make-sounds.py` ile üretilen çiptün WAV'lar (`assets/sounds/`:
  jump, pickup, passenger, hit, splash, levelup, kit). `feedback/sounds.ts`: modül düzeyinde
  `createAudioPlayer`, `playsInSilentMode: false`, `mixWithOthers`; çalmadan önce `seekTo(0)`.
  Store'da kalıcı `soundOn`, ☰ menüde Ses Açık/Kapalı. Parallax: `Background` `scroll` (worldScroll)
  alır; bulutlar/süzülenler depth 0.12–0.24 ile kayar ve sarar, kıyı silüeti 0.35 ile iki kopya halinde.
- Adım 12 tamam (yolcu durakları): rol `stop` (kapibara: chance 0.1, kutu 42x60). İskele `DOCK`/`DOCK_USED`
  (art/world.ts), suyun üstünde `DOCK_LIFT` = 21, süzülmez. Puan ikiye ayrıldı: engel taban puanı hep
  güvende, yolcu çarpanından gelen bonus `pendingSV`'de birikir ("sırtta +N"). Durağa yolcuyla değince:
  bonus skora, yolcular iner (çarpan/ağırlık sıfır), bayrak iner (`stop_used`). Çarpınca sırttaki
  bonus kaybolur (Hud: "Sırttaki +N kayboldu"). Durağı olmayan modda bonus doğrudan skora gider.
- Sıradaki adım: 10, 11, 13–16'dan biri.
