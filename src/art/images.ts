// PNG piksel çizimleri (Burak Uçuyor modu).
// width/height: SANAT pikseli cinsinden (1x dosyanın boyutu). Metro, telefonun ekranına göre
// @6x/@8x sürümünü yükleyebilir; biz boyutu buradan aldığımız için hangisi gelirse gelsin
// her sanat pikseli ekranda tam PIXEL_SIZE x PIXEL_SIZE dp çizilir.
// Burak ve bilgisayar parçaları ekranda 2x çizilir (kablolar ve deniz 3x, PIXEL_SIZE).
// Ölçek tam sayı olmalı ki nearest filtreyle pikseller eşit ve keskin kalsın.
export const BURAK_PIXEL = 2;

export type ImageSprite = {
  source: number;
  width: number;
  height: number;
};

export const BURAK_NORMAL: ImageSprite = {
  source: require('../../assets/sprites/burak_normal.png'),
  width: 26,
  height: 33,
};
export const BURAK_HAPPY: ImageSprite = {
  source: require('../../assets/sprites/burak_happy.png'),
  width: 26,
  height: 33,
};

export const CABLE_HEAD_DOWN: ImageSprite = {
  source: require('../../assets/sprites/cable_head_down.png'),
  width: 18,
  height: 19,
};
export const CABLE_HEAD_UP: ImageSprite = {
  source: require('../../assets/sprites/cable_head_up.png'),
  width: 18,
  height: 19,
};
export const CABLE_BODY_TILE: ImageSprite = {
  source: require('../../assets/sprites/cable_body_tile.png'),
  width: 18,
  height: 8,
};

export const PART_CPU: ImageSprite = {
  source: require('../../assets/sprites/part_cpu.png'),
  width: 16,
  height: 15,
};
export const PART_RAM: ImageSprite = {
  source: require('../../assets/sprites/part_ram.png'),
  width: 24,
  height: 9,
};
export const PART_GPU: ImageSprite = {
  source: require('../../assets/sprites/part_gpu.png'),
  width: 26,
  height: 14,
};
export const PART_SSD: ImageSprite = {
  source: require('../../assets/sprites/part_ssd.png'),
  width: 18,
  height: 10,
};

// Toplanabilir parçalar, id → görsel
export const PART_SPRITES: Record<string, ImageSprite> = {
  ram: PART_RAM,
  ssd: PART_SSD,
  cpu: PART_CPU,
  gpu: PART_GPU,
};
