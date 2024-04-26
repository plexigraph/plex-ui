import { LitElement, css, html, nothing } from 'lit'
import { customElement, queryAssignedElements } from 'lit/decorators.js'
import '../../lib/pg-surface'
import '../../lib/pg-cursor'
import '../../lib/pg-ripple/pg-ripple'
import { Context2D, createContext2D } from '../Contexts'
import { NO_INTERP, getLinearInterp, getSlerp } from 'aninest'
import { getInteractableSignals } from '../../lib/InteractableSignals'
import { surfaceContext2D } from '../../lib/surfaceContext'
import {
  type ReadonlySignal,
  computed,
  SignalWatcher,
  signal,
  Signal,
} from '@lit-labs/preact-signals'
import { provide } from '@lit/context'
import '../pg-rounded-rect'
import '../pg-cursor'
import { colorFromHex, sleep } from '../../lib/Utils'
import { ifDefined } from 'lit/directives/if-defined.js'

const rippleInterp = getLinearInterp(1)
const dotInterp = getSlerp(0.15)
const colorInterp = getSlerp(0.2)

@customElement('pg-button-inner')
export class PGButtonInner extends SignalWatcher(LitElement) {
  @queryAssignedElements({
    selector: 'button:first-child:last-child, a:first-child:last-child',
  })
  buttons?: Array<HTMLButtonElement>
  context = createContext2D()
  interactableSignals = getInteractableSignals()
  rippleSize: Signal<number> = signal(0)
  rippleWidth: Signal<number> = signal(0)
  button = document.createElement('button')
  rippleTimeout = undefined as NodeJS.Timeout | undefined
  onClick = () => {
    // check prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    this.rippleSize.value = 0
    this.rippleWidth.value = 5
    this.rippleTimeout && clearTimeout(this.rippleTimeout)
    this.rippleTimeout = setTimeout(() => {
      this.rippleSize.value = 250
      this.rippleWidth.value = 0
      this.rippleTimeout = undefined
    }, 200)
  }
  static styles = css`
    :host {
      display: contents;
      position: relative;
    }
  `
  @provide({ context: surfaceContext2D })
  ctx: ReadonlySignal<Context2D> = computed(() => this.context.ctx)
  async handleSlotChange() {
    await sleep(0)
    if (this.buttons!.length == 1) {
      this.button = this.buttons![0]
    }
    const style = window.getComputedStyle(this.button)
    const marginL = style.getPropertyValue('margin-left')
    const marginT = style.getPropertyValue('margin-top')
    // parse for number
    const marginLNum = parseInt(marginL.substring(0, marginL.length - 2)) ?? 16
    const marginTNum = parseInt(marginT.substring(0, marginT.length - 2)) ?? 16
    this.context.ctx.setPos(marginLNum, marginTNum)
    this.interactableSignals.initialize(this.button, this.context.ctx)
    this.button.addEventListener('click', this.onClick)
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
    this.button.removeEventListener('click', this.onClick)
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
    const full = this.button.classList.contains('full')

    this.button.classList.toggle(
      'active',
      this.interactableSignals.active.value
    )

    return html`<pg-surface
      .context=${this.context}
      full=${ifDefined(full ? 'full' : undefined)}
    >
      <slot @slotchange=${this.handleSlotChange} />
      <pg-cursor
        width=${this.cursorSize.value}
        height=${this.cursorSize.value}
        radius=${this.cursorSize.value / 2}
        .backgroundColor=${this.cursorColor.value}
        .sizeInterp=${dotInterp}
        .colorInterp=${colorInterp}
        x=${pointerX.value - this.cursorSize.value / 2}
        y=${pointerY.value - this.cursorSize.value / 2}
      ></pg-cursor>
      ${clickedX.value && clickedY.value
        ? html`<pg-ripple
            .size=${this.rippleSize.value}
            .width=${this.rippleWidth.value}
            .color=${this.cursorColor.value}
            .sizeInterp=${rippleInterp}
            .colorInterp=${colorInterp}
            .x=${clickedX.value}
            .y=${clickedY.value}
          ></pg-ripple> `
        : nothing}</pg-surface
    >`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-button-inner': PGButtonInner
  }
}
