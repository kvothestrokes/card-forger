import { IconHeat, IconRecursos } from '../icons/Symbology'

interface Props {
  recursos: number
  heat: number
}

/** Costes en las esquinas superiores: recursos (círculo) y heat (hexágono). */
export default function CardCost({ recursos, heat }: Props) {
  return (
    <>
      <div className="cost-badge cost-resources" title="Coste de recursos">
        <span className="cost-glyph">
          <IconRecursos size={64} color="#2f6fc4" />
        </span>
        <span className="cost-value">{recursos}</span>
      </div>

      <div className="cost-badge cost-heat" title="Coste de Heat">
        <span className="cost-glyph">
          <IconHeat size={62} color="#b4531c" />
        </span>
        <span className="cost-value">{heat}</span>
      </div>
    </>
  )
}
