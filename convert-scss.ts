import * as sass from 'sass'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

const convert = async () => {
  const srcPath = path.resolve(__dirname, './src')

  const allFiles = fs
    .readdirSync(srcPath, {
      recursive: true,
      withFileTypes: true,
    })
    .filter((file) => {
      return file.isFile()
    })

  const files = allFiles.filter(
    (file) => file.name.endsWith('.scss') || file.name.endsWith('.css')
  )

  const fileNames = files.map((file) => {
    const periodInd = file.name.lastIndexOf('.')
    return file.name.slice(0, periodInd)
  })

  const fileContents = files.map((file) => {
    return fs.readFileSync(path.resolve(file.path, file.name), 'utf-8')
  })

  const convertedContents = fileContents.map((content) => {
    return sass.compileStringAsync(content, {
      loadPaths: files.map((file) => {
        return file.path
      }),
      style: 'compressed',
    })
  })

  const tsCssFileNames = fileNames.map((name) => {
    return `${name}.css.ts`
  })

  // write css files back to src
  tsCssFileNames.forEach(async (outfileName, i) => {
    const cssFileDir = files[i].path
    let cssFileContent
    try {
      cssFileContent = (await convertedContents[i]).css.toString()
      // remove first character if it is U+feff
      if (cssFileContent.charCodeAt(0) === 0xfeff) {
        cssFileContent = cssFileContent.slice(1)
      }
    } catch (e) {
      console.error(e)
      return
    }
    const jsString = ` // auto-generated file from ./${fileNames[i]}.scss DO NOT EDIT
import { css } from "lit"
export default css\` ${cssFileContent}\``
    // diff the old and new files
    // if they're different, write the new file
    // if they're the same, do nothing
    // if old file doesn't exist, write the new file
    if (!fs.existsSync(path.resolve(cssFileDir, outfileName))) {
      fs.writeFileSync(path.resolve(cssFileDir, outfileName), jsString)
      return
    }
    const oldFile = fs.readFileSync(
      path.resolve(cssFileDir, outfileName),
      'utf-8'
    )
    if (oldFile === jsString) return
    fs.writeFileSync(path.resolve(cssFileDir, outfileName), jsString)
  })
}

export default convert

convert()
