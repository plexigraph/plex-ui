import { css } from "lit"
export default css` pg-radio-inner label{--color: var(--pg-fg-accent);--size: 16px;display:flex;padding:8px;align-items:center;border-radius:8px;gap:8px;width:100%;color:var(--color);position:relative}pg-radio-inner input{height:calc(var(--size) - 4px);width:calc(var(--size) - 4px);margin:2px;position:relative}pg-radio-inner input::before{content:"";display:inline-block;position:absolute;top:-2px;left:-2px;width:var(--size);height:var(--size);border-radius:50%;border:2px solid var(--color);background-color:var(--pg-bg);transition:background-color .2s ease}pg-radio-inner input::after{content:"";display:inline-block;position:absolute;width:calc(var(--size) - 4px);height:calc(var(--size) - 4px);border-radius:50%;background-color:var(--color);transform-origin:50% 50%;transform:scale(0);transition:transform .2s ease,background-color .2s ease}pg-radio-inner input:focus-visible::before{outline:4px solid var(--pg-cursor);transition:background-color .2s ease,outline-width .2s cubic-bezier(0, 0, 0.5, 3)}@media(hover: hover){pg-radio-inner input:hover::after{transform:scale(0.33)}pg-radio-inner input:hover:checked::after{background-color:var(--pg-fg-mid)}pg-radio-inner input:hover:checked:disabled::after{background-color:var(--color)}}pg-radio-inner input:checked::after{transform:scale(1);background:var(--color)}pg-radio-inner label:has(input:disabled){background-color:var(--pg-bg);--color: var(--pg-bg-mid)}pg-radio-inner input:disabled:hover::after{transform:scale(0)}pg-radio-inner input:disabled:hover:checked::after{transform:scale(1)}pg-radio-inner label:has(input:invalid),pg-radio-inner.error label{--pg-fg: var(--pg-error-fg);--pg-fg-accent: var(--pg-error-fg-accent);--pg-fg-mid: var(--pg-error-mid);--pg-bg-mid: var(--pg-error-mid-accent);--pg-bg-accent: var(--pg-error-bg-accent);--pg-bg: var(--pg-error-bg);--pg-cursor: var(--pg-fg-mid);padding-top:0px;padding-bottom:16px}pg-radio-inner label:has(input:invalid)::after,pg-radio-inner.error label::after{content:var(--validity, "is required.");position:absolute;bottom:0;left:calc(var(--size)*2);font-size:12px}pg-radio-inner label:has(input:invalid:checked)::after,pg-radio-inner.error label::after{content:var(--validity, "should be unchecked.")}`