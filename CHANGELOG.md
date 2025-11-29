# CHANGELOG

All notable changes to this project will be documented in this file.

This project adheres to semantic versioning.

---

## **v0.3.0** - ALT-based syntax, reliable sizing & alignment

**Released:** 2025-11-25

### Added

* New **ALT-based directive syntax** for image styling:
  `![Alt|size=...|align=...](url)`
* Support for all size formats:

  * `size=50%`
  * `size=NN`
  * `size=NNxMM`
  * `size=NNx`
  * `size=xNN`
* Alignment support using:

  * `align=left`
  * `align=center` / `align=middle`
  * `align=right`
* Full inline documentation and updated README.md
* Minified build output: `docsify-image-size.min.js`

### Changed

* Title-based syntax (`:size=` / `:align=`) has been **fully removed**
  Docsify strips these values before plugins run, making them unreliable.
* New implementation operates in `hook.doneEach` and manipulates only final HTML.
* ALT text is cleaned to remove directives after parsing.

### Fixed

* All path inconsistencies caused by previous markdown-rewriting approach.
* Broken behavior in `v0.2.0` where Docsify interfered with the title attribute.

---

## **v0.2.0** - (Broken)

* Experimental title-based syntax using `:size=` and `:align=`
* Conflicted with Docsify built-in parsing
* Produced path issues and inconsistent behavior
* **Replaced by v0.3.0**

---

## **v0.1.0** - Initial release

* Basic size syntax using `:size=...`
* No alignment support
* Relied on Docsify's title parsing (unstable)
