import type { Surface } from '$lib'

export type DrawableObject = {
  needsUpdate: boolean
  onUpdate(dt: number): void
}

export type ContextWrapper<Context> = {
  ctx: Context
  objects: DrawableObject[]
  init: (parent: HTMLDivElement) => void
  /**
   * Called after any update is called
   * @param ctx the context to draw to
   * @param dt time in seconds from the last draw call
   */
  draw(ctx: Context, dt: number): void
  /**
   * @returns {boolean} whether or not to update next frame
   */
  update(dt: number): boolean
  restartListener: () => void
}

export function defaultContext(): ContextWrapper<null> {
  return {
    ctx: null,
    init: () => {},
    draw: (_ctx) => {},
    objects: [],
    update(dt) {
      let draw = false
      for (const object of this.objects) {
        if (object.needsUpdate) {
          draw = true
          object.onUpdate(dt)
        }
      }
      return draw
    },
    restartListener: () => {}
  }
}
