import { html } from "lit"

import "./lib/pg-button/pg-button"

export default html`
  <h1 style="display: flex; align-items: center">
    <img
      style="display: inline-block"
      src="/pg-gray.png"
      aspect-ratio="1"
      width="42"
      alt="Plex UI logo"
    />
    Plex UI
  </h1>
  <h2>Buttons</h2>
  <label for="color-select">Theme:</label>
  <select
    id="color-select"
    onchange="document.querySelector('#button-grid').className = 'button-grid ' + this.value;"
  >
    <option value="accent" selected>Accent</option>
    <option value="error">Error</option>
    <option value="warning">Warning</option>
    <option value="success">Success</option>
    <option value="neutral">Neutral</option>
  </select>
  <div id="button-grid" class="button-grid accent">
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
    <div>
      <pg-button type="text">Click me!</pg-button>
    </div>
    <h3>Filled</h3>
    <div>
      <pg-button type="filled">Click me!</pg-button>
    </div>
    <h3>Disabled</h3>
    <div>
      <pg-button disabled>not clickable</pg-button>
    </div>
  </div>
`
