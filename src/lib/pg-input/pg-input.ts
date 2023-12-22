import inputStyles from "./text-input.css.ts"
import errorCss from "../../styles/colors/status/error.css.ts"
import { customElement, property, query } from "lit/decorators.js"
import { LitElement, PropertyValueMap, css, html } from "lit"
import { ifDefined } from "lit/directives/if-defined.js"

@customElement("pg-input")
export default class PgInput extends LitElement {
  static styles = [
    inputStyles,
    errorCss,
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
  placeholder = ""
  @property({ type: String })
  value = ""
  @property({ type: String })
  validity = ""
  @query("input")
  input: HTMLInputElement | undefined
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has("validity") && this.input) {
      this.input.setCustomValidity(this.validity)
    }
  }
  render() {
    const text = this.validity != "" ? this.validity : this.placeholder
    return html`
      <pg-input-inner>
        <label class=${ifDefined(this.validity != "" ? "error" : "")}>
          <span> ${text} </span>
          <input
            disabled=${ifDefined(this.disabled ? "disabled" : undefined)}
            class="pg-interactable"
            placeholder=${this.placeholder}
            type="text"
          />
        </label>
      </pg-input-inner>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pg-input": PgInput
  }
}
