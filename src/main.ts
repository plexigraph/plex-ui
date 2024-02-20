import { html } from 'lit'

import './lib/pg-button/pg-button'
import './lib/pg-input/pg-input'
import './lib/pg-check/pg-check'
import './lib/pg-radio/pg-radio'
import './lib/pg-grid/pg-grid'
import './lib/pg-grid/pg-grid-element'
import './lib/pg-split/pg-split'
import styles from './styles/base.css.ts'

const gridDivStyles =
  'background-color: var(--pg-bg); border: 1px solid var(--pg-fg-mid); width: 100%; height: 100%; overflow: hidden; font-size: 12px'

export default html`
  ${'<style>' + styles.cssText + '</style>'}
  <main>
    <h1 style="display: flex; align-items: center; color: var(--pg-fg-accent)">
      <span style="color: var(--pg-fg-mid)">
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
        <pg-button size="full">Click me!</pg-button>
      </div>
      <h3>Outlined</h3>
      <div>
        <pg-button type="outlined" size="full">Click me!</pg-button>
      </div>
      <h3>Inset</h3>
      <div>
        <pg-button type="inset" size="full">Click me!</pg-button>
      </div>
      <h3>Text</h3>
      <div><pg-button type="text" size="full">Click me!</pg-button></div>
      <h3>Filled</h3>
      <div>
        <pg-button type="filled" size="full">Click me!</pg-button>
      </div>
      <h3>Disabled</h3>
      <div>
        <pg-button disabled type="filled" size="full">not clickable</pg-button>
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
        <pg-radio name="options1" value="1" disabled>Option 1</pg-radio>
        <pg-radio name="options1" value="2" disabled>Option 2</pg-radio>
        <pg-radio name="options1" value="3" disabled>Option 3</pg-radio>
      </div>
      <h3>Invalid</h3>
      <div>
        <pg-radio name="options2" value="1" validity="wrong answer" checked
          >Option 1</pg-radio
        >
        <pg-radio name="options2" value="2" validity="correct answer"
          >Option 2</pg-radio
        >
        <pg-radio name="options2" value="3">Option 3</pg-radio>
      </div>
      <h3>Disabled &&nbsp;Invalid</h3>
      <div>
        <pg-radio
          name="options3"
          value="1"
          validity="wrong answer"
          checked
          disabled
          >Option 1</pg-radio
        >
        <pg-radio name="options3" value="2" validity="correct answer" disabled
          >Option 2</pg-radio
        >
        <pg-radio name="options3" value="3" disabled>Option 3</pg-radio>
      </div>
    </div>
    <h2>Grid</h2>
    <div class="ex-grid">
      <h3>Divs</h3>
      <div>
        <pg-grid gap="16" columns="6">
          <pg-grid-element width="3" height="1">
            <div style="${gridDivStyles}">3x1</div>
          </pg-grid-element>
          <pg-grid-element width="2" height="2">
            <div style="${gridDivStyles}">2x2</div>
          </pg-grid-element>
          <pg-grid-element width="1" height="3">
            <div style="${gridDivStyles}">1x3</div>
          </pg-grid-element>
          <pg-grid-element width="3" height="2">
            <div style="${gridDivStyles}">3x2</div>
          </pg-grid-element>
          <pg-grid-element width="2" height="1">
            <div style="${gridDivStyles}">2x1</div>
          </pg-grid-element>
        </pg-grid>
      </div>
      <h3>Form</h3>
      <div>
        <pg-grid gap="2" columns="auto">
          <pg-grid-element start="1" width="fill" height="4">
            <pg-input placeholder="Username"></pg-input>
          </pg-grid-element>
          <pg-grid-element width="4" height="3">
            <pg-check>Show</pg-check>
          </pg-grid-element>
          <pg-grid-element start="5" width="fill" height="4">
            <pg-input placeholder="Password" type="password"></pg-input>
          </pg-grid-element>
        </pg-grid>
      </div>
    </div>
    <h2>Split</h2>
    <div class="ex-grid">
      <h3>Vertical</h3>
      <div>
        <pg-split vertical>
          <span slot="first">top</span>
          <span slot="second">bottom</span>
        </pg-split>
      </div>
      <h3>Horizontal</h3>
      <div>
        <pg-split>
          <span slot="first">left</span>
          <span slot="second">right</span>
        </pg-split>
      </div>
      <h3>Multiple</h3>
      <div>
        <pg-split startingPercent=${25}>
          <span slot="first">left</span>
          <pg-split vertical slot="second">
            <span slot="first">top right</span>
            <span slot="second">bottom right</span>
          </pg-split>
        </pg-split>
      </div>
      <h3>Multiple</h3>
      <div>
        <pg-split vertical startingPercent=${25}>
          <span slot="first">top</span>
          <pg-split slot="second">
            <span slot="first">bottom right</span>
            <span slot="second">bottom left</span>
          </pg-split>
        </pg-split>
      </div>
    </div>
  </main>
`
