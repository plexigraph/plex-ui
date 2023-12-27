import { html } from 'lit'

import './lib/pg-button/pg-button'
import './lib/pg-input/pg-input'
import './lib/pg-check/pg-check'

import styles from './styles/base.css.ts'

export default html`
  ${'<style>' + styles.cssText + '</style>'}
  <h1 style="display: flex; align-items: center">
    <img
      style="display: inline-block"
      src="/pg-gray.png"
      aspect-ratio="1"
      width="42"
      height="42"
      alt="Plex UI logo"
    />
    Plex UI
  </h1>
  <label for="color-select">Theme:</label>
  <select
    id="color-select"
    onchange="document.querySelector('body').className = this.value;"
  >
    <option value="accent">Accent</option>
    <option value="success">Success</option>
    <option value="warn">Warn</option>
    <option value="error">Error</option>
    <option value="neutral" selected>Neutral</option>
  </select>
  <h2>Buttons</h2>
  <div class="ex-grid">
    <h3>Default</h3>
    <div>
      <pg-button>Click me!</pg-button>
    </div>
    <h3>Outlined</h3>
    <div>
      <pg-button type="outlined">Click me!</pg-button>
    </div>
    <h3>Inset</h3>
    <div>
      <pg-button type="inset">Click me!</pg-button>
    </div>
    <h3>Text</h3>
    <div><pg-button type="text">Click me!</pg-button></div>
    <h3>Filled</h3>
    <div>
      <pg-button type="filled">Click me!</pg-button>
    </div>
    <h3>Disabled</h3>
    <div>
      <pg-button disabled>not clickable</pg-button>
    </div>
  </div>
  <h2>Inputs</h2>
  <div class="ex-grid">
    <h3>Default</h3>
    <div>
      <pg-input placeholder="Username"></pg-input>
      <pg-input placeholder="Password" type="password"></pg-input>
    </div>
    <h3>Disabled</h3>
    <div>
      <pg-input placeholder="Username" disabled value="scuba"></pg-input>
      <pg-input placeholder="Password" disabled type="password"></pg-input>
    </div>
    <h3>Invalid</h3>
    <div>
      <pg-input placeholder="Username" validity="is required."></pg-input>
      <pg-input
        placeholder="Password"
        type="password"
        validity="is required."
      ></pg-input>
    </div>
    <h3>Disabled &&nbsp;Invalid</h3>
    <div>
      <pg-input
        placeholder="Username"
        disabled
        value="scuba"
        validity="doesn't belong to any account."
      ></pg-input>
      <pg-input
        placeholder="Password"
        disabled
        type="password"
        validity="is required"
      ></pg-input>
    </div>
  </div>
  <h2>Checkboxes</h2>
  <div class="ex-grid">
    <h3>Default</h3>
    <div>
      <pg-check>Check me!</pg-check>
    </div>
    <h3>Disabled</h3>
    <div>
      <pg-check disabled>Not checkable</pg-check>
    </div>
    <h3>Invalid</h3>
    <div>
      <pg-check validity="invalid">Agree to terms and conditions</pg-check>
    </div>
    <h3>Disabled &&nbsp;Invalid</h3>
    <div>
      <pg-check disabled validity="invalid">
        Not checkable and invalid
      </pg-check>
    </div>
  </div>
`
