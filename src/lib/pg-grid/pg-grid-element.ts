import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'

@customElement('pg-grid-element')
export default class PGGrid extends LitElement {
  @property({ type: String })
  width = 'fill'
  @property({ type: String })
  height = 'fill'
  @property({ type: Number })
  start = NaN
  static styles = [
    perElementCss,
    css`
      #elem {
        display: grid;
        align-items: center;
        justify-items: center;
        grid-column: var(--start, auto) / var(--width);
        grid-row: var(--height);
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

    const cssVarsStr = [...cssVars.entries()]
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')
    return html`<div id="elem" style=${cssVarsStr}><slot></slot></div>`
  }
}
