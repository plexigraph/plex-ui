// no need for an inner since it should only be used within inner components anyway
import { Context2D, createContext2D } from '@lib/Contexts'
import { colorFromHex } from '../../lib/Utils'
import { surfaceContext2D } from '@lib/surfaceContext'
import { computed, type ReadonlySignal } from '@lit-labs/preact-signals'
import { provide } from '@lit/context'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { NO_INTERP, getSlerp } from 'aninest'
import '../../lib/pg-cursor'

@customElement('pg-ripple')
export class PgRipple extends LitElement {
  @property({ type: Number })
  size = 0 // max size of the ripple
  @property({ type: Number })
  width = 0 // width of the ripple
  @property({ type: Object })
  color = colorFromHex('#888') // color of the ripple
  @property({ type: Number })
  backgroundColor = colorFromHex('transparent')
  @property({ type: Function })
  sizeInterp = getSlerp(0.2)
  @property({ type: Function })
  colorInterp = getSlerp(0.2)

  @property({ type: Number })
  x = 0 // x position of the ripple relative to the closest relative parent
  @property({ type: Number })
  y = 0 // y position of the ripple relative to the closest relative parent
  @property({ type: Boolean })
  active = false // whether the ripple is active. To activate the ripple, set this to true
  connectedCallback(): void {
    super.connectedCallback()
  }
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ]

  render() {
    return html` <pg-cursor
      .width=${this.size}
      .height=${this.size}
      .radius=${this.size / 2}
      .borderColor=${this.color}
      .borderWidth=${this.width}
      .backgroundColor=${this.backgroundColor}
      .x=${this.x - this.size / 2}
      .y=${this.y - this.size / 2}
      .sizeInterp=${this.size == 0 ? NO_INTERP : this.sizeInterp}
      .colorInterp=${this.colorInterp}
    ></pg-cursor>`
  }
}
