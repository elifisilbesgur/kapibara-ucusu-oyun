import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Oyunlar arası kalıcı durum: uygulamayı kapatıp açınca da hatırlanır.
type GameStore = {
  totalOranges: number;
  addOranges: (count: number) => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      totalOranges: 0,
      addOranges: (count) => set((state) => ({ totalOranges: state.totalOranges + count })),
    }),
    {
      name: 'kapibara-ucusu', // AsyncStorage'daki anahtar
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
