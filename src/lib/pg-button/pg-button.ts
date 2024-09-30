import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'

import buttonCss from './button.css.ts'
import resetCss from '../../styles/reset.css.ts'
import perElementCss from '../../styles/per-element.css.ts'

@customElement('pg-button')
export default class PGButton extends LitElement {
  @property({ type: String })
  type = '' as 'default' | 'outlined' | 'inset' | 'text' | 'filled'
  @property({ type: Boolean })
  disabled = false
  @property({ type: String })
  href = '' // only set if you want to use an anchor tag
  @property({ type: String })
  download = '' // only set if you want to use an anchor tag
  @property({ type: String })
  target = '' // only set if you want to use an anchor tag
  @property({ type: String })
  size = 'fit' as 'fit' | 'normal' | 'full' | 'skinny' | 'icon'
  @property({ type: String })
  align = 'center' as 'center' | 'left' | 'right'
  static get styles() {
    return [buttonCss, resetCss, perElementCss]
  }
  render() {
    return html`<pg-button-inner>
      ${this.href !== ''
        ? html`<a
            class=${`${this.type} ${this.size} ${this.align}`}
            disabled=${ifDefined(this.disabled ? 'disabled' : undefined)}
            href=${this.href}
            download=${this.download}
            target=${this.target}
          >
            <slot />
          </a>`
        : html`<button
            class=${`${this.type} ${this.size} ${this.align}`}
            disabled=${ifDefined(this.disabled ? 'disabled' : undefined)}
          >
            <slot />
          </button>`}
    </pg-button-inner> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-button': PGButton
  }
}
