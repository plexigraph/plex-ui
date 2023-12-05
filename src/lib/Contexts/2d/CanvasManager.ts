export type RemoveCanvas = () => void
export type InitCanvas = (
  parent: HTMLElement,
  afterResize: () => void
) => RemoveCanvas

export type CanvasManager = {
  getContext(zIndex: number): CanvasRenderingContext2D
  addCanvas(zIndex: number): InitCanvas
  saveContexts(): void
  translateAndScaleContexts(scalePos: {
    scale: number
    pos: { x: number; y: number }
  }): void
  restoreContexts(): void
  clearContexts(): void
}

type CanvasInfo = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export function createCanvasManager() {
  const canvases: Record<number, CanvasInfo> = {}
  const zIndices: number[] = []

  function setSizes(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    parent: HTMLElement,
    afterResize: () => void
  ) {
    canvas.width = parent.clientWidth * devicePixelRatio
    canvas.height = parent.clientHeight * devicePixelRatio
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    ctx.scale(devicePixelRatio, devicePixelRatio)

    afterResize()
  }
  return {
    addCanvas(zIndex: number) {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      canvas.style.position = "absolute"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.style.zIndex = zIndex.toString()
      canvas.style.pointerEvents = "none"
      canvases[zIndex] = {
        canvas,
        ctx,
      }
      zIndices.push(zIndex)
      zIndices.sort((a, b) => a - b)
      return (parent: HTMLElement, afterResize: () => void = () => {}) => {
        parent.appendChild(canvas)
        setSizes(ctx, canvas, parent, afterResize)
        // listen for parent resize
        const observer = new ResizeObserver(() => {
          setSizes(ctx, canvas, parent, afterResize)
        })
        observer.observe(parent)
        // listen for window resize for zoom
        function onResize() {
          setSizes(ctx, canvas, parent, afterResize)
        }
        window.addEventListener("resize", onResize)
        return () => {
          delete canvases[zIndex]
          zIndices.splice(zIndices.indexOf(zIndex), 1)
          observer.disconnect()
          window.removeEventListener("resize", onResize)
        }
      }
    },
    getContext(zIndex: number) {
      // find the zIndex that is lower than the requested zIndex
      let i = 0
      while (zIndices[i] < zIndex) i++
      if (zIndices[i] !== zIndex) i--
      zIndex = zIndices[i]
      return canvases[zIndex].ctx
    },
    saveContexts() {
      const out: Record<number, CanvasRenderingContext2D> = {}
      for (const zIndex in canvases) {
        canvases[zIndex].ctx.save()
      }
      return out
    },
    clearContexts() {
      for (const zIndex in canvases) {
        canvases[zIndex].ctx.clearRect(
          0,
          0,
          canvases[zIndex].canvas.width,
          canvases[zIndex].canvas.height
        )
      }
    },
    translateAndScaleContexts(scalePos: {
      scale: number
      pos: { x: number; y: number }
    }) {
      const { scale, pos } = scalePos
      for (const zIndex in canvases) {
        canvases[zIndex].ctx.translate(pos.x, pos.y)
        canvases[zIndex].ctx.scale(scale, scale)
      }
    },
    restoreContexts() {
      for (const zIndex in canvases) {
        canvases[zIndex].ctx.restore()
      }
    },
  }
}
