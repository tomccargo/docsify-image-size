# docsify-image-size

Docsify plugin that fixes and extends :size= image sizing syntax

## Installation

Include the plugin script in your `index.html` after the Docsify script:

```html
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
<script src="docsify-image-size.js"></script>
```

Or install via npm:

```bash
npm install docsify-image-size
```

## How to Use

This plugin allows you to control image sizes in your Docsify documentation using the `:size=` syntax in image alt text or title.

### Syntax

```markdown
![alt text](image.jpg ":size=WIDTHxHEIGHT")
```

### Examples

**Percentage width:**

```markdown
![logo](logo.png ":size=50%")
```

Sets the image width to 50% of the container, height is automatic.

**Pixel width only:**

```markdown
![screenshot](screenshot.png ":size=300")
```

Sets the image width to 300px, height is automatic.

**Width and height:**

```markdown
![icon](icon.png ":size=200x100")
```

Sets the image to 200px wide and 100px tall.

**Width only (explicit):**

```markdown
![banner](banner.png ":size=400x")
```

Sets the image width to 400px, height is automatic.

**Height only:**

```markdown
![vertical](vertical.png ":size=x300")
```

Sets the image height to 300px, width is automatic.

### Notes

- The `:size=` portion is automatically removed from image tooltips
- Existing Docsify width/height attributes are overridden by this plugin
- All sizes support standard CSS units (px, %, etc.)
