import { useCallback, useRef, useState } from 'react'
import type { Card } from './types'
import { createInitialCard } from './data/initialCard'
import CardPreview from './components/card/CardPreview'
import CardEditor from './components/editor/CardEditor'
import DataPanel from './components/editor/DataPanel'
import { buildFileName, exportCardToPng } from './utils/exportCard'
import { getFactionTheme } from './utils/getFactionTheme'

type MobileTab = 'preview' | 'editor'

export default function App() {
  const [card, setCard] = useState<Card>(() => createInitialCard())
  const [tab, setTab] = useState<MobileTab>('preview')
  const [showData, setShowData] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const theme = getFactionTheme(card.faccion)

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }, [])

  const handleChange = useCallback((updater: (current: Card) => Card) => {
    setCard((current) => updater(current))
  }, [])

  const handleReset = useCallback(() => {
    setCard(createInitialCard())
    notify('Carta restaurada · Guardian de Desguace')
  }, [notify])

  const handleExport = useCallback(async () => {
    const node = cardRef.current
    if (!node || exporting) return
    setExporting(true)
    try {
      await exportCardToPng(node, buildFileName(card.nombre, card.numero_coleccion))
      notify('PNG exportado')
    } catch {
      notify('No se pudo exportar la carta')
    } finally {
      setExporting(false)
    }
  }, [card.nombre, card.numero_coleccion, exporting, notify])

  return (
    <div className="app" data-faction={theme.short}>
      <div className="app-bg" aria-hidden="true">
        <span className="bg-grid" />
        <span className="bg-glow" style={{ background: theme.glow }} />
        <span className="bg-scan" />
      </div>

      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 32 32">
              <path
                d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M16 9 L22 12.5 L22 19.5 L16 23 L10 19.5 L10 12.5 Z" fill="currentColor" />
            </svg>
          </span>
          <div className="brand-text">
            <h1>
              CARD<span>FORGER</span>
            </h1>
            <p>FLEET CARD FABRICATION TERMINAL · v1.0 by <span style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '0.7rem' }}>KvotheStrokes</span></p>
          </div>
        </div>

        <div className="header-actions">
          <span className="header-status">
            <span className="status-dot" />
            {card.numero_coleccion.toLocaleUpperCase('es')}
          </span>
          <button type="button" className="btn btn-ghost" onClick={() => setShowData(true)}>
            VIEW DATA
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            RESET
          </button>
          <button type="button" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            {exporting ? 'EXPORTANDO…' : 'EXPORT PNG'}
          </button>
        </div>
      </header>

      <nav className="mobile-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'preview'}
          className={tab === 'preview' ? 'is-active' : ''}
          onClick={() => setTab('preview')}
        >
          PREVIEW
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'editor'}
          className={tab === 'editor' ? 'is-active' : ''}
          onClick={() => setTab('editor')}
        >
          EDITOR
        </button>
      </nav>

      <main className="app-main">
        <section className={`pane pane-preview${tab === 'preview' ? ' is-active' : ''}`}>
          <CardPreview card={card} ref={cardRef} />
        </section>

        <aside className={`pane pane-editor${tab === 'editor' ? ' is-active' : ''}`}>
          <CardEditor card={card} onChange={handleChange} />
        </aside>
      </main>

      {showData && <DataPanel card={card} onClose={() => setShowData(false)} />}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
