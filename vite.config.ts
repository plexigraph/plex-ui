import { defineConfig } from 'vite'
import { litShell, litConvertScss } from './vite-plugin-lit-shell'
import { compileLitTemplates } from '@lit-labs/compiler'
import typescript from '@rollup/plugin-typescript'
import brotli from 'rollup-plugin-brotli'
export default defineConfig({
  resolve: {
    alias: {
      '@lib': '/src/lib',
    },
  },
  plugins: [
    // typescript({
    //   transformers: { before: [compileLitTemplates()] },
    // }), // -- support for lit with vite is spotty
    litShell(),
    litConvertScss(),
    brotli(),
  ],
})
