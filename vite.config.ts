import { defineConfig } from 'vite'
import { litShell, litConvertScss } from './vite-plugin-lit-shell'
import { compileLitTemplates } from '@lit-labs/compiler'
import typescript from '@rollup/plugin-typescript'
import brotli from 'rollup-plugin-brotli'

export default defineConfig(({ mode }) => {
  return {
    plugins:
      mode != 'development'
        ? [
            // typescript({
            //   transformers: { before: [compileLitTemplates()] },
            // }), // -- support for lit with vite is spotty
            litShell(),
            litConvertScss(),
            typescript({
              outDir: 'dist',
            }),
            brotli(),
          ]
        : [
            litShell(),
            litConvertScss(),
            brotli(),
          ],
    build: {
      lib: {
        entry: 'src/all-components.ts',
        formats: ['es'],
      },
    },
  }
})
