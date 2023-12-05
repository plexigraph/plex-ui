import { type Context2D } from "@lib/Contexts"
import { mergeDictTrees } from "@lib/Utils"
import { Signal, signal } from "@lit-labs/preact-signals"

const defaultValues = {
  disabled: false,
  active: false,
  hovered: false,
  focused: false,
  invalid: false,
  pointerX: 0,
  pointerY: 0,
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
      }
    }
    const onSchemeChange = () => {
      setTimeout(() => {
        setColors()
      }, 0)
    }
    setColors()
    const unsubscribeMethods = new Set<() => void>()
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
    const onClick = (e: MouseEvent) => {
      if (out.disabled.value) return
      setPointerPos(e)
      out.active.value = true
      clearTimeout(clickTimeout)
      clickTimeout = setTimeout(() => {
        out.active.value = false
        clickTimeout = undefined
      }, 200)
    }
    pElem.addEventListener("pointerenter", onEnter)
    pElem.addEventListener("pointerleave", onLeave)
    pElem.addEventListener("pointermove", onMove)
    pElem.addEventListener("click", onClick)
    unsubscribeMethods.add(() => {
      pElem.removeEventListener("pointerenter", onEnter)
      pElem.removeEventListener("pointerleave", onLeave)
      pElem.removeEventListener("pointermove", onMove)
      pElem.removeEventListener("click", onClick)
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
    unsubscribeMethods.add(() => {
      observer.disconnect()
    })

    const onFocused = () => {
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
      for (const method of unsubscribeMethods) {
        method()
      }
    }
    out.unsubscribe = unsubscribe
  }
  return out
}
