const fileRegex = /\.scss$/
import { render } from "@lit-labs/ssr"
import {
  collectResult,
  collectResultSync,
} from "@lit-labs/ssr/lib/render-result"
import { html as lit_html } from "lit"

import { decode } from "html-entities"
import "./src/lib/pg-button/pg-button"

import buttons from "./src/main"

import convert from "./convert-scss"
import type { Plugin } from "vite"

export function litConvertScss(): Plugin {
  return {
    name: "html-lit-convert-scss",
    config() {
      convert()
    },
    handleHotUpdate({ modules }) {
      const needsUpdate = modules.some(module => {
        if (!module.file) return
        return module.file.match(fileRegex)
      })
      if (needsUpdate) {
        convert()
      }
    },
  }
}

export function litShell() {
  return {
    name: "html-lit-shell",
    async transformIndexHtml(html) {
      // match for body opening and closing tags
      const bodyRegex = /<body[^>]*>([\s\S]*)<\/body>/

      const res = render(buttons)
      // insert buttons into body
      let outHtml = decode(await collectResult(res))
      // replace body with buttons
      outHtml = html.replace(bodyRegex, `<body>${outHtml}</body>`)
      return outHtml
    },
    order: "post",
  }
}
