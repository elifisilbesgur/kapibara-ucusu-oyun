import * as Haptics from 'expo-haptics';

import { useGameStore } from '@/store/useGameStore';

// Oyundaki titreşimler tek yerde. Hepsi JS tarafında çalışır;
// oyun döngüsünden scheduleOnRN ile çağrılır. Menüden kapatıldıysa hiçbiri titretmez.
const on = () => useGameStore.getState().hapticsOn;

export function hapticHit() {
  if (on()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function hapticSplash() {
  if (on()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
}

export function hapticOrange() {
  if (on()) Haptics.selectionAsync();
}

export function hapticPassenger() {
  if (on()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticLevelUp() {
  if (on()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
