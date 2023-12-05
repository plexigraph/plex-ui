import {
  argbFromHex,
  Hct,
  hexFromArgb,
} from "@material/material-color-utilities"
import { signal, computed } from "@lit-labs/preact-signals"
import { BROWSER } from "esm-env"

export type Color = {
  hue: number
  chroma: number
  tone: number
  opacity: number // 0-1
}

export function colorToHex(color: Color): string {
  const hct = Hct.from(color.hue, color.chroma, color.tone)
  const argb = hct.toInt()
  const hex = hexFromArgb(argb)
  return hex
}

export function colorFromHex(hex: string): Color {
  // get whether light or dark mode is active
  const scheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  if (hex === "")
    return { hue: 288, chroma: 50, tone: scheme ? 0 : 100, opacity: 0 }
  if (hex === "transparent")
    return { hue: 288, chroma: 50, tone: scheme ? 0 : 100, opacity: 0 }
  // get the opacity if length is 8
  let opacity = 1
  if (hex.length === 9) {
    const opacityHex = hex.slice(-2)
    hex = hex.slice(0, -2)
    opacity = parseInt(opacityHex, 16) / 255
  }
  const argb = argbFromHex(hex)
  const hct = Hct.fromInt(argb)
  const { hue, chroma, tone } = hct
  return { hue, chroma, tone, opacity }
}

export function getCssVariableColor(color: string): string {
  if (!BROWSER) return "#f00"
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--${color}`
  )
}

function readable<T>(initial: T, setter: (set: (value: T) => void) => void) {
  const sig = signal(initial)
  const set = (value: T) => (sig.value = value)
  setter(set)
  return computed(() => sig.value)
}

export function getCssSignalColor(color: string, element?: HTMLElement) {
  if (!BROWSER) return signal(colorFromHex("#f00"))
  const elem = element || document.documentElement
  const computedColor = colorFromHex(
    getComputedStyle(elem).getPropertyValue(`--pg-${color}`)
  )
  return readable(computedColor, set => {
    function update() {
      const replacementColor = getComputedStyle(elem).getPropertyValue(
        `--pg-${color}`
      )
      const computedColor = colorFromHex(replacementColor)
      set(computedColor)
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(elem, { attributes: true, attributeFilter: ["style"] })
    // detect when prefers-color-scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", update)
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener("change", update)
    }
  })
}

export const COLORS = {
  ACCENT_FG: getCssSignalColor("accent-fg"),
  ACCENT_FG_ACCENT: getCssSignalColor("accent-fg-accent"),
  ACCENT_MID: getCssSignalColor("accent-mid"),
  ACCENT_MID_ACCENT: getCssSignalColor("accent-mid-accent"),
  ACCENT_BG_ACCENT: getCssSignalColor("accent-bg-accent"),
  ACCENT_BG: getCssSignalColor("accent-bg"),

  NEUTRAL_FG: getCssSignalColor("neutral-fg"),
  NEUTRAL_FG_ACCENT: getCssSignalColor("neutral-fg-accent"),
  NEUTRAL_MID: getCssSignalColor("neutral-mid"),
  NEUTRAL_MID_ACCENT: getCssSignalColor("neutral-mid-accent"),
  NEUTRAL_BG_ACCENT: getCssSignalColor("neutral-bg-accent"),
  NEUTRAL_BG: getCssSignalColor("neutral-bg"),

  ERROR_FG: getCssSignalColor("error-fg"),
  ERROR_FG_ACCENT: getCssSignalColor("error-fg-accent"),
  ERROR_MID: getCssSignalColor("error-mid"),
  ERROR_MID_ACCENT: getCssSignalColor("error-mid-accent"),
  ERROR_BG_ACCENT: getCssSignalColor("error-bg-accent"),
  ERROR_BG: getCssSignalColor("error-bg"),

  WARNING_FG: getCssSignalColor("warning-fg"),
  WARNING_FG_ACCENT: getCssSignalColor("warning-fg-accent"),
  WARNING_MID: getCssSignalColor("warning-mid"),
  WARNING_MID_ACCENT: getCssSignalColor("warning-mid-accent"),
  WARNING_BG_ACCENT: getCssSignalColor("warning-bg-accent"),
  WARNING_BG: getCssSignalColor("warning-bg"),

  SUCCESS_FG: getCssSignalColor("success-fg"),
  SUCCESS_FG_ACCENT: getCssSignalColor("success-fg-accent"),
  SUCCESS_MID: getCssSignalColor("success-mid"),
  SUCCESS_MID_ACCENT: getCssSignalColor("success-mid-accent"),
  SUCCESS_BG_ACCENT: getCssSignalColor("success-bg-accent"),
  SUCCESS_BG: getCssSignalColor("success-bg"),
}
