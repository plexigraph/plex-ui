function getColorSwatch(swatch: string) {
  if (swatch === `accent`) return import('./styles/colors/accent.css.ts')
  const path = `./styles/colors/status/${swatch}.css.ts`
  return import(path)
}

const onChange = (event: Event) => {
  const swatch = (event.target as HTMLSelectElement).value
  document.querySelector(`body`)!.className = swatch
  getColorSwatch(swatch).then((module) => {
    const style = document.querySelector(
      `style#color-swatch`
    ) as HTMLStyleElement
    style.textContent = module.default.cssText
  })
}
