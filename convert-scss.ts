import * as sass from "sass"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const convert = async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url))

  const srcPath = path.resolve(__dirname, "./src")

  const scssFiles = fs
    .readdirSync(srcPath, {
      recursive: true,
      withFileTypes: true,
    })
    .filter(file => {
      return file.isFile() && file.name.endsWith(".scss")
    })

  const scssFileNames = scssFiles.map(file => {
    return file.name.replace(".scss", "")
  })

  const scssFileContents = scssFiles.map(file => {
    return fs.readFileSync(path.resolve(file.path, file.name), "utf-8")
  })

  const cssFileContents = scssFileContents.map(content => {
    return sass.compileStringAsync(content, {
      loadPaths: scssFiles.map(file => {
        return file.path
      }),
      style: "compressed",
    })
  })

  const cssFileNames = scssFileNames.map(name => {
    return `${name}.css`
  })

  // write css files back to src
  scssFileNames.forEach(async (name, i) => {
    const cssFileName = cssFileNames[i]
    const cssFileDir = scssFiles[i].path
    let cssFileContent
    try {
      cssFileContent = (await cssFileContents[i]).css.toString()
    } catch (e) {
      console.log(e)
      return
    }
    const jsString = `import { css } from "lit"
export default css\`
${cssFileContent}
\``
    // diff the old and new files
    // if they're different, write the new file
    // if they're the same, do nothing
    // if old file doesn't exist, write the new file
    if (!fs.existsSync(path.resolve(cssFileDir, cssFileName + ".ts"))) {
      fs.writeFileSync(path.resolve(cssFileDir, cssFileName + ".ts"), jsString)
      return
    }
    const oldFile = fs.readFileSync(
      path.resolve(cssFileDir, cssFileName + ".ts"),
      "utf-8"
    )
    if (oldFile === jsString) return
    fs.writeFileSync(path.resolve(cssFileDir, cssFileName + ".ts"), jsString)
  })
}

export default convert
