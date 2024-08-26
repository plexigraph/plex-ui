import {
  argbFromHex,
  Hct,
  hexFromArgb,
} from '@material/material-color-utilities'

const generatePalette = (hex, name) => {
  const argb = argbFromHex(hex)
  const original = Hct.fromInt(argb)
  const hct = Hct.fromInt(argb)
  // change the tones from 0 to 1 at 0.1 steps
  const tones = Array.from(Array(9).keys()).map((i) => (i + 1) * 10)
  tones.unshift(5)
  tones.unshift(2)
  tones.unshift(1)

  tones.push(95)
  tones.push(98)
  tones.push(99)
  // save the hex values for each chroma
  const palette = tones.map((tone) => {
    hct.tone = original.tone
    hct.chroma = original.chroma
    hct.hue = original.hue
    hct.tone = tone
    return hct.toInt()
  })
  let colors = palette.map((color) => hexFromArgb(color))
  // map colors to dict
  let paletteDict = {}
  for (let i = 0; i < colors.length; i++) {
    paletteDict[`${name}-${tones[i]}`] = colors[i]
  }
  return paletteDict
}

const paletteDictToList = (dict) => {
  let list = []
  for (let key in dict) {
    list.push({ name: key, color: dict[key] })
  }
  return list
}

const generateGrayPalette = (from, to, chroma) => {
  const fromArgb = argbFromHex(from)
  const toArgb = argbFromHex(to)
  const tones = Array.from(Array(9).keys()).map((i) => (i + 1) * 10)
  tones.unshift(5)
  tones.unshift(2)
  tones.unshift(1)

  tones.push(95)
  tones.push(98)
  tones.push(99)
  // save the hex values for each chroma
  const palette = tones.map((tone) => {
    const fromHct = Hct.fromInt(fromArgb)
    const toHct = Hct.fromInt(toArgb)
    const blend = Hct.fromInt(fromArgb)
    blend.hue = fromHct.hue + ((toHct.hue - fromHct.hue) * tone) / 100
    blend.chroma = chroma
    blend.tone = tone
    return blend.toInt()
  })
  let colors = palette.map((color) => hexFromArgb(color))
  // map colors to dict
  let paletteDict = {}
  for (let i = 0; i < colors.length; i++) {
    paletteDict['gray-' + tones[i]] = colors[i]
  }
  return paletteDict
}

const green = generatePalette('#6E9D87', 'seafoam')
const purple = generatePalette('#645CEE', 'violet')
const yellow = generatePalette('#CE9409', 'gold')
const fire = generatePalette('#CE5509', 'fire')
const rose = generatePalette('#db8d7f', 'rose')
const gray = generateGrayPalette('#6E9D87', '#fbbc3b', 4)

const colors = {
  ...green,
  ...purple,
  ...yellow,
  ...gray,
}

const paletteImport = [
  {
    paletteName: 'seafoam',
    swatches: paletteDictToList(green),
  },
  {
    paletteName: 'violet',
    swatches: paletteDictToList(purple),
  },
  {
    paletteName: 'gold',
    swatches: paletteDictToList(yellow),
  },
  {
    paletteName: 'fire',
    swatches: paletteDictToList(fire),
  },
  {
    paletteName: 'rose',
    swatches: paletteDictToList(rose),
  },
  {
    paletteName: 'gray',
    swatches: paletteDictToList(gray),
  },
]
console.log(paletteImport)
// save the palette to a file
import fs from 'fs'
import path from 'path'
const filePath = path.join('palette.json')
fs.writeFileSync(filePath, JSON.stringify(paletteImport))


// console.log(colors)
