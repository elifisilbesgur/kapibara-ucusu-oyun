import { CAPYBARA_MODE } from './capybara';
import type { GameMode, ModeId } from './types';

export const MODES: Record<ModeId, GameMode> = {
  capybara: CAPYBARA_MODE,
  burak: CAPYBARA_MODE, // B3'te Burak Uçuyor yapılandırmasıyla değişecek
};

// Adres çubuğundan gelen değeri güvenle moda çevirir; tanınmazsa kapibara.
export function modeFromParam(param: string | string[] | undefined): GameMode {
  return param === 'burak' ? MODES.burak : MODES.capybara;
}
