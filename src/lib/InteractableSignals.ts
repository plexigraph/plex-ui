import { type Context2D } from "../lib/Contexts"
import { Signal, signal } from "@lit-labs/preact-signals"

const defaultValues = {
  disabled: false,
  active: false,
  hovered: false,
  focused: false,
  invalid: false,
  pointerX: 0,
  pointerY: 0,
  clickedX: undefined as number | undefined,
  clickedY: undefined as number | undefined,
  width: 0,
  height: 0,
  ctx: undefined as Context2D | undefined,
  colors: {
    foreground: "#000",
    foregroundAccent: "#333",
    mid: "#aaa",
    midAccent: "#666",
    backgroundAccent: "#ccc",
    background: "#fff",
    cursor: "#aaa",
  },
}

type Signals = typeof defaultValues

type SignalWrapper<T> = {
  [K in keyof T]: Signal<T[K]>
}

export type InteractableSignals = SignalWrapper<Signals> & {
  unsubscribe: () => void
  initialize: (
    elem: HTMLElement,
    parentContext: Context2D,
    pointerElem?: HTMLElement
  ) => void
}

export function getInteractableSignals(): InteractableSignals {
  const out = {} as InteractableSignals
  for (const key in defaultValues) {
    const value = defaultValues[key as keyof Signals]
    const s = signal(value)
    out[key as keyof Signals] = s as never
  }
  out.unsubscribe = () => {}
  out.initialize = (
    elem: HTMLElement,
    parentContext: Context2D,
    pointerElem?: HTMLElement
  ) => {
    // unsubscribe from previous
    out.unsubscribe()
    const unsubscribeMethods = new Set<() => void>()
    const pElem = pointerElem || elem
    const setPointerPos = (e: MouseEvent) => {
      const rect = elem.getBoundingClientRect()
      if (e.clientX === 0 && e.clientY === 0) {
        if (out.hovered.value) {
          return
        }
        out.pointerX.value = rect.width / 2
        out.pointerY.value = rect.height / 2
        return
      }
      out.pointerX.value = e.clientX - rect.left
      out.pointerY.value = e.clientY - rect.top
    }
    const setColors = () => {
      const styles = window.getComputedStyle(elem)
      out.colors.value = {
        foreground: styles.getPropertyValue("--pg-fg"),
        foregroundAccent: styles.getPropertyValue("--pg-fg-accent"),
        mid: styles.getPropertyValue("--pg-mid"),
        midAccent: styles.getPropertyValue("--pg-mid-accent"),
        backgroundAccent: styles.getPropertyValue("--pg-bg-accent"),
        background: styles.getPropertyValue("--pg-bg"),
        cursor: styles.getPropertyValue("--pg-cursor"),
      }
    }
    const onSchemeChange = () => {
      setTimeout(() => {
        setColors()
      }, 0)
    }
    setColors()
    const matched = window.matchMedia("(prefers-color-scheme: dark)")
    matched.addEventListener("change", onSchemeChange)
    unsubscribeMethods.add(() => {
      matched.removeEventListener("change", onSchemeChange)
    })
    elem.classList.add("pg-interactable")

    const onAnimStart = () => {
      if (elem.matches(":active") && !out.disabled.value) {
        out.active.value = true
      } else {
        if (clickTimeout) return
        out.active.value = false
      }
    }
    elem.addEventListener("animationstart", onAnimStart)
    unsubscribeMethods.add(() => {
      elem.removeEventListener("animationstart", onAnimStart)
    })
    const onEnter = (e: PointerEvent) => {
      out.hovered.value = true
      setPointerPos(e)
    }
    const onLeave = (e: PointerEvent) => {
      out.hovered.value = false
      setPointerPos(e)
    }
    const onMove = (e: PointerEvent) => {
      setPointerPos(e)
    }
    let clickTimeout: NodeJS.Timeout | undefined = undefined
    let downAt: number | undefined = undefined
    const onClick = (e: MouseEvent) => {
      setColors()
      setPointerPos(e)
      out.active.value = true
      clearTimeout(clickTimeout)
      out.clickedX.value = out.pointerX.value
      out.clickedY.value = out.pointerY.value
      if (!downAt) {
        downAt = performance.now()
      }
      const timeDiff = performance.now() - downAt
      if (timeDiff < 200) {
        clickTimeout = setTimeout(() => {
          out.active.value = false
          clickTimeout = undefined
        }, 200 - timeDiff)
      }
      downAt = undefined
    }
    const onPointerDown = (e: PointerEvent) => {
      if (out.disabled.value) return
      setColors()
      setPointerPos(e)
      out.active.value = true
      downAt = performance.now()
    }
    const onPointerUp = (e: PointerEvent) => {
      if (out.disabled.value) return
      setColors()
      setPointerPos(e)
      out.active.value = false
      downAt = undefined
    }
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        out.active.value = true
      }
      if (e.key === " ") {
        out.active.value = true
      }
    }
    pElem.addEventListener("pointerenter", onEnter)
    pElem.addEventListener("pointerleave", onLeave)
    pElem.addEventListener("pointermove", onMove)
    pElem.addEventListener("click", onClick)
    pElem.addEventListener("pointerdown", onPointerDown)
    pElem.addEventListener("pointerup", onPointerUp)
    pElem.addEventListener("keydown", onKeydown)
    unsubscribeMethods.add(() => {
      pElem.removeEventListener("pointerenter", onEnter)
      pElem.removeEventListener("pointerleave", onLeave)
      pElem.removeEventListener("pointermove", onMove)
      pElem.removeEventListener("click", onClick)
      pElem.removeEventListener("pointerdown", onPointerDown)
      pElem.removeEventListener("pointerup", onPointerUp)
      pElem.removeEventListener("keydown", onKeydown)
    })

    const rect = elem.getBoundingClientRect()
    out.pointerX.value = rect.width / 2
    out.pointerY.value = rect.height / 2

    // listen for disabled attribute change
    const observer = new MutationObserver(mutations => {
      setColors()
      mutations.forEach(mutation => {
        if (mutation.attributeName === "disabled") {
          out.disabled.value = elem.hasAttribute("disabled")
        }
      })
    })
    observer.observe(elem, { attributes: true })
    console.log(elem)
    out.disabled.value = elem.hasAttribute("disabled")
    unsubscribeMethods.add(() => {
      observer.disconnect()
    })

    const onFocused = () => {
      if (!out.hovered.value) {
        setPointerPos({ clientX: 0, clientY: 0 } as any)
      }
      out.focused.value = true
      setColors()
    }
    const onBlurred = () => {
      out.focused.value = false
      setColors()
    }
    // listen for focus
    elem.addEventListener("focus", onFocused)
    elem.addEventListener("blur", onBlurred)
    unsubscribeMethods.add(() => {
      elem.removeEventListener("focus", onFocused)
      elem.removeEventListener("blur", onBlurred)
    })
    // add resize observer
    out.ctx.value = parentContext.addChild(0, 0, 1).ctx
    const resizeObserver = new ResizeObserver(() => {
      if (!out.ctx.value) return
      out.width.value = pElem.offsetWidth
      out.height.value = pElem.offsetHeight
      const offset = pElem.getBoundingClientRect()
      const windowOffset =
        out.ctx.value.canvasCtx.canvas.getBoundingClientRect()
      const x = offset.x - windowOffset.x + offset.width / 2
      const y = offset.y - windowOffset.y + offset.height / 2
      out.ctx.value.setPos(x, y)
      setColors()
    })
    resizeObserver.observe(elem)
    resizeObserver.observe(parentContext.canvasCtx.canvas)
    unsubscribeMethods.add(() => {
      resizeObserver.disconnect()
    })
    const unsubscribe = () => {
      unsubscribeMethods.forEach(method => method())
      unsubscribeMethods.clear()
    }
    out.unsubscribe = unsubscribe
  }
  return out
}
