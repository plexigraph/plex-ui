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
const dotInterp = getSlerp(0.15)

@customElement("pg-button-inner")
export class PGButtonInner extends SignalWatcher(LitElement) {
  @queryAssignedElements({
    selector: "button:first-child:last-child, a:first-child:last-child",
  })
  buttons?: Array<HTMLButtonElement>
  context = createContext2D()
  interactableSignals = getInteractableSignals()
  rippleSize = signal(0)
  rippleWidth = signal(0)
  button = document.createElement("button")
  rippleTimeout = undefined as NodeJS.Timeout | undefined
  onClick = () => {
    // check prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    this.rippleSize.value = 0
    this.rippleWidth.value = 5
    this.rippleTimeout && clearTimeout(this.rippleTimeout)
    this.rippleTimeout = setTimeout(() => {
      this.rippleSize.value = 250
      this.rippleWidth.value = 0
      this.rippleTimeout = undefined
    }, 300)
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
    if (this.buttons!.length == 1) {
      this.button = this.buttons![0]
    }
    const marginL = window.getComputedStyle(this.button).marginLeft
    const marginT = window.getComputedStyle(this.button).marginTop
    // parse for number
    const marginLNum = parseInt(marginL.substring(0, marginL.length - 2))
    const marginTNum = parseInt(marginT.substring(0, marginT.length - 2))
    this.context.ctx.setPos(marginLNum, marginTNum)
    this.interactableSignals.initialize(this.button, this.context.ctx)
    this.button.addEventListener("click", this.onClick)
  }
  cursorSize = computed(() => {
    return this.interactableSignals.active.value ? 24 : 0
  })
  cursorColor = computed(() => {
    return colorFromHex(this.interactableSignals.colors.value.cursor)
  })
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.interactableSignals.unsubscribe()
    this.button.removeEventListener("click", this.onClick)
  }
  connectedCallback(): void {
    super.connectedCallback()
    if (!this.button) {
      return
    }
    this.interactableSignals.initialize(this.button, this.context.ctx)
  }
  render() {
    const { pointerX, pointerY, clickedX, clickedY } = this.interactableSignals

    this.button.classList.toggle(
      "active",
      this.interactableSignals.active.value
    )

    return html`<pg-surface .context=${this.context}>
      <slot />
      <pg-cursor
        width=${this.cursorSize.value}
        height=${this.cursorSize.value}
        radius=${this.cursorSize.value / 2}
        .backgroundColor=${this.cursorColor.value}
        .sizeInterp=${dotInterp}
        .colorInterp=${NO_INTERP}
        x=${pointerX.value - this.cursorSize.value / 2}
        y=${pointerY.value - this.cursorSize.value / 2}
      ></pg-cursor>
      ${clickedX.value && clickedY.value
        ? html`<pg-cursor
        width=${this.rippleSize.value}
        height=${this.rippleSize.value}
        radius=${this.rippleSize.value / 2}
        .borderColor=${this.cursorColor.value}
        .borderWidth=${this.rippleWidth.value}
        .backgroundColor=${colorFromHex("transparent")}
        x=${clickedX.value - this.rippleSize.value / 2}
        y=${clickedY.value - this.rippleSize.value / 2}
        .sizeInterp=${this.rippleSize.value == 0 ? NO_INTERP : rippleInterp}
        .colorInterp=${NO_INTERP}
      ></pg-cursor>
    </pg-surface>`
        : nothing}</pg-surface
    >`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pg-button-inner": PGButtonInner
  }
}
