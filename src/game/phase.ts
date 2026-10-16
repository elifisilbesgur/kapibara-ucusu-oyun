// Oyunun hangi aşamada olduğu:
// ready   → ortada bekliyor, "Uçmak için dokun"
// playing → oyun sürüyor
// falling → çarptı, denize düşüyor (dokunuşlar yok sayılır)
// over    → suda sırtüstü yüzüyor, "Tekrar için dokun"
export type GamePhase = 'ready' | 'playing' | 'falling' | 'over';
