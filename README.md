# docsify-image-size

A Docsify plugin that adds **inline image sizing**, **image alignment**, and **captions** using simple directives written directly inside Markdown.

The plugin is:

* Safe (no invalid HTML)
* Idempotent (runs once per image)
* Non-invasive (no layout changes unless explicitly requested)
* Pipe-robust (alt text can contain `|`)
* Caption-aware (captions below or above, styled, aligned with the image)

> [!TIP]
> **Quick Docsify Example**
>
> ```markdown
> ![GitHub Logo|size=96|align=center](./images/GitHub-Mark.png "The GitHub mark")
> ```
>
> This displays the GitHub logo at **96px**, centered, with a centered italic caption below the image:
>
> <p align="center"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"><br><em>The GitHub mark</em></p>

---

- [Installation](#installation)
  - [Via CDN](#via-cdn)
  - [Via npm](#via-npm)
  - [Local file](#local-file)
- [Usage](#usage)
- [ALT Directives](#alt-directives)
  - [size=](#size)
  - [align=](#align)
- [TITLE Directives (Captions)](#title-directives-captions)
  - [Visibility](#visibility)
  - [Position](#position)
  - [Style](#style)
  - [Alignment](#alignment)
- [Examples \& Previews](#examples--previews)
  - [Percentage width](#percentage-width)
  - [Pixel width](#pixel-width)
  - [Width + height](#width--height)
  - [Width only](#width-only)
  - [Height only](#height-only)
  - [Left](#left)
  - [Center](#center)
  - [Right](#right)
- [Combined Example](#combined-example)
- [Notes](#notes)

---

## Installation

### Via CDN

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify-image-size/docsify-image-size.min.js"></script>
```

### Via npm

```bash
npm install docsify-image-size
```

```html
<script src="node_modules/docsify-image-size/docsify-image-size.min.js"></script>
```

### Local file

```html
<script src="./assets/js/docsify-image-size.js"></script>
```

---

## Usage

Use the `|` character inside the ALT text for **image sizing and alignment**,
and inside the TITLE text for **captions**.

```markdown
![Alt text|size=50%|align=center](image.png "My caption|pos=below|style=italic")
```

**ALT rule:**
Everything before the first `|` remains the real accessibility alt.

---

## ALT Directives

The plugin recognizes **exactly two** ALT directives:

### size=

Sizing options:

| Value     | Meaning                 |
| --------- | ----------------------- |
| `50%`     | width 50%, height auto  |
| `80`      | width 80px              |
| `80px`    | width 80px              |
| `80x40`   | width 80px, height 40px |
| `80x`     | width 80px, height auto |
| `x40`     | width auto, height 40px |
| `80xauto` | width 80px, height auto |

### align=

Alignment options:

| Value    | Meaning                 |
| -------- | ----------------------- |
| `left`   | Default image alignment |
| `center` | Centered block image    |
| `middle` | Alias for center        |
| `right`  | Right-aligned block     |

**Important:**
No float options. No class options. No max-width options.
The plugin deliberately does **not** touch layout unless `align=` is present.

---

## TITLE Directives (Captions)

Captions are extracted from the TITLE string:

```markdown
![ALT](img.png "Caption text|pos=above|style=bold")
```

### Visibility

To suppress the visible caption:

```markdown
notitle
no-title
nocaption
no_caption
```

(`"notitle"` alone even removes the tooltip.)

### Position

* `pos=above`
* `pos=below` (default)

### Style

* `italic` (default)
* `bold`
* `underline`
* `normal`

### Alignment

Captions **always** align exactly like the image.
No caption-specific `align=` is supported.

---

## Examples & Previews

### Percentage width

```markdown
![GitHub Logo|size=50%](./images/GitHub-Mark.png)
```

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="160"></p>

---

### Pixel width

```markdown
![GitHub Logo|size=64](./images/GitHub-Mark.png)
```

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="64"></p>

---

### Width + height

```markdown
![GitHub Logo|size=160x80](./images/GitHub-Mark.png)
```

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="160" height="80"></p>

---

### Width only

```markdown
![GitHub Logo|size=96x](./images/GitHub-Mark.png)
```

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"></p>

---

### Height only

```markdown
![GitHub Logo|size=x96](./images/GitHub-Mark.png)
```

<p><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" height="96"></p>

---

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

## Combined Example

A real plugin-valid combined example:

```markdown
![GitHub Logo|size=120|align=center](./images/GitHub-Mark.png
 "The GitHub Mark|pos=below|style=italic")
```

Rendered:

<p align="center">
  <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="120"><br>
  <em>The GitHub Mark</em>
</p>

---

## Notes

* ALT text before the first `|` is preserved as the true accessibility alt.
* Directives must be the last segments in ALT.
* Unknown directives are ignored with warnings.
* Image URLs are never modified.
* Captions are injected using `<span style="display:block">` for valid HTML inside `<p>`.
* Caption alignment always follows image alignment.
