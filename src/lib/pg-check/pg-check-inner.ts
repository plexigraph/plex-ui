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

@customElement('pg-check-inner')
export class PGCheckInner extends SignalWatcher(LitElement) {
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
    const { focused, invalid } = this.interactableSignals
    if (!this.label) {
      return html` <slot /> `
    }
    this.label.classList.toggle('focus', focused.value)
    this.label.classList.toggle('error', invalid.value)
    return html` <slot /> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-check-inner': PGCheckInner
  }
}
