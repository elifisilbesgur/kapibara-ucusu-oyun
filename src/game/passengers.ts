import { MULTIPLIER_PER_PASSENGER, PASSENGER_STATS } from './constants';

export type PassengerKind = 'bird' | 'turtle' | 'monkey' | 'owl' | 'flamingo' | 'penguin';
export const PASSENGER_KINDS: PassengerKind[] = [
  'bird',
  'turtle',
  'monkey',
  'owl',
  'flamingo',
  'penguin',
];
// Nadir yolcular: her gün bunlardan sadece biri çıkar (günün yolcusu)
export const RARE_PASSENGERS: PassengerKind[] = ['owl', 'flamingo', 'penguin'];

// Çarpan için yolcu sayısı: flamingo gösterişli, iki yolcu sayılır
export function multiplierCount(passengers: PassengerKind[]): number {
  'worklet';
  let count = 0;
  for (const kind of passengers) count += kind === 'flamingo' ? 2 : 1;
  return count;
}

// Tüm yolcuların yerçekimi etkisi çarpılarak birikir: 2 kaplumbağa = 1.12 x 1.12
export function gravityScale(passengers: PassengerKind[]): number {
  'worklet';
  let scale = 1;
  for (const kind of passengers) scale *= PASSENGER_STATS[kind].gravity;
  return scale;
}

export function jumpScale(passengers: PassengerKind[]): number {
  'worklet';
  let scale = 1;
  for (const kind of passengers) scale *= PASSENGER_STATS[kind].jump;
  return scale;
}

// 0 yolcu x1, 1 yolcu x1.2, 2 yolcu x1.4 ...
export function multiplierFor(passengerCount: number): number {
  'worklet';
  return 1 + MULTIPLIER_PER_PASSENGER * passengerCount;
}

// Yığındaki en üstteki `kind` yolcusunu indirir (üsttekiler bir aşağı kayar).
export function removeTopmost(passengers: PassengerKind[], kind: PassengerKind): PassengerKind[] {
  'worklet';
  const index = passengers.lastIndexOf(kind);
  if (index === -1) return passengers;
  return passengers.filter((_, i) => i !== index);
}
