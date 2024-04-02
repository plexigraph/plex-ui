// define a lit element named pg-split-view

import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('pg-split-view')
export class PgSplitView extends LitElement {
  @property()
  handle: HTMLElement | undefined

  onHandleDrag() {}

  onHandleDrop() {}

  connectedCallback(): void {
    
  }

  render() {
    return html`<slot></slot>`
  }
}

@customElement('pg-split-view')
export class XItem extends LitElement {
  render() {
    return html``
  }
}
