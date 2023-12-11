import { html } from "lit"

import "./lib/pg-button/pg-button"
import "./lib/pg-input/pg-input"

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
  <label for="color-select">Theme:</label>
  <select
    id="color-select"
    onchange="document.querySelector('body').className = this.value;"
  >
    <option value="accent">Accent</option>
    <option value="success">Success</option>
    <option value="warning">Warning</option>
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
  <h2>Inputs</h2>
  <div class="ex-grid">
    <h3>Default</h3>
    <div>
      <pg-input placeholder="Placeholder" />
    </div>
    <h3>Disabled</h3>
    <div>
      <pg-input placeholder="Placeholder" disabled />
    </div>
    <h3>Invalid</h3>
    <div>
      <pg-input placeholder="Placeholder" validity="is invalid." />
    </div>
  </div>
`
