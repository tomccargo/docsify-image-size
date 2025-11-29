# docsify-image-size

A Docsify plugin that adds **image sizing** and **alignment** using simple directives inside the **ALT text** of markdown images.

---

## Quick Docsify Example

```markdown
![GitHub Logo|size=96|align=center](./images/GitHub-Mark.png)
```

<p align="center"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"></p>

This displays the GitHub logo **96px wide**, **centered** on the page.

---

- [Quick Docsify Example](#quick-docsify-example)
- [Installation](#installation)
  - [Via CDN (recommended)](#via-cdn-recommended)
  - [Via npm](#via-npm)
  - [Local file](#local-file)
- [Usage](#usage)
- [Supported Directives](#supported-directives)
  - [Sizing (`size=`)](#sizing-size)
  - [Alignment (`align=`)](#alignment-align)
- [Examples \& Previews](#examples--previews)
  - [Percentage width](#percentage-width)
  - [Pixel width](#pixel-width)
  - [Width + height](#width--height)
  - [Width only](#width-only)
  - [Height only](#height-only)
- [Alignment Examples](#alignment-examples)
  - [Left](#left)
  - [Center](#center)
  - [Right](#right)
  - [Combining size \& alignment](#combining-size--alignment)
- [Notes \& Limitations](#notes--limitations)

---

## Installation

### Via CDN (recommended)

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify-image-size@0.3.0/docsify-image-size.min.js"></script>
```

### Via npm

```bash
npm install docsify-image-size
```

Use in `index.html`:

```html
<script src="node_modules/docsify-image-size/docsify-image-size.min.js"></script>
```

### Local file

```html
<script src="./assets/js/docsify-image-size.js"></script>
```

---

## Usage

Directives go inside the **ALT** text using the `|` separator:

```markdown
![ALT|size=VALUE|align=VALUE](URL)
```

Only the first segment becomes the actual ALT text.
All other segments are interpreted as directives.

---

## Supported Directives

### Sizing (`size=`)

| Syntax  | Meaning                     | Example rendered size |
| ------- | --------------------------- | --------------------- |
| `50%`   | Width = 50%, height auto    | width 50%             |
| `80`    | Width = 80px, height auto   | 80 x auto             |
| `80x40` | Width = 80px, height = 40px | 80 x 40               |
| `80x`   | Width = 80px, height auto   | 80 x auto             |
| `x40`   | Width auto, height = 40px   | auto x 40             |

### Alignment (`align=`)

| Value    | Effect            |
| -------- | ----------------- |
| `left`   | Left aligned      |
| `center` | Centered          |
| `middle` | Alias of `center` |
| `right`  | Right aligned     |

Alignment is implemented using:

- `display: block`
- `margin-left/right`
- parent `text-align`

---

## Examples & Previews

All previews below use the GitHub Mark logo:

```markdown
https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
```

(Previews look correct on GitHub; Docsify will dynamically size/align using the plugin.)

---

### Percentage width

```markdown
![GitHub Logo|size=50%](./images/GitHub-Mark.png)
```

Preview:

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="160"></p>

---

### Pixel width

```markdown
![GitHub Logo|size=64](./images/GitHub-Mark.png)
```

Preview:

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="64"></p>

---

### Width + height

```markdown
![GitHub Logo|size=160x80](./images/GitHub-Mark.png)
```

Preview:

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="160" height="80"></p>

---

### Width only

```markdown
![GitHub Logo|size=96x](./images/GitHub-Mark.png)
```

Preview:

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"></p>

---

### Height only

```markdown
![GitHub Logo|size=x96](./images/GitHub-Mark.png)
```

Preview:

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" height="96"></p>

---

## Alignment Examples

### Left

```markdown
![GitHub Logo|size=96|align=left](./images/GitHub-Mark.png)
```

<p align="left"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"></p>

---

### Center

```markdown
![GitHub Logo|size=96|align=center](./images/GitHub-Mark.png)
```

<p align="center"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"></p>

---

### Right

```markdown
![GitHub Logo|size=96|align=right](./images/GitHub-Mark.png)
```

<p align="right"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"></p>

---

### Combining size & alignment

```markdown
![GitHub Logo|size=64|align=center](./images/GitHub-Mark.png)
![GitHub Logo|size=160x80|align=right](./images/GitHub-Mark.png)
![GitHub Logo|size=x96|align=center](./images/GitHub-Mark.png)
```

---

## Notes & Limitations

- The plugin only parses directives inside the **ALT text**.
- Docsify's built-in `:size=` syntax is ignored.
- Unknown size formats are ignored.
- The plugin **never** modifies `src` paths.
- Previews in this README are simulated with raw HTML.
