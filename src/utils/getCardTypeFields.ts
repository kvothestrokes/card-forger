import type { Card, CardType, FieldGroup } from '../types'

export const CARD_TYPES: CardType[] = ['Nave', 'Orden', 'Piloto', 'Gear', 'Estación']

export const SHIP_ROLES = [
  'Caza',
  'Corbeta',
  'Fragata',
  'Destructor',
  'Crucero',
  'Acorazado',
  'Titán',
  'Soporte',
]
export const ORDER_SUBTYPES = ['Instantánea', 'Pasiva', 'Reacción']
export const ORDER_TIMINGS = ['Tu turno', 'Turno del rival', 'Reacción']
export const STATION_ROLES = ['Base', 'Astillero', 'Puerto', 'Relé']

export const CARD_SIZE_PORTRAIT = { w: 420, h: 588 }
export const CARD_SIZE_STATION = { w: 720, h: 400 }

export function getCardSize(tipo: CardType): { w: number; h: number } {
  return tipo === 'Estación' ? CARD_SIZE_STATION : CARD_SIZE_PORTRAIT
}

export function cardTypeClass(tipo: string): string {
  return tipo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Secciones del editor visibles para cada tipo de carta, en orden. */
export function getCardTypeFields(tipo: CardType): FieldGroup[] {
  const base: FieldGroup[] = ['identidad', 'clasificacion', 'economia']
  switch (tipo) {
    case 'Nave':
      return [...base, 'combate', 'equipamiento', 'efecto', 'artwork', 'creditos']
    case 'Orden':
      return [...base, 'orden', 'efecto', 'artwork', 'creditos']
    case 'Piloto':
      return [...base, 'enlace', 'efecto', 'artwork', 'creditos']
    case 'Gear':
      return [...base, 'equipamiento', 'efecto', 'artwork', 'creditos']
    case 'Estación':
      return ['identidad', 'clasificacion', 'estacion', 'efecto', 'artwork', 'creditos']
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

  const stationKeys: (keyof Card)[] = ['hp', 'hp_max', 'heat_actual', 'heat_umbral']

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
        ...stationKeys,
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
        ...stationKeys,
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
        ...stationKeys,
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
        ...stationKeys,
      ])
      next.espacios_ocupa = card.espacios_ocupa ?? 1
      next.restriccion_equipamiento = card.restriccion_equipamiento ?? 'Sólo Acorazado'
      next.modificadores = card.modificadores ?? '+10 Escudo'
      break

    case 'Estación':
      clear([
        'ataque',
        'escudo',
        'espacios_gear',
        'chatarra_al_morir',
        'subtipo',
        'momento_juego',
        'requisito_enlace',
        'bono_al_enlazar',
        'bono_sin_enlazar',
        'espacios_ocupa',
        'restriccion_equipamiento',
        'modificadores',
      ])
      next.rol = card.rol && STATION_ROLES.includes(card.rol) ? card.rol : 'Base'
      next.hp = card.hp ?? 14
      next.hp_max = card.hp_max ?? 20
      next.heat_actual = card.heat_actual ?? 3
      next.heat_umbral = card.heat_umbral ?? 10
      next.coste_recursos = 0
      next.coste_heat = 0
      if (card.tipo !== 'Estación') {
        next.texto_efecto =
          'Al inicio de tu turno, gana 1 <recurso#3ee0a0> adicional. Si el Heat llega a 10, enfría 3 y pierde 2 HP.'
      }
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
  Neutral: 'NT',
}
