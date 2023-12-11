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
  color: var(--pg-fg-accent);
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

input[type=text]:disabled::placeholder {
  color: var(--pg-mid-accent);
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
  position: relative;
  margin: 16px;
  width: calc(100% - 32px);
}

label:has(input[type=text], input[type=password]) > span {
  background-color: transparent;
  color: var(--pg-fg-accent);
  width: 100%;
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
  color: var(--pg-bg);
  border-color: transparent;
  transition: transform 0.2s 0.2s ease, opacity 0.2s 0.2s ease;
}

input[type=text]:placeholder-shown,
input[type=password]:placeholder-shown {
  transform: translateY(0%);
  transition: transform 0.2s ease;
}

label:has(input[type=text], input[type=password])::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
  border-radius: 8px;
  background-color: transparent;
  transition: height 0.2s ease, top 0.2s ease, background-color 0.2s ease, border 0.2s ease;
  border: 1px solid var(--pg-fg-accent);
}

label:has(input[type=text]:placeholder-shown,
input[type=password]:placeholder-shown)::before {
  height: 2px;
  top: 50%;
  border-color: transparent;
  background-color: var(--pg-fg-accent);
}

label:has(input[type=text]:focus, input[type=password]:focus)::before {
  background-color: var(--pg-fg-accent);
  height: 50%;
  top: 50%;
}

label:has(input[type=text]:disabled,
input[type=password]:disabled)::before {
  background-color: var(--pg-bg);
  border-color: var(--pg-bg);
  height: 100%;
  top: 0;
}

label:has(input[type=text]:focus, input[type=password]:focus) > span {
  color: var(--pg-bg);
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
  color: var(--pg-error-fg-accent);
  -webkit-animation: active 0s linear;
  -o-animation: active 0s linear;
  -ms-animation: active 0s linear;
  animation: invalid 0s linear;
}

@keyframes invalid {}
@keyframes valid {}
label:has(input[type=text]:invalid:focus,
input[type=password]:invalid:focus)::before,
label:has(input[type=text]:invalid:placeholder-shown,
input[type=password]:invalid:placeholder-shown)::before {
  background-color: var(--pg-error-fg-accent);
}

label:has(input[type=text]:invalid, input[type=password]:invalid)::before {
  border-color: var(--pg-error-fg-accent);
}

label:has(input[type=text]:invalid, input[type=password]:invalid) > span {
  color: var(--pg-error-bg);
  font-size: 12px;
  padding: 2px;
  line-height: 1;
}

label:has(input[type=text]:invalid, input[type=password]:invalid) > span {
  color: var(--pg-error-fg-accent);
}
label:has(input[type=text]:invalid, input[type=password]:invalid) > span::before {
  color: var(--pg-error-fg-accent);
}

label:has(input[type=text]:invalid:focus,
input[type=password]:invalid:focus) > span {
  color: var(--pg-error-bg);
}
label:has(input[type=text]:invalid:focus,
input[type=password]:invalid:focus) > span::before {
  color: var(--pg-error-bg-accent);
}

label:has(input[type=text]:invalid, input[type=password]:invalid) > span::before {
  content: "↳";
  color: var(--pg-error-fg-accent);
}

input[type=text]:disabled,
input[type=password]:disabled {
  color: var(--pg-mid);
  z-index: 1;
}

input[type=text]:disabled:placeholder-shown,
input[type=password]:disabled:placeholder-shown {
  border-color: transparent;
  border-radius: 8px;
  transform: translateY(50%);
}

label:has(input[type=text]:disabled:placeholder-shown,
input[type=password]:disabled:placeholder-shown) > span {
  background-color: transparent;
  border-color: transparent;
}

label:has(input[type=text]:disabled, input[type=password]:disabled) > span {
  color: var(--pg-mid-accent);
  border-color: transparent;
}
`