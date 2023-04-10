export type Sides = {
    TOP: 'top'
    BOTTOM: 'bottom'
    LEFT: 'left'
    RIGHT: 'right'
}
  
export type Side = Sides[keyof Sides]
export type SideOffset = { [key in Side]?: number }