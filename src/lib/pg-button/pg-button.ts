import { LitElement, PropertyValueMap, css, html } from "lit"
import { customElement, queryAssignedElements } from "lit/decorators.js"
import "@lib/pg-surface"
import { Context2D, createContext2D } from "../Contexts"
import { getInteractableSignals } from "@lib/InteractableSignals"
import { surfaceContext2D } from "@lib/surfaceContext"
import {
  type ReadonlySignal,
  computed,
  SignalWatcher,
} from "@lit-labs/preact-signals"
import { provide } from "@lit/context"
import "../pg-rounded-rect"
import "../pg-cursor"
import { colorFromHex } from "@lib/Utils"

@customElement("pg-button")
export class PGButton extends SignalWatcher(LitElement) {
  @queryAssignedElements({ selector: "button" })
  buttons?: Array<HTMLButtonElement>
  context = createContext2D()
  interactableSignals = getInteractableSignals()
  static styles = css`
    :host {
      display: contents;
      position: relative;
    }
  `
  @provide({ context: surfaceContext2D })
  ctx: ReadonlySignal<Context2D> = computed(() => this.context.ctx)
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.context.ctx.setPos(4, 4)
    this.interactableSignals.initialize(this.buttons![0], this.context.ctx)
  }
  cursorSize = computed(() => {
    return this.interactableSignals.active.value ? 34 : 0
  })
  render() {
    const { pointerX, pointerY, colors } = this.interactableSignals
    return html`<pg-surface .context=${this.context}>
      <slot />
      <pg-cursor
        width=${this.cursorSize.value}
        height=${this.cursorSize.value}
        radius=${this.cursorSize.value / 2}
        .backgroundColor=${colorFromHex(colors.value.foregroundAccent)}
        x=${pointerX.value - this.cursorSize.value / 2}
        y=${pointerY.value - this.cursorSize.value / 2}
      ></pg-cursor>
    </pg-surface>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pg-button": PGButton
  }
}
