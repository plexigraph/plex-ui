import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'

@customElement('pg-grid')
export default class PGGrid extends LitElement {
  @property({ type: String })
  columns = '8'
  @property({ type: Number })
  gap = 0
  static styles = [
    perElementCss,
    css`
    :host {
      display: block;
      width: 100%;
    }
      #grid {
        display: grid;
        grid-template-columns: var(--cols);
        grid-auto-rows: 16px;
        grid-gap: var(--gap, 0px);
      }
    `,
  ]
  columnsToCSS(cols: string) {
    const colsNum = parseInt(cols)
    if (!isNaN(colsNum)) return `repeat(${colsNum}, 16px)`
    if (cols == 'auto') return 'repeat(auto-fill, 16px)'
    throw new Error('Invalid value for columns')
  }
  render() {
    const cssVars = new Map()

    cssVars.set('--cols', this.columnsToCSS(this.columns))
    cssVars.set('--gap', this.gap.toString() + 'px')

    const cssVarsStr = [...cssVars.entries()]
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')
    return html`<div id="grid" style=${cssVarsStr}><slot></slot></div>`
  }
}
