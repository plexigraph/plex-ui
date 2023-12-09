import { css } from "lit"
export default css`
pg-button-inner button,
pg-button-inner a {
  outline: 1px solid var(--pg-fg-accent);
  outline-offset: -1px;
  background-color: var(--pg-bg);
  color: var(--pg-fg-accent);
  border-radius: 20px;
  border: none;
  padding: 0 12px;
  height: 32px;
  margin: 16px;
  display: inline-block;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--color-transition-speed), color var(--color-transition-speed), outline var(--size-transition-speed), border-radius var(--size-transition-speed);
  -webkit-tap-highlight-color: transparent;
}
pg-button-inner a {
  text-decoration: none;
}
pg-button-inner button.outlined,
pg-button-inner a.outlined {
  background-color: transparent;
  outline-color: var(--pg-fg);
  color: var(--pg-fg);
}
pg-button-inner button.inset,
pg-button-inner a.inset {
  background-color: var(--pg-bg);
  outline-color: transparent;
}
pg-button-inner button.text,
pg-button-inner a.text {
  background-color: transparent;
  outline-color: transparent;
}
pg-button-inner button.filled,
pg-button-inner a.filled {
  --pg-cursor: var(--pg-mid-accent);
  background-color: var(--pg-fg);
  outline-color: transparent;
  color: var(--pg-bg);
}
@media (hover: hover) {
  pg-button-inner button.filled:hover,
  pg-button-inner a.filled:hover {
    background-color: var(--pg-fg-accent);
  }
}
pg-button-inner button.filled:active, pg-button-inner button.filled.active,
pg-button-inner a.filled:active,
pg-button-inner a.filled.active {
  background-color: var(--pg-mid);
  color: var(--pg-bg);
}
@media (hover: hover) {
  pg-button-inner button.outlined:hover,
  pg-button-inner a.outlined:hover,
  pg-button-inner button.text:hover,
  pg-button-inner a.text:hover {
    background-color: var(--pg-bg);
  }
}
pg-button-inner button.outlined:active,
pg-button-inner a.outlined,
pg-button-inner button.outlined.active,
pg-button-inner a.outlined.active,
pg-button-inner button.text:active,
pg-button-inner a.text:active,
pg-button-inner button.text.active,
pg-button-inner a.text.active {
  background-color: var(--pg-bg-accent);
}
pg-button-inner button.full,
pg-button-inner a.full {
  width: 100%;
  display: block;
}
pg-button-inner button.normal,
pg-button-inner a.normal {
  width: 256px;
}
pg-button-inner button.icon,
pg-button-inner a.icon {
  width: 32px;
}
pg-button-inner button:focus-visible,
pg-button-inner a:focus-visible {
  outline: 4px solid var(--pg-cursor);
  transition: background-color var(--color-transition-speed), color var(--color-transition-speed), outline var(--size-transition-speed), border-radius var(--size-transition-speed), outline-width 0.2s cubic-bezier(0, 0, 0.5, 3);
}
@media (hover: hover) {
  pg-button-inner button:hover,
  pg-button-inner a:hover {
    background-color: var(--pg-bg-accent);
  }
}
pg-button-inner button:active,
pg-button-inner button.active,
pg-button-inner a:active,
pg-button-inner a.active {
  background-color: var(--pg-mid-accent);
  color: var(--pg-fg);
}
pg-button-inner button:disabled,
pg-button-inner button:disabled:hover,
pg-button-inner button:disabled:active,
pg-button-inner button:disabled.active,
pg-button-inner a:disabled {
  border-color: var(--pg-bg);
  outline-color: var(--pg-bg);
  background-color: var(--pg-bg);
  color: var(--pg-mid-accent);
  border-radius: 4px;
}

/**
* @param {string} $color-name - The name of the color - ex: gold/violet/fire/sea
* @param {string} $type - The type of shade - ex: accent/neutral/error/warning/success
* @param {string} $num - The number of the color - ex: 100/300/500/700/900
* @param {string} $shade-name - The name of the shade - ex: bg/bg-accent/mid/fg-accent/fg
*/
:root {
  --violet-1: #02001f;
  --violet-2: #03002e;
  --violet-5: #09004a;
  --violet-10: #100069;
  --violet-20: #1f00a4;
  --violet-30: #3728c2;
  --violet-40: #5047da;
  --violet-50: #6a62f4;
  --violet-60: #8681ff;
  --violet-70: #a5a1ff;
  --violet-80: #c3c0ff;
  --violet-90: #e3dfff;
  --violet-95: #f2efff;
  --violet-98: #fcf8ff;
  --violet-99: #fffbff;
  --gold-1: #070300;
  --gold-2: #0d0600;
  --gold-5: #190f00;
  --gold-10: #271900;
  --gold-20: #422d00;
  --gold-30: #5e4200;
  --gold-40: #7d5800;
  --gold-50: #9c6f00;
  --gold-60: #bd8700;
  --gold-70: #dca11d;
  --gold-80: #fbbc3b;
  --gold-90: #ffdea9;
  --gold-95: #ffeed8;
  --gold-98: #fff8f3;
  --gold-99: #fffbff;
  --fire-1: #0c0200;
  --fire-2: #140300;
  --fire-5: #240800;
  --fire-10: #351000;
  --fire-20: #571f00;
  --fire-30: #7b2f00;
  --fire-40: #a14000;
  --fire-50: #c95203;
  --fire-60: #eb6a23;
  --fire-70: #ff8c54;
  --fire-80: #ffb695;
  --fire-90: #ffdbcc;
  --fire-95: #ffede7;
  --fire-98: #fff8f6;
  --fire-99: #fffbff;
  --gray-1: #020403;
  --gray-2: #050807;
  --gray-5: #0e120f;
  --gray-10: #191c1a;
  --gray-20: #2e312d;
  --gray-30: #454843;
  --gray-40: #5e5f59;
  --gray-50: #777771;
  --gray-60: #93918a;
  --gray-70: #aeaba3;
  --gray-80: #cbc6bd;
  --gray-90: #e8e2d8;
  --gray-95: #f7f0e6;
  --gray-98: #fff8f3;
  --gray-99: #fffbff;
  --pg-accent-fg: var(--violet-5);
  --pg-accent-fg-accent: var(--violet-20);
  --pg-accent-mid: var(--violet-40);
  --pg-accent-mid-accent: var(--violet-60);
  --pg-accent-bg-accent: var(--violet-80);
  --pg-accent-bg: var(--violet-95);
  --pg-neutral-fg: var(--gray-5);
  --pg-neutral-fg-accent: var(--gray-20);
  --pg-neutral-mid: var(--gray-40);
  --pg-neutral-mid-accent: var(--gray-60);
  --pg-neutral-bg-accent: var(--gray-80);
  --pg-neutral-bg: var(--gray-95);
  --pg-error-fg: var(--fire-5);
  --pg-error-fg-accent: var(--fire-20);
  --pg-error-mid: var(--fire-40);
  --pg-error-mid-accent: var(--fire-60);
  --pg-error-bg-accent: var(--fire-80);
  --pg-error-bg: var(--fire-95);
  --pg-warning-fg: var(--gold-5);
  --pg-warning-fg-accent: var(--gold-20);
  --pg-warning-mid: var(--gold-40);
  --pg-warning-mid-accent: var(--gold-60);
  --pg-warning-bg-accent: var(--gold-80);
  --pg-warning-bg: var(--gold-95);
  --pg-success-fg: var(--seafoam-5);
  --pg-success-fg-accent: var(--seafoam-20);
  --pg-success-mid: var(--seafoam-40);
  --pg-success-mid-accent: var(--seafoam-60);
  --pg-success-bg-accent: var(--seafoam-80);
  --pg-success-bg: var(--seafoam-95);
  color: var(--pg-neutral-fg);
  background-color: var(--gray-98);
  color-scheme: light;
  --color-transition-speed: 0.2s;
  --size-transition-speed: 0.2s;
  --pos-transition-speed: 0.2s;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --pg-accent-bg: var(--violet-5);
    --pg-accent-bg-accent: var(--violet-20);
    --pg-accent-mid-accent: var(--violet-40);
    --pg-accent-mid: var(--violet-60);
    --pg-accent-fg-accent: var(--violet-80);
    --pg-accent-fg: var(--violet-95);
    --pg-neutral-bg: var(--gray-5);
    --pg-neutral-bg-accent: var(--gray-20);
    --pg-neutral-mid-accent: var(--gray-40);
    --pg-neutral-mid: var(--gray-60);
    --pg-neutral-fg-accent: var(--gray-80);
    --pg-neutral-fg: var(--gray-95);
    --pg-error-bg: var(--fire-5);
    --pg-error-bg-accent: var(--fire-20);
    --pg-error-mid-accent: var(--fire-40);
    --pg-error-mid: var(--fire-60);
    --pg-error-fg-accent: var(--fire-80);
    --pg-error-fg: var(--fire-95);
    --pg-warning-bg: var(--gold-5);
    --pg-warning-bg-accent: var(--gold-20);
    --pg-warning-mid-accent: var(--gold-40);
    --pg-warning-mid: var(--gold-60);
    --pg-warning-fg-accent: var(--gold-80);
    --pg-warning-fg: var(--gold-95);
    --pg-success-bg: var(--seafoam-5);
    --pg-success-bg-accent: var(--seafoam-20);
    --pg-success-mid-accent: var(--seafoam-40);
    --pg-success-mid: var(--seafoam-60);
    --pg-success-fg-accent: var(--seafoam-80);
    --pg-success-fg: var(--seafoam-95);
    background-color: var(--gray-1);
    color: var(--pg-neutral-fg);
  }
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Comfortaa", sans-serif;
  margin: 0;
}

body {
  font-family: "Atkinson Hyperlegible", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
}

code {
  font-family: "Fira Code", monospace;
  white-space: pre;
}

hr.thin {
  margin: 1rem 0;
  border: 0.5px solid var(--pg-neutral-mid);
}

.surface {
  margin: 0 auto;
}

:root {
  --pg-fg: var(--pg-neutral-fg);
  --pg-fg-accent: var(--pg-neutral-fg-accent);
  --pg-mid: var(--pg-neutral-mid);
  --pg-mid-accent: var(--pg-neutral-mid-accent);
  --pg-bg-accent: var(--pg-neutral-bg-accent);
  --pg-bg: var(--pg-neutral-bg);
  --pg-cursor: var(--pg-mid);
}

.accent {
  --pg-fg: var(--pg-accent-fg);
  --pg-fg-accent: var(--pg-accent-fg-accent);
  --pg-mid: var(--pg-accent-mid);
  --pg-mid-accent: var(--pg-accent-mid-accent);
  --pg-bg-accent: var(--pg-accent-bg-accent);
  --pg-bg: var(--pg-accent-bg);
  --pg-cursor: var(--pg-mid);
}

.success {
  --pg-fg: var(--pg-success-fg);
  --pg-fg-accent: var(--pg-success-fg-accent);
  --pg-mid: var(--pg-success-mid);
  --pg-mid-accent: var(--pg-success-mid-accent);
  --pg-bg-accent: var(--pg-success-bg-accent);
  --pg-bg: var(--pg-success-bg);
  --pg-cursor: var(--pg-mid);
}

.warning {
  --pg-fg: var(--pg-warning-fg);
  --pg-fg-accent: var(--pg-warning-fg-accent);
  --pg-mid: var(--pg-warning-mid);
  --pg-mid-accent: var(--pg-warning-mid-accent);
  --pg-bg-accent: var(--pg-warning-bg-accent);
  --pg-bg: var(--pg-warning-bg);
  --pg-cursor: var(--pg-mid);
}

.error {
  --pg-fg: var(--pg-error-fg);
  --pg-fg-accent: var(--pg-error-fg-accent);
  --pg-mid: var(--pg-error-mid);
  --pg-mid-accent: var(--pg-error-mid-accent);
  --pg-bg-accent: var(--pg-error-bg-accent);
  --pg-bg: var(--pg-error-bg);
  --pg-cursor: var(--pg-mid);
}

.pg-interactable {
  -webkit-animation: inactive 0s linear;
  -o-animation: inactive 0s linear;
  -ms-animation: inactive 0s linear;
  animation: inactive 0s linear;
}

.pg-interactable:active {
  -webkit-animation: active 0s linear;
  -o-animation: active 0s linear;
  -ms-animation: active 0s linear;
  animation: active 0s linear;
}

@keyframes active {}
@keyframes inactive {}
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