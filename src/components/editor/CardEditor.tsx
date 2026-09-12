import { useMemo, useRef, useState } from 'react'
import type { Card, CardType } from '../../types'
import { FACTIONS, RARITIES } from '../../data/factions'
import { extractKeywords, extractParsedKeywords } from '../../utils/extractKeywords'
import {
  CARD_TYPES,
  ORDER_SUBTYPES,
  ORDER_TIMINGS,
  SHIP_ROLES,
  STATION_ROLES,
  applyTypeDefaults,
  getCardTypeFields,
} from '../../utils/getCardTypeFields'
import { CardTypeIcon, RoleIcon } from '../icons/Symbology'
import ArtworkUploader from './ArtworkUploader'
import KeywordParser from './KeywordParser'
import {
  EditorSection,
  NumberField,
  SegmentedField,
  SelectField,
  TextAreaField,
  TextField,
} from './fields'

interface Props {
  card: Card
  onChange: (updater: (card: Card) => Card) => void
}

type SectionKey =
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

const DEFAULT_OPEN: Record<SectionKey, boolean> = {
  identidad: true,
  clasificacion: true,
  economia: true,
  combate: true,
  equipamiento: true,
  enlace: true,
  orden: true,
  estacion: true,
  efecto: true,
  artwork: false,
  creditos: true,
}

export default function CardEditor({ card, onChange }: Props) {
  const [open, setOpen] = useState<Record<SectionKey, boolean>>(DEFAULT_OPEN)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const visible = useMemo(() => new Set(getCardTypeFields(card.tipo)), [card.tipo])
  const keywords = useMemo(() => extractParsedKeywords(card.texto_efecto ?? ''), [card.texto_efecto])

  const toggle = (key: SectionKey) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  /** Toda edición pasa por aquí: `palabras_clave` siempre se deriva del texto. */
  const patch = (partial: Partial<Card>) => {
    onChange((current) => {
      const next = { ...current, ...partial }
      next.palabras_clave = extractKeywords(next.texto_efecto ?? '')
      return next
    })
  }

  const changeType = (tipo: string) => {
    onChange((current) => {
      const next = applyTypeDefaults(current, tipo as CardType)
      next.palabras_clave = extractKeywords(next.texto_efecto ?? '')
      return next
    })
  }

  const insertKeyword = (snippet: string, start: number, end: number) => {
    const text = card.texto_efecto ?? ''
    if (start < 0) {
      patch({ texto_efecto: `${text}${text && !text.endsWith(' ') ? ' ' : ''}${snippet}` })
      return
    }
    const before = text.slice(0, start)
    const after = text.slice(end)
    const glue = before && !/\s$/.test(before) ? ' ' : ''
    const next = `${before}${glue}${snippet}${after}`
    patch({ texto_efecto: next })

    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      const caret = before.length + glue.length + snippet.length
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }

  let sectionIndex = 0
  const idx = () => String(++sectionIndex).padStart(2, '0')

  return (
    <div className="editor">
      <div className="editor-head">
        <h2>CARD EDITOR</h2>
        <span className="editor-sub">
          {card.tipo.toLocaleUpperCase('es')} · {card.faccion.toLocaleUpperCase('es')}
        </span>
      </div>

      {/* ---------- IDENTIDAD ---------- */}
      <EditorSection
        title="IDENTIDAD"
        index={idx()}
        hint="id · nombre"
        open={open.identidad}
        onToggle={() => toggle('identidad')}
      >
        <TextField
          label="ID interno"
          value={card.id}
          mono
          onChange={(value) => patch({ id: value })}
          placeholder="cp_006"
        />
        <TextField
          label="Número de colección"
          value={card.numero_coleccion}
          mono
          onChange={(value) => patch({ numero_coleccion: value })}
          placeholder="CP-006"
        />
        <TextField
          label="Nombre"
          value={card.nombre}
          wide
          maxLength={42}
          onChange={(value) => patch({ nombre: value })}
          placeholder="Guardian de Desguace"
        />
      </EditorSection>

      {/* ---------- CLASIFICACIÓN ---------- */}
      <EditorSection
        title="CLASIFICACIÓN"
        index={idx()}
        hint="tipo · facción"
        open={open.clasificacion}
        onToggle={() => toggle('clasificacion')}
      >
        <SegmentedField
          label="Tipo de carta"
          value={card.tipo}
          wrap
          onChange={changeType}
          options={CARD_TYPES.map((tipo) => ({
            value: tipo,
            icon: <CardTypeIcon tipo={tipo} size={15} color="currentColor" />,
          }))}
        />

        {card.tipo === 'Nave' && (
          <SegmentedField
            label="Rol"
            value={card.rol ?? 'Acorazado'}
            wrap
            onChange={(value) => patch({ rol: value })}
            options={SHIP_ROLES.map((rol) => ({
              value: rol,
              icon: <RoleIcon rol={rol} size={15} color="currentColor" />,
            }))}
          />
        )}

        {card.tipo === 'Estación' && (
          <SegmentedField
            label="Rol de estación"
            value={card.rol ?? 'Base'}
            wrap
            onChange={(value) => patch({ rol: value })}
            options={STATION_ROLES.map((rol) => ({
              value: rol,
              icon: <RoleIcon rol={rol} size={15} color="currentColor" />,
            }))}
          />
        )}

        <SelectField
          label="Facción"
          value={card.faccion}
          options={FACTIONS}
          onChange={(value) => patch({ faccion: value })}
          wide
        />
        <SelectField
          label="Rareza"
          value={card.rareza}
          options={RARITIES}
          onChange={(value) => patch({ rareza: value })}
        />
      </EditorSection>

      {/* ---------- ECONOMÍA ---------- */}
      {visible.has('economia') && (
        <EditorSection
          title="ECONOMÍA"
          index={idx()}
          hint="coste · heat"
          open={open.economia}
          onToggle={() => toggle('economia')}
        >
          <NumberField
            label="Coste de recursos"
            value={card.coste_recursos}
            min={0}
            max={20}
            accent="#4d8cff"
            onChange={(value) => patch({ coste_recursos: value })}
          />
          <NumberField
            label="Coste de Heat"
            value={card.coste_heat}
            min={0}
            max={20}
            accent="#e07b32"
            onChange={(value) => patch({ coste_heat: value })}
          />
        </EditorSection>
      )}

      {/* ---------- COMBATE ---------- */}
      {visible.has('combate') && (
        <EditorSection
          title="COMBATE"
          index={idx()}
          hint="ataque · escudo"
          open={open.combate}
          onToggle={() => toggle('combate')}
        >
          <NumberField
            label="Ataque"
            value={card.ataque ?? 0}
            min={0}
            max={999_999}
            step={5}
            accent="#ef6a5e"
            onChange={(value) => patch({ ataque: value })}
          />
          <NumberField
            label="Escudo"
            value={card.escudo ?? 0}
            min={0}
            max={999_999}
            step={5}
            accent="#3b86e8"
            onChange={(value) => patch({ escudo: value })}
          />
        </EditorSection>
      )}

      {/* ---------- EQUIPAMIENTO ---------- */}
      {visible.has('equipamiento') && (
        <EditorSection
          title="EQUIPAMIENTO"
          index={idx()}
          hint={card.tipo === 'Gear' ? 'espacios · restricción' : 'gear · chatarra'}
          open={open.equipamiento}
          onToggle={() => toggle('equipamiento')}
        >
          {card.tipo === 'Nave' ? (
            <>
              <NumberField
                label="Espacios de Gear"
                value={card.espacios_gear ?? 0}
                min={0}
                max={8}
                accent="#57d7d7"
                onChange={(value) => patch({ espacios_gear: value })}
              />
              <NumberField
                label="Chatarra al morir"
                value={card.chatarra_al_morir ?? 0}
                min={0}
                max={20}
                accent="#9ad83a"
                onChange={(value) => patch({ chatarra_al_morir: value })}
              />
            </>
          ) : (
            <>
              <NumberField
                label="Espacios que ocupa"
                value={card.espacios_ocupa ?? 1}
                min={0}
                max={8}
                accent="#57d7d7"
                onChange={(value) => patch({ espacios_ocupa: value })}
              />
              <TextField
                label="Restricción de equipamiento"
                value={card.restriccion_equipamiento ?? ''}
                onChange={(value) => patch({ restriccion_equipamiento: value })}
                placeholder="Sólo Acorazado"
              />
              <TextField
                label="Modificadores"
                value={card.modificadores ?? ''}
                wide
                onChange={(value) => patch({ modificadores: value })}
                placeholder="+10 Escudo · +1 Gear"
              />
            </>
          )}
        </EditorSection>
      )}

      {/* ---------- ENLACE (Piloto) ---------- */}
      {visible.has('enlace') && (
        <EditorSection
          title="ENLACE"
          index={idx()}
          hint="requisito · bonos"
          open={open.enlace}
          onToggle={() => toggle('enlace')}
        >
          <TextField
            label="Requisito de enlace"
            value={card.requisito_enlace ?? ''}
            wide
            onChange={(value) => patch({ requisito_enlace: value })}
            placeholder="Nave · Caza"
          />
          <TextField
            label="Bono al enlazar"
            value={card.bono_al_enlazar ?? ''}
            wide
            onChange={(value) => patch({ bono_al_enlazar: value })}
            placeholder="+5 Ataque y <Evasión>"
          />
          <TextField
            label="Bono sin enlazar"
            value={card.bono_sin_enlazar ?? ''}
            wide
            onChange={(value) => patch({ bono_sin_enlazar: value })}
            placeholder="Genera 1 recurso al inicio de tu turno."
          />
        </EditorSection>
      )}

      {/* ---------- ORDEN ---------- */}
      {visible.has('orden') && (
        <EditorSection
          title="PROTOCOLO"
          index={idx()}
          hint="subtipo · momento"
          open={open.orden}
          onToggle={() => toggle('orden')}
        >
          <SelectField
            label="Subtipo"
            value={card.subtipo ?? 'Instantánea'}
            options={ORDER_SUBTYPES}
            onChange={(value) => patch({ subtipo: value })}
          />
          <SelectField
            label="Momento de juego"
            value={card.momento_juego ?? 'Tu turno'}
            options={ORDER_TIMINGS}
            onChange={(value) => patch({ momento_juego: value })}
          />
        </EditorSection>
      )}

      {/* ---------- ESTACIÓN ---------- */}
      {visible.has('estacion') && (
        <EditorSection
          title="ESTACIÓN"
          index={idx()}
          hint="hp · heat gauge"
          open={open.estacion}
          onToggle={() => toggle('estacion')}
        >
          <NumberField
            label="HP actual"
            value={card.hp ?? 0}
            min={0}
            max={40}
            accent="#3ee0a0"
            onChange={(value) => patch({ hp: value })}
          />
          <NumberField
            label="HP máximo"
            value={card.hp_max ?? 20}
            min={1}
            max={40}
            accent="#3ee0a0"
            onChange={(value) => patch({ hp_max: value })}
          />
          <NumberField
            label="Heat actual"
            value={card.heat_actual ?? 0}
            min={0}
            max={16}
            accent="#e07b32"
            onChange={(value) => patch({ heat_actual: value })}
          />
          <NumberField
            label="Umbral de sobrecalentamiento"
            value={card.heat_umbral ?? 10}
            min={1}
            max={16}
            accent="#e07b32"
            onChange={(value) => patch({ heat_umbral: value })}
          />
        </EditorSection>
      )}
      <EditorSection
        title="EFECTO"
        index={idx()}
        hint="&lt; &gt; = keyword"
        open={open.efecto}
        onToggle={() => toggle('efecto')}
      >
        <TextAreaField
          label="Texto de efecto"
          value={card.texto_efecto ?? ''}
          rows={6}
          inputRef={textareaRef}
          onChange={(value) => patch({ texto_efecto: value })}
          placeholder={'Al entrar en juego, obtiene <Escolta>.\nAl ser destruida, genera 2 <Chatarra>.'}
          footer={
            <p className="field-help">
              Las palabras entre <code>&lt; &gt;</code> se convierten en keywords. Admiten parámetros:{' '}
              <code>&lt;Perforante 2&gt;</code> y color hexadecimal:{' '}
              <code>&lt;Chatarra#ff4d4d&gt;</code>. Los símbolos no se imprimen en la carta.
            </p>
          }
        />

        <KeywordParser detected={keywords} textareaRef={textareaRef} onInsert={insertKeyword} />
      </EditorSection>

      {/* ---------- ARTWORK ---------- */}
      <EditorSection
        title="ARTWORK"
        index={idx()}
        hint="local · en memoria"
        open={open.artwork}
        onToggle={() => toggle('artwork')}
      >
        <ArtworkUploader artwork={card.artwork} onChange={(url) => patch({ artwork: url })} />
      </EditorSection>

      <EditorSection
        title="CRÉDITOS"
        index={idx()}
        hint="autor"
        open={open.creditos}
        onToggle={() => toggle('creditos')}
      >
        <TextField
          label="Autor"
          value={card.autor}
          wide
          maxLength={42}
          onChange={(value) => patch({ autor: value })}
          placeholder="KvotheStrokes"
        />
      </EditorSection>
    </div>
  )
}
