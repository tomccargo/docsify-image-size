# docsify-image-size

A Docsify plugin that adds flexible image sizing using the `:size=` syntax in your markdown.

## Installation

### Via CDN

Include the plugin script after Docsify in your `index.html`:

```html
<!-- Load Docsify first -->
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>

<!-- Then load the image size plugin -->
<script src="//cdn.jsdelivr.net/npm/docsify-image-size@0.1.0/docsify-image-size.js"></script>
```

You can also use unpkg:

```html
<script src="//unpkg.com/docsify-image-size"></script>
```

### Via npm

Install the package using npm:

```bash
npm install docsify-image-size
```

Then include it in your Docsify setup by referencing the local file or bundling it as needed.

## Usage

This plugin lets you control image sizes in your Docsify documentation by adding a `:size=` parameter inside the image title.

### Syntax

Use the `:size=` syntax followed by the desired dimensions:

```markdown
![alt text](image.jpg ":size=WIDTHxHEIGHT")
```

### Examples

* **Percentage width:**

  ```markdown
  ![logo](logo.png ":size=50%")
  ```

  This sets the image width to 50% of its container, maintaining the aspect ratio.

* **Fixed pixel width:**

  ```markdown
  ![screenshot](screenshot.png ":size=300")
  ```

  This sets the image width to 300 pixels and height is adjusted automatically.

* **Fixed width and height:**

  ```markdown
  ![icon](icon.png ":size=200x100")
  ```

  This sets the image to 200 pixels wide by 100 pixels tall.

* **Width only:**

  ```markdown
  ![banner](banner.png ":size=400x")
  ```

  This sets the image width to 400 pixels, with the height adjusted automatically.

* **Height only:**

  ```markdown
  ![vertical](vertical.png ":size=x300")
  ```

  This sets the image height to 300 pixels, with the width adjusted automatically.

### Notes

* The `:size=` portion is removed from the image tooltip automatically.
* The plugin overrides any existing width/height attributes that Docsify sets by default.
* Currently supports `px` for pixels and `%` for percentage-based widths.
