/**
 * Texto giratorio: una palabra repetida 3 veces (estilo fashion/aesthetic).
 * El usuario elige la palabra desde Configuración.
 */
export const SPINNING_TEXT_WORDS = [
  "exclusive",
  "aesthetic",
  "fashion",
  "premium",
  "limited",
  "rare",
] as const;

export type SpinningTextWordKey = (typeof SPINNING_TEXT_WORDS)[number];

export const SPINNING_TEXT_WORD_LABELS: Record<SpinningTextWordKey, string> = {
  exclusive: "Exclusive",
  aesthetic: "Aesthetic",
  fashion: "Fashion",
  premium: "Premium",
  limited: "Limited",
  rare: "Rare",
};

/** Migración: valores antiguos set1/set2 → palabras nuevas */
const LEGACY_MAP: Record<string, string> = {
  set1: "exclusive",
  set2: "aesthetic",
};

/** Devuelve la palabra repetida 3 veces con separador • para el anillo */
export function getSpinningTextContent(
  wordKey: SpinningTextWordKey | string | null | undefined
): string | null {
  if (!wordKey || typeof wordKey !== "string") return null;
  const raw = wordKey.trim().toLowerCase();
  if (!raw) return null;
  const word = LEGACY_MAP[raw] ?? raw;
  return `${word} • ${word} • ${word} •`;
}
