import { createContext2D } from '../Contexts'
import { getInteractableSignals } from '../InteractableSignals'
import { SignalWatcher } from '@lit-labs/preact-signals'
import { LitElement, css, html } from 'lit'
import '../pg-cursor'
import '../pg-surface'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'

@customElement('pg-radio-inner')
export class PGRadioInner extends SignalWatcher(LitElement) {
  @queryAssignedElements({
    selector: 'label:first-child:last-child:has(> input:first-child)',
  })
  labels?: Array<HTMLLabelElement>
  label!: HTMLLabelElement
  input!: HTMLInputElement
  static styles = css`
    :host {
      display: contents;
    }
  `
  context = createContext2D()
  protected handleSlotChange(): void {
    this.label = this.labels![0]
    console.log(this.label)
    this.input = this.label.querySelector('input')!
    const { focused, invalid } = this.interactableSignals
    focused.subscribe((f) => this.label.classList.toggle('focus', f))
    invalid.subscribe((i) => this.label.classList.toggle('error', i))
    this.interactableSignals.initialize(
      this.input,
      this.context.ctx,
      this.label
    )
    // force update
    this.requestUpdate()
  }
  @property({ type: Object })
  interactableSignals = getInteractableSignals()
  render() {
    if (!this.label) {
      return html` <slot /> `
    }
    const { focused, invalid } = this.interactableSignals
    this.label.classList.toggle('focus', focused.value)
    this.label.classList.toggle('error', invalid.value)
    return html`<slot />`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-radio-inner': PGRadioInner
  }
}
