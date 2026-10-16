import { GRAVITY, MAX_DT, MAX_FALL_SPEED } from './constants';

// Bu dosyadaki fonksiyonlar React'ten bağımsız, saf hesaplar.
// 'worklet' satırı, fonksiyonun oyun döngüsünün çalıştığı UI thread'inde
// de çalışabilmesini sağlar.

// Kareler arası geçen süreyi milisaniyeden saniyeye çevirir.
export function frameDeltaSeconds(ms: number | null): number {
  'worklet';
  if (ms === null) return 0; // İlk karede önceki kare yok
  return Math.min(ms / 1000, MAX_DT);
}

// velocity += gravity * dt  (gravityScale: yolcuların ağırlığı, 1 = yolcusuz)
export function stepVelocity(velocity: number, dt: number, gravityScale = 1): number {
  'worklet';
  return Math.min(velocity + GRAVITY * gravityScale * dt, MAX_FALL_SPEED);
}

// y += velocity * dt
export function stepPosition(y: number, velocity: number, dt: number): number {
  'worklet';
  return y + velocity * dt;
}
