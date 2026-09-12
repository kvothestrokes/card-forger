import { forwardRef, useEffect, useRef, useState } from 'react'
import type { Card } from '../../types'
import CardFrame from './CardFrame'

export const CARD_W = 420
export const CARD_H = 588

interface Props {
  card: Card
}

/**
 * Escenario de la carta: mide el espacio disponible y escala la carta
 * manteniendo su proporción. El nodo exportado nunca lleva transform,
 * así que el PNG sale siempre a resolución completa.
 */
const CardPreview = forwardRef<HTMLDivElement, Props>(function CardPreview({ card }, cardRef) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const next = Math.min((width - 24) / CARD_W, (height - 24) / CARD_H, 1.25)
      setScale(Math.max(0.32, next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="card-stage" ref={stageRef}>
      <div className="stage-grid" aria-hidden="true" />
      <div
        className="card-scaler"
        style={{ width: CARD_W * scale, height: CARD_H * scale }}
      >
        <div
          className="card-scaler-inner"
          style={{ transform: `scale(${scale})`, width: CARD_W, height: CARD_H }}
        >
          <CardFrame ref={cardRef} card={card} />
        </div>
      </div>
    </div>
  )
})

export default CardPreview
