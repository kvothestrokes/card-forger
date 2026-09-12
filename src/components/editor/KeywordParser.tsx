import { useState } from 'react'
import type { RefObject } from 'react'
import { KEYWORD_GROUPS, getKeywordTone } from '../../data/keywords'

interface Props {
  detected: string[]
  textareaRef: RefObject<HTMLTextAreaElement>
  onInsert: (snippet: string, selectionStart: number, selectionEnd: number) => void
}

/**
 * Panel de keywords: muestra las detectadas en el texto y permite
 * insertar vocabulario oficial directamente en el cursor del textarea.
 */
export default function KeywordParser({ detected, textareaRef, onInsert }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>(KEYWORD_GROUPS[0].id)

  const insert = (word: string) => {
    const el = textareaRef.current
    const snippet = `<${word}>`
    if (!el) {
      onInsert(snippet, -1, -1)
      return
    }
    onInsert(snippet, el.selectionStart ?? el.value.length, el.selectionEnd ?? el.value.length)
  }

  return (
    <div className="kw-parser">
      <div className="kw-parser-head">
        <span className="kw-parser-title">Keywords detectadas</span>
        <span className="kw-count">{detected.length}</span>
      </div>

      <div className="kw-detected">
        {detected.length === 0 ? (
          <span className="kw-empty">
            Escribe una palabra entre <code>&lt; &gt;</code> para convertirla en keyword.
          </span>
        ) : (
          detected.map((kw) => (
            <span key={kw} className={`kw-badge sm tone-${getKeywordTone(kw)}`}>
              {kw.toLocaleUpperCase('es')}
            </span>
          ))
        )}
      </div>

      <div className="kw-library">
        <div className="kw-tabs">
          {KEYWORD_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`kw-tab${openGroup === group.id ? ' is-active' : ''}`}
              onClick={() => setOpenGroup(group.id === openGroup ? null : group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>

        {openGroup && (
          <div className="kw-pool">
            {KEYWORD_GROUPS.find((g) => g.id === openGroup)?.words.map((word) => (
              <button
                key={word}
                type="button"
                className={`kw-chip tone-${getKeywordTone(word)}`}
                onClick={() => insert(word)}
                title={`Insertar <${word}>`}
              >
                {word}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
