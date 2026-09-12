import type { Card } from '../types'
import { extractKeywords } from '../utils/extractKeywords'

/* Texto inicial: guarda la keyword entre < > para demostrar el parser. */
const INITIAL_EFFECT =
  'Puede interceptar un ataque dirigido a otra nave aliada.\nAl ser destruida, genera 2 <Chatarra>.'

export const INITIAL_CARD: Card = {
  id: 'cp_006',
  nombre: 'Guardian de Desguace',
  tipo: 'Nave',
  rol: 'Acorazado',
  faccion: 'CyberPunk',
  coste_recursos: 3,
  coste_heat: 1,
  ataque: 20,
  escudo: 40,
  espacios_gear: 2,
  texto_efecto: INITIAL_EFFECT,
  palabras_clave: extractKeywords(INITIAL_EFFECT),
  chatarra_al_morir: 2,
  rareza: 'Rara',
  numero_coleccion: 'CP-006',
  autor: 'KvotheStrokes',
}

/** Copia limpia para el botón RESET. */
export function createInitialCard(): Card {
  return {
    ...INITIAL_CARD,
    palabras_clave: extractKeywords(INITIAL_EFFECT),
  }
}
