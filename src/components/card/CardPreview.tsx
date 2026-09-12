import { forwardRef, useEffect, useRef, useState } from 'react'
import type { Card } from '../../types'
import { CARD_SIZE_PORTRAIT, getCardSize } from '../../utils/getCardTypeFields'
import CardFrame from './CardFrame'

export const CARD_W = CARD_SIZE_PORTRAIT.w
export const CARD_H = CARD_SIZE_PORTRAIT.h

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
  const { w, h } = getCardSize(card.tipo)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const next = Math.min((width - 24) / w, (height - 24) / h, 1.25)
      setScale(Math.max(0.32, next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [w, h])

  return (
    <div className="card-stage" ref={stageRef}>
      <div className="stage-grid" aria-hidden="true" />
      <div
        className="card-scaler"
        style={{ width: w * scale, height: h * scale }}
      >
        <div
          className="card-scaler-inner"
          style={{ transform: `scale(${scale})`, width: w, height: h }}
        >
          <CardFrame ref={cardRef} card={card} />
        </div>
      </div>
    </div>
  )
})

export default CardPreview
