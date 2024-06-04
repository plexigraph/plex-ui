import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import perElementCss from '../../styles/per-element.css'
import skeletonCss from './skeleton.css'

@customElement('pg-skeleton')
export class PgSkeleton extends LitElement {
  @property()
  offset = 0
  static styles = [perElementCss, skeletonCss]

  render() {
    const cssVars = new Map()
    cssVars.set(
      '--time-offset',
      !Number.isNaN(this.offset) ? this.offset.toString() : '0'
    )
    const cssVarsStr = [...cssVars.entries()]
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')

    return html`<div class="skeleton" style=${cssVarsStr}></div>`
  }
}
