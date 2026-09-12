import { toPng } from 'html-to-image'

const EXPORT_SCALE = 3

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'card'
}

export function buildFileName(nombre: string, numero: string): string {
  const parts = [slugify(numero), slugify(nombre)].filter(Boolean)
  return `${parts.join('_')}.png`
}

/**
 * Exporta únicamente el nodo de la carta a PNG de alta resolución.
 * No incluye header, editor, fondo de la app ni controles.
 */
export async function exportCardToPng(node: HTMLElement, fileName: string): Promise<void> {
  const options = {
    pixelRatio: EXPORT_SCALE,
    cacheBust: true,
    backgroundColor: 'transparent',
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: 'none', margin: '0' },
  }

  let dataUrl: string
  try {
    dataUrl = await toPng(node, options)
  } catch {
    // Reintento sin incrustar fuentes remotas (entornos sin red / CORS).
    dataUrl = await toPng(node, { ...options, skipFonts: true })
  }

  const link = document.createElement('a')
  link.download = fileName
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
