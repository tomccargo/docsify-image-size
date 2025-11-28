# docsify-image-size

A Docsify plugin that adds flexible image sizing and alignment using `:size=` and `:align=` syntax in your markdown image titles.

- `:size=` controls image dimensions (percent or pixels)
- `:align=` controls image alignment (left, center, right)

## Features

- Fixes Docsify built in `:size=` handling
- Supports:
  - `:size=50%`         width as percentage, height auto
  - `:size=300`         width in pixels, height auto
  - `:size=300x100`     width and height in pixels
  - `:size=300x`        width only in pixels, height auto
  - `:size=x100`        height only in pixels, width auto
- Adds simple alignment:
  - `:align=left`
  - `:align=center` or `:align=middle`
  - `:align=right`
- Automatically strips `:size=` and `:align=` from the image tooltip

---

## Installation

### Via CDN (recommended)

Include the plugin script after Docsify in your `index.html`.

Using jsDelivr with an explicit version:

```html
<!-- Docsify core -->
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>

<!-- docsify-image-size plugin (version 0.2.0) -->
<script src="//cdn.jsdelivr.net/npm/docsify-image-size@0.2.0/docsify-image-size.min.js"></script>
````

Using unpkg:

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify-image-size@0.2.0/docsify-image-size.min.js"></script>
```

You can also use `@latest` instead of `@0.2.0` if you want to always pull the newest release (at the cost of reproducibility).

### Via npm

Install the package:

```bash
npm install docsify-image-size
```

Then include the plugin in your Docsify HTML (for example from `node_modules`):

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="node_modules/docsify-image-size/docsify-image-size.min.js"></script>
```

The plugin auto registers itself with Docsify when loaded. You do not need to modify `window.$docsify.plugins` manually.

---

## Usage

The plugin reads markers from the image `title` attribute in your markdown.

Basic pattern:

```markdown
![alt text](path/to/image.png ":size=... :align=...")
```

You can use `:size=`, `:align=`, or both, in any order, separated by spaces.

In the examples and previews below, all images use this bitmap:

```text
https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
```

Replace it with your own image in real documentation.

---

## Sizing syntax (`:size=`)

### Percentage width

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=50%")
```

Sets width to 50 percent of the container, height is automatic (aspect ratio preserved).

Preview (simulated only for GitHub README):

<p>
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo 50%"
    width="80"
  />
</p>

### Pixel width only

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80")
```

Sets width to 80 pixels, height is automatic.

Preview (simulated):

<p>
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo 80px"
    width="80"
  />
</p>

### Width and height

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80x80")
```

Sets width to 80 pixels and height to 80 pixels.

Preview (simulated):

<p>
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo 80x80"
    width="80"
    height="80"
  />
</p>

### Width only (explicit)

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80x")
```

Sets width to 80 pixels, height is automatic.

Preview (simulated):

<p>
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo width 80"
    width="80"
  />
</p>

### Height only

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=x80")
```

Sets height to 80 pixels, width is automatic.

Preview (simulated):

<p>
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo height 80"
    height="80"
  />
</p>

If the plugin does not recognize the value format, it leaves the image size unchanged.

---

## Alignment syntax (`:align=`)

Supported values:

* `:align=left`
* `:align=center`
* `:align=middle` (alias for `center`)
* `:align=right`

Alignment is applied using `display: block` and margins on the `img` element:

* `center` / `middle`: `display: block; margin-left: auto; margin-right: auto;`
* `right`: `display: block; margin-left: auto; margin-right: 0;`
* `left`: `display: block; margin-left: 0; margin-right: auto;`

### Align left

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80 :align=left")
```

Preview (simulated):

<p align="left">
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo left"
    width="80"
  />
</p>

### Align center

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80 :align=center")
```

Preview (simulated):

<p align="center">
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo center"
    width="80"
  />
</p>

### Align right

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80 :align=right")
```

Preview (simulated):

<p align="right">
  <img
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    alt="GitHub Logo right"
    width="80"
  />
</p>

These previews are plain HTML that GitHub Markdown allows (no `style` attributes), so they give a rough idea of what the plugin does even when the plugin is not running in the README.

---

## Combining size and alignment

You can combine both markers in the same title. Order does not matter:

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=80 :align=center")
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=50% :align=right")
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png ":size=x80 :align=center")
```

---

## Notes and limitations

* The plugin looks for `:size=` and `:align=` in the **title** part of the markdown image, not in `alt`.
* It removes `:size=...` and `:align=...` from the title before rendering, so tooltips stay clean.
* It removes any `width` and `height` attributes that Docsify may have added to the image and replaces them with inline `style` properties.
* Sizing supports:

  * Percent width: `NN%`
  * Pixel values: `NN`, `NNxMM`, `NNx`, `xNN`
* Unknown `:size=` values are ignored and the image is left unchanged.
* The plugin modifies inline styles (`style` attribute) on `<img>` elements when Docsify runs. The simulated previews above use only `width`, `height`, and `align` attributes so they also work on GitHub.
