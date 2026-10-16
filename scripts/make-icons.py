"""Uygulama ikonlarını ve açılış ekranı görselini oyunun kendi piksel çizimlerinden üretir.

Çalıştır:  python3 scripts/make-icons.py
Okur:      src/art/palette.ts, src/art/capybara.ts, src/art/skies.ts
Yazar:     assets/images/ (icon, android-icon-*, splash-icon, favicon)

Sadece Python standart kütüphanesi. Her sanat pikseli tam sayı katına büyütülür (keskin kalsın).
"""
import os
import re
import struct
import zlib

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'assets', 'images')


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


palette_src = read('src/art/palette.ts')
PALETTE = dict(re.findall(r"^\s+(\w): '(#[0-9A-Fa-f]{6})'", palette_src, re.M))
capybara_src = read('src/art/capybara.ts')
capybara_src = capybara_src.replace('PROPELLER_X', '11').replace('PROPELLER_Y', '-2')
capybara_src = capybara_src.replace('FLAME_X', '2').replace('FLAME_Y', '13')


def sprites(name):
    """capybara.ts içindeki bir sprite (ya da sprite dizisi) → [(satırlar, offsetX, offsetY)]"""
    block = re.search(r'export const ' + name + r'\b.*?(?=\nexport const |\n// ---|\Z)', capybara_src, re.S)
    found = re.finditer(r'offsetX: (-?\d+),\s*offsetY: (-?\d+),\s*rows: \[(.*?)\]', block.group(0), re.S)
    return [(re.findall(r"'([^']*)'", m.group(3)), int(m.group(1)), int(m.group(2))) for m in found]


# Jetpack + pervaneli şapka + büyük alev + gülümseme: oyunun en "tam" hali
CAPYBARA = (
    sprites('FLAME_BIG')[:1] + sprites('BODY') + sprites('JETPACK') + sprites('CAP')
    + sprites('PROPELLER_FRAMES')[:1] + sprites('SMILE')
)
CAPY_W, CAPY_TOP, CAPY_BOTTOM = 22, -2, 17  # gövde 22 piksel geniş; pervane -2'den alev 17'ye

sky_src = read('src/art/skies.ts')
SKY_BANDS = re.findall(r"'(#[0-9A-Fa-f]{6})'", re.search(r'bands: \[(.*?)\]', sky_src).group(1))


def hex_rgba(color, alpha=255):
    return (int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16), alpha)


def blank(size, color=None):
    fill = hex_rgba(color) if color else (0, 0, 0, 0)
    return [[fill] * size for _ in range(size)]


def draw_capybara(img, left, top, scale, mono=None):
    """Kapibarayı (sol-üst köşesi left/top, sanat pikseli başına `scale` görüntü pikseli) çizer."""
    for rows, ox, oy in CAPYBARA:
        for y, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch == '.':
                    continue
                color = mono or hex_rgba(PALETTE[ch])
                px, py = left + (ox + x) * scale, top + (oy + y - CAPY_TOP) * scale
                for dy in range(scale):
                    for dx in range(scale):
                        if 0 <= py + dy < len(img) and 0 <= px + dx < len(img):
                            img[py + dy][px + dx] = color


def centered_capybara(size, scale, mono=None, img=None):
    img = img or blank(size)
    width, height = CAPY_W * scale, (CAPY_BOTTOM - CAPY_TOP) * scale
    draw_capybara(img, (size - width) // 2, (size - height) // 2, scale, mono)
    return img


def sky(size, water=True):
    """Gökyüzü bantları; altta deniz şeridi"""
    img = blank(size)
    water_top = size * 27 // 32 if water else size
    for y in range(size):
        if y < water_top:
            color = SKY_BANDS[min(len(SKY_BANDS) - 1, y * len(SKY_BANDS) // water_top)]
        else:
            color = PALETTE['w'] if y < water_top + size // 64 else PALETTE['I']
        img[y] = [hex_rgba(color)] * size
    return img


def save(name, img):
    size = len(img)
    raw = b''.join(b'\0' + b''.join(bytes(p) for p in row) for row in img)

    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xFFFFFFFF)

    png = (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))  # 8-bit RGBA
        + chunk(b'IDAT', zlib.compress(raw, 9))
        + chunk(b'IEND', b'')
    )
    with open(os.path.join(OUT, name), 'wb') as f:
        f.write(png)
    print(f'assets/images/{name}  ({size}x{size})')


os.makedirs(OUT, exist_ok=True)
# iOS ve genel ikon: gökyüzü + deniz + kapibara (sanat pikseli = 32 px)
icon = sky(1024)
draw_capybara(icon, (1024 - CAPY_W * 32) // 2, 1024 * 27 // 32 - (CAPY_BOTTOM - CAPY_TOP) * 32 - 40, 32)
save('icon.png', icon)
# Android uyarlanabilir ikon: ön plan (saydam), arka plan (gökyüzü), tek renk (beyaz siluet).
# Ön plan güvenli alanın (ortadaki ~%66) içinde kalsın diye daha küçük ölçek.
save('android-icon-foreground.png', centered_capybara(1024, 24))
save('android-icon-background.png', sky(1024, water=False))
save('android-icon-monochrome.png', centered_capybara(1024, 24, mono=(255, 255, 255, 255)))
# Açılış ekranı ortasındaki görsel (arka plan rengi app.json'da)
save('splash-icon.png', centered_capybara(1024, 40))
save('favicon.png', centered_capybara(48, 2))
