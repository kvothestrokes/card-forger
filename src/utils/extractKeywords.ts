/* ============================================================
   Parser de keywords.
   Fuente de verdad única: `texto_efecto`.
   Todo lo que el usuario escriba entre < > es una keyword,
   incluyendo parámetros: <Perforante 2>, <Asalto +5>, ...
   ============================================================ */

export const KEYWORD_REGEX = /<([^<>]+)>/g

/**
 * Devuelve todas las keywords encontradas en un texto, sin duplicados
 * y respetando el orden de aparición.
 *
 *   extractKeywords('<Escolta> ... genera 2 <Chatarra>.')
 *   // → ['Escolta', 'Chatarra']
 */
export function extractKeywords(text: string): string[] {
  if (!text) return []
  const found: string[] = []
  const seen = new Set<string>()
  const re = new RegExp(KEYWORD_REGEX.source, 'g')
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    const keyword = match[1].trim().replace(/\s+/g, ' ')
    if (!keyword) continue
    const dedupeKey = keyword.toLocaleLowerCase('es')
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    found.push(keyword)
  }
  return found
}

export type EffectToken =
  | { kind: 'text'; value: string }
  | { kind: 'keyword'; value: string }

/**
 * Trocea el texto de efecto en segmentos de texto plano y keywords,
 * eliminando los delimitadores < > de la salida renderizada.
 */
export function tokenizeEffectText(text: string): EffectToken[] {
  if (!text) return []
  const tokens: EffectToken[] = []
  const re = new RegExp(KEYWORD_REGEX.source, 'g')
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', value: text.slice(lastIndex, match.index) })
    }
    const keyword = match[1].trim().replace(/\s+/g, ' ')
    if (keyword) tokens.push({ kind: 'keyword', value: keyword })
    lastIndex = re.lastIndex
  }

  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', value: text.slice(lastIndex) })
  }
  return tokens
}

/** Texto sin delimitadores, útil para exportaciones o tooltips. */
export function stripKeywordMarkers(text: string): string {
  return (text || '').replace(new RegExp(KEYWORD_REGEX.source, 'g'), (_m, inner: string) =>
    inner.trim(),
  )
}
