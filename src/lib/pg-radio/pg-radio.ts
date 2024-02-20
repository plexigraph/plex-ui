import { LitElement, PropertyValueMap, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import radioCss from './radio.css.ts'
import resetCss from '../../styles/reset.css.ts'
import perElementCss from '../../styles/per-element.css.ts'
import { SignalWatcher } from '@lit-labs/preact-signals'
import {
  type RadioGroup,
  addRadio,
  createRadioGroups,
  removeRadio,
  radioSelected,
} from './RadioGroups.ts'

const radioGroups = createRadioGroups()

@customElement('pg-radio')
export default class PGRadio extends SignalWatcher(LitElement) {
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
  @property({ type: String })
  name = 'radio'
  @query('input')
  input: HTMLInputElement | undefined
  @state()
  group: RadioGroup = addRadio(radioGroups, this)
  selectedSignalUnsub = () => {}

  static get styles() {
    return [radioCss, resetCss, perElementCss]
  }
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('validity') && this.input) {
      this.input.setCustomValidity(this.validity)
      this.input.checkValidity()
    }
    if (changedProperties.has('checked')) {
      if (this.checked) {
        radioSelected(this.group, this)
      }
    }
  }

  protected updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('name')) {
      this.group = addRadio(radioGroups, this)
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    removeRadio(radioGroups, this)
  }

  onChecked() {
    this.checked = true
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.group = addRadio(radioGroups, this)
    if (this.checked) {
      radioSelected(this.group, this)
    }
  }

  render() {
    this.checked = this.group.selected.value === this
    return html`<pg-radio-inner
      class=${this.validity != '' ? 'error' : ''}
      style=${`--validity: '${this.validity}'`}
    >
      <label>
        <input
          value=${this.value}
          @change=${() => {
            this.checked = true
          }}
          name=${this.name}
          .checked=${ifDefined(this.checked ? 'checked' : undefined)}
          type="radio"
          disabled=${ifDefined(this.disabled ? 'disabled' : undefined)}
        />
        <slot></slot>
      </label>
    </pg-radio-inner>`
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'pg-radio': PGRadio
  }
}
