import { defineConfig } from "vite"
import { litShell, litConvertScss } from "./vite-plugin-lit-shell"
export default defineConfig({
  resolve: {
    alias: {
      "@lib": "/src/lib",
    },
  },
  plugins: [litShell(), litConvertScss()],
})
