/*
  docsify-image-size (alt-based variant)

  Docsify plugin that adds size and alignment directives using the image ALT text.

  Why this exists
  ---------------

  Docsify itself parses :size=... inside the image *title* string and removes it
  before plugins running in hook.doneEach can read it. That makes title-based
  syntax unreliable.

  This version uses ALT-based syntax instead, so we do not conflict with Docsify's
  built-in :size support and we do NOT modify image src URLs.

  Syntax
  ------

    ![ALT|size=VALUE|align=VALUE](URL)

  Separator is the "|" character.

  Examples:

    ![Kafka|size=x50|align=center](../assets/img/kafka.png)
    ![Logo|size=64](./images/logo.png)
    ![Diagram|size=50%|align=right](./images/diagram.png)
    ![Icon|align=center](./images/icon.png)

  Rules:

    - Everything before the first "|" is the real alt text.
    - Later segments may contain:
         size=...
         align=...
    - If ALT contains no "|", the plugin does nothing.

  Supported size values
  ---------------------

    size=50%     -> width: 50%, height: auto
    size=80      -> width: 80px, height: auto
    size=80x40   -> width: 80px, height: 40px
    size=80x     -> width: 80px, height: auto
    size=x40     -> width: auto, height: 40px

  Supported align values
  ----------------------

    align=left
    align=center
    align=middle   (alias of center)
    align=right

  What it does
  ------------

    - Runs in hook.doneEach on rendered HTML.
    - Scans all <img> elements inside .markdown-section.
    - Parses ALT for directives.
    - Removes directives from ALT.
    - Applies size styles to the <img>.
    - Applies alignment using display + margins + parent text-align.
    - Never changes src.
*/

(function (root, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    root.DocsifyImageSize = factory();
  }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function parseAltDirectives(alt) {
    if (!alt || alt.indexOf("|") === -1) {
      return null;
    }

    const parts = alt.split("|").map(s => s.trim());
    const baseAlt = parts[0] || "";
    let size = null;
    let align = null;

    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i];
      if (!seg) continue;

      const lower = seg.toLowerCase();
      if (lower.startsWith("size=")) {
        size = seg.slice(5).trim();
      } else if (lower.startsWith("align=")) {
        align = seg.slice(6).trim().toLowerCase();
      }
    }

    if (!size && !align) {
      return null;
    }

    return { baseAlt, size, align };
  }

  function sizeToStyles(size) {
    if (!size) return { width: null, height: null, widthPercent: null };

    let width = null;
    let height = null;
    let widthPercent = null;

    if (size.indexOf("%") !== -1) {
      const pm = size.match(/^(\d+(?:\.\d+)?)\s*%$/);
      if (pm) {
        widthPercent = pm[1];
        height = "auto";
      }
      return { width, height, widthPercent };
    }

    if (/^\d+$/.test(size)) {
      const wOnly = parseInt(size, 10);
      if (!isNaN(wOnly)) {
        width = wOnly;
        height = "auto";
      }
      return { width, height, widthPercent };
    }

    const parts = size.split(/x/i);
    if (parts.length >= 1) {
      const rawW = (parts[0] || "").trim();
      const rawH = (parts[1] || "").trim();

      const w = rawW ? parseInt(rawW, 10) : NaN;
      const h = rawH ? parseInt(rawH, 10) : NaN;

      const hasW = !isNaN(w);
      const hasH = !isNaN(h);

      if (hasW && !hasH) {
        width = w;
        height = "auto";
      } else if (!hasW && hasH) {
        width = "auto";
        height = h;
      } else if (hasW && hasH) {
        width = w;
        height = h;
      }
    }

    return { width, height, widthPercent };
  }

  function applySize(img, sizeToken) {
    if (!sizeToken) return;

    const s = sizeToStyles(sizeToken);

    img.removeAttribute("width");
    img.removeAttribute("height");

    if (s.widthPercent !== null) {
      img.style.width = s.widthPercent + "%";
      img.style.height = "auto";
      return;
    }

    if (s.width !== null && s.width !== "auto") {
      img.style.width = s.width + "px";
    } else if (s.width === "auto") {
      img.style.width = "auto";
    }

    if (s.height !== null && s.height !== "auto") {
      img.style.height = s.height + "px";
    } else if (s.height === "auto") {
      img.style.height = "auto";
    }
  }

  function applyAlign(img, alignToken) {
    if (!alignToken) return;

    const a = String(alignToken).toLowerCase();

    img.style.display = "";
    img.style.marginLeft = "";
    img.style.marginRight = "";

    const parent = img.parentElement || null;
    if (parent) {
      parent.style.textAlign = "";
    }

    if (a === "center" || a === "middle") {
      img.style.display = "block";
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
      if (parent) {
        parent.style.textAlign = "center";
      }
      return;
    }

    if (a === "right") {
      img.style.display = "block";
      img.style.marginLeft = "auto";
      img.style.marginRight = "0";
      if (parent) {
        parent.style.textAlign = "right";
      }
      return;
    }

    if (a === "left") {
      img.style.display = "block";
      img.style.marginLeft = "0";
      img.style.marginRight = "auto";
      if (parent) {
        parent.style.textAlign = "left";
      }
      return;
    }
  }

  function imageSizePlugin(hook, vm) {
    hook.doneEach(function () {
      const container = document.querySelector(".markdown-section");
      if (!container) return;

      const imgs = container.querySelectorAll("img[alt]");
      imgs.forEach(function (img) {
        const alt = img.getAttribute("alt") || "";
        const info = parseAltDirectives(alt);
        if (!info) return;

        img.setAttribute("alt", info.baseAlt);

        if (info.size) {
          applySize(img, info.size);
        }

        if (info.align) {
          applyAlign(img, info.align);
        }
      });
    });
  }

  if (typeof window !== "undefined") {
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(imageSizePlugin);
  }

  return imageSizePlugin;
}));
