import { useCallback, useRef, useState } from 'react'

interface Props {
  artwork?: string
  onChange: (url: string | undefined) => void
}

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']

/** Carga local de arte. Se guarda como data URL para que el export PNG no rompa blob: URLs. */
export default function ArtworkUploader({ artwork, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      if (!ACCEPTED.includes(file.type)) {
        setError('Formato no soportado. Usa PNG, JPG o WEBP.')
        return
      }
      setError(null)
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') onChange(reader.result)
        else setError('No se pudo leer la imagen.')
      }
      reader.onerror = () => setError('No se pudo leer la imagen.')
      reader.readAsDataURL(file)
    },
    [onChange],
  )

  return (
    <div className="field field-wide">
      <span className="field-label">Imagen de arte</span>

      <div
        className={`drop-zone${dragging ? ' is-dragging' : ''}${artwork ? ' has-art' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
      >
        {artwork ? (
          <>
            <img className="drop-preview" src={artwork} alt="Arte cargado" />
            <span className="drop-overlay">REEMPLAZAR</span>
          </>
        ) : (
          <div className="drop-empty">
            <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 7 V25 M7 16 H25" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <rect x="2.5" y="2.5" width="27" height="27" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 5" opacity="0.7" />
            </svg>
            <b>+ ARTWORK</b>
            <span>Arrastra una imagen o haz clic</span>
            <small>PNG · JPG · WEBP</small>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="visually-hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>

      {error && <p className="field-error">{error}</p>}

      {artwork && (
        <button type="button" className="btn btn-ghost btn-block" onClick={() => onChange(undefined)}>
          Remove artwork
        </button>
      )}
    </div>
  )
}
