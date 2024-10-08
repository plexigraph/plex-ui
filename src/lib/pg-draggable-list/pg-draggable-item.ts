import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('pg-draggable-item')
export class PgDraggableItem extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
        width: calc(100% - 32px);
        margin: 16px;
        background-color: var(--pg-neutral-bg);
      }
      .assistive-text {
        position: absolute;
        margin: -1px;
        border: 0;
        padding: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
      }
      .drag {
        width: 16px;
        position: relative;
        overflow: hidden;
        margin-right: 16px;
        cursor: move;
        border: transparent;
      }
      .drag::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--pg-bg);
      }
      .drag:focus-visible {
        outline: 4px solid var(--pg-cursor);
        transition: background-color 0.2s ease,
          outline-width 0.2s cubic-bezier(0, 0, 0.5, 3);
      }
      .drag::after {
        content: '';
        position: absolute;
        --height: 24px;
        top: calc(100% / 2 - var(--height) / 2);
        left: 0;
        width: 100%;
        height: var(--height);
        background-image: radial-gradient(
          circle at 2px 2px,
          var(--pg-fg-mid) 2px,
          transparent 0
        );
        background-position: calc(50% - 2px + 8px) calc(50% - 2px + 4px);
        background-size: 16px 8px;
      }
    `,
  ]

  @state()
  announcement = ''

  render() {
    return html`
      <button class="drag">Drag me</button>
      <slot></slot>
      <span aria-live="assertive" class="assistive-text"
        >${this.announcement}</span
      >
    `
  }
}
