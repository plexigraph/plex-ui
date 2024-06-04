/* example
<pg-draggable-list>
    <pg-draggable-item>Short Item</pg-draggable-item>
    <pg-draggable-item>
        <div style="min-height: 256px"> Tall Item</div>
    </pg-draggable-item>
</pg-draggable-list>
*/

import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('pg-draggable-list')
export class PgDraggableList extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  @state()
  dragging: HTMLElement | undefined

  render() {
    return html`
      <slot></slot>
      <div id="dragging">${this.dragging}</div>
    `
  }
}
