import { getUpdateLayer, UpdateLayer } from '@aninest/extensions'
import { UnknownRecursiveAnimatable } from 'aninest'

export type DrawableObject<Context> = {
  deleteWhenDoneUpdating?: boolean
  draw(ctx: Context): void
  updateLayer: UpdateLayer<UnknownRecursiveAnimatable>
}

type CleanUp = () => void

export type ContextWrapper<Context> = DrawableObject<Context> & {
  ctx: Context
  updateLayer: UpdateLayer<UnknownRecursiveAnimatable>
  objects: { [zIndex: number]: Set<DrawableObject<Context>> }
  zIndicies: number[]
  init(parent: HTMLDivElement): CleanUp | void
}

function defaultContext(): ContextWrapper<null> {
  const updateLayer = getUpdateLayer()
  return {
    updateLayer,
    ctx: null,
    init: () => {},
    objects: {},
    draw(_ctx) {},
    zIndicies: [],
  }
}

export const NO_CONTEXT: ContextWrapper<null> = defaultContext()

/**
 *
 * @param objects Objects to update and draw
 * @param keysInObjects
 * @param zIndex
 * @param obj
 * @returns {CleanUp} a function to remove the object from the objects
 */
export function addObjectWithZIndex<Context>(
  contextWrapper: ContextWrapper<Context>,
  obj: DrawableObject<Context>,
  zIndex: number
): CleanUp {
  const unsubs: CleanUp[] = []
  if (contextWrapper.zIndicies.includes(zIndex)) {
    contextWrapper.objects[zIndex].add(obj)
  } else {
    contextWrapper.objects[zIndex] = new Set([obj])
    contextWrapper.zIndicies.push(zIndex)
    contextWrapper.zIndicies.sort() // TODO: might be better to do insertion sort?
  }
  unsubs.push(obj.updateLayer.setParent(contextWrapper.updateLayer))
  unsubs.push(() => {
    const index = contextWrapper.zIndicies.findIndex((v) => v == zIndex)
    contextWrapper.zIndicies.splice(index, 1)
    contextWrapper.objects[zIndex].delete(obj)
  })
  return () => unsubs.forEach((fn) => fn())
}
