// Oyunun ayarlanabilir sayıları tek yerde dursun.
// Hepsi piksel (dp) ya da saniye cinsinden.

export const PLAYER_RADIUS = 24; // Şimdilik kapibara yerine çizdiğimiz dairenin yarıçapı
export const PLAYER_X_RATIO = 0.3; // Oyuncu ekran genişliğinin %30'unda sabit durur

export const GRAVITY = 1800; // Hız her saniye bu kadar artar (dp/s²)
export const MAX_FALL_SPEED = 900; // Düşüş hızı bundan fazla olamaz (dp/s)
export const JUMP_VELOCITY = -600; // Dokununca hız bu olur (eksi = yukarı)
export const MAX_DT = 1 / 20; // Bir karede en fazla 50 ms ilerle (takılmada ışınlanmayı önler)

export const COLORS = {
  sky: '#BFE6F2',
  player: '#8B5E3C', // kapibara kahvesi
};
