import { html } from 'lit'

import './lib/pg-button/pg-button'
import './lib/pg-input/pg-input'
import './lib/pg-check/pg-check'
import './lib/pg-radio/pg-radio'

import styles from './styles/base.css.ts'

export default html`
  ${'<style>' + styles.cssText + '</style>'}
  <main>
    <h1 style="display: flex; align-items: center; color: var(--pg-fg-accent)">
      <span style="color: var(--pg-mid)">
        <svg style="fill: currentColor" width="42" height="42">
          <use xlink:href="pg.svg#img" href="pg.svg#img"></use>
        </svg>
      </span>
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
          validity="was not found. Try creating an account instead."
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
        <pg-check>Show Password</pg-check>
      </div>
      <h3>Disabled</h3>
      <div>
        <pg-check disabled>Not checkable</pg-check>
      </div>
      <h3>Invalid</h3>
      <div>
        <pg-check validity="is required."
          >Agree to terms and services.</pg-check
        >
      </div>
      <h3>Disabled &&nbsp;Invalid</h3>
      <div>
        <pg-check disabled validity="invalid"> Show Password </pg-check>
      </div>
    </div>
    <h2>Radio Buttons</h2>
    <div class="ex-grid">
      <h3>Default</h3>
      <div>
        <pg-radio name="options" value="1">Option 1</pg-radio>
        <pg-radio name="options" value="2">Option 2</pg-radio>
        <pg-radio name="options" value="3">Option 3</pg-radio>
      </div>
      <h3>Disabled</h3>
      <div>
        <pg-radio name="options" value="1" disabled>Option 1</pg-radio>
        <pg-radio name="options" value="2" disabled>Option 2</pg-radio>
        <pg-radio name="options" value="3" disabled>Option 3</pg-radio>
      </div>
      <h3>Invalid</h3>
      <div>
        <pg-radio
          name="options"
          value="1"
          validity="wrong answer"
          checked
          >Option 1</pg-radio
        >
        <pg-radio name="options" value="2" validity="correct answer"
          >Option 2</pg-radio
        >
        <pg-radio name="options" value="3">Option 3</pg-radio>
      </div>
      <h3>Disabled &&nbsp;Invalid</h3>
      <div>
        <pg-check disabled validity="invalid">Show Password</pg-check>
      </div>
    </div>
  </main>
`
