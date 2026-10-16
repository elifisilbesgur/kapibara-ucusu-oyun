import { useLocalSearchParams } from 'expo-router';

import { modeFromParam } from '@/modes';
import GameScreen from '@/screens/GameScreen';

// /game?mode=capybara ya da /game?mode=burak
export default function GameRoute() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  return <GameScreen mode={modeFromParam(mode)} />;
}
