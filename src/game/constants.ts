// Motorun ortak sayıları (her modda aynı). Hepsi piksel (dp) ya da saniye cinsinden.
// Moda özel sayılar (çarpışma kutusu, geçit, eşyalar, puan, seviyeler) src/modes/ altında.

export const PLAYER_X_RATIO = 0.3; // Oyuncu ekran genişliğinin %30'unda sabit durur

export const GRAVITY = 1300; // Hız her saniye bu kadar artar (dp/s²)
export const MAX_FALL_SPEED = 900; // Düşüş hızı bundan fazla olamaz (dp/s)
export const JUMP_VELOCITY = -480; // Dokununca hız bu olur (eksi = yukarı)
export const RESTART_DELAY_MS = 600; // Oyun bitince yanlışlıkla hemen yeniden başlamayı önler
export const MAX_DT = 1 / 20; // Bir karede en fazla 50 ms ilerle (takılmada ışınlanmayı önler)

export const OBSTACLE_WIDTH = 54; // Engelin kalınlığı (bambu da kablo da 18 piksel x PIXEL_SIZE)
export const OBSTACLE_SPACING = 260; // İki engel arasındaki yatay mesafe
export const OBSTACLE_SPEED = 160; // Engellerin sola kayma hızı (dp/s)
export const GAP_MARGIN = 80; // Geçit ekranın üstüne/altına bundan fazla yaklaşmaz

// Engellerin önündeki eşyalar (portakal, yolcu, parça)
export const ITEM_Y_SPREAD = 90; // Geçidin ortasından en fazla bu kadar yukarı/aşağı
export const ITEM_SIZE = 24; // Toplama kutusu (8 piksel x PIXEL_SIZE)
export const ITEM_BOB = 4; // Havada bu kadar aşağı-yukarı süzülür (dp)
export const ITEM_BOB_SPEED = 3; // Süzülme hızı (radyan/sn)

// Puan ve yolcular
export const MAX_PASSENGERS = 5; // Sırtta en fazla bu kadar yolcu
export const MULTIPLIER_PER_PASSENGER = 0.2; // 1 yolcu x1.2, 2 yolcu x1.4 ...
// Her yolcu yerçekimini ve zıplama gücünü bu oranlarla çarpar (risk-ödül)
export const PASSENGER_STATS = {
  bird: { gravity: 1.03, jump: 1.06 }, // hafif; itişi güçlendirir
  turtle: { gravity: 1.12, jump: 0.95 }, // ağır; ama bir çarpmayı karşılar
  monkey: { gravity: 1.07, jump: 0.97 }, // orta; portakalları uzaktan toplar
};
export const SHIELD_TIME = 1.2; // Kaplumbağa çarpmayı karşılayınca bu kadar saniye dokunulmazlık
export const MAGNET_RANGE = 60; // Maymun varken portakal toplama kutusu her yönde bu kadar büyür

// Kapibara görünümü ve animasyonu
export const PIXEL_SIZE = 3; // Çizimdeki 1 piksel ekranda 3x3 dp
export const TILT_UP = 0.35; // Yükselirken burun en fazla bu kadar yukarı (radyan, ~20°)
export const TILT_DOWN = 0.6; // Düşerken burun en fazla bu kadar aşağı (~35°)
export const THRUST_DECAY = 4; // Dokunuş gücü saniyede bu kadar söner (1 → 0: 0.25 sn)
export const PROPELLER_FPS = 10; // Pervane sakinken saniyede kaç kare döner
export const PROPELLER_BOOST_FPS = 20; // Dokununca bu kadar ek hız
export const FLAME_FLICKER_FPS = 12; // Alev saniyede kaç kez titrer

// Deniz ve kayıp anı
export const WATER_HEIGHT = 60; // Ekranın altındaki deniz şeridi (20 piksel x PIXEL_SIZE)
export const HIT_BOUNCE = -250; // Bambuya/tavana çarpınca hafifçe sekip sonra düşer
export const FLOAT_BOB = 3; // Suda bu kadar aşağı-yukarı sallanır (dp)
export const FLOAT_BOB_SPEED = 2; // Sallanma hızı (radyan/sn)
export const SPLASH_TIME = 0.5; // Su sıçraması bu kadar saniye görünür

// Yolcu durağı (iskele): ortası su yüzeyinin bu kadar üstünde; bacaklar suyun içinde kalır
export const DOCK_LIFT = 21;

// Kasa kutlaması (Burak Uçuyor)
export const CELEBRATION_TIME = 1.2; // Konfeti bu kadar saniye uçuşur

// His
export const SHAKE_TIME = 0.35; // Çarpınca ekran bu kadar saniye sarsılır
export const SHAKE_AMOUNT = 6; // En fazla bu kadar dp kayar

// Seviye geçişi (seviyelerin kendisi modda tanımlı)
export const LEVEL_TRANSITION = 1.5; // Gökyüzü yeni seviyeye bu kadar saniyede geçer
export const LEVEL_BANNER_TIME = 1.8; // "Yeni mod" yazısı bu kadar saniye görünür
