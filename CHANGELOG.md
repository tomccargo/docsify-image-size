# CHANGELOG

All notable additions and modifications to this plugin are documented here.

This project follows semantic versioning.

---

## v1.0.0 — Full directive system: captions, figures, floats, max width, classes, zoom, lightbox

**Released:** 2025-11-29

### Added

- ALT-based directives:
  - `size=`, `s=`
  - `align=`, `a=` including `float-left` and `float-right`
  - `max=`, `m=`
  - `class=`, `c=`
  - `zoom`, `lightbox`
- TITLE-based caption system:
  - Caption text
  - `pos=above` and `pos=below`
  - `align=left|center|right`
  - `style=italic|bold|underline|normal`
  - `notitle`, `no-title`, `nocaption`, `no_caption`
- Caption CSS class application:
  - `class=caption-small highlight`
- Figure labeling:
  - `fig=1.1`, `label=1.1`
  - Customizable prefix (`Figure`)
- Autonumbering:
  - Per-caption with `autonumber`
  - Global autonumbering with configuration
  - Page-scoped or global-scoped counters
- Global configuration block:

  ```js
  window.$docsify = {
    imageSize: {
      defaultCaptionPos: "below",
      defaultCaptionAlign: "center",
      defaultCaptionStyle: "italic",
      figurePrefix: "Figure",
      autoNumber: false,
      autoNumberScope: "page"
    }
  };
  ```

- Data attributes added to each image and caption:

  - `data-img-size`
  - `data-img-align`
  - `data-img-max`
  - `data-img-class`
  - `data-img-zoom`
  - `data-img-lightbox`
  - `data-img-caption-pos`
  - `data-img-caption-align`
  - `data-img-caption-style`
  - `data-img-caption-fig`
  - `data-img-caption-autonumber`
  - `data-img-caption-number`

### Changed

- Unified directive parsing for all ALT/TITLE fields.
- More robust DOM handling including prevention of double caption injection.
- More tolerant syntax handling and warnings for malformed directives.

### Fixed

- Caption duplication on re-render.
- Incorrect float behavior when combined with captions.
- Max-width behavior inconsistencies across Docsify rebuilds.

---

## v0.3.0 — ALT-based syntax and reliable sizing and alignment

**Released:** 2025-11-25

### Added

- ALT-based directive syntax for image configuration:

  - `![Alt|size=...]`
  - `![Alt|align=...]`
- Size formats supported:

  - Percent widths (`50%`)
  - Single pixel width (`80`)
  - Pixel width and height (`80x40`)
  - Width-only (`80x`)
  - Height-only (`x40`)
- Alignment options:

  - `left`, `center`, `middle`, `right`
- Updated documentation describing new ALT system.
- Minified build output.

### Changed

- Removed Docsify title-based syntax (`:size=` and `:align=`) because Docsify strips these before plugins run.
- Plugin rewritten to operate in `hook.doneEach`.
- ALT text cleaned after parsing.

### Fixed

- All path inconsistencies caused by previous markdown-rewriting method.
- Broken title-based behavior in 0.2.x versions.

---

## v0.2.0 — Title-based directive experiment (superseded)

**Released:** 2025-xx-xx

### Description

- Introduced `:size=` and `:align=` title-based syntax.
- Conflicted with Docsify's internal markdown parsing.
- Caused broken paths and inconsistent handling.
- Superseded by v0.3.0 ALT-based design.

---

## v0.1.0 — Initial release

**Released:** 2025-xx-xx

### Features

- Basic image sizing via `:size=`.
- No alignment support.
- Relied on Docsify's title parsing, which was unstable.
