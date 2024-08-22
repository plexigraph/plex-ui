import { LitElement, PropertyValueMap, PropertyValues, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'
import splitCss from './split.css'
import { clamp } from '../Utils'
import {
  createAnimation,
  getSlerp,
  modifyTo,
  addRecursiveListener,
  updateAnimation,
  getStateTree,
  changeInterpFunction,
  NO_INTERP,
  createMode,
  createExtensionStack,
  addLayerToStack,
  addExtensionToStack,
  END,
  animationNeedsUpdate,
  unsubscribe,
  Extension,
  addLocalListener,
  getLocalInterpingTo,
  getLocalState,
  Animation,
  getLinearInterp,
} from 'aninest'
import { getSnapPointLayer, snapGridExtension } from '@aninest/extensions'
import { localMomentumLayer } from '../momentumLayer'
const INTERP = getSlerp(0.05)

type SplitState = {
  percentX: number
  percentY: number
}
function getBoundPreemptivelyExtension(
  anim: Animation<SplitState>,
  momentumLayer: ReturnType<typeof localMomentumLayer>
) {
  const boundPreemptivelyExtension: Extension<SplitState> = (anim) => {
    const unsub = addLocalListener(anim, 'start', () => {
      const ending = getLocalInterpingTo(anim)
      const starting = getLocalState(anim)
      const vel = momentumLayer.getVelocity()
      const clampAxis = (axis: 'percentX' | 'percentY') => {
        if (ending[axis] > 1 || ending[axis] < 0) {
          const clamped = clamp(0, ending[axis], 1)
          const diff = Math.abs(starting[axis] - clamped)
          const time = diff / vel
          modifyTo(anim, { [axis]: clamped })

          changeInterpFunction(anim, getLinearInterp(Math.max(0.05, time)))
        }
      }
      clampAxis('percentX')
      clampAxis('percentY')
    })
    return unsub
  }
  return boundPreemptivelyExtension(anim)
}

@customElement('pg-split-inner')
export default class PGSplitInner extends LitElement {
  // vertical split: window1, horiz split: window1 | window2
  //                 window2
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

  shouldSnap = (snapTo: SplitState, state: SplitState) => {
    return this.vertical
      ? Math.abs(snapTo.percentY - state.percentY) < 0.05
      : Math.abs(snapTo.percentX - state.percentX) < 0.05
  }

  animation = createAnimation(
    {
      percentX: this.startingPercent / 100,
      percentY: this.startingPercent / 100,
    },
    INTERP
  )
  afterUpStack = createExtensionStack<SplitState>()
  _ = addExtensionToStack(
    this.afterUpStack,
    snapGridExtension<SplitState>({ percentX: 0.01, percentY: 0.01 })
  )
  afterUpMode = createMode(this.animation, this.afterUpStack)
  snapLayer = addLayerToStack(
    this.afterUpStack,
    getSnapPointLayer(
      {
        percentX: this.startingPercent / 100,
        percentY: this.startingPercent / 100,
      },
      this.shouldSnap
    )
  )
  momentumStack = createExtensionStack<SplitState>()
  momentumLayer = addLayerToStack(
    this.momentumStack,
    localMomentumLayer(0.08, 100)
  )
  momentumMode = createMode(this.animation, this.momentumStack)
  _removeMomentum = this.momentumLayer.mount(this.animation)
  // _removeBounds = setupBoundsLayer(this.animation, {
  //   lower: { percentX: 0, percentY: 0 },
  //   upper: { percentX: 1, percentY: 1 },
  // }).mount(this.animation)
  _removeBounds = getBoundPreemptivelyExtension(
    this.animation,
    this.momentumLayer
  )
  prevTime: number | undefined = undefined
  startUnsub = addRecursiveListener(this.animation, 'start', () => {
    if (this.prevTime !== undefined) return
    const update = (time: number) => {
      if (this.prevTime === undefined) this.prevTime = time
      const dt = time - this.prevTime
      this.prevTime = time
      const needsUpdate = updateAnimation(this.animation, dt / 1000)
      this.requestUpdate()
      if (needsUpdate) requestAnimationFrame(update)
      else this.prevTime = undefined
    }
    requestAnimationFrame(update)
  })

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
  slideEndUnsub: unsubscribe | undefined = undefined
  ro: ResizeObserver = new ResizeObserver((_entries) => {
    this.updatePixelsPerUnit()
  })
  bindedWindowUp: () => void = () => {}
  bindedWindowMove: (e: PointerEvent) => void = () => {}

  getStyle(percentX: number, percentY: number) {
    return css`
      --percentX: ${Math.round(Math.max(0, percentX) * 10000) / 100}%;
      --percentY: ${Math.round(Math.max(0, percentY) * 10000) / 100}%;
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
    if (this.slideEndUnsub) {
      this.slideEndUnsub()
      this.slideEndUnsub = undefined
    }
    this.afterUpMode.off()
    this.pointersDown = 1
    if (this.pointersDown == 1) {
      this.bindedWindowMove = this.onWindowMove.bind(this)
      window.addEventListener('pointermove', this.bindedWindowMove)
      this.broadcastSplitEvent('down')
    }
  }
  timeUp = 0
  onClick() {
    if (performance.now() - this.timeUp < this.doubleTapTimeout * 1000) {
      this.momentumMode.off()
      console.log('MOMENTUM MODE OFF')
      this.percentX = this.startingPercent / 100
      this.percentY = this.startingPercent / 100
      this.timeUp = 0
      setTimeout(() => {
        addLocalListener(this.animation, END, () => {
          this.momentumMode.on()
          console.log('MOMENTUM MODE ON')
          return true
        })
      }, 0)
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
    this.afterUpMode.off()
    this.percentY = clamp(0, this.percentY, 1)
    this.percentX = clamp(0, this.percentX, 1)
    e.preventDefault()
    e.stopPropagation()
  }
  onKeyup() {
    this.afterUpMode.on()
  }
  onWindowUp() {
    if (this.pointersDown == 1) {
      if (this.slideEndUnsub) {
        this.slideEndUnsub()
        this.slideEndUnsub = undefined
      }
      if (this.momentumLayer.startGlide()) {
        console.log(
          'SLIDE',
          animationNeedsUpdate(this.animation),
          this.animation._to,
          this.animation._time
        )
        console.log('SLIDE', this.animation.recursiveEndListeners.size)
        this.slideEndUnsub = addRecursiveListener(this.animation, END, () => {
          console.log('ENDDDD')
          this.slideEndUnsub!()
          setTimeout(() => {
            console.log('MODE ON')
            console.log(this.animation.beforeEndListeners.keys())
            this.afterUpMode.on()
            console.log(this.animation.beforeEndListeners.keys())
          }, 0)
        })
      }
      this.broadcastSplitEvent('up')
      window.removeEventListener('pointermove', this.onWindowMove.bind(this))
    }
    if (this.pointersDown > 0) this.pointersDown--
  }
  updatePixelsPerUnit() {
    const parent = this
    const { width, height } = parent.getBoundingClientRect()
    // modify pixelsPerUnit to be the size of the parent
    const activeSize = this.vertical ? height : width
    this.momentumLayer.changePixelsPerUnit(activeSize)
  }
  connectedCallback(): void {
    super.connectedCallback()
    if (typeof window != 'undefined') {
      this.bindedWindowUp = this.onWindowUp.bind(this)
      window.addEventListener('pointerup', this.bindedWindowUp)
    }
    this.ro.observe(this)
  }
  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.updatePixelsPerUnit()
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (typeof window != 'undefined') {
      window.removeEventListener('pointerup', this.bindedWindowUp)
      window.removeEventListener('pointermove', this.bindedWindowMove)
      this.ro.disconnect()
    }
  }
  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('startingPercent')) {
      this.percentX = this.startingPercent / 100
      this.percentY = this.startingPercent / 100
      changeInterpFunction(this.animation, NO_INTERP)
      this.snapLayer.changeSnapPoint({
        percentX: this.startingPercent / 100,
        percentY: this.startingPercent / 100,
      })
      setTimeout(() => {
        changeInterpFunction(this.animation, INTERP)
      }, 50)
    }
    if (changedProperties.has('percentX')) {
      modifyTo(this.animation, { percentX: this.percentX })
    }
    if (changedProperties.has('percentY')) {
      modifyTo(this.animation, { percentY: this.percentY })
    }
    if (changedProperties.has('vertical')) {
      this.updatePixelsPerUnit()
    }
  }
  render() {
    const { percentX, percentY } = getStateTree(this.animation)
    return html`<div
      class=${this.vertical ? 'vertical' : 'horizontal'}
      style=${this.getStyle(percentX, percentY)}
      id="split"
    >
      <slot name="first" id="primary-split"></slot>

      <button
        class="draggable"
        @click=${this.onClick}
        @keydown=${this.onKeypress}
        @keyup=${this.onKeyup}
        @pointerdown=${this.onDown}
        aria-valuenow="${this.vertical ? percentY : percentX}"
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
