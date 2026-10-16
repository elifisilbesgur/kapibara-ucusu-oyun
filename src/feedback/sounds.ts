import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import { useGameStore } from '@/store/useGameStore';

// Oyunun ses efektleri tek yerde. Sesler scripts/make-sounds.py ile üretildi (çiptün).
// Çalarlar bir kez, modül yüklenirken kurulur ve uygulama boyunca yaşar
// (her seste yeni çalar kurmak gecikme yaratırdı). Oyun döngüsünden scheduleOnRN ile çağrılır.

// Kısa efektler: telefon sessizdeyse çalmasın, kullanıcının müziğini de kesmesin
setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' });

// Çalar havuzu: aynı sesin birkaç kopyası, sırayla kullanılır. Tek çalar olsaydı hızlı
// dokunuşlarda önceki ses bitmeden yenisi istenir ve bazıları hiç duyulmazdı.
type Pool = { players: AudioPlayer[]; next: number };

function pool(source: number, size: number): Pool {
  return { players: Array.from({ length: size }, () => createAudioPlayer(source)), next: 0 };
}

const sounds = {
  jump: pool(require('../../assets/sounds/jump.wav'), 4), // En sık çalan: saniyede birkaç kez
  pickup: pool(require('../../assets/sounds/pickup.wav'), 3),
  passenger: pool(require('../../assets/sounds/passenger.wav'), 2),
  hit: pool(require('../../assets/sounds/hit.wav'), 1),
  splash: pool(require('../../assets/sounds/splash.wav'), 1),
  levelup: pool(require('../../assets/sounds/levelup.wav'), 1),
  kit: pool(require('../../assets/sounds/kit.wav'), 2), // Kasa ve durak ikisi de bunu çalar
};

async function play(sound: Pool) {
  if (!useGameStore.getState().soundOn) return; // Menüden kapatıldıysa sessiz
  const player = sound.players[sound.next];
  sound.next = (sound.next + 1) % sound.players.length; // Sıradaki çalar
  try {
    // seekTo asenkron: başa sarma BİTMEDEN play() çağrılırsa çalar bazen hiç çalmıyordu
    await player.seekTo(0);
    player.play();
  } catch {
    // Ses çalamamak oyunu durdurmamalı; sessizce geç
  }
}

export const soundJump = () => play(sounds.jump);
export const soundPickup = () => play(sounds.pickup);
export const soundPassenger = () => play(sounds.passenger);
export const soundHit = () => play(sounds.hit);
export const soundSplash = () => play(sounds.splash);
export const soundLevelUp = () => play(sounds.levelup);
export const soundKit = () => play(sounds.kit);
