import { COLORS, Color, sleep } from "../Utils"
import { ReadonlySignal, computed, signal } from "@lit-labs/preact-signals"

export type Aurora = {
  signal: ReadonlySignal<Color>
  pause: () => void
  resume: () => void
  unsubscribe: () => void
  paused: boolean
}

export function getAuroraSignal(delay = 1.3, initialDelay = 0.6) {
  const { NEUTRAL_BG_ACCENT } = COLORS
  const s = signal(NEUTRAL_BG_ACCENT.value)
  let i = 1
  // check if dark mode
  let interval: NodeJS.Timeout | undefined = undefined
  let timeout: NodeJS.Timeout | undefined = undefined
  const hueRange = [152, 330]
  const stepCount = 20
  const diff = Math.abs(hueRange[1] - hueRange[0])
  const stepAmount = diff / stepCount
  const onInterval = async () => {
    i = (i + 5) % stepCount
    // i = (i + 2 + Math.floor(Math.random() * 3)) % (stepCount + 5)
    // const forwardOrBack = Math.random() > 0.5 ? 1 : -1
    const forwardOrBack = 1
    for (let j = 0; j < 2; j++) {
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      s.value = {
        hue: hueRange[0] + (i + j * forwardOrBack * 5) * stepAmount,
        chroma: darkMode ? 100 - j * 75 : 60 - j * 35,
        tone: darkMode ? 40 - j * 10 : 60 + j * 10,
        opacity: 1,
      }
      await sleep(0.2)
    }
    s.value = NEUTRAL_BG_ACCENT.value
  }
  const out = computed(() => s.value)
  const outDict = {
    signal: out,
    pause: () => {
      if (outDict.paused) return // NO OP
      outDict.paused = true
      if (interval) clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    },
    resume: () => {
      if (!outDict.paused) return // NO OP
      outDict.paused = false
      s.value = NEUTRAL_BG_ACCENT.value
      timeout = setTimeout(() => {
        interval = setInterval(onInterval, delay * 1000)
        onInterval()
      }, 1000 * initialDelay)
    },
    unsubscribe: () => {
      if (interval) clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    },
    paused: true,
  }
  outDict.resume()
  return outDict
}
