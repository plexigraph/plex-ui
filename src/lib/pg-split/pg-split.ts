import { LitElement, PropertyValueMap, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import splitCss from './split.css.ts'
import perElementCss from '../../styles/per-element.css.ts'
@customElement('pg-split')
export default class PGSplit extends LitElement {
  @property({ type: Boolean })
  vertical = false
  @property({ type: Number })
  doubleTapTimeout = 0.5
  @property({ type: Number })
  startingPercent = 50
  @state()
  ssr = true

  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
    splitCss,
    perElementCss,
  ]
  getStyle(percentX: number, percentY: number) {
    return css`
      --percentX: ${Math.round(percentX)}%;
      --percentY: ${Math.round(percentY)}%;
    `
  }
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.ssr = false
  }
  render() {
    let c = this.vertical ? 'vertical' : 'horizontal'
    if (this.ssr) {
      c += ' ssr'
    }

    return html` <pg-split-inner
      .vertical=${this.vertical}
      .startingPercent=${this.startingPercent}
      .doubleTapTimeout=${this.doubleTapTimeout}
      class=${c}
      style=${this.getStyle(this.startingPercent, this.startingPercent)}
      id="split"
    >
      <slot slot="first" name="first" id="primary-split"></slot>

      <button
        role="separator"
        aria-valuenow="${this.startingPercent}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="${this.vertical ? 'vertical' : 'horizontal'} split"
        aria-controls="primary-split"
        class="draggable"
      >
        drag
      </button>

      <slot slot="second" name="second"></slot>
    </pg-split-inner>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-split': PGSplit
  }
}
