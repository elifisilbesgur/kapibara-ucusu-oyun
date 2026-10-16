"""Oyunun çiptün ses efektlerini üretir (sadece Python standart kütüphanesi).

Çalıştır:  python3 scripts/make-sounds.py
Çıktı:     assets/sounds/*.wav  (22050 Hz, 16-bit, mono)

Her ses, eski oyun konsollarındaki gibi basit dalgalardan yapılır:
kare dalga (bip), frekans kaydırma (yükselen/alçalan ton), notalar (arpej), gürültü (su).
"""
import math
import os
import random
import struct
import wave

RATE = 22050
VOLUME = 0.35  # Hepsi biraz kısık: oyunun sakin tonuna uysun
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sounds')


def square(phase, duty=0.5):
    return 1.0 if (phase % 1.0) < duty else -1.0


def triangle(phase):
    p = phase % 1.0
    return 4 * p - 1 if p < 0.5 else 3 - 4 * p


def sweep(f_start, f_end, seconds, wave_fn=square, duty=0.5):
    """Frekansı f_start'tan f_end'e kaydıran ton; sona doğru söner."""
    n = int(RATE * seconds)
    out, phase = [], 0.0
    for i in range(n):
        t = i / n
        freq = f_start + (f_end - f_start) * t
        phase += freq / RATE
        envelope = (1 - t) ** 1.5  # hızlı başla, yavaşça sön
        value = wave_fn(phase, duty) if wave_fn is square else wave_fn(phase)
        out.append(value * envelope)
    return out


def notes(freqs, note_seconds, wave_fn=square, duty=0.25):
    """Art arda kısa notalar (arpej); her nota kendi içinde söner."""
    out = []
    for freq in freqs:
        n = int(RATE * note_seconds)
        phase = 0.0
        for i in range(n):
            phase += freq / RATE
            envelope = 1 - (i / n) * 0.7
            value = wave_fn(phase, duty) if wave_fn is square else wave_fn(phase)
            out.append(value * envelope)
    return out


def noise(seconds, smooth=4, seed=1):
    """Sönen gürültü; komşu örneklerin ortalaması sesi yumuşatır (şırıltı gibi)."""
    rng = random.Random(seed)  # Sabit tohum: her çalıştırmada aynı ses
    n = int(RATE * seconds)
    raw = [rng.uniform(-1, 1) for _ in range(n)]
    out = []
    for i in range(n):
        window = raw[max(0, i - smooth):i + 1]
        envelope = (1 - i / n) ** 2
        out.append(sum(window) / len(window) * envelope)
    return out


def mix(*tracks):
    length = max(len(t) for t in tracks)
    return [sum(t[i] for t in tracks if i < len(t)) / len(tracks) for i in range(length)]


def save(name, samples):
    path = os.path.join(OUT, name + '.wav')
    with wave.open(path, 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes(b''.join(
            struct.pack('<h', int(max(-1, min(1, s)) * VOLUME * 32767)) for s in samples
        ))
    print(f'{path}  ({len(samples) / RATE:.2f} sn)')


C5, E5, G5, B5, C6, D6, G6 = 523, 659, 784, 988, 1047, 1175, 1568

os.makedirs(OUT, exist_ok=True)
save('jump', sweep(320, 640, 0.09))                                   # zıplama: kısa yükselen bip
save('pickup', notes([880, 1320], 0.06))                              # portakal/parça: iki nota "bling"
save('passenger', notes([C5, E5, G5], 0.05, triangle))                # yolcu biniyor: yumuşak üçlü
save('hit', mix(sweep(240, 70, 0.22, duty=0.5), noise(0.12, seed=2)))  # çarpma: alçalan ton + tok gürültü
save('splash', noise(0.45, smooth=6, seed=3))                         # suya düşme: şırıltı
save('levelup', notes([C5, E5, G5, C6], 0.07))                        # yeni mod
save('kit', notes([G5, B5, D6, G6, D6, G6], 0.06))                    # kasa tamam: daha parlak arpej
