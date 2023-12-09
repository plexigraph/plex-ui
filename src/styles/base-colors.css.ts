import { css } from "lit"
export default css`
/**
* @param {string} $color-name - The name of the color - ex: gold/violet/fire/sea
* @param {string} $type - The type of shade - ex: accent/neutral/error/warning/success
* @param {string} $num - The number of the color - ex: 100/300/500/700/900
* @param {string} $shade-name - The name of the shade - ex: bg/bg-accent/mid/fg-accent/fg
*/
:root {
  --seafoam-1: #000502;
  --seafoam-2: #000a05;
  --seafoam-5: #00150c;
  --seafoam-10: #002115;
  --seafoam-20: #043827;
  --seafoam-30: #214f3d;
  --seafoam-40: #3a6754;
  --seafoam-50: #52806c;
  --seafoam-60: #6c9b85;
  --seafoam-70: #86b59e;
  --seafoam-80: #a0d1b9;
  --seafoam-90: #bceed5;
  --seafoam-95: #cafce3;
  --seafoam-98: #e7fff1;
  --seafoam-99: #f4fff7;
  --pg-success-fg: var(--seafoam-5);
  --pg-success-fg-accent: var(--seafoam-20);
  --pg-success-mid: var(--seafoam-40);
  --pg-success-mid-accent: var(--seafoam-60);
  --pg-success-bg-accent: var(--seafoam-80);
  --pg-success-bg: var(--seafoam-95);
}

@media (prefers-color-scheme: dark) {
  :root {
    --pg-success-bg: var(--seafoam-5);
    --pg-success-bg-accent: var(--seafoam-20);
    --pg-success-mid-accent: var(--seafoam-40);
    --pg-success-mid: var(--seafoam-60);
    --pg-success-fg-accent: var(--seafoam-80);
    --pg-success-fg: var(--seafoam-95);
  }
}
`