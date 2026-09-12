import { FACTION_THEMES } from '../data/factions'
import type { FactionId, FactionTheme } from '../types'

const FALLBACK: FactionId = 'CyberPunk'

export function getFactionTheme(faccion: string): FactionTheme {
  return FACTION_THEMES[(faccion as FactionId)] ?? FACTION_THEMES[FALLBACK]
}

/** Variables CSS inyectadas en la raíz de la carta. */
export function factionCssVars(faccion: string): Record<string, string> {
  const t = getFactionTheme(faccion)
  return {
    '--f-primary': t.primary,
    '--f-accent': t.accent,
    '--f-ink': t.ink,
    '--f-border': t.border,
    '--f-glow': t.glow,
    '--f-bg-from': t.bgFrom,
    '--f-bg-to': t.bgTo,
    '--f-art-from': t.artFrom,
    '--f-art-to': t.artTo,
  }
}
