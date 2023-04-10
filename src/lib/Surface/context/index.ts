export type DrawableObject = {
  needsUpdate: boolean
  onUpdate(dt: number): void
}

export type ContextWrapper<Context> = {
  ctx: Context
  objects: DrawableObject[]
  /**
   * Called after any update is called
   * @param ctx the context to draw to
   * @param dt time in seconds from the last draw call
   */
  draw(ctx: Context, dt: number): void
  /**
   * @returns {boolean} whether or not to call draw for this frame
   */
  update(dt: number): boolean
}

export function defaultContext(): ContextWrapper<null> {
  return {
    ctx: null,
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
    }
  }
}
