import { useMemo, useState } from 'react'
import type { Card } from '../../types'
import { extractKeywords } from '../../utils/extractKeywords'

interface Props {
  card: Card
  onClose: () => void
}

/** Vista del JSON en vivo — la forma exacta que consumirá el simulador. */
export default function DataPanel({ card, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const json = useMemo(() => {
    const clone: Card = { ...card, palabras_clave: extractKeywords(card.texto_efecto ?? '') }
    if (clone.artwork) clone.artwork = '<data-url:local>'
    return JSON.stringify(clone, null, 2)
  }, [card])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="data-overlay" role="dialog" aria-label="Datos de la carta">
      <div className="data-panel">
        <div className="data-head">
          <span className="data-title">CARD DATA · JSON</span>
          <div className="data-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
              {copied ? 'COPIADO' : 'COPIAR'}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              CERRAR
            </button>
          </div>
        </div>
        <pre className="data-body">
          <code>{json}</code>
        </pre>
      </div>
    </div>
  )
}
