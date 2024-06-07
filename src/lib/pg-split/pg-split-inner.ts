import { LitElement, PropertyValueMap, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'
import splitCss from './split.css'
import { clamp } from '../Utils'
@customElement('pg-split-inner')
export default class PGSplitInner extends LitElement {
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
    return css`
      --percentX: ${Math.round(percentX * 100)}%;
      --percentY: ${Math.round(percentY * 100)}%;
    `
  }
  broadcastSplitEvent(type: string) {
    const event = new CustomEvent(`pg-split-${type}`, {
      bubbles: true,
      detail: {
        percent: this.vertical ? this.percentY : this.percentX,
      },
    })
    window.dispatchEvent(event)
  }
  pointersDown = 0
  onDown() {
    this.pointersDown++
    if (this.pointersDown == 1) {
      window.addEventListener('pointermove', this.onWindowMove.bind(this))
      this.broadcastSplitEvent('down')
    }
  }
  timeUp = 0
  onClick() {
    if (performance.now() - this.timeUp < this.doubleTapTimeout * 1000) {
      this.percentX = this.startingPercent / 100
      this.percentY = this.startingPercent / 100
      this.timeUp = 0
      return
    }
    if (this.pointersDown == 0) this.timeUp = performance.now()
  }
  setDivisionPercent(e: PointerEvent) {
    const parent: HTMLDivElement = this.shadowRoot!.querySelector('div')!
    const { x, y, width, height } = parent.getBoundingClientRect()
    const pX = e.clientX
    const pY = e.clientY
    const relativeX = pX - x
    const relativeY = pY - y
    this.percentX = clamp(0, relativeX / width, 1)
    this.percentY = clamp(0, relativeY / height, 1)
  }

  onWindowMove(e: PointerEvent) {
    this.timeUp = 0
    if (this.pointersDown > 0) {
      this.setDivisionPercent(e)
    }
  }

  onKeypress(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        this.percentY -= 0.01
        break
      case 'ArrowDown':
        this.percentY += 0.01
        break
      case 'ArrowLeft':
        this.percentX -= 0.01
        break
      case 'ArrowRight':
        this.percentX += 0.01
        break
      default:
        return
    }
    this.percentY = clamp(0, this.percentY, 1)
    this.percentX = clamp(0, this.percentX, 1)
    e.preventDefault()
    e.stopPropagation()
  }
  onWindowUp() {
    if (this.pointersDown == 1) {
      this.broadcastSplitEvent('up')
      window.removeEventListener('pointermove', this.onWindowMove.bind(this))
    }
    if (this.pointersDown > 0) this.pointersDown--
  }
  connectedCallback(): void {
    super.connectedCallback()
    if (typeof window != 'undefined') {
      window.addEventListener('pointerup', this.onWindowUp.bind(this))
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (typeof window != 'undefined') {
      window.removeEventListener('pointerup', this.onWindowUp.bind(this))
      window.removeEventListener('pointermove', this.onWindowMove.bind(this))
    }
  }
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('startingPercent')) {
      this.percentX = this.startingPercent / 100
      this.percentY = this.startingPercent / 100
    }
  }
  render() {
    return html`<div
      class=${this.vertical ? 'vertical' : 'horizontal'}
      style=${this.getStyle(this.percentX, this.percentY)}
      id="split"
    >
      <slot name="first" id="primary-split"></slot>

      <button
        class="draggable"
        @click=${this.onClick}
        @keydown=${this.onKeypress}
        @pointerdown=${this.onDown}
        aria-valuenow="${this.vertical ? this.percentY : this.percentX}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="${this.vertical ? 'vertical' : 'horizontal'} split"
        aria-controls="primary-split"
      >
        drag
      </button>

      <slot name="second"></slot>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-split-inner': PGSplitInner
  }
}
