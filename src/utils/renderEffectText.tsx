import type { ReactNode } from 'react'
import { tokenizeEffectText } from './extractKeywords'
import { getKeywordTone } from '../data/keywords'

/**
 * Convierte el texto de efecto en nodos React.
 * - Los delimitadores < > nunca se imprimen en la carta.
 * - Cada keyword se renderiza como etiqueta integrada con glow.
 * - Se respetan los saltos de línea.
 */
export function renderEffectText(text: string): ReactNode {
  const tokens = tokenizeEffectText(text)
  if (tokens.length === 0) return null

  const nodes: ReactNode[] = []

  tokens.forEach((token, tokenIndex) => {
    if (token.kind === 'keyword') {
      const tone = getKeywordTone(token.value)
      nodes.push(
        <span
          key={`kw-${tokenIndex}`}
          className={`kw-inline tone-${tone}`}
          data-keyword={token.value}
        >
          {token.value.toLocaleUpperCase('es')}
        </span>,
      )
      return
    }

    const lines = token.value.split('\n')
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) nodes.push(<br key={`br-${tokenIndex}-${lineIndex}`} />)
      if (line) nodes.push(<span key={`tx-${tokenIndex}-${lineIndex}`}>{line}</span>)
    })
  })

  return nodes
}
