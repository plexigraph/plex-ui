import { Signal, computed, signal } from "@lit-labs/preact-signals"

export default function asyncComputed<T>(
  initial: T,
  asyncSignal: Signal<Promise<T>>
) {
  const s = signal(initial)
  asyncSignal.subscribe(promise => {
    promise.then(value => {
      s.value = value
    })
  })
  return computed(() => s.value)
}
