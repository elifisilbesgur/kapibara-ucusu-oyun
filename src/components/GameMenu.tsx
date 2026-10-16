import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MODES } from '@/modes';
import type { ModeId } from '@/modes/types';

type Props = {
  currentMode: ModeId;
  onOpenChange: (open: boolean) => void; // Açılınca oyun durur, kapanınca devam eder
};

// Sol üstte hamburger düğmesi; açılınca soldan mod listesi.
// Oyunun dokunma algılayıcısının DIŞINDA durur: buraya dokunmak karakteri zıplatmaz.
export function GameMenu({ currentMode, onOpenChange }: Props) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const setMenuOpen = (value: boolean) => {
    setOpen(value);
    onOpenChange(value);
  };

  const chooseMode = (id: ModeId) => {
    setMenuOpen(false);
    if (id === currentMode) return; // Aynı mod: sadece menüyü kapat, oyun kaldığı yerden sürsün
    // Sayfayı yenisiyle değiştir (geri tuşunda eski moda dönülmesin)
    router.replace({ pathname: '/game', params: { mode: id } });
  };

  if (!open) {
    return (
      <Pressable
        style={[styles.hamburger, { top: insets.top + 12 }]}
        onPress={() => setMenuOpen(true)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Menüyü aç"
      >
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
      </Pressable>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Karartılmış arka plan: dokununca menü kapanır */}
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={() => setMenuOpen(false)}
        accessibilityLabel="Menüyü kapat"
      />
      <View style={[styles.panel, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.heading}>Modlar</Text>
        {Object.values(MODES).map((mode) => {
          const selected = mode.id === currentMode;
          return (
            <Pressable
              key={mode.id}
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => chooseMode(mode.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                {mode.name}
              </Text>
              {selected && <Text style={styles.itemTextSelected}>●</Text>}
            </Pressable>
          );
        })}
        <Pressable style={styles.close} onPress={() => setMenuOpen(false)}>
          <Text style={styles.closeText}>Devam et</Text>
        </Pressable>
        <Pressable style={styles.close} onPress={() => router.replace('/')}>
          <Text style={styles.closeText}>Ana menü</Text>
        </Pressable>
      </View>
    </View>
  );
}

const DARK = '#3B2414';

const styles = StyleSheet.create({
  hamburger: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 36,
    padding: 8,
    gap: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 36, 20, 0.75)',
    justifyContent: 'center',
  },
  bar: {
    height: 3,
    borderRadius: 1,
    backgroundColor: 'white',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: '#FFF6E8',
    borderRightWidth: 4,
    borderColor: DARK,
  },
  heading: {
    fontSize: 14,
    fontWeight: '800',
    color: DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: DARK,
    backgroundColor: 'white',
  },
  itemSelected: {
    backgroundColor: DARK,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
  },
  itemTextSelected: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFD23F',
  },
  close: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
    textDecorationLine: 'underline',
  },
});
