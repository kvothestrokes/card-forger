import type { Card } from '../../types'
import { IconAtaque, IconChatarra, IconEscudo, IconGear, IconMomento, IconEnlace } from '../icons/Symbology'
import GearSlots from './GearSlots'

interface Props {
  card: Card
}

/** Zona inferior de datos. Su composición cambia según el tipo de carta. */
export default function CardStats({ card }: Props) {
  if (card.tipo === 'Nave') {
    return (
      <div className="card-stats-zone">
        <div className="stats-utility">
          <GearSlots total={card.espacios_gear ?? 0} />
          {(card.chatarra_al_morir ?? 0) > 0 && (
            <span className="scrap-pill" title="Chatarra al morir">
              <IconChatarra size={14} color="#9ad83a" />
              SCRAP +{card.chatarra_al_morir}
            </span>
          )}
        </div>

        <div className="stats-combat">
          <span className="stat stat-atk">
            <IconAtaque size={26} color="#ef6a5e" />
            <b>{card.ataque ?? 0}</b>
          </span>
          <span className="stat-divider" />
          <span className="stat stat-def">
            <b>{card.escudo ?? 0}</b>
            <IconEscudo size={26} color="#3b86e8" />
          </span>
        </div>
      </div>
    )
  }

  if (card.tipo === 'Orden') {
    return (
      <div className="card-stats-zone">
        <div className="stats-tags">
          <span className="data-tag">
            <IconMomento size={14} color="var(--f-primary)" />
            {(card.momento_juego || 'Tu turno').toLocaleUpperCase('es')}
          </span>
          <span className="data-tag ghost">{(card.subtipo || 'Instantánea').toLocaleUpperCase('es')}</span>
        </div>
      </div>
    )
  }

  if (card.tipo === 'Piloto') {
    return (
      <div className="card-stats-zone">
        <div className="stats-tags">
          <span className="data-tag">
            <IconEnlace size={14} color="var(--f-primary)" />
            {(card.requisito_enlace || 'Sin requisito').toLocaleUpperCase('es')}
          </span>
        </div>
      </div>
    )
  }

  /* Gear */
  return (
    <div className="card-stats-zone">
      <div className="stats-utility">
        <GearSlots total={card.espacios_ocupa ?? 0} label="OCUPA" />
        {card.modificadores && (
          <span className="mod-pill" title="Modificadores">
            <IconGear size={13} color="var(--f-accent)" />
            {card.modificadores}
          </span>
        )}
      </div>
    </div>
  )
}
