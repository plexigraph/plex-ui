import { Signal, signal } from '@lit-labs/preact-signals'
import PGRadio from './pg-radio'

type RadioGroupId = string

export type RadioGroup = {
  name: RadioGroupId
  radios: Set<PGRadio>
  selected: Signal<PGRadio | undefined>
}

export type RadioGroups = Map<RadioGroupId, RadioGroup>

export function createRadioGroups() {
  const radioGroups: RadioGroups = new Map<RadioGroupId, RadioGroup>()

  return radioGroups
}

export function getGroup(groups: RadioGroups, radio: PGRadio) {
  const group: RadioGroup = groups.get(radio.name) || {
    name: radio.name,
    radios: new Set(),
    selected: signal(undefined),
  }
  console.log(group)
  return group
}

export function addRadio(groups: RadioGroups, radio: PGRadio): RadioGroup {
  const group = getGroup(groups, radio)
  group.radios.add(radio)
  groups.set(radio.name, group)
  return group
}

export function removeRadio(groups: RadioGroups, radio: PGRadio) {
  const group = groups.get(radio.name)
  if (group) {
    if (group.selected.value === radio) {
      group.selected.value = undefined
    }
    group.radios.delete(radio)
    if (group.radios.size === 0) {
      groups.delete(radio.name)
    }
  }
}

export function radioSelected(group: RadioGroup, radio: PGRadio) {
  group.selected.value = radio
}

export function getSelected(group: RadioGroup) {
  return group.selected.value
}

export function subscribeToSelected(
  group: RadioGroup,
  fn: (radio: PGRadio | undefined) => void
) {
  return group.selected.subscribe(fn)
}
