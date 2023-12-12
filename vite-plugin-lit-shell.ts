const fileRegex = /\.scss$/
import { render } from "@lit-labs/ssr"
import { collectResult } from "@lit-labs/ssr/lib/render-result"

import { decode } from "html-entities"
import "./src/lib/pg-button/pg-button"

import main from "./src/main"

import convert from "./convert-scss"
import type { Plugin } from "vite"

export function litConvertScss(): Plugin {
  return {
    name: "html-lit-convert-scss",
    config() {
      convert()
    },
    handleHotUpdate({ file, modules }) {
      const needsUpdate = !!file.match(fileRegex)
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

      const res = render(main)
      // insert buttons into body
      let outHtml = decode(await collectResult(res))
      // replace body with buttons
      outHtml = html.replace(bodyRegex, `<body>${outHtml}</body>`)
      return outHtml
    },
    order: "post",
  }
}
