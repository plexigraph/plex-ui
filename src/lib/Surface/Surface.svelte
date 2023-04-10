<script lang="ts">
  import type { SideOffset, Side } from './surface'
  import type { ContextWrapper } from './context'
  /** sides of the parent surface to align to. If no parent it will align to the top of  */
  export let alignTo: SideOffset
  /** multiplier of 4 pixels */
  export let padding: number
  export let context: ContextWrapper<any>
  /** number of tiles */
  export let width: number | undefined
  /** number of tiles */
  export let height: number | undefined
  function surfaceToCss(): string {
    let out = `\
--width: ${width};
--height: ${height};
--padding: ${padding};`
    for (const side in alignTo) {
      out += `--${side}: ${alignTo[side as Side]};`
    }
    return out
  }
</script>

<div class="surface" style={surfaceToCss($store)}>
  <slot />
</div>

<style>
  .surface {
    display: grid;
    grid-template-rows: repeat(auto-fill, 16px);
    grid-template-columns: repeat(auto-fill, 16px);
  }
</style>
