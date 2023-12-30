import { createContext2D } from '../../lib/Contexts'
import { getInteractableSignals } from '../../lib/InteractableSignals'
import { SignalWatcher } from '@lit-labs/preact-signals'
import { LitElement, css, html } from 'lit'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'

@customElement('pg-input-inner')
export class PGInputInner extends SignalWatcher(LitElement) {
  @queryAssignedElements({
    selector:
      'label:first-child:last-child:has(> span:first-child+input:last-child)',
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
  handleSlotChange(): void {
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
    if (!this.label) {
      return html` <slot @slotchange=${this.handleSlotChange} /> `
    }
    const { focused, invalid } = this.interactableSignals
    this.label.classList.toggle('focus', focused.value)
    this.label.classList.toggle('error', invalid.value)
    return html`
      <pg-surface full="full" .context=${this.context}>
        <slot @slotchange=${this.handleSlotChange} />
      </pg-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pg-input-inner': PGInputInner
  }
}
