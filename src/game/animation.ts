import {
  JUMP_VELOCITY,
  MAX_FALL_SPEED,
  PROPELLER_BOOST_FPS,
  PROPELLER_FPS,
  THRUST_DECAY,
  TILT_DOWN,
  TILT_UP,
} from './constants';

// İtiş (thrust): dokununca 1 olur, sonra yavaşça 0'a söner.
// Alevin boyu ve pervanenin hızı buna bakar.
export function stepThrust(thrust: number, dt: number): number {
  'worklet';
  return Math.max(0, thrust - THRUST_DECAY * dt);
}

// Pervane fazı sürekli artan bir sayı; tam sayı kısmı hangi karenin gösterileceğini belirler.
export function stepPropeller(phase: number, thrust: number, dt: number): number {
  'worklet';
  return phase + (PROPELLER_FPS + PROPELLER_BOOST_FPS * thrust) * dt;
}

// Hıza göre gövde eğimi (radyan). Eksi = burun yukarı, artı = burun aşağı.
export function tiltFor(velocity: number): number {
  'worklet';
  if (velocity < 0) {
    return Math.max(-1, velocity / -JUMP_VELOCITY) * TILT_UP;
  }
  return Math.min(1, velocity / MAX_FALL_SPEED) * TILT_DOWN;
}
