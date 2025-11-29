# CHANGELOG

All notable additions and modifications to this plugin are documented here.

This project follows semantic versioning.

---

## v1.0.0 - Finalized ALT/TITLE directive system (sizing, alignment, captions)

**Released:** 2025-11-29

### Added

* **ALT-based directives**

  * `size=` - pixel, percent, and WxH size formats:

    * `50%`, `80`, `80px`, `80x40`, `80x`, `x40`, `80xauto`
  * `align=` - image alignment:

    * `left` (default), `center`, `middle` (alias), `right`
  * Backwards parsing allows pipes (`|`) inside real alt text.

* **TITLE-based caption system**

  * Simple caption text via the TITLE attribute.
  * Caption directives:

    * `pos=above`, `pos=below` (default)
    * `style=italic|bold|underline|normal`
    * `notitle`, `no-title`, `nocaption`, `no_caption`
  * Captions automatically inherit image alignment.
  * Valid HTML: captions rendered as `<span style="display:block">` (safe inside `<p>`).

* **DOM Safety and Robustness**

  * Idempotent processing (`data-docsify-image-size-processed`).
  * No modification of parent containers.
  * No layout changes unless `align=` is explicitly used.

* **Warnings**

  * Console warnings for malformed or misplaced ALT directives (case-insensitive, pipe-aware).

### Changed

* Completely rewritten parser:

  * Reverse-scan ALT directive parsing.
  * Defensive handling of mixed/garbage size inputs.
  * Strict clamping of alignment values.
* Unified caption behavior:

  * Default italic, below image.
  * Bare `notitle` removes both caption and tooltip.
* Caption injection now safe, minimal, and HTML-correct.

### Fixed

* Removed invalid `<div>` injection inside `<p>` (now uses `<span>`).
* Eliminated parent paragraph alignment side effects.
* Caption duplication prevented via internal idempotency flags.
* ALT directives with embedded pipes no longer break parsing.

---

## v0.3.0 - ALT-based syntax for reliable sizing and alignment

**Released:** 2025-11-25

### Added

* ALT-based directive system:

  * `![Alt|size=...]`
  * `![Alt|align=...]`
* Supported size formats:

  * `50%`, `80`, `80x40`, `80x`, `x40`
* Alignment options:

  * `left`, `center`, `middle`, `right`
* Cleaned ALT text after parsing.
* Minified build output.

### Changed

* Removed Docsify title-based `:size=` and `:align=` syntax (Docsify strips titles before plugins run).
* Plugin now operates fully in `hook.doneEach`.
* More stable and predictable DOM behavior.

### Fixed

* Path inconsistencies caused by manipulating Markdown.
* All broken title-based behavior from 0.2.x.

---

## v0.2.0 - Title-based directive experiment (superseded)

**Released:** 2025-xx-xx

### Description

* Introduced `:size=` and `:align=` directives in the title string.
* Conflicted with Docsify's internal parser.
* Caused broken paths and inconsistent rendering.
* Replaced entirely by v0.3.0 ALT-based approach.

---

## v0.1.0 - Initial release

**Released:** 2025-xx-xx

### Features

* Basic image sizing using experimental `:size=` syntax.
* No alignment support.
* Depended on Docsify's title parsing, which proved unstable.
