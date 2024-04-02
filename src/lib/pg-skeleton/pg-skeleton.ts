import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'

@customElement('pg-skeleton')
export class PgSkeleton extends LitElement {
  @property()
  offset = 0
  static styles = [
    perElementCss,
    css`
      :host {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .skeleton {
        top: 0;
        left: 0;
        display: block;
        width: calc(100% - 8px);
        height: calc(100% - 32px);
        border-radius: 8px;
        --b-size: min(800px, 100vw);
        background-size: var(--b-size);
        background: var(--pg-bg-accent);
        /*animation: 2s calc(var(--start) * 0.05s) ease-out infinite pulse;*/
        /* animation: 2s ease-out infinite slide; */
        animation: 2s calc(var(--time-offset) * 0.1s) ease-in infinite pulse;
      }
      @keyframes pulse {
        0% {
          background: var(--pg-bg-accent);
        }
        50% {
          background: var(--pg-bg-mid);
          animation-timing-function: linear;
        }
        100% {
          background: var(--pg-bg-accent);
        }
      }
    `,
  ]

  render() {
    const cssVars = new Map()
    cssVars.set(
      '--time-offset',
      !Number.isNaN(this.offset) ? this.offset.toString() : '0'
    )
    const cssVarsStr = [...cssVars.entries()]
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')

    return html` <div class="skeleton" style=${cssVarsStr}></div>`
  }
}
