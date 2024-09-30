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
@customElement('pg-dropdown')
export default class PGDropdown extends SignalWatcher(LitElement) {
  @property({ type: Boolean })
  disabled = false
  @property({ type: Boolean })
  open = false

  static styles = [
    perElementCss,
    css`
      :host {
        position: relative;
        display: inline-block;
      }
      div {
        position: absolute;
        background: var(--pg-neutral-bg);
        border-radius: 8px;
        box-sizing: border-box;
        z-index: 100;
        margin: 8px;
        padding: 4px 0px;
        transform: translateX(-50%);
        width: max-content;
        color: var(--pg-neutral-fg-accent);
        animation: fadeIn 0.2s ease;
      }
      div.above {
        bottom: 80%;
        left: 50%;
      }
      div.below {
        top: 80%;
        left: 50%;
      }
      div::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        box-shadow: 0 1px 4px 0px var(--pg-neutral-bg-accent);
      }
      @media (prefers-color-scheme: dark) {
        div::before {
          box-shadow: inset 0 0 3px 1px var(--pg-neutral-bg-accent);
        }
        div {
          overflow: hidden;
          background-color: var(--pg-neutral-bg);

          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform-origin: 50% 100%;
          transform: translateY(-8px) scale(0.9) translateX(-50%);
        }
        to {
          opacity: 1;
          transform-origin: 50% 100%;
          transform: translateY(0) scale(1) translateX(-50%);
        }
      }
    `,
  ]

  toggleDropdown() {
    this.open = !this.open
    // force dropdown to be fully visible
    const dropdown = this.shadowRoot!.querySelector('div') as HTMLElement
    const broadcastOpen = () => {
      this.dispatchEvent(
        new CustomEvent('open', {
          detail: { open: this.open },
          bubbles: false,
          composed: true,
        })
      )
    }
    setTimeout(() => {
      const rect = dropdown.getBoundingClientRect()
      const above = rect.bottom > window.innerHeight
      dropdown.classList.toggle('above', above)
      dropdown.classList.toggle('below', !above)
    }, 0)
    // hide dropdown when clicked outside
    setTimeout(() => {
      const closeDropdown = (e: MouseEvent) => {
        if (!e.composedPath().includes(this)) {
          this.open = false
          document.removeEventListener('click', closeDropdown)
          broadcastOpen()
        }
      }
      document.addEventListener('click', closeDropdown)
    }, 0)
    // broadcast open state
    broadcastOpen()
  }

  getCssVars() {}

  render() {
    return html`<slot name="trigger" @click="${this.toggleDropdown}"> </slot>
      <div ?hidden="${!this.open}">
        <slot> </slot>
      </div>`
  }
}
