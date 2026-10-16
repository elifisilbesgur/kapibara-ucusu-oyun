# Kapibara Uçuşu

Dokunarak uçulan, sonsuz kayan piksel art bir beceri oyunu. Sinir bozucu ama sakinleştirici:
jetpack'li, pervaneli şapkalı bir kapibara bambuların arasından geçer, portakal toplar,
sırtına arkadaş alır ve çarpınca sakince denize düşüp sırtüstü yüzer.

İki mod var:
- **Kapibara:** bambular, portakallar, sırta binen yolcular (kuş, kaplumbağa, maymun ve her gün
  bir nadir yolcu), yolcu durakları, rüzgâr, esneme ve skorla evrimleşen kıyafetler
  (yaprak → balon → pervane → kuş kanadı → jetpack).
- **Burak Uçuyor:** CAT6 kablolar arasında uç, bilgisayar parçası topla, kasayı tamamla.

Ayrıca: arkadaş defteri (albüm), moda göre rekorlar, paylaşılabilir rekor kartı.

## Çalıştırma

```bash
npm install
npx expo start      # QR kodunu Expo Go ile tara
```

## Geliştirme

```bash
npx tsc --noEmit    # tip kontrolü
npx expo lint       # lint
python3 scripts/make-sounds.py   # ses efektlerini yeniden üret (assets/sounds/)
python3 scripts/make-icons.py    # ikon ve açılış görsellerini yeniden üret (assets/images/)
```

Mimari, kurallar ve geliştirme geçmişi [CLAUDE.md](CLAUDE.md) dosyasında.
