import { getKeywordTone } from '../../data/keywords'

interface Props {
  keywords: string[]
}

/** Badges derivados automáticamente del texto de efecto. */
export default function CardKeywords({ keywords }: Props) {
  if (!keywords.length) return null
  const shown = keywords.slice(0, 5)
  const dense = shown.length > 3

  return (
    <div className={`card-keywords${dense ? ' is-dense' : ''}`}>
      {shown.map((kw, i) => (
        <span
          key={kw}
          className={`kw-badge tone-${getKeywordTone(kw)}`}
          style={{ animationDelay: `${i * 55}ms` }}
        >
          {kw.toLocaleUpperCase('es')}
        </span>
      ))}
      {keywords.length > shown.length && (
        <span className="kw-badge tone-unknown kw-more">+{keywords.length - shown.length}</span>
      )}
    </div>
  )
}
