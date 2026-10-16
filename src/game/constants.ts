// Oyunun ayarlanabilir sayıları tek yerde dursun.
// Hepsi piksel (dp) ya da saniye cinsinden.

export const PLAYER_X_RATIO = 0.3; // Oyuncu ekran genişliğinin %30'unda sabit durur
export const PLAYER_HITBOX_WIDTH = 40; // Çarpışma kutusu: gövdeden biraz küçük (affedici olsun)
export const PLAYER_HITBOX_HEIGHT = 30;

export const GRAVITY = 1300; // Hız her saniye bu kadar artar (dp/s²)
export const MAX_FALL_SPEED = 900; // Düşüş hızı bundan fazla olamaz (dp/s)
export const JUMP_VELOCITY = -480; // Dokununca hız bu olur (eksi = yukarı)
export const RESTART_DELAY_MS = 600; // Oyun bitince yanlışlıkla hemen yeniden başlamayı önler
export const MAX_DT = 1 / 20; // Bir karede en fazla 50 ms ilerle (takılmada ışınlanmayı önler)

export const OBSTACLE_WIDTH = 54; // Bir bambu kamışının kalınlığı (18 piksel x PIXEL_SIZE)
export const OBSTACLE_GAP = 230; // Üst ve alt bambu arasındaki geçit yüksekliği
export const OBSTACLE_SPACING = 260; // İki engel arasındaki yatay mesafe
export const OBSTACLE_SPEED = 160; // Engellerin sola kayma hızı (dp/s)
export const GAP_MARGIN = 80; // Geçit ekranın üstüne/altına bundan fazla yaklaşmaz

export const ORANGE_CHANCE = 0.6; // İki engel arasında portakal olma olasılığı (%60)
export const ORANGE_Y_SPREAD = 90; // Portakal geçidin ortasından en fazla bu kadar yukarı/aşağı
export const ORANGE_SIZE = 24; // Portakalın boyu (8 piksel x PIXEL_SIZE); çarpışma kutusu da bu
export const ORANGE_BOB = 4; // Portakal havada bu kadar aşağı-yukarı süzülür (dp)
export const ORANGE_BOB_SPEED = 3; // Süzülme hızı (radyan/sn)

// Kapibara görünümü ve animasyonu
export const PIXEL_SIZE = 3; // Çizimdeki 1 piksel ekranda 3x3 dp
export const TILT_UP = 0.35; // Yükselirken burun en fazla bu kadar yukarı (radyan, ~20°)
export const TILT_DOWN = 0.6; // Düşerken burun en fazla bu kadar aşağı (~35°)
export const THRUST_DECAY = 4; // Dokunuş gücü saniyede bu kadar söner (1 → 0: 0.25 sn)
export const PROPELLER_FPS = 10; // Pervane sakinken saniyede kaç kare döner
export const PROPELLER_BOOST_FPS = 20; // Dokununca bu kadar ek hız
export const FLAME_FLICKER_FPS = 12; // Alev saniyede kaç kez titrer

export const COLORS = {
  // Gökyüzü yukarıdan aşağı bantlar halinde açılır (piksel art usulü degrade)
  skyBands: ['#7FC8E3', '#94D3E9', '#AADDEE', '#BFE6F2', '#D3EEF5'],
};
