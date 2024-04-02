import { LitElement, PropertyValueMap, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import checkCss from './check.css.ts'
import resetCss from '../../styles/reset.css.ts'
import perElementCss from '../../styles/per-element.css.ts'

@customElement('pg-check')
export default class PGCheck extends LitElement {
  @property({ type: Boolean })
  disabled = false
  @property({ type: String })
  href = '' // only set if you want to use an anchor tag
  @property({ type: String })
  download = '' // only set if you want to use an anchor tag
  @property({ type: String })
  target = '' // only set if you want to use an anchor tag
  @property({ type: String })
  validity = ''
  @property({ type: String })
  value = 'on'
  @property({ type: Boolean })
  checked = false
  @query('input')
  input: HTMLInputElement | undefined

  static get styles() {
    return [checkCss, resetCss, perElementCss]
  }
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('validity') && this.input) {
      this.input.setCustomValidity(this.validity)
      this.input.checkValidity()
    }
  }
  render() {
    return html`<pg-check-inner
      class=${this.validity != '' ? 'error' : ''}
      style=${`--validity: '${this.validity}'`}
    >
      <label>
        <input
          value=${this.value}
          @change=${() => {
            this.checked = this.input!.checked
          }}
          checked=${ifDefined(this.checked ? '' : undefined)}
          type="checkbox"
          disabled=${ifDefined(this.disabled ? 'disabled' : undefined)}
        />
        <slot></slot>
      </label>
    </pg-check-inner> `
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'pg-check': PGCheck
  }
}
