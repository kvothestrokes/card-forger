# CARD FORGE

Editor visual de cartas para un TCG de naves espaciales sci-fi.
100 % frontend: sin backend, sin autenticación, sin base de datos y sin APIs externas.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview
```

## Despliegue en Vercel Drop

1. `npm run build`
2. Arrastra la carpeta `dist/` a https://vercel.com/drop

También funciona importando el repositorio completo: Vercel detecta Vite
automáticamente (`build` → `dist`). `base: './'` en `vite.config.ts` hace que
el build sea válido en cualquier ruta.

## Sistema de keywords

La **única fuente de verdad** es `texto_efecto`. Todo lo que se escriba entre
`< >` se convierte en keyword:

```
<Escolta> Puede interceptar un ataque dirigido a otra nave aliada.
Al ser destruida, genera 2 <Chatarra>.
Obtiene <Perforante 2>.
```

- `palabras_clave` se deriva siempre con `extractKeywords(texto_efecto)`.
- Soporta parámetros: `<Perforante 2>`, `<Asalto +5>`, `<Fuego de cobertura 10>`
  se tratan como una keyword completa.
- Se eliminan duplicados respetando el orden de aparición.
- Los símbolos `<` y `>` **no se imprimen** en la carta: sólo en el editor.
- Las keywords desconocidas no se bloquean; reciben el color de acento de la facción.

El panel de keywords del editor permite insertar vocabulario oficial en la
posición del cursor del textarea.

## Tipos de carta

| Tipo   | Campos propios                                                      |
| ------ | ------------------------------------------------------------------- |
| Nave   | rol, ataque, escudo, espacios_gear, chatarra_al_morir                |
| Orden  | subtipo, momento_juego                                              |
| Piloto | requisito_enlace, bono_al_enlazar, bono_sin_enlazar                 |
| Gear   | espacios_ocupa, restriccion_equipamiento, modificadores             |

Al cambiar de tipo, `applyTypeDefaults()` limpia los campos que dejan de aplicar
y rellena los nuevos con valores razonables.

## Facciones

Imperio Galáctico · Piratas · Xeno · CyberPunk · IA · SteamPunk

Cada facción inyecta variables CSS (`--f-primary`, `--f-accent`, `--f-glow`, …)
que modifican bordes, acentos, glow y el arte procedural — sin alterar el layout.

## Estructura

```
src/
  App.tsx                    layout, header, export, reset, tabs móviles
  types.ts                   modelo Card (nombres estables para el simulador)
  data/
    factions.ts              temas cromáticos y rarezas
    keywords.ts              vocabulario oficial y tonos
    initialCard.ts           Guardian de Desguace
  utils/
    extractKeywords.ts       parser < >  ·  tokenizador  ·  strip
    renderEffectText.tsx     texto → nodos React con keywords resaltadas
    getFactionTheme.ts       tema → variables CSS
    getCardTypeFields.ts     secciones visibles por tipo + defaults
    exportCard.ts            PNG 3× sólo de la carta
  components/
    card/                    CardPreview, CardFrame, CardHeader, CardArtwork,
                             CardKeywords, CardEffect, CardStats, CardCost,
                             CardFaction, GearSlots
    editor/                  CardEditor, EditorSection, TextField, NumberField,
                             SelectField, SegmentedField, TextAreaField,
                             KeywordParser, ArtworkUploader, DataPanel
    icons/Symbology.tsx      simbología SVG inline
  styles/                    global.css · card.css · editor.css
```

## Notas técnicas

- La carta se renderiza a tamaño intrínseco **420 × 588** y se escala con
  `transform` según el espacio disponible; **EXPORT PNG** captura el nodo sin
  transform, a `pixelRatio: 3` → **1260 × 1764 px** con fondo transparente.
- El texto de efecto se auto-ajusta midiendo el contenido (14 px → 8.5 px), así
  que nunca se recorta por muy largo que sea.
- El artwork se mantiene sólo en memoria mediante `URL.createObjectURL(file)`.
- No se usa `localStorage`: todo el estado vive en React.
- Preparado para el simulador: los nombres de campo del JSON son los definitivos;
  no hay lógica de combate, turnos, mazos ni multijugador.
