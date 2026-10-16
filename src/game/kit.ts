// Kasa: hangi parçaların toplandığını tek bir sayıda tutarız (bit maskesi).
// parts = ['cpu', 'ram', 'gpu', 'ssd'] ise: cpu → 1 (0001), ram → 2 (0010), gpu → 4 (0100), ssd → 8 (1000).
// Toplanan parçaların bitleri "veya" (|) ile açılır; dördü de açıksa 15 (1111) → kasa tamam.

export function fullMask(parts: string[]): number {
  'worklet';
  return (1 << parts.length) - 1; // 4 parça → 10000 - 1 = 1111 (15)
}

// Bu parçanın biti kasada açık mı?
export function hasPart(mask: number, parts: string[], id: string): boolean {
  'worklet';
  const index = parts.indexOf(id);
  return index !== -1 && (mask & (1 << index)) !== 0;
}

// Yeni toplanan parçaları kasaya ekler. Kasa tamamlanırsa sıfırlanır ve completed = true.
export function addToKit(
  mask: number,
  collected: string[],
  parts: string[],
): { mask: number; completed: boolean } {
  'worklet';
  let next = mask;
  for (const id of collected) {
    const index = parts.indexOf(id);
    if (index !== -1) next = next | (1 << index);
  }
  if (next === fullMask(parts)) return { mask: 0, completed: true };
  return { mask: next, completed: false };
}
