/* ============================================================
   CARD FORGE — Modelo de datos
   Los nombres de campo se mantienen estables para que un futuro
   simulador del TCG pueda consumir este JSON sin traducciones.
   ============================================================ */

export type CardType = 'Nave' | 'Orden' | 'Piloto' | 'Gear' | 'Estación'

export type StationRole = 'Base' | 'Astillero' | 'Puerto' | 'Relé'

export type FactionId =
  | 'Imperio Galáctico'
  | 'Piratas'
  | 'Xeno'
  | 'CyberPunk'
  | 'IA'
  | 'SteamPunk'
  | 'Neutral'

export type ShipRole =
  | 'Caza'
  | 'Corbeta'
  | 'Fragata'
  | 'Destructor'
  | 'Crucero'
  | 'Acorazado'
  | 'Titán'
  | 'Soporte'

export type OrderSubtype = 'Instantánea' | 'Pasiva' | 'Reacción'

export type OrderTiming = 'Tu turno' | 'Turno del rival' | 'Reacción'

export type Rarity = 'Común' | 'Poco común' | 'Rara' | 'Épica' | 'Legendaria'

export interface Card {
  id: string
  nombre: string
  tipo: CardType
  faccion: string

  coste_recursos: number
  coste_heat: number

  /* --- Nave --- */
  rol?: string
  ataque?: number
  escudo?: number
  espacios_gear?: number
  chatarra_al_morir?: number

  /* --- Común a varios tipos --- */
  palabras_clave?: string[]
  texto_efecto?: string

  /* --- Orden --- */
  subtipo?: string
  momento_juego?: string

  /* --- Piloto --- */
  requisito_enlace?: string
  bono_al_enlazar?: string
  bono_sin_enlazar?: string

  /* --- Gear --- */
  espacios_ocupa?: number
  restriccion_equipamiento?: string
  modificadores?: string

  /* --- Estación --- */
  hp?: number
  hp_max?: number
  heat_actual?: number
  heat_umbral?: number

  /* --- Metadatos de colección --- */
  rareza: string
  numero_coleccion: string
  autor: string

  /* --- Arte (object URL en memoria, nunca se sube a ningún servidor) --- */
  artwork?: string
}

export interface FactionTheme {
  id: FactionId
  short: string
  primary: string
  accent: string
  ink: string
  border: string
  glow: string
  bgFrom: string
  bgTo: string
  artFrom: string
  artTo: string
  pattern: 'grid' | 'scan' | 'organic' | 'neon' | 'geometric' | 'gears' | 'stars'
}

export type FieldGroup =
  | 'identidad'
  | 'clasificacion'
  | 'economia'
  | 'combate'
  | 'equipamiento'
  | 'enlace'
  | 'orden'
  | 'estacion'
  | 'efecto'
  | 'artwork'
  | 'creditos'
