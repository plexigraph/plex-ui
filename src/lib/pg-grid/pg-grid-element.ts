import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'
import { SignalWatcher } from '@lit-labs/preact-signals'
// TODO: disallow auto width without start
@customElement('pg-grid-element')
export default class PGGrid extends SignalWatcher(LitElement) {
  @property({ type: String })
  width = 'fill'
  @property({ type: String })
  height = 'fill'
  @property({ type: Number })
  start = NaN
  @property({ type: Boolean })
  skeleton = false
  @property({ type: Number })
  skeletonOffset = 0 // the offset amount, in multiples of 0.05s
  static styles = [
    perElementCss,
    css`
      #elem {
        display: grid;
        align-items: center;
        justify-items: center;
        grid-column: var(--start, auto) / var(--width);
        grid-row: var(--height);
        position: relative;
      }
      .skeleton {
        margin: 16px 4px;
        border-radius: 8px;
        --b-size: min(800px, 100vw);
        background-size: var(--b-size);
        background: var(--pg-bg-accent);
        /*animation: 2s calc(var(--start) * 0.05s) ease-out infinite pulse;*/
        /* animation: 2s ease-out infinite slide; */
        animation: 2s calc(var(--time-offset) * 0.1s) ease-in infinite pulse;
      }
      @keyframes pulse {
        0% {
          background: var(--pg-bg-accent);
        }
        50% {
          background: var(--pg-bg-mid);
          animation-timing-function: linear;
        }
        100% {
          background: var(--pg-bg-accent);
        }
      }
    `,
  ]

  sizeToCSS(width: string) {
    const widthNum = parseInt(width)
    if (!isNaN(widthNum)) return 'span ' + widthNum.toString()
    if (width in ['fill', 'auto']) return '-1'
    throw new Error('Invalid value for size')
  }
  render() {
    const cssVars = new Map()

    cssVars.set('--width', this.sizeToCSS(this.width))
    cssVars.set('--height', this.sizeToCSS(this.height))
    cssVars.set(
      '--start',
      !Number.isNaN(this.start) ? this.start.toString() : 'auto'
    )
    cssVars.set(
      '--offset',
      !Number.isNaN(this.start)
        ? `calc(${(this.start - 1) * 16}px + ${
            this.start > 1 ? `var(--gap) * ${this.start}` : '0px'
          })`
        : '0px'
    )

    cssVars.set(
      '--time-offset',
      !Number.isNaN(this.skeletonOffset) ? this.skeletonOffset.toString() : '0'
    )

    const cssVarsStr = [...cssVars.entries()]
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')

    if (this.skeleton) {
      console.log(cssVars)
      console.log(cssVarsStr)
    }
    return html`<div id="elem" style=${cssVarsStr}>
      ${this.skeleton
        ? html`<pg-skeleton
            id="elem"
            .offset=${this.skeletonOffset}
          ></pg-skeleton>`
        : html` <slot></slot>`}
    </div>`
  }
}
