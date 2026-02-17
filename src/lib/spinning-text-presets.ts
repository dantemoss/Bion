/**
 * Presets para el texto giratorio del perfil público.
 * Tres frases separadas por • (obligatorio); el usuario elige el set desde Configuración.
 */
export const SPINNING_TEXT_PRESETS = {
  set1: "aprende más • crece más • comparte más •",
  set2: "learn more • earn more • grow more •",
} as const

export type SpinningTextSetKey = keyof typeof SPINNING_TEXT_PRESETS

export const SPINNING_TEXT_SET_LABELS: Record<SpinningTextSetKey, string> = {
  set1: "Set 1 (español)",
  set2: "Set 2 (inglés)",
}

export function getSpinningTextContent(setKey: SpinningTextSetKey | null | undefined): string | null {
  if (!setKey || !(setKey in SPINNING_TEXT_PRESETS)) return null
  return SPINNING_TEXT_PRESETS[setKey as SpinningTextSetKey]
}
