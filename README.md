# docsify-image-size

A Docsify plugin that adds a complete image-styling and caption system using simple inline directives inside the ALT and TITLE fields.

Features include:

- Image sizing (px, %, WxH)
- Alignment (left, center, right, float-left, float-right)
- Max-width
- Image CSS classes
- Zoom/lightbox hooks
- Captions (from TITLE)
- Caption position, alignment, style
- Caption CSS classes
- Figure labels
- Autonumbering (local and global)

> [!TIP]
> **Quick Docsify Example**
>
>```markdown
>![GitHub Logo|size=96|align=center](./images/GitHub-Mark.png "The GitHub mark")
>```
>
>This displays the GitHub logo at **96px**, centered, with a centered, italics caption below the image:
>
><p align="center"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="96"><br><em>The GitHub mark</em></p>

- [Installation](#installation)
  - [Via CDN](#via-cdn)
  - [Via npm](#via-npm)
  - [Local file](#local-file)
- [Usage](#usage)
- [ALT Directives](#alt-directives)
  - [size= / s=](#size--s)
  - [align= / a=](#align--a)
  - [max= / m=](#max--m)
  - [class= / c=](#class--c)
  - [zoom / lightbox](#zoom--lightbox)
- [TITLE Directives (Captions)](#title-directives-captions)
  - [Caption visibility](#caption-visibility)
  - [Caption position](#caption-position)
  - [Caption alignment](#caption-alignment)
  - [Caption style](#caption-style)
  - [Caption classes](#caption-classes)
  - [Figure labels](#figure-labels)
  - [Autonumbering](#autonumbering)
- [Examples \& Previews](#examples--previews)
  - [Percentage width](#percentage-width)
  - [Pixel width](#pixel-width)
  - [Width + height](#width--height)
  - [Width only](#width-only)
  - [Height only](#height-only)
  - [Left](#left)
  - [Center](#center)
  - [Right](#right)
- [Combined Examples](#combined-examples)
  - [Caption + style + autonumber](#caption--style--autonumber)
  - [Float + max width + figure label](#float--max-width--figure-label)
  - [Custom image classes + caption classes](#custom-image-classes--caption-classes)
- [Configuration](#configuration)
- [Notes](#notes)

---

## Installation

### Via CDN

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify-image-size@1.0.0/docsify-image-size.min.js"></script>
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

Directives appear inside the image's ALT or TITLE string using the `|` separator.

```markdown
![ALT|size=50%|align=center](image.png "Caption text|pos=below|style=italic")
```

The part before the first `|` in ALT remains the real accessibility ALT.

---

## ALT Directives

### size= / s=

| Syntax  | Meaning                 |
| ------- | ----------------------- |
| `50%`   | width 50%, height auto  |
| `80`    | width 80px              |
| `80x40` | width 80px, height 40px |
| `80x`   | width 80px, height auto |
| `x40`   | width auto, height 40px |

### align= / a=

| Value         | Effect          |
| ------------- | --------------- |
| `left`        | left aligned    |
| `center`      | centered        |
| `middle`      | alias of center |
| `right`       | right aligned   |
| `float-left`  | float left      |
| `float-right` | float right     |

### max= / m=

Controls CSS `max-width`.

```markdown
![img|max=300](img.png)
![img|max=50%](img.png)
```

### class= / c=

Adds CSS classes to the `<img>` element.

```markdown
![img|class=rounded shadow](img.png)
```

### zoom / lightbox

Adds classes only.

```markdown
![img|zoom](img.png)
![img|lightbox](img.png)
```

---

## TITLE Directives (Captions)

Syntax:

```markdown
![ALT](url "Caption|directive|directive")
```

### Caption visibility

```markdown
notitle
no-title
nocaption
no_caption
```

### Caption position

- `pos=above`
- `pos=below` (default)

### Caption alignment

- `align=left`
- `align=center`
- `align=right`

### Caption style

- `italic`
- `bold`
- `underline`
- `normal`

### Caption classes

```markdown
"Caption text|class=caption-small highlight"
```

### Figure labels

```markdown
"CPU pipeline|fig=2.3"
```

### Autonumbering

```markdown
"CPU Pipeline|autonumber"
```

---

## Examples & Previews

(*ALL GitHub logo examples preserved exactly from your original README, now enhanced if directives allow.*)

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

## Combined Examples

### Caption + style + autonumber

```markdown
![GitHub Logo|size=120|align=center](./images/GitHub-Mark.png
 "The GitHub Mark|pos=below|style=italic|autonumber|class=caption-small")
```

<p align="center"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="120"></p>
<p align="center" style="font-style: italic;"><em>Figure 1: The GitHub Mark</em></p>

---

### Float + max width + figure label

```markdown
![Pipeline|size=50%|align=float-right|max=300](pipeline.png
 "Pipeline execution stages|pos=above|fig=3.1|style=bold")
```

<em>Note: Float and caption positioning best viewed in rendered Docsify site.</em>

---

### Custom image classes + caption classes

```markdown
![CPU|size=200|class=hero-img rounded](cpu.png
 "CPU overview|class=caption-highlight note")
```

<em>Note: Custom classes require corresponding CSS definitions in your Docsify theme.</em>

---

## Configuration

Add to your `index.html` before loading Docsify:

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

---

## Notes

- ALT text before the first `|` remains the true accessibility alt.
- Unknown directives are ignored with warnings.
- Image URLs are never modified.
- Captions and images expose data attributes for chaining with other plugins.
