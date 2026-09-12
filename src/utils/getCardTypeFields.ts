import type { Card, CardType, FieldGroup } from '../types'

export const CARD_TYPES: CardType[] = ['Nave', 'Orden', 'Piloto', 'Gear']

export const SHIP_ROLES = ['Acorazado', 'Caza', 'Soporte']
export const ORDER_SUBTYPES = ['Instantánea', 'Pasiva', 'Reacción']
export const ORDER_TIMINGS = ['Tu turno', 'Turno del rival', 'Reacción']

/** Secciones del editor visibles para cada tipo de carta, en orden. */
export function getCardTypeFields(tipo: CardType): FieldGroup[] {
  const base: FieldGroup[] = ['identidad', 'clasificacion', 'economia']
  switch (tipo) {
    case 'Nave':
      return [...base, 'combate', 'equipamiento', 'efecto', 'artwork']
    case 'Orden':
      return [...base, 'orden', 'efecto', 'artwork']
    case 'Piloto':
      return [...base, 'enlace', 'efecto', 'artwork']
    case 'Gear':
      return [...base, 'equipamiento', 'efecto', 'artwork']
  }
}

/**
 * Normaliza la carta al cambiar de tipo: limpia los campos que dejan de
 * aplicar y garantiza valores por defecto sensatos para los nuevos.
 */
export function applyTypeDefaults(card: Card, tipo: CardType): Card {
  const next: Card = { ...card, tipo }

  const clear = (keys: (keyof Card)[]) => {
    for (const key of keys) delete next[key]
  }

  switch (tipo) {
    case 'Nave':
      clear([
        'subtipo',
        'momento_juego',
        'requisito_enlace',
        'bono_al_enlazar',
        'bono_sin_enlazar',
        'espacios_ocupa',
        'restriccion_equipamiento',
        'modificadores',
      ])
      next.rol = card.rol && SHIP_ROLES.includes(card.rol) ? card.rol : 'Acorazado'
      next.ataque = card.ataque ?? 10
      next.escudo = card.escudo ?? 20
      next.espacios_gear = card.espacios_gear ?? 1
      next.chatarra_al_morir = card.chatarra_al_morir ?? 0
      break

    case 'Orden':
      clear([
        'rol',
        'ataque',
        'escudo',
        'espacios_gear',
        'chatarra_al_morir',
        'requisito_enlace',
        'bono_al_enlazar',
        'bono_sin_enlazar',
        'espacios_ocupa',
        'restriccion_equipamiento',
        'modificadores',
      ])
      next.subtipo = card.subtipo && ORDER_SUBTYPES.includes(card.subtipo) ? card.subtipo : 'Instantánea'
      next.momento_juego =
        card.momento_juego && ORDER_TIMINGS.includes(card.momento_juego)
          ? card.momento_juego
          : 'Tu turno'
      break

    case 'Piloto':
      clear([
        'rol',
        'ataque',
        'escudo',
        'espacios_gear',
        'chatarra_al_morir',
        'subtipo',
        'momento_juego',
        'espacios_ocupa',
        'restriccion_equipamiento',
        'modificadores',
      ])
      next.requisito_enlace = card.requisito_enlace ?? 'Nave · Caza'
      next.bono_al_enlazar = card.bono_al_enlazar ?? '+5 Ataque'
      next.bono_sin_enlazar = card.bono_sin_enlazar ?? 'Genera 1 recurso al inicio de tu turno.'
      break

    case 'Gear':
      clear([
        'rol',
        'ataque',
        'escudo',
        'espacios_gear',
        'chatarra_al_morir',
        'subtipo',
        'momento_juego',
        'requisito_enlace',
        'bono_al_enlazar',
        'bono_sin_enlazar',
      ])
      next.espacios_ocupa = card.espacios_ocupa ?? 1
      next.restriccion_equipamiento = card.restriccion_equipamiento ?? 'Sólo Acorazado'
      next.modificadores = card.modificadores ?? '+10 Escudo'
      break
  }

  return next
}

/** Prefijo de número de colección sugerido por facción. */
export const FACTION_PREFIX: Record<string, string> = {
  'Imperio Galáctico': 'IG',
  Piratas: 'PR',
  Xeno: 'XN',
  CyberPunk: 'CP',
  IA: 'IA',
  SteamPunk: 'SP',
}
