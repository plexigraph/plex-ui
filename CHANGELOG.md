# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-02-14

### Added

- First major commit
- buttons
- input fields
- radio inputs
- checkboxes
- grid
- color palette support
  - see `src/styles/colors/` for example palettes
  - see [src/styles/colors/color-mixins.scss](src/styles/colors/color-mixins.scss#L15-23) for the mixin used in colors and for the css variables used for styling:
    - `--pg-fg` - foreground color
    - `--pg-fg-accent` - foreground accent color
    - `--pg-fg-mid`

```scss
--pg-fg: var(--pg-#{$name}-fg);
--pg-fg-accent: var(--pg-#{$name}-fg-accent);
--pg-fg-mid: var(--pg-#{$name}-mid);
--pg-bg-mid: var(--pg-#{$name}-mid-accent);
--pg-bg-accent: var(--pg-#{$name}-bg-accent);
--pg-bg: var(--pg-#{$name}-bg);
--pg-cursor: var(--pg-fg-mid);
```
