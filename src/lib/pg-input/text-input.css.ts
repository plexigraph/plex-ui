import { css } from "lit"
export default css`
@charset "UTF-8";
input[type=password],
input[type=text] {
  border: none;
  width: 100%;
  height: 32px;
  background-color: transparent;
  border-radius: 0px;
  outline: none;
  padding: 2px 8px;
  border-radius: 8px 8px 0 0;
  color: var(--pg-accent-fg-accent);
}

input[type=password] {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

input[type=password]::placeholder {
  font-family: "Atkinson Hyperlegible", sans-serif; /* because font of dots is different */
  letter-spacing: normal;
}

input[type=text]::placeholder {
  font: inherit;
  color: var(--pg-neutral-mid);
}

input:placeholder-shown {
  text-overflow: ellipsis;
}

input:focus::placeholder {
  color: transparent;
}

label:has(input[type=text], input[type=password]) {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  justify-content: left;
  align-items: start;
  border-radius: 8px;
  margin-bottom: 8px;
  height: 64px;
  --cursor-color: var(--pg-accent-fg-accent);
  --background-color: var(--pg-accent-fg-accent);
  --border-color: var(--pg-accent-fg-accent);
}

label:has(input[type=text], input[type=password]) > span {
  background-color: transparent;
  color: var(--pg-accent-fg-accent);
  width: 100%;
  border: 1px solid var(--pg-accent-fg-accent);
  border-radius: 0 0 8px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 32px;
  padding: 0.25rem;
  padding-top: 0rem;
  font-size: 14px;
  opacity: 1;
  transform: translateY(0%);
  transition: transform 0.2s ease, opacity 0.2s 0.05s ease, color 0.2s linear !important;
}

label:has(input[type=text]:placeholder-shown,
input[type=password]:placeholder-shown) > span {
  opacity: 0;
  transform: translateY(-100%);
  color: var(--pg-accent-bg);
  border-color: transparent;
  transition: transform 0.2s 0.2s ease, opacity 0.2s 0.2s ease;
}

input[type=text]:placeholder-shown,
input[type=password]:placeholder-shown {
  border-bottom: 4px solid var(--pg-accent-fg-accent);
  transform: translateY(0%);
  transition: transform 0.2s ease;
}

input[type=text]:focus,
input[type=password]:focus {
  border: none;
}

label:has(input[type=text]:focus, input[type=password]:focus) > span {
  background-color: var(--pg-accent-fg-accent);
  color: var(--pg-accent-bg);
  opacity: 1;
  transform: translateY(0%);
}

label:has(input[type=text], input[type=password]) > span::before {
  content: "↑";
  margin-right: 0.25rem;
}

input {
  -webkit-animation: active 0s linear;
  -o-animation: active 0s linear;
  -ms-animation: active 0s linear;
  animation: valid 0s linear;
}

input[type=text]:invalid,
input[type=password]:invalid {
  color: var(--pg-error-fg);
  -webkit-animation: active 0s linear;
  -o-animation: active 0s linear;
  -ms-animation: active 0s linear;
  animation: invalid 0s linear;
}

@keyframes invalid {}
@keyframes valid {}
label:has(input[type=text]:invalid, input[type=password]:invalid) {
  --cursor-color: var(--pg-error-fg-accent);
  --background-color: var(--pg-error-fg-accent);
  --border-color: var(--pg-error-fg-accent);
}

label:has(input[type=text]:invalid, input[type=password]:invalid) > span {
  background-color: var(--pg-error-fg-accent);
  color: var(--pg-error-bg);
  padding: 2px;
  line-height: 1;
}

label:has(input[type=text]:invalid, input[type=password]:invalid) > span {
  background-color: transparent;
  color: var(--pg-error-fg-accent);
  border: 1px solid var(--pg-error-fg-accent);
}
label:has(input[type=text]:invalid, input[type=password]:invalid) > span::before {
  color: var(--pg-error-mid);
}

label:has(input[type=text]:invalid:focus,
input[type=password]:invalid:focus) > span {
  background-color: var(--pg-error-fg-accent);
  color: var(--pg-error-bg);
  border: 1px solid var(--pg-error-fg-accent);
}
label:has(input[type=text]:invalid:focus,
input[type=password]:invalid:focus) > span::before {
  color: var(--pg-error-mid-accent);
}

label:has(input[type=text]:invalid, input[type=password]:invalid) > span::before {
  content: "↳";
  color: var(--pg-error-mid-accent);
}

label:has(input[type=text]:disabled, input[type=password]:disabled) {
  background-color: var(--pg-neutral-bg-accent);
  --cursor-color: var(--pg-neutral-fg-accent);
  --background-color: var(--pg-neutral-bg-accent);
  --border-color: transparent;
}

label:has(input[type=text]:disabled:placeholder-shown,
input[type=password]:disabled:placeholder-shown) {
  background-color: transparent;
}

input[type=text]:disabled,
input[type=password]:disabled {
  color: var(--pg-neutral-fg);
}

input[type=text]:disabled:placeholder-shown,
input[type=password]:disabled:placeholder-shown {
  border-color: transparent;
  background-color: var(--pg-neutral-bg-accent);
  border-radius: 8px;
  transform: translateY(50%);
}

label:has(input[type=text]:disabled:placeholder-shown,
input[type=password]:disabled:placeholder-shown) {
  background-color: var(--pg-neutral-bg-accent);
}
label:has(input[type=text]:disabled:placeholder-shown,
input[type=password]:disabled:placeholder-shown) > span {
  display: none;
}

label:has(input[type=text]:disabled, input[type=password]:disabled) > span {
  background-color: var(--pg-neutral-bg-accent);
  color: var(--pg-neutral-fg-accent);
  border-color: transparent;
}
`