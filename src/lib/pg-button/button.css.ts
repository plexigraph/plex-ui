import { css } from "lit"
export default css` pg-button-inner{display:contents}pg-button-inner button,pg-button-inner a{min-width:fit-content;text-wrap:nowrap;outline:2px solid var(--pg-fg-accent);outline-offset:-1px;background-color:var(--pg-bg);color:var(--pg-fg-accent);border-radius:20px;border:none;padding:0 12px;height:32px;margin:16px;display:inline-block;font-size:16px;display:inline-flex;align-items:center;justify-content:center;transition:background-color var(--color-transition-speed),color var(--color-transition-speed),outline var(--size-transition-speed),border-radius var(--size-transition-speed);-webkit-tap-highlight-color:rgba(0,0,0,0)}pg-button-inner a{text-decoration:none}pg-button-inner button.outlined,pg-button-inner a.outlined{background-color:rgba(0,0,0,0);outline-color:var(--pg-fg);color:var(--pg-fg)}pg-button-inner button.inset,pg-button-inner a.inset{background-color:var(--pg-bg);outline-color:rgba(0,0,0,0)}pg-button-inner button.text,pg-button-inner a.text{background-color:rgba(0,0,0,0);outline-color:rgba(0,0,0,0)}pg-button-inner button.filled,pg-button-inner a.filled{--pg-cursor: var(--pg-bg-mid);background-color:var(--pg-fg);outline-color:rgba(0,0,0,0);color:var(--pg-bg)}@media(hover: hover){pg-button-inner button.filled:hover,pg-button-inner a.filled:hover{background-color:var(--pg-fg-accent)}}pg-button-inner button.filled:active,pg-button-inner button.filled.active,pg-button-inner a.filled:active,pg-button-inner a.filled.active{background-color:var(--pg-fg-mid);color:var(--pg-bg)}@media(hover: hover){pg-button-inner button.outlined:hover,pg-button-inner a.outlined:hover,pg-button-inner button.text:hover,pg-button-inner a.text:hover{background-color:var(--pg-bg)}}pg-button-inner button.outlined:active,pg-button-inner a.outlined,pg-button-inner button.outlined.active,pg-button-inner a.outlined.active,pg-button-inner button.text:active,pg-button-inner a.text:active,pg-button-inner button.text.active,pg-button-inner a.text.active{background-color:var(--pg-bg-accent)}pg-button-inner button.full,pg-button-inner a.full{width:calc(100% - 32px)}pg-button-inner button.normal,pg-button-inner a.normal{width:256px}pg-button-inner button.icon,pg-button-inner a.icon{width:32px}pg-button-inner button:focus-visible,pg-button-inner a:focus-visible{outline:4px solid var(--pg-cursor);transition:background-color var(--color-transition-speed),color var(--color-transition-speed),outline var(--size-transition-speed),border-radius var(--size-transition-speed),outline-width .2s cubic-bezier(0, 0, 0.5, 3)}@media(hover: hover){pg-button-inner button:hover,pg-button-inner a:hover{background-color:var(--pg-bg-accent)}}pg-button-inner button:active,pg-button-inner button.active,pg-button-inner a:active,pg-button-inner a.active{background-color:var(--pg-bg-mid);color:var(--pg-fg)}pg-button-inner button:disabled,pg-button-inner button:disabled:hover,pg-button-inner button:disabled:active,pg-button-inner button:disabled.active,pg-button-inner a:disabled{border-color:var(--pg-bg);outline-color:var(--pg-bg);background-color:var(--pg-bg);color:var(--pg-bg-mid);border-radius:4px}`