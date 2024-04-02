import PGSplit from '@lib/pg-split/pg-split'

/**
 * When a formerly split window merges with an existing one
 *
 * @event SplitManager#split
 * @type {object}
 * @property {PGSplit} split The split that was created.
 * @property {}
 */

type SplitEvent = {
  split: PGSplit
  level: number
}

// a recursive manager which allows the creation of split views from dragging.
// Events:
// -
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
/**
 *
 * @description A recursive manager which allows the creation of split views from dragging.
 * @emits SplitManager#split
 * @event Join Fired when a formerly split window merges with an existing one.
 */
@customElement('pg-split-manager')
export class PgSplitManager extends LitElement {
  protected override render() {
    return html`<slot></slot>`
  }
}
