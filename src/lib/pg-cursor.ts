import { NO_INTERP, getSlerp } from "./Contexts"
import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
const colorInterp = getSlerp(0.2)

@customElement("pg-cursor")
export default class PGCursor extends LitElement {
  @property({ type: Number })
  width = 0
  @property({ type: Number })
  height = 0
  @property({ type: Number })
  x = 0
  @property({ type: Number })
  y = 0
  @property({ type: Number })
  radius = 0
  @property({ type: Object })
  backgroundColor = undefined
  @property({ type: Object })
  borderColor = undefined
  @property({ type: Number })
  borderWidth = 0
  @property({ type: Function })
  posInterp = getSlerp(0)
  @property({ type: Function })
  sizeInterp = getSlerp(0.2)
  @property({ type: Function })
  colorInterp = getSlerp(0.2)
  @property({ type: Boolean })
  hidden = false
  @property({ type: Number })
  zIndex = 10
  @state()
  actualPosInterp = this.posInterp
  actualPosInterpTimeout: NodeJS.Timeout | undefined = undefined
  willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("hidden")) {
      if (changedProperties.get("hidden")) {
        if (this.actualPosInterpTimeout) {
          clearTimeout(this.actualPosInterpTimeout)
        }
        this.actualPosInterp = NO_INTERP
        this.actualPosInterpTimeout = setTimeout(() => {
          this.actualPosInterp = this.posInterp
        }, 50)
      }
    } else {
      this.actualPosInterp = this.posInterp
    }
  }
  render() {
    return html` <pg-rounded-rect
      .x=${this.x + this.width / 2}
      .y=${this.y + this.height / 2}
      .width=${!this.hidden ? this.width : 0}
      .height=${!this.hidden ? this.height : 0}
      .radius=${this.radius}
      .posInterp=${this.actualPosInterp}
      .sizeInterp=${this.sizeInterp}
      .colorInterp=${this.colorInterp}
      .stylesInterp=${colorInterp}
      .backgroundColor=${this.backgroundColor}
      .borderColor=${this.borderColor}
      .borderWidth=${this.borderWidth}
      .zIndex=${this.zIndex}
    ></pg-rounded-rect>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pg-cursor": PGCursor
  }
}
