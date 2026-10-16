import type { PassengerKind } from '@/game/passengers';

import type { ModeRules } from './types';

// Bugünün yolcusu: tarihten hesaplanır, yani o gün herkes için aynı.
// Gün sayısı = 1 Ocak 1970'ten bu yana geçen gün (telefonun yerel takvimine göre);
// sırayla kinds[0], kinds[1], kinds[2], kinds[0]...
export function todaysPassenger(kinds: PassengerKind[], now: Date): PassengerKind {
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return kinds[day % kinds.length];
}

// Modun kurallarına bugünün yolcusunu eşya olarak ekler (kurallar değişmez, yeni nesne döner).
export function withDailyPassenger(rules: ModeRules, today: PassengerKind | undefined): ModeRules {
  if (!rules.dailyPassenger || !today) return rules;
  return {
    ...rules,
    items: [...rules.items, { id: today, role: 'passenger', chance: rules.dailyPassenger.chance, points: 0 }],
  };
}
