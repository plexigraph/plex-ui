import { writable } from 'svelte/store'

const gridUnit = writable(0)

export function getGridUnit() {
  return gridUnit
}

export function setGridUnit(value: number) {
  gridUnit.set(value)
}
