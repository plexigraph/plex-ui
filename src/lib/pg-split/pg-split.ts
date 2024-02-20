import { LitElement, PropertyValueMap, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'
import splitCss from './split.css'
import { clamp } from '../Utils'

@customElement('pg-split')
export default class PGSplit extends LitElement {
  @property({ type: Boolean })
  vertical = false
  @property({ type: Number })
  doubleTapTimeout = 0.5
  @property({ type: Number })
  startingPercent = 50
  @state()
  percentX = this.startingPercent / 100
  @state()
  percentY = this.startingPercent / 100

  static styles = [
    perElementCss,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
    splitCss,
  ]
  getStyle(percentX: number, percentY: number) {
    console.log('HERE')
    return css`
      --percentX: ${Math.round(percentX * 100)}%;
      --percentY: ${Math.round(percentY * 100)}%;
    `
  }
  pointersDown = 0
  onDown() {
    console.log('down')
    this.pointersDown++
  }
  timeUp = 0
  onClick() {
    if (performance.now() - this.timeUp < this.doubleTapTimeout * 1000) {
      this.percentX = this.startingPercent / 100
      this.percentY = this.startingPercent / 100
      this.timeUp = 0
      console.log('RESETTING POINTER')
      return
    }
    if (this.pointersDown == 0) this.timeUp = performance.now()
  }
  onUp(e: PointerEvent) {
    console.log('up')
    if (this.pointersDown > 0) {
      this.setDivisionPercent(e)
      this.pointersDown--
    }
  }
  onLeave(e: PointerEvent) {
    console.log('up')
    if (this.pointersDown > 0) {
      this.setDivisionPercent(e)
    }
  }
  setDivisionPercent(e: PointerEvent) {
    console.log(e.currentTarget)
    const parent: HTMLDivElement = e.currentTarget as HTMLDivElement
    const { x, y, width, height } = parent.getBoundingClientRect()
    console.log({ x, y, width, height })
    const pX = e.clientX
    const pY = e.clientY
    const relativeX = pX - x
    const relativeY = pY - y
    this.percentX = clamp(0, relativeX / width, 1)
    this.percentY = clamp(0, relativeY / height, 1)
    console.log('setting division percent')
  }
  onMove(e: PointerEvent) {
    this.timeUp = 0
    console.log(this.pointersDown)
    if (this.pointersDown > 0) {
      this.setDivisionPercent(e)
    }
  }
  onWindowUp() {
    console.log(this)
    console.log(this.pointersDown)
    if (this.pointersDown > 0) this.pointersDown--
  }
  connectedCallback(): void {
    super.connectedCallback()
    if (typeof window != 'undefined')
      window.addEventListener('pointerup', this.onWindowUp.bind(this))
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (typeof window != 'undefined')
      window.removeEventListener('pointerup', this.onWindowUp.bind(this))
  }
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('startingPercent')) {
      this.percentX = this.startingPercent / 100
      this.percentY = this.startingPercent / 100
      console.log(this.percentX, this.percentY)
    }
  }
  render() {
    console.log(this.percentX, this.percentY)
    return html`<div
      @pointerup=${this.onUp}
      @pointerleave=${this.onLeave}
      @pointermove=${this.onMove}
      style=${this.getStyle(this.percentX, this.percentY)}
      id="split"
      class=${this.vertical ? 'vertical' : 'horizontal'}
    >
      <slot name="first"></slot>

      <button
        class="draggable"
        @click=${this.onClick}
        @pointerdown=${this.onDown}
      >
        drag
      </button>

      <slot name="second"></slot>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-split': PGSplit
  }
}
