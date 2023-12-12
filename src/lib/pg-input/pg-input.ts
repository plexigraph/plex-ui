import inputStyles from "./text-input.css.ts"
import base from "../../styles/base.css.ts"
import resetCss from "../../styles/reset.css.ts"
import { customElement, property, query } from "lit/decorators.js"
import { LitElement, PropertyValueMap, css, html } from "lit"
import { ifDefined } from "lit/directives/if-defined.js"
import "./pg-input-inner.ts"

@customElement("pg-input")
export default class PgInput extends LitElement {
  static styles = [
    base,
    inputStyles,
    resetCss,
    css`
      :host {
        display: inline-block;
        width: 100%;
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
      <label class=${ifDefined(this.validity != "" ? "error" : "")}>
        <span> ${text} </span>
        <input
          disabled=${ifDefined(this.disabled ? "disabled" : undefined)}
          class="pg-interactable"
          placeholder=${this.placeholder}
          type="text"
        />
      </label>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pg-input": PgInput
  }
}
