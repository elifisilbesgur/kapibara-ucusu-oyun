import { useLocalSearchParams } from 'expo-router';

import { modeFromParam } from '@/modes';
import GameScreen from '@/screens/GameScreen';

// /game?mode=capybara ya da /game?mode=burak
export default function GameRoute() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const gameMode = modeFromParam(mode);
  // key: mod değişince oyun ekranı sıfırdan kurulsun (eski modun durumu taşınmasın)
  return <GameScreen key={gameMode.id} mode={gameMode} />;
}
