import { useId } from 'react'
import type { ReactNode, RefObject } from 'react'

/* ---------------- EditorSection ---------------- */

interface SectionProps {
  title: string
  hint?: string
  index: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export function EditorSection({ title, hint, index, open, onToggle, children }: SectionProps) {
  return (
    <section className={`ed-section${open ? ' is-open' : ''}`}>
      <button type="button" className="ed-section-head" onClick={onToggle} aria-expanded={open}>
        <span className="ed-index">{index}</span>
        <span className="ed-title">{title}</span>
        {hint && <span className="ed-hint">{hint}</span>}
        <span className="ed-chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className="ed-section-body">
        <div className="ed-grid">{children}</div>
      </div>
    </section>
  )
}

/* ---------------- TextField ---------------- */

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  wide?: boolean
  mono?: boolean
  maxLength?: number
}

export function TextField({ label, value, onChange, placeholder, wide, mono, maxLength }: TextFieldProps) {
  const id = useId()
  return (
    <div className={`field${wide ? ' field-wide' : ''}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`field-input${mono ? ' is-mono' : ''}`}
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/* ---------------- NumberField ---------------- */

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  accent?: string
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  accent,
}: NumberFieldProps) {
  const id = useId()
  const clamp = (n: number) => Math.max(min, Math.min(max, n))

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="stepper" style={accent ? ({ ['--acc' as string]: accent } as never) : undefined}>
        <button type="button" className="step-btn" onClick={() => onChange(clamp(value - step))} aria-label={`Restar ${label}`}>
          −
        </button>
        <input
          id={id}
          className="step-input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10)
            onChange(clamp(Number.isNaN(parsed) ? 0 : parsed))
          }}
        />
        <button type="button" className="step-btn" onClick={() => onChange(clamp(value + step))} aria-label={`Sumar ${label}`}>
          +
        </button>
      </div>
    </div>
  )
}

/* ---------------- SelectField ---------------- */

interface SelectFieldProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  wide?: boolean
}

export function SelectField({ label, value, options, onChange, wide }: SelectFieldProps) {
  const id = useId()
  return (
    <div className={`field${wide ? ' field-wide' : ''}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="select-wrap">
        <select id={id} className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="select-arrow" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 12 12">
            <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  )
}

/* ---------------- SegmentedField ---------------- */

interface SegmentedProps {
  label: string
  value: string
  options: { value: string; icon?: ReactNode }[]
  onChange: (value: string) => void
}

export function SegmentedField({ label, value, options, onChange }: SegmentedProps) {
  return (
    <div className="field field-wide">
      <span className="field-label">{label}</span>
      <div className="segmented" role="group">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`seg-btn${option.value === value ? ' is-active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            <span>{option.value}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- TextAreaField ---------------- */

interface TextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  inputRef?: RefObject<HTMLTextAreaElement>
  footer?: ReactNode
}

export function TextAreaField({ label, value, onChange, rows = 5, placeholder, inputRef, footer }: TextAreaProps) {
  const id = useId()
  return (
    <div className="field field-wide">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        ref={inputRef}
        className="field-textarea"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {footer}
    </div>
  )
}
