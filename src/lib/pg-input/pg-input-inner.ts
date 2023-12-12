import { SignalWatcher } from "@lit-labs/preact-signals"
import { LitElement, PropertyValueMap, css, html } from "lit"
import { customElement, queryAssignedElements } from "lit/decorators.js"

@customElement("pg-input-inner")
export class PGInputInner extends SignalWatcher(LitElement) {
  @queryAssignedElements({
    selector:
      "label:first-child:last-child:has(> span:first-child+input:last-child)",
  })
  label?: Array<HTMLLabelElement>
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }
  `
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(this.label)
  }
  render() {
    console.log(this.label)
    return html`
      <pg-surface>
        <slot />
      </pg-surface>
    `
  }
}
