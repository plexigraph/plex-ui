import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../pg-skeleton/pg-skeleton'
@customElement('pg-sandbox')
export class PgSandbox extends LitElement {
  @property({ type: String })
  html = '' // can be any html string
  @property({ type: String })
  sandbox = 'allow-scripts'
  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ]

  render() {
    return html`<pg-sandbox-inner html=${this.html} sandbox=${this.sandbox}
      ><pg-skeleton></pg-skeleton
    ></pg-sandbox-inner>`
  }
}
