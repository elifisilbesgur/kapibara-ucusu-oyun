import * as Haptics from 'expo-haptics';

// Oyundaki titreşimler tek yerde. Hepsi JS tarafında çalışır;
// oyun döngüsünden scheduleOnRN ile çağrılır.

export function hapticHit() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function hapticSplash() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
}

export function hapticOrange() {
  Haptics.selectionAsync();
}

export function hapticPassenger() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticLevelUp() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
