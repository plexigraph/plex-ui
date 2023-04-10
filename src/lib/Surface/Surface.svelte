<script lang="ts">
  import type { SideOffset, Side } from './surface'
  import { defaultContext, type ContextWrapper } from './context'
  import { onMount } from 'svelte'
  /** sides of the parent surface to align to. If no parent it will align to the top of  */
  export let alignTo: SideOffset = {}
  /** multiplier of 4 pixels */
  export let padding: number = 0
  export let context: ContextWrapper<any> = defaultContext()
  /** number of tiles */
  export let width: number | undefined = undefined
  /** number of tiles */
  export let height: number | undefined = undefined
  let elem: HTMLDivElement | undefined = undefined
  function surfaceToCss(): string {
    let out = `--padding: ${padding};`
    width && (out += `width: ${width * 16}px;`)
    height && (out += `height: ${height * 16}px;`)
    for (const side in alignTo) {
      out += `--${side}: ${alignTo[side as Side]};`
    }
    return out
  }

  let lastTime = Date.now()

  function restartUpdateLoop() {
    lastTime = Date.now()
    requestAnimationFrame(updateLoop)
  }
  function updateLoop(time: number) {
    let dt = time - lastTime
    lastTime = time

    let renderNextFrame = context?.update(dt)
    context.draw(context.ctx, dt)
    if (renderNextFrame) {
      requestAnimationFrame(updateLoop)
    }
  }

  onMount(() => {
    if (elem) {
      context.restartListener = restartUpdateLoop
      context.init(elem)
    }
  })
</script>

<div bind:this={elem} class="surface" style={surfaceToCss()}>
  <slot />
</div>

<style>
  .surface {
    display: grid;
    box-sizing: border-box;
    grid-template-rows: repeat(auto-fill, 16px);
    grid-template-columns: repeat(auto-fill, 16px);
    grid-gap: 4px;
    padding: var(--padding, 0) var(--padding, 0);
  }
</style>
