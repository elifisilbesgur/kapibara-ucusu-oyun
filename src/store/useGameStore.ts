import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PassengerKind } from '@/game/passengers';
import type { ModeId } from '@/modes/types';

// Arkadaş defterindeki bir sayfa: ilk tanışma (ISO tarih) ve kaç kez sırta bindiği
export type FriendEntry = { firstMet: string; rides: number };

// Oyunlar arası kalıcı durum: uygulamayı kapatıp açınca da hatırlanır.
type GameStore = {
  totalOranges: number;
  bestScores: Record<ModeId, number>; // Her modun rekoru ayrı
  soundOn: boolean;
  friends: Partial<Record<PassengerKind, FriendEntry>>; // Arkadaş defteri
  addOranges: (count: number) => void;
  // Sırta binen yolcuları deftere işler; İLK KEZ tanışılanları döndürür
  meetFriends: (kinds: PassengerKind[]) => PassengerKind[];
  toggleSound: () => void;
  // Biten oyunun skorunu kaydeder; rekor kırıldıysa true döner
  submitScore: (mode: ModeId, score: number) => boolean;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      totalOranges: 0,
      bestScores: { capybara: 0, burak: 0 },
      soundOn: true,
      friends: {},
      meetFriends: (kinds) => {
        const friends = { ...get().friends };
        const fresh: PassengerKind[] = [];
        const now = new Date().toISOString();
        for (const kind of kinds) {
          const known = friends[kind];
          if (!known) fresh.push(kind);
          friends[kind] = { firstMet: known?.firstMet ?? now, rides: (known?.rides ?? 0) + 1 };
        }
        set({ friends });
        return fresh;
      },
      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
      addOranges: (count) => set((state) => ({ totalOranges: state.totalOranges + count })),
      submitScore: (mode, score) => {
        const previous = get().bestScores[mode] ?? 0;
        if (score <= previous) return false;
        set((state) => ({ bestScores: { ...state.bestScores, [mode]: score } }));
        return true;
      },
    }),
    {
      name: 'kapibara-ucusu', // AsyncStorage'daki anahtar
      storage: createJSONStorage(() => AsyncStorage),
      // Eski kayıtta olmayan alanlar (bestScores) varsayılandan gelir, olanlar korunur
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<GameStore>;
        return {
          ...current,
          ...saved,
          bestScores: { ...current.bestScores, ...saved.bestScores },
        };
      },
    },
  ),
);
