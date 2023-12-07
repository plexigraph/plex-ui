import { LitElement, PropertyValueMap, css, html, nothing } from "lit"
import { customElement, queryAssignedElements } from "lit/decorators.js"
import "@lib/pg-surface"
import {
  Context2D,
  NO_INTERP,
  createContext2D,
  getLinearInterp,
  getSlerp,
} from "../Contexts"
import { getInteractableSignals } from "@lib/InteractableSignals"
import { surfaceContext2D } from "@lib/surfaceContext"
import {
  type ReadonlySignal,
  computed,
  SignalWatcher,
  signal,
} from "@lit-labs/preact-signals"
import { provide } from "@lit/context"
import "../pg-rounded-rect"
import "../pg-cursor"
import { colorFromHex } from "@lib/Utils"

const rippleInterp = getLinearInterp(1)

@customElement("pg-button")
export class PGButton extends SignalWatcher(LitElement) {
  @queryAssignedElements({ selector: "button" })
  buttons?: Array<HTMLButtonElement>
  context = createContext2D()
  interactableSignals = getInteractableSignals()
  rippleSize = signal(0)
  rippleWidth = signal(0)
  rippleTimeout = undefined as NodeJS.Timeout | undefined
  onClick = () => {
    this.rippleSize.value = 0
    this.rippleWidth.value = 5
    this.rippleTimeout && clearTimeout(this.rippleTimeout)
    this.rippleTimeout = setTimeout(() => {
      this.rippleSize.value = 250
      this.rippleWidth.value = 0
      this.rippleTimeout = undefined
    }, 410)
  }
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
    const marginL = window.getComputedStyle(this.buttons![0]).marginLeft
    const marginR = window.getComputedStyle(this.buttons![0]).marginRight
    console.log(marginL, marginR)
    // parse for number
    const marginLNum = parseInt(marginL.substring(0, marginL.length - 2))
    const marginRNum = parseInt(marginR.substring(0, marginR.length - 2))
    this.context.ctx.setPos(marginLNum, marginRNum)
    this.interactableSignals.initialize(this.buttons![0], this.context.ctx)
    this.buttons![0].addEventListener("click", this.onClick)
  }
  cursorSize = computed(() => {
    return this.interactableSignals.active.value ? 30 : 0
  })
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.interactableSignals.unsubscribe()
    this.buttons![0].removeEventListener("click", this.onClick)
  }
  connectedCallback(): void {
    super.connectedCallback()
    console.log("connected", this.buttons)
    if (!this.buttons || this.buttons.length === 0) {
      throw new Error("No buttons found")
    }
    this.interactableSignals.initialize(this.buttons![0], this.context.ctx)
    this.buttons![0].addEventListener("click", this.onClick)
  }
  render() {
    const { pointerX, pointerY, colors, clickedX, clickedY } =
      this.interactableSignals

    console.log(this.rippleSize.value)

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

      ${clickedX.value && clickedY.value
        ? html`<pg-cursor
        width=${this.rippleSize.value}
        height=${this.rippleSize.value}
        radius=${this.rippleSize.value / 2}
        .borderColor=${colorFromHex(colors.value.foregroundAccent)}
        .borderWidth=${this.rippleWidth.value}
        .backgroundColor=${colorFromHex("#00000000")}
        x=${clickedX.value - this.rippleSize.value / 2}
        y=${clickedY.value - this.rippleSize.value / 2}
        .sizeInterp=${this.rippleSize.value == 0 ? NO_INTERP : rippleInterp}
      ></pg-cursor>
    </pg-surface>`
        : nothing}</pg-surface
    >`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pg-button": PGButton
  }
}
