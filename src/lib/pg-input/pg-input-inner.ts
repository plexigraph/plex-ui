import { createContext2D } from "../../lib/Contexts"
import { getInteractableSignals } from "../../lib/InteractableSignals"
import { SignalWatcher, watch } from "@lit-labs/preact-signals"
import { LitElement, PropertyValueMap, css, html } from "lit"
import { customElement, queryAssignedElements } from "lit/decorators.js"

@customElement("pg-input-inner")
export class PGInputInner extends SignalWatcher(LitElement) {
  @queryAssignedElements({
    selector:
      "label:first-child:last-child:has(> span:first-child+input:last-child)",
  })
  labels?: Array<HTMLLabelElement>
  label!: HTMLLabelElement
  input!: HTMLInputElement
  static styles = css`
    :host {
      display: contents;
    }
  `
  context = createContext2D()
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.label = this.labels![0]
    this.input = this.label.querySelector("input")!
    console.log(this.input)
    this.interactableSignals.initialize(
      this.input,
      this.context.ctx,
      this.label
    )
    console.log("firstUpdated")
    // force update
    this.requestUpdate()
  }
  interactableSignals = getInteractableSignals()
  render() {
    if (!this.label) {
      return html` <slot /> `
    }
    const { focused } = this.interactableSignals
    this.label.classList.toggle("focus", focused.value)
    return html`
      <pg-surface full="full" .context=${this.context}>
        <slot />
      </pg-surface>
    `
  }
}
