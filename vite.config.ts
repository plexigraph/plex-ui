import { defineConfig } from 'vite'
import { litShell, litConvertScss } from './vite-plugin-lit-shell'
import { compileLitTemplates } from '@lit-labs/compiler'
import typescript from '@rollup/plugin-typescript'
import brotli from 'rollup-plugin-brotli'
import { globSync } from 'glob'
import path from 'path'

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
              transformers: { before: [compileLitTemplates()] },
              outDir: 'dist',
            }),
            // brotli(),
          ]
        : [litShell(), litConvertScss(), brotli()],
    build: {
      rollupOptions: {
        input: Object.fromEntries(
          [
            ...globSync('src/**/pg-*.ts'),
            ...globSync('src/styles/**/*.scss'),
          ].map((file) => {
            const out = path.relative('src', file.slice(0, -3))
            return [out, file]
          })
        ),
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
      // lib: {
      //   entry: 'src/**/*.ts',
      //   formats: ['es'],
      // },
    },
  }
})
