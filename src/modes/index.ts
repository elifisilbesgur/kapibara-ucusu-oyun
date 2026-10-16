import { BURAK_MODE } from './burak';
import { CAPYBARA_MODE } from './capybara';
import type { GameMode, ModeId } from './types';

export const MODES: Record<ModeId, GameMode> = {
  capybara: CAPYBARA_MODE,
  burak: BURAK_MODE,
};

// Adres çubuğundan gelen değeri güvenle moda çevirir; tanınmazsa kapibara.
export function modeFromParam(param: string | string[] | undefined): GameMode {
  return param === 'burak' ? MODES.burak : MODES.capybara;
}
