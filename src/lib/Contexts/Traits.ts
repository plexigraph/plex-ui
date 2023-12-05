import { Signal, ReadonlySignal } from "@lit-labs/preact-signals"

export type Traits<T extends Record<string, Animatable | unknown>> = {
  traitDict: T
  inheritedTraits: (keyof T)[]
  animatableTraits: {
    [K in keyof T]: T[K] extends Animatable ? K : never
  }[keyof T][]
}

export type InheritedTraitsStack<
  T extends Record<string, Animatable | unknown>
> = {
  raw: Signal<T>[]
  accumulated: ReadonlySignal<T>[]
}
