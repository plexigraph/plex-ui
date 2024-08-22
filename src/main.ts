import { html } from 'lit'

import './lib/pg-button/pg-button'
import './lib/pg-input/pg-input'
import './lib/pg-check/pg-check'
import './lib/pg-radio/pg-radio'
import './lib/pg-grid/pg-grid'
import './lib/pg-grid/pg-grid-element'
import './lib/pg-split/pg-split'
import './lib/pg-skeleton/pg-skeleton'
import './lib/pg-draggable-list/pg-draggable-list'
import './lib/pg-draggable-list/pg-draggable-item'
import './lib/pg-sandbox/pg-sandbox'
import styles from './styles/base.css.ts'
const gridDivStyles =
  'background-color: var(--pg-bg); border: 1px solid var(--pg-fg-mid); width: 100%; height: 100%; overflow: hidden; font-size: 12px'

const injection_html = `
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  hello!
  <iframe srcdoc='asdf'></iframe>
  </body>
</html>
`

export default html`
  ${'<style>' + styles.cssText + '</style>'}
  <script>
    window.addEventListener("pg-split-down", (e) => console.log("splitttt", e.detail))
    window.addEventListener("pg-split-up", (e) => console.log("split done", e.detail))
  </script>
  <main>
    <h1 style="display: flex; align-items: center; color: var(--pg-fg-accent)">
      <span style="color: var(--pg-fg-mid)">
        <svg style="fill: currentColor" width="42" height="42">
          <use xlink:href="pg.svg#img" href="pg.svg#img"></use>
        </svg>
      </span>
      Plex UI
    </h1>
    <pg-sandbox html=${injection_html} 
    style="height: 150px; display: block;"
    ></pg-sandbox>
    <label for="color-select">Theme:</label>
    <select
      id="color-select"
      onchange="document.querySelector('body').className = this.value;"
    >
      <option value="accent" selected>Accent</option>
      <option value="success">Success</option>
      <option value="warn">Warn</option>
      <option value="error">Error</option>
      <option value="neutral">Neutral</option>
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
        <pg-radio name="options3" value="2" validity="Correct answer" disabled
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
      <h3>Skeleton</h3>
      <div>
        <pg-grid gap="2" columns="auto">
          <pg-grid-element start="1" width="fill" height="4" skeletonOffset="0" skeleton>
            <pg-input placeholder="Username"></pg-input>
          </pg-grid-element>
          <pg-grid-element start="1" width="4" height="3"  skeletonOffset="2" skeleton>
            <pg-check>Show</pg-check>
          </pg-grid-element>
          <pg-grid-element start="5" width="fill" height="4"  skeletonOffset="3" skeleton>
            <pg-input placeholder="Password" type="password"></pg-input>
          </pg-grid-element>
        </pg-grid>
      </div>
      <h3>Skeleton</h3>
      <div>
        <pg-grid gap="2" columns="auto">
          <pg-grid-element start="1" width="fill" height="4" skeletonOffset="0" skeleton>
            <pg-input placeholder="Username"></pg-input>
          </pg-grid-element>
          <pg-grid-element start="1" width="4" height="3" skeletonOffset="1" skeleton>
            <pg-check>Show</pg-check>
          </pg-grid-element>
          <pg-grid-element width="5" height="4" skeletonOffset="2" skeleton>
            <pg-input placeholder="Password" type="password"></pg-input>
          </pg-grid-element>
          <pg-grid-element start="10" width="fill" height="8" skeletonOffset="3" skeleton>
            <pg-input placeholder="Password" type="password"></pg-input>
          </pg-grid-element>
          <pg-grid-element start="1" width="9" height="4" skeletonOffset="4" skeleton>
            <pg-check>Show</pg-check>
          </pg-grid-element>
        </pg-grid>
      </div>
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
      <h3>Many</h3>
      <div style="min-height: 256px">
        <pg-split vertical>
          <span slot="first">1</span>
          <pg-split slot="second">
            <span slot="first">2</span>
            <pg-split slot="second" vertical>
              <span slot="first">3</span>
              <pg-split slot="second">
                <span slot="first">4</span>
                <pg-split slot="second" vertical>
                  <span slot="first">5</span>
                  <pg-split slot="second">
                    <span slot="first">6</span>
                    <span slot="second">7</span>
                  </pg-split>
                </pg-split>
              </pg-split>
            </pg-split>
          </pg-split>
        </pg-split>
      </div>
    </div>
    <h2>Draggable List</h2>
    <div class="ex-grid">
      <h3>Two Items</h3>
      <div>
        <pg-draggable-list>
          <pg-draggable-item>Short Item</pg-draggable-item>
          <pg-draggable-item>
            <div style="min-height: 256px"> Tall Item</div>
          </pg-draggable-item>
        </pg-draggable-list>
      </div>
  </main>
`
