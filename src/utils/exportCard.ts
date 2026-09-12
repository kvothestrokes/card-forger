import { toPng } from 'html-to-image'
import { CARD_H, CARD_W } from '../components/card/CardPreview'

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

function blobUrlToDataUrl(url: string): Promise<string> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`No se pudo leer el artwork (${res.status})`)
      return res.blob()
    })
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            if (typeof reader.result === 'string') resolve(reader.result)
            else reject(new Error('No se pudo convertir el artwork'))
          }
          reader.onerror = () => reject(new Error('No se pudo convertir el artwork'))
          reader.readAsDataURL(blob)
        }),
    )
}

/** html-to-image añade `?t=` a cada src si cacheBust=true; eso invalida blob: URLs. */
async function inlineBlobImages(node: HTMLElement): Promise<() => void> {
  const imgs = Array.from(node.querySelectorAll('img'))
  const restore: Array<() => void> = []

  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src')
      if (!src?.startsWith('blob:')) return
      const original = src
      img.src = await blobUrlToDataUrl(src)
      restore.push(() => {
        img.src = original
      })
    }),
  )

  return () => restore.forEach((fn) => fn())
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

/**
 * Recorta el artwork con la misma regla que el viewer (`object-fit: cover`)
 * y lo deja rasterizado al tamaño real de la caja. Así un PNG enorme no
 * empuja el layout ni se descuadra en el foreignObject de html-to-image.
 */
async function bakeCoverArtwork(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img.card-art-img'))

  await Promise.all(
    imgs.map(async (img) => {
      try {
        if (img.decode) await img.decode()
      } catch {
        /* la imagen puede seguir siendo usable */
      }

      const box = img.parentElement
      if (!box || !img.naturalWidth || !img.naturalHeight) return

      const cssW = box.clientWidth
      const cssH = box.clientHeight
      if (!cssW || !cssH) return

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(cssW * EXPORT_SCALE))
      canvas.height = Math.max(1, Math.round(cssH * EXPORT_SCALE))
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)

      img.src = canvas.toDataURL('image/png')
      img.removeAttribute('srcset')
      img.style.position = 'absolute'
      img.style.inset = '0'
      img.style.width = '100%'
      img.style.height = '100%'
      img.style.maxWidth = 'none'
      img.style.maxHeight = 'none'
      img.style.objectFit = 'fill'
      img.style.objectPosition = 'center'
    }),
  )
}

function mountExportClone(source: HTMLElement): { clone: HTMLElement; dispose: () => void } {
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.className = 'card-export-host'
  host.style.cssText = [
    'position:fixed',
    'left:-10000px',
    'top:0',
    `width:${CARD_W}px`,
    `height:${CARD_H}px`,
    'margin:0',
    'padding:0',
    'transform:none',
    'zoom:1',
    'pointer-events:none',
    'z-index:-1',
  ].join(';')

  const clone = source.cloneNode(true) as HTMLElement
  clone.classList.add('is-exporting')
  clone.style.transform = 'none'
  clone.style.margin = '0'
  clone.style.zoom = '1'
  host.appendChild(clone)
  document.body.appendChild(host)

  return {
    clone,
    dispose: () => {
      host.remove()
    },
  }
}

/**
 * Exporta únicamente el nodo de la carta a PNG de alta resolución.
 * No incluye header, editor, fondo de la app ni controles.
 *
 * Se captura una copia a 420×588 (sin el scale del viewer) para que
 * badges, texto y artwork coincidan con lo que se ve en pantalla.
 */
export async function exportCardToPng(node: HTMLElement, fileName: string): Promise<void> {
  const restoreBlobs = await inlineBlobImages(node)
  const { clone, dispose } = mountExportClone(node)

  try {
    if (document.fonts?.ready) await document.fonts.ready
    await nextPaint()
    await bakeCoverArtwork(clone)
    await nextPaint()

    const dataUrl = await toPng(clone, {
      pixelRatio: EXPORT_SCALE,
      cacheBust: false,
      skipFonts: true,
      skipAutoScale: true,
      backgroundColor: 'transparent',
      width: CARD_W,
      height: CARD_H,
      canvasWidth: CARD_W,
      canvasHeight: CARD_H,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
        margin: '0',
        inset: 'auto',
        left: '0',
        top: '0',
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
      },
    })

    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    dispose()
    restoreBlobs()
  }
}
