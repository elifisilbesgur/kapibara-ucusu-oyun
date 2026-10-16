import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import { useGameStore } from '@/store/useGameStore';

// Oyunun ses efektleri tek yerde. Sesler scripts/make-sounds.py ile üretildi (çiptün).
// Çalarlar bir kez, modül yüklenirken kurulur ve uygulama boyunca yaşar
// (her seste yeni çalar kurmak gecikme yaratırdı). Oyun döngüsünden scheduleOnRN ile çağrılır.

// Kısa efektler: telefon sessizdeyse çalmasın, kullanıcının müziğini de kesmesin
setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' });

const players = {
  jump: createAudioPlayer(require('../../assets/sounds/jump.wav')),
  pickup: createAudioPlayer(require('../../assets/sounds/pickup.wav')),
  passenger: createAudioPlayer(require('../../assets/sounds/passenger.wav')),
  hit: createAudioPlayer(require('../../assets/sounds/hit.wav')),
  splash: createAudioPlayer(require('../../assets/sounds/splash.wav')),
  levelup: createAudioPlayer(require('../../assets/sounds/levelup.wav')),
  kit: createAudioPlayer(require('../../assets/sounds/kit.wav')),
};

function play(player: AudioPlayer) {
  if (!useGameStore.getState().soundOn) return; // Menüden kapatıldıysa sessiz
  player.seekTo(0); // Önceki çalış bitmemiş olsa bile baştan başla (hızlı zıplamalar)
  player.play();
}

export const soundJump = () => play(players.jump);
export const soundPickup = () => play(players.pickup);
export const soundPassenger = () => play(players.passenger);
export const soundHit = () => play(players.hit);
export const soundSplash = () => play(players.splash);
export const soundLevelUp = () => play(players.levelup);
export const soundKit = () => play(players.kit);
