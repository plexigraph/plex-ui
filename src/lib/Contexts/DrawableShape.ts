import type { DrawableObject } from './context'
import type { Context2D } from './2d/Context2D'
import type { Animation, RecursiveAnimatable } from 'aninest'
type Animated<Animating extends RecursiveAnimatable<unknown>> = {
  animationInfo: Animation<Animating>
}

export type DrawableShape<Animating extends RecursiveAnimatable<unknown>> =
  Animated<Animating> & DrawableObject<Context2D>
