import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { NO_CONTEXT, type ContextWrapper } from '../lib/Contexts'

@customElement('pg-surface')
export default class PGSurface extends LitElement {
  static get styles() {
    return [
      css`
        .surface {
          display: inline-block;
          position: relative;
        }
        .surface.full {
          width: 100%;
        }
        :host {
          display: contents;
        }
        canvas.behind {
          pointer-events: none;
          z-index: -1;
        }
        canvas.above {
          pointer-events: none;
          z-index: 100;
        }
      `,
    ]
  }

  constructor() {
    super()
  }

  @property({ type: Object })
  context: ContextWrapper<unknown> = NO_CONTEXT

  @property({ type: Boolean })
  full = false

  @state()
  lastTime: number | null = null

  @query('div')
  elem!: HTMLDivElement | null

  updateLoop = (time: number) => {
    let dt = 0
    if (this.lastTime != null) {
      dt = time - this.lastTime
    }

    this.lastTime = time

    const renderNextFrame = this.context.update(dt / 1000)
    this.context.draw(this.context.ctx)
    if (renderNextFrame) {
      requestAnimationFrame(this.updateLoop)
      return
    }
    this.lastTime = null
  }

  restartUpdateLoop() {
    if (this.lastTime == null) {
      this.lastTime = performance.now()
      requestAnimationFrame(this.updateLoop)
    }
  }

  setupContext() {
    if (this.elem && this.context) {
      this.context.addRestartListener(this.restartUpdateLoop.bind(this))
      this.restartUpdateLoop()
      this.context.init(this.elem)
    }
  }
  handleSlotChange() {
    this.setupContext()
  }

  render() {
    const classes = ['surface']
    if (this.full) {
      classes.push('full')
    }
    const classString = classes.join(' ')
    return html`<div class=${classString}>
      <slot @slotchange=${this.handleSlotChange} />
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-surface': PGSurface
  }
}
