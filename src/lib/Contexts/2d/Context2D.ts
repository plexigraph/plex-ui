import {
  addObjectWithZIndex,
  type ContextWrapper,
  type DrawableObject,
} from '../../../lib/Contexts/context'
import { newVec2, type Vec2 } from '../../../lib/Utils/vec2'
import {
  modifyTo,
  updateAnimation,
  changeInterpFunction,
  addLocalListener,
  removeLocalListener,
  createAnimation,
  getStateTree,
  NO_INTERP,
  type Interp,
  type AnimatableEvents,
  type RecursiveAnimatable,
} from 'aninest'
import type { DrawableShape } from '../DrawableShape'
import { setupBoundsLayer, getUpdateLayer } from '@aninest/extensions'
import {
  CanvasManager,
  createCanvasManager,
  InitCanvas,
  Remove,
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
  ) => Remove
  addChild: (
    x: number,
    y: number,
    scale: number
  ) => [ContextWrapper<Context2D> & DrawableShape<ScalePos> & Deletable, Remove]
  adoptChild: (child: ReturnType<typeof createContext2D>) => Remove
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
  const animationInfo = createAnimation<ScalePos>(
    {
      scale: 1,
      pos: newVec2(0, 0),
    },
    NO_INTERP // TODO: make this configurable
  )
  const updateLayer = getUpdateLayer()
  updateLayer.mount(animationInfo)
  const boundLayer = setupBoundsLayer<ScalePos>(animationInfo, {})
  boundLayer.mount(animationInfo)
  const { update: updateBounds } = boundLayer
  let canvasManager: CanvasManager
  const initFuncs: InitCanvas[] = []
  let deleteFuncs: Remove[]
  if (parentCanvasManager) {
    canvasManager = parentCanvasManager
  } else {
    //create a canvas element
    canvasManager = createCanvasManager()
    initFuncs.push(canvasManager.addCanvas(1))
    initFuncs.push(canvasManager.addCanvas(-1))
  }
  const zIndicies: number[] = []
  type extendedAnimatable = unknown extends Animatable ? Animatable : never
  const out: ContextWrapper<Context2D> & {
    objects: {
      [zIndex: number]: Set<DrawableObject<extendedAnimatable> & Deletable>
    }
  } & DrawableShape<ScalePos> &
    Deletable = {
    zIndicies: zIndicies,
    updateLayer,
    animationInfo,
    objects: { 0: new Set() },
    ctx: {
      pos: newVec2(0, 0),
      scale: 1,
      canvasCtx: canvasManager.getContext(0),
      canvasManager,
      addScaleListener: function (type, listener) {
        addLocalListener(animationInfo, type, listener)
      },
      removeScaleListener: function (type, listener) {
        removeLocalListener(animationInfo, type, listener)
      },
      removePosListener: function (type, listener) {
        removeLocalListener(animationInfo.children.pos, type, listener)
      },
      addPosListener: function (type, listener) {
        addLocalListener(animationInfo.children.pos, type, listener)
      },
      setPosBounds(lower, upper) {
        updateBounds({
          lower: { pos: lower },
          upper: { pos: upper },
        })
      },
      setScaleBounds(lower, upper) {
        updateBounds({
          lower: { scale: lower },
          upper: { scale: upper },
        })
      },
      addShape<Animating extends RecursiveAnimatable<unknown>>(
        shape: DrawableShape<Animating> & Deletable,
        zIndex: number = 0
      ) {
        return addObjectWithZIndex(out, shape, zIndex)
      },
      setScale: function (scale: number): void {
        out.ctx.scale = scale
        modifyTo<Scale>(animationInfo, { scale })
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
        if (out.animationInfo._timingFunction === NO_INTERP) {
          updateAnimation(out.animationInfo, 0.99)
        }
      },
      getPos: function (): Vec2 {
        return out.ctx.pos
      },
      delete: function () {
        for (const zIndex of zIndicies) {
          if (!out.objects[zIndex]) continue
          for (const obj of out.objects[zIndex]) {
            obj.delete()
          }
        }
        out.deleteWhenDoneUpdating = true
      },
      addChild: function (x: number, y: number, scale: number) {
        const child = createContext2D(out.ctx)
        child.ctx.setScale(scale)
        child.ctx.setPos(x, y)
        const removeChild = out.ctx.adoptChild(child)
        return [child, removeChild]
      },
      adoptChild: function (child: ReturnType<typeof createContext2D>) {
        child.ctx.setInterp(NO_INTERP)
        return addObjectWithZIndex(out, child, 0)
      },
      setInterp(interp: Interp): void {
        changeInterpFunction(animationInfo, interp)
      },
      setPosInterp(interp: Interp): void {
        changeInterpFunction(animationInfo.children.pos, interp)
      },
    },
    init: (parent) => {
      deleteFuncs = initFuncs.map((func) => {
        return func(parent, () => out.draw(out.ctx))
      })
    },
    draw(ctx) {
      canvasManager.saveContexts()
      if (initFuncs.length > 0) {
        canvasManager.clearContexts()
      }
      // transform the canvas
      const state = getStateTree(animationInfo)
      canvasManager.translateAndScaleContexts(state)
      for (const key of zIndicies) {
        ctx.canvasCtx = canvasManager.getContext(key)
        for (const object of this.objects[key]) {
          object.draw(ctx)
        }
      }
      canvasManager.restoreContexts()
    },
    delete: () => {
      out.ctx.delete()
    },
  }
  out.ctx.addScaleListener('start', (scale) => {
    if (scale.scale) {
      out.ctx.scale = scale.scale
    }
  })
  out.ctx.addPosListener('start', (pos) => {
    const newPos = { ...out.ctx.pos, ...pos }
    out.ctx.pos = newPos
  })
  const checkToDelete = () => {
    if (out.deleteWhenDoneUpdating) {
      console.log('deleting')
      for (const func of deleteFuncs) {
        func()
      }
    }
  }
  // out.updateLayer.subscribe('done', checkToDelete)
  return out
}
