import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
@customElement('pg-separator')
export class PgSandbox extends LitElement {
  static styles = [
    css`
      hr {
        height: 8px;
        margin: 0;
        border: none;
        box-shadow: inset 1px 0px 2px 0px var(--pg-neutral-bg),
          inset -1px 0px 2px 0px var(--pg-neutral-bg),
          inset 0px 1px 3px 0.5px var(--pg-neutral-bg-accent);
      }
      @media (prefers-color-scheme: dark) {
        hr {
          margin: 4px 0px;
          height: 0px;
          background: var(--pg-neutral-bg-accent);
          box-shadow: 0px -0px 3px 1px var(--pg-neutral-bg-accent);
        }
      }
    `,
  ]

  render() {
    return html`<hr />`
  }
}
