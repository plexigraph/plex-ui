import { SignalWatcher } from '@lit-labs/preact-signals'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'

/* example:
<pg-dropdown open>
    <pg-dropdown-item>Item 1</pg-dropdown-item>
    <pg-dropdown-item>Item 2</pg-dropdown-item>
    <pg-dropdown-item>Item 3</pg-dropdown-item>
</pg-dropdown>
*/
@customElement('pg-dropdown-item')
export default class PGDropdownItem extends SignalWatcher(LitElement) {
  @property({ type: Boolean })
  disabled = false
  @property({ type: Boolean })
  open = false

  static styles = [
    perElementCss,
    css`
      :host {
        display: block;
        margin: 0px 8px;
        margin-left: 4px;
      }
    `,
  ]

  toggleDropdown() {
    this.open = true
  }

  render() {
    return html`
      <pg-button type="text" size="full" align="left">
        <slot></slot>
      </pg-button>
    `
  }
}
