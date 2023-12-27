import inputStyles from './text-input.css.ts'
import perElementCss from '../../styles/per-element.css.ts'
import { customElement, property, query } from 'lit/decorators.js'
import { LitElement, PropertyValueMap, css, html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import type { PGInputInner } from './pg-input-inner.ts'
import { SignalWatcher } from '@lit-labs/preact-signals'

@customElement('pg-input')
export default class PgInput extends SignalWatcher(LitElement) {
  static styles = [
    inputStyles,
    perElementCss,
    css`
      :host {
        display: contents;
      }
      input {
        font: inherit;
      }
    `,
  ]
  @property({ type: Boolean })
  disabled = false
  @property({ type: String })
  placeholder = ''
  @property({ type: String })
  value = ''
  @property({ type: String })
  validity = ''
  @property({ type: String })
  type = 'text'
  @property({ type: Boolean })
  loading = false

  @query('input')
  input: HTMLInputElement | undefined
  @query('pg-input-inner')
  inner: PGInputInner | undefined
  @query('label')
  label: HTMLLabelElement | undefined
  initiallyErrored = this.validity != ''
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('validity') && this.input) {
      this.input.setCustomValidity(this.validity)
      this.input.checkValidity()
    }
  }
  render() {
    const disabled =
      this.inner?.interactableSignals.disabled.value ?? this.disabled
    const text =
      this.validity != '' && !disabled ? this.validity : this.placeholder
    const focused = this.inner?.interactableSignals.focused.value
    const placeholder =
      this.validity == '' || focused
        ? this.placeholder
        : this.placeholder + ' ' + this.validity
    return html`
      <pg-input-inner class=${this.validity != '' ? 'error' : ''}>
        <label aria-hidden=${focused || this.value != '' ? 'false' : 'true'}>
          <span aria-live="assertive" class="loading"> ${text} </span>
          <input
            value=${this.value}
            disabled=${ifDefined(this.disabled ? 'disabled' : undefined)}
            placeholder=${placeholder}
            type=${this.type}
          />
        </label>
      </pg-input-inner>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-input': PgInput
  }
}
