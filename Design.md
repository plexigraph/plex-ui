# Design

## Colors

- Neutral: For defining hierarchy in the layout and for content - default of gray
- Accent color(s): For Interactive elements - default of lavender (#9E6FFF) - developer can specify a different color at build time
- Informational/Custom color(s): Allow custom colors for various informational reasons like error/warning/success or the color of sections of the app - should be opt-in - i.e. no built in red/green color and fallback to accent colors.
- custom user defined accent color
- expose api to change accent color at runtime

Uses the material-color-utilities provided by Google’s Material Design 3 design system including to generate color palettes that have even tones.

## Text

Header font: [Comfortaa](https://fonts.google.com/specimen/Comfortaa) - a round font that is very friendly.

Paragraph font: [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) - a pointy font that is very legible.

Code font: [Fira Code](https://fonts.google.com/specimen/Fira+Code) - A monospace font with ligatures.

## Header Sizes

Uses a set ratio to scale up and scale down starting with the standard font size of 16px. The scale by default is the major second type scale with the ratio of 1.125 which is generally a good choice for any application website.

Check out [this blog post](https://medium.com/sketch-app-sources/exploring-responsive-type-scales-cf1da541be54) by Joseph Mueller for guidance on which scales to use for which projects. Generally speaking, the more practical the project is, the smaller the ratio should be. Other popular ratios are the major fourth with 1.414 and the golden ratio of 1.618.

Also uses a set of labels for different sizes and font families:

With the paragraph font:

- The `body` label will always represent 16px paragraph font with regular, bold, italic, and italic bold options.
- The `label` label will always be one font size smaller compared to body with the same formatting options and font family as body.
- The `display` label will have six sizes, starting at one font size above `body` and going up to six sizes above `body`.

With the heading font:

- The `heading` label will have six sizes as well, starting at one font size above `body` and going up to six sizes above body. A different number of font sizes in between each heading is configurable for making headers bigger on bigger screens and smaller on smaller screens.
- heading.1 is the biggest and heading.6 is the smallest font size.

With the code font:

- The `code` label will always represent 16px regular code font.

## Surfaces

Surfaces are sidebars, body contents, nav bars, table of contents, and more.

### Dimensions

A surface is comprised of a grid of tiles, such that each tile is the base unit (16px by default). Surfaces should be an even multiple of 16px in its dimensions. Surfaces will automatically adjust to be an even multiple by increasing padding.

### Alignment

You can align a surface to be centered along one of the parent’s axes or aligned to one of the edges of the grid. The parent of a surface without a parent in this case is the viewport. This allows a surface to dynamically resize based on its parent and overflowing content.

For example, a sidebar might be aligned to the left edge while a navbar would probably be aligned to the top or the bottom of the viewport.

This does leave an edge case where an element’s size might not be a perfect multiple of 16px if it aligns to two opposing sides of the viewport like if you aligned a topbar to the top, left & right. In this case the surface will stretch its padding so that the surface’s inside grid is still a perfect multiple.

### Padding & Outlines

Each grid tile is then divided into four parts to allow for padding and border radius. Gaps between elements must always be at least 1 base unit.
Below is a 16px by 16px square divided into four parts such that each sub-square is 4px wide.
￼

Outlines like borders and separators may be 1-2 pixels wide, being contained entirely inside the element.

### Context & Canvas

Each Surface can provide a surface context to children which are scoped to the dimensions of that child. This surface context provide child surfaces with a flexible API that can be used to create additional decorative elements around any particular element within its grid bounds. Decorative elements drawn to the canvas will be automatically animated based on position, on creation, and on destroy. Elements can also interact decoratively with elements created by other surfaces.

The surface context API is completely configurable and extensible to support drawing anything as a layer between the background color with any tool. Examples include having a draggable element rendered with css and html, a graph rendered with D3.js, decorative elements rendered on a 2D/3D canvas, and more. The surface context API can also keep track of pointers on the surface and children can subscribe to that store.

If a child needs to draw outside the bounds of the grid, consider having the child broadcast an event to the parent which then allows the parent to handle drawing what the child needs to be drawn. This makes it really easy to debug the UI as it provides a clear separation of concerns between surfaces. Each surface is only responsible for what lies in its boundaries.

## Interactivity

All interactivity should be visually displayed and be linked to a responsive html element to ensure accessibility. The built in button, input, radio, and checkbox elements all come with reactivity designed in mind from the start.
