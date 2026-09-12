import { RARITY_COLORS } from '../../data/factions'

interface Props {
  faccion: string
  rareza: string
  numero: string
}

/** Pie de carta: facción, rareza y número de colección. */
export default function CardFaction({ faccion, rareza, numero }: Props) {
  const color = RARITY_COLORS[rareza] ?? '#8f9bb0'

  return (
    <footer className="card-footer">
      <span className="footer-faction">{faccion.toLocaleUpperCase('es')}</span>
      <span className="footer-right">
        <span className="rarity-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <span className="footer-meta" style={{ color }}>
          {rareza.toLocaleUpperCase('es')}
        </span>
        <span className="footer-sep">·</span>
        <span className="footer-meta">{numero.toLocaleUpperCase('es')}</span>
      </span>
    </footer>
  )
}
