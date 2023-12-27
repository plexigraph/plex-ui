import {
  addObjectWithZIndex,
  type ContextWrapper,
  type DrawableObject,
} from '../../../lib/Contexts/context'
import { newVec2, type Vec2 } from '../../../lib/Utils/vec2'
import {
  type Animatable,
  modifyTo,
  updateAnimationInfo,
  changeInterpFunction,
  modifyAnimationBounds,
  type AnimatableEvents,
  getCurrentStateWithChildren,
  addListener,
  removeListener,
  type RecursiveAnimatable,
  addRecursiveStartListener,
  createAnimationInfo,
} from '../Animate/Animatable'
import type { DrawableShape } from '../DrawableShape'
import { NO_INTERP, type Interp } from '../Animate/Interp'
import {
  CanvasManager,
  createCanvasManager,
  InitCanvas,
  RemoveCanvas,
} from './CanvasManager'

export type HasZIndex = { zIndex: number }

export type HasColor = { color: string }

export type HasInterp = { interp: Interp }

export type Context2D = Readonly<{
  canvasManager: CanvasManager
  setScale: (scale: number) => void
  setPos: (x: number, y: number) => void
  setPosToVec: (pos: Vec2) => void
  setPosBounds: (lower: Vec2, upper: Vec2) => void
  setScaleBounds: (lower: number, upper: number) => void
  setPosInterp: (interp: Interp) => void
  getScale: () => number
  getPos: () => Vec2
  delete: () => void
  addShape: (
    shape: DrawableShape<RecursiveAnimatable<unknown>> & Deletable,
    zIndex: number
  ) => void
  addChild: (
    x: number,
    y: number,
    scale: number
  ) => ContextWrapper<Context2D> & DrawableShape<ScalePos> & Deletable
  adoptChild: (child: ReturnType<typeof createContext2D>) => void
  removeChild: (child: Deletable) => void
  setInterp: (interp: Interp) => void
  addScaleListener: (
    type: AnimatableEvents,
    listener: (newValue: Partial<Scale>) => boolean | void
  ) => void
  removeScaleListener: (
    type: AnimatableEvents,
    listener: (newValue: Partial<Scale>) => boolean | void
  ) => void
  addPosListener: (
    type: AnimatableEvents,
    listener: (newValue: Partial<Vec2>) => boolean | void
  ) => void
  removePosListener: (
    type: AnimatableEvents,
    listener: (newValue: Partial<Vec2>) => boolean | void
  ) => void
}> &
  ScalePos & {
    canvasCtx: CanvasRenderingContext2D // either background or foreground
  }

export type Scale = { scale: number }
export type ScalePos = Scale & { pos: Vec2 }

export type Deletable = { delete: () => void }

export function createContext2D(
  parent?: Context2D
): ContextWrapper<Context2D> & DrawableShape<ScalePos> & Deletable {
  let { canvasManager: parentCanvasManager } = parent || {
    canvasManager: null,
  }
  const animationInfo = createAnimationInfo<ScalePos>(
    {
      scale: 1,
      pos: newVec2(0, 0),
    },
    NO_INTERP // TODO: make this configurable
  )
  let canvasManager: CanvasManager
  const initFuncs: InitCanvas[] = []
  let deleteFuncs: RemoveCanvas[]
  if (parentCanvasManager) {
    canvasManager = parentCanvasManager
  } else {
    //create a canvas element
    canvasManager = createCanvasManager()
    initFuncs.push(canvasManager.addCanvas(1))
    initFuncs.push(canvasManager.addCanvas(-1))
  }
  const keysInObjects: number[] = []
  type extendedAnimatable = unknown extends Animatable ? Animatable : never
  const restartListeners = new Set<() => void>()

  function restartListener() {
    restartListeners.forEach((listener) => listener())
  }
  const out: ContextWrapper<Context2D> & {
    objects: {
      [zIndex: number]: Set<DrawableObject<extendedAnimatable> & Deletable>
    }
  } & DrawableShape<ScalePos> &
    Deletable = {
    animationInfo,
    needsUpdate: false,
    objects: { 0: new Set() },
    ctx: {
      pos: newVec2(0, 0),
      scale: 1,
      canvasCtx: canvasManager.getContext(0),
      canvasManager,
      addScaleListener: function (type, listener) {
        addListener(animationInfo, type, listener)
      },
      removeScaleListener: function (type, listener) {
        removeListener(animationInfo, type, listener)
      },
      removePosListener: function (type, listener) {
        removeListener(animationInfo.children.pos, type, listener)
      },
      addPosListener: function (type, listener) {
        addListener(animationInfo.children.pos, type, listener)
      },
      setPosBounds(lower, upper) {
        modifyAnimationBounds<Vec2>(animationInfo.children.pos, {
          lower,
          upper,
        })
        restartListener()
      },
      setScaleBounds(lower, upper) {
        modifyAnimationBounds<Scale>(animationInfo, {
          lower: { scale: lower },
          upper: { scale: upper },
        })
        restartListener()
      },
      addShape<Animating extends RecursiveAnimatable<unknown>>(
        shape: DrawableShape<Animating> & Deletable,
        zIndex: number = 0
      ) {
        addObjectWithZIndex(out.objects, keysInObjects, zIndex, shape)
        addRecursiveStartListener(shape.animationInfo, () => {
          restartListener()
        })
        addListener(shape.animationInfo, 'start', () => {
          restartListener()
        })
        restartListener()
      },
      setScale: function (scale: number): void {
        out.ctx.scale = scale
        modifyTo<Scale>(animationInfo, { scale })
        restartListener()
      },
      getScale: function (): number {
        return out.ctx.scale
      },
      setPos: function (x: number, y: number): void {
        out.ctx.setPosToVec(newVec2(x, y))
      },
      setPosToVec: function (pos: Vec2): void {
        out.ctx.pos = pos
        modifyTo(animationInfo, { pos })
        if (out.animationInfo.timingFunction === NO_INTERP) {
          updateAnimationInfo(out.animationInfo, 0.99)
        }
        restartListener()
      },
      getPos: function (): Vec2 {
        return out.ctx.pos
      },
      delete: function () {
        for (const zIndex of keysInObjects) {
          if (!out.objects[zIndex]) continue
          for (const obj of out.objects[zIndex]) {
            obj.delete()
          }
        }
        out.needsUpdate = true
        out.deleteWhenDoneUpdating = true
      },
      addChild: function (x: number, y: number, scale: number) {
        const child = createContext2D(out.ctx)
        child.ctx.setScale(scale)
        child.ctx.setPos(x, y)
        out.ctx.adoptChild(child)
        return child
      },
      adoptChild: function (child: ReturnType<typeof createContext2D>) {
        child.ctx.setInterp(NO_INTERP)
        addObjectWithZIndex(
          out.objects,
          keysInObjects,
          0, // make zIndex configurable
          child
        )
        child.addRestartListener(() => {
          restartListener()
        })
        restartListener()
        return child
      },

      removeChild: function (child: Deletable) {
        child.delete()
        restartListener()
      },
      setInterp(interp: Interp): void {
        changeInterpFunction(animationInfo, interp)
        restartListener()
      },
      setPosInterp(interp: Interp): void {
        changeInterpFunction(animationInfo.children.pos, interp)
        restartListener()
      },
    },
    init: (parent) => {
      deleteFuncs = initFuncs.map((func) => {
        return func(parent, restartListener)
      })
      out.addRestartListener(() => {
        out.needsUpdate = true
      })
    },
    update(dt) {
      let draw = false
      if (updateAnimationInfo(animationInfo, dt)) {
        draw = true
      }
      // loop through the in-order keys
      for (const key of keysInObjects) {
        // loop through the objects
        for (const object of this.objects[key]) {
          if (object.needsUpdate) {
            draw = true
            object.needsUpdate = object.update(dt)
          } else if (object.deleteWhenDoneUpdating) {
            this.objects[key].delete(object)
            if (this.objects[key].size === 0) {
              delete this.objects[key]
              const keyIndex = keysInObjects.indexOf(key)
              keysInObjects.splice(keyIndex, 1)
            }
          }
        }
      }
      this.needsUpdate = draw
      if (this.deleteWhenDoneUpdating && !draw) {
        if (deleteFuncs)
          for (const func of deleteFuncs) {
            func()
          }
      }
      return draw
    },
    draw(ctx) {
      canvasManager.saveContexts()
      if (initFuncs.length > 0) {
        canvasManager.clearContexts()
      }
      // transform the canvas
      const state = getCurrentStateWithChildren(animationInfo)
      canvasManager.translateAndScaleContexts(state)
      for (const key of keysInObjects) {
        ctx.canvasCtx = canvasManager.getContext(key)
        for (const object of this.objects[key]) {
          object.draw(ctx)
        }
      }
      canvasManager.restoreContexts()
    },
    addRestartListener: (listener: () => void) => {
      restartListeners.add(listener)
    },
    removeRestartListener: (listener: () => void) => {
      restartListeners.delete(listener)
    },
    delete: () => {
      out.ctx.delete()
    },
  }
  out.addRestartListener(() => {
    out.needsUpdate = true
  })
  out.ctx.addScaleListener('start', (scale) => {
    if (scale.scale) {
      out.ctx.scale = scale.scale
    }
  })
  out.ctx.addPosListener('start', (pos) => {
    const newPos = { ...out.ctx.pos, ...pos }
    out.ctx.pos = newPos
  })
  return out
}
