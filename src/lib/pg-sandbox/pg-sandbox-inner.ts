import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'
const metaTag = document.createElement('meta')
metaTag.httpEquiv = 'Content-Security-Policy'
metaTag.content = `default-src 'none'; script-src 'unsafe-inline'; frame-src 'none';`

@customElement('pg-sandbox-inner')
export class PgSandbox extends LitElement {
  @property({ type: String })
  html = '' // can be any html string
  @property({ type: String })
  sandbox = 'allow-scripts'
  doc: Document | undefined
  static styles = [
    perElementCss,
    css`
      :host {
        display: block;
      }
      iframe {
        width: 100%;
        height: var(--height, 100%);
        border: none;
        background: transparent;
        border-radius: 8px;
        animation: 0.5s fadein;
      }
      @keyframes fadein {
        from {
          opacity: 0;
          filter: blur(4px);
          transform: scale(102%);
        }
        to {
          opacity: 1;
          filter: blur(0px);
          transform: scale(100%);
        }
      }
    `,
  ]

  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('html')) {
      this.doc = document.implementation.createHTMLDocument()
      this.doc.documentElement.innerHTML = this.html
      // add meta tag to prevent loading external resources
      this.doc.head.prepend(metaTag)
    }
  }

  render() {
    return html` <iframe
      srcdoc=${this.doc?.documentElement.outerHTML}
      sandbox=${this.sandbox}
    ></iframe>`
  }
}
