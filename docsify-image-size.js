/*
  docsify-image-size (alt-based variant)

  Docsify plugin that adds size and alignment directives using the image ALT text.

  Why this exists
  ---------------

  Docsify itself parses :size=... inside the image *title* string and removes it
  before plugins running in hook.doneEach can read it. That makes title-based
  syntax unreliable for sizing.

  This version uses ALT-based syntax instead for sizing and image alignment,
  so we do not conflict with Docsify's built-in :size support and we do NOT
  modify image src URLs.

  It also optionally uses the image TITLE attribute as a caption, with simple
  directives for caption position, alignment, and style.

  ALT-based syntax (size and image alignment)
  -------------------------------------------

    ![ALT|size=VALUE|align=VALUE](URL)

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
    - If ALT contains no "|", the plugin does nothing for sizing/alignment.

  Supported size values
  ---------------------

    size=50%     -> width: 50%, height: auto
    size=80      -> width: 80px, height: auto
    size=80x40   -> width: 80px, height: 40px
    size=80x     -> width: 80px, height: auto
    size=x40     -> width: auto, height: 40px

  Supported align values (for the image itself)
  ---------------------------------------------

    align=left
    align=center
    align=middle   (alias of center)
    align=right

  Caption syntax (TITLE-based)
  ----------------------------

  The TITLE attribute can be used to render a visible caption above or below
  the image. The syntax mirrors the ALT directives and uses "|" as separator:

    ![ALT|size=...|align=...](URL "CAPTION TEXT|pos=VALUE|align=VALUE|style=VALUE")

  Rules:

    - Everything before the first "|" in TITLE is the visible caption text.
    - That same text is also kept as the browser tooltip (title attribute).
    - Later segments are caption directives.

  Caption directives:

    notitle / no-title / nocaption / no_caption
      - Do NOT render a visible caption, but still keep the tooltip text.

    pos=
      - pos=below   (default) -> caption below the image
      - pos=above              -> caption above the image

    align=           (caption text alignment only)
      - align=left
      - align=center (default if caption is present)
      - align=right

    style=
      - style=normal
      - style=italic   (default)
      - style=bold
      - style=underline / style=underlined

  Examples:

    ![Logo|size=64|align=center](./images/logo.png "Project logo")

    ![Diagram|size=50%](./images/diagram.png "Diagram 1.2|pos=above")

    ![Photo|size=200x](./images/photo.png "A left caption|align=left|style=bold")

    ![Icon|size=32](./images/icon.png "Tooltip only|notitle")

  Notes:

    - Caption is rendered as a <div> inserted just before or after the <img>.
    - By default, caption is below, centered, italic.
    - The plugin marks images once captioned to avoid duplicate captions on re-runs.
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

    const parts = alt.split("|").map(function (s) { return s.trim(); });
    const baseAlt = parts[0] || "";
    let size = null;
    let align = null;

    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i];
      if (!seg) continue;

      const lower = seg.toLowerCase();
      if (lower.indexOf("size=") === 0) {
        size = seg.slice(5).trim();
      } else if (lower.indexOf("align=") === 0) {
        align = seg.slice(6).trim().toLowerCase();
      }
    }

    if (!size && !align) {
      return null;
    }

    return { baseAlt: baseAlt, size: size, align: align };
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
      return { width: width, height: height, widthPercent: widthPercent };
    }

    if (/^\d+$/.test(size)) {
      const wOnly = parseInt(size, 10);
      if (!isNaN(wOnly)) {
        width = wOnly;
        height = "auto";
      }
      return { width: width, height: height, widthPercent: widthPercent };
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

    return { width: width, height: height, widthPercent: widthPercent };
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
      img.style.width = String(s.width) + "px";
    } else if (s.width === "auto") {
      img.style.width = "auto";
    }

    if (s.height !== null && s.height !== "auto") {
      img.style.height = String(s.height) + "px";
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

  function parseTitleDirectives(title) {
    if (!title) return null;

    const parts = title.split("|").map(function (s) { return s.trim(); });
    const baseTitle = parts[0] || "";

    let pos = null;
    let align = null;
    let style = null;
    let noTitle = false;

    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i];
      if (!seg) continue;

      const lower = seg.toLowerCase();

      if (
        lower === "notitle" ||
        lower === "no-title" ||
        lower === "nocaption" ||
        lower === "no_caption"
      ) {
        noTitle = true;
        continue;
      }

      if (lower.indexOf("pos=") === 0 || lower.indexOf("position=") === 0) {
        const eqIdx = seg.indexOf("=");
        if (eqIdx !== -1) {
          const val = seg.slice(eqIdx + 1).trim().toLowerCase();
          if (val === "above" || val === "top") {
            pos = "above";
          } else if (val === "below" || val === "bottom") {
            pos = "below";
          }
        }
        continue;
      }

      if (lower.indexOf("align=") === 0) {
        const eqIdx = seg.indexOf("=");
        if (eqIdx !== -1) {
          const val = seg.slice(eqIdx + 1).trim().toLowerCase();
          if (val === "left" || val === "center" || val === "right") {
            align = val;
          }
        }
        continue;
      }

      if (lower.indexOf("style=") === 0) {
        const eqIdx = seg.indexOf("=");
        if (eqIdx !== -1) {
          const val = seg.slice(eqIdx + 1).trim().toLowerCase();
          if (val === "normal") {
            style = "normal";
          } else if (val === "italic" || val === "italics") {
            style = "italic";
          } else if (val === "bold") {
            style = "bold";
          } else if (val === "underline" || val === "underlined") {
            style = "underline";
          }
        }
        continue;
      }
    }

    if (!baseTitle && !noTitle) {
      return null;
    }

    return {
      baseTitle: baseTitle,
      pos: pos,
      align: align,
      style: style,
      noTitle: noTitle
    };
  }

  function applyCaption(img, captionInfo) {
    if (!captionInfo) return;

    // Always clean the title attribute to the base caption text (tooltip)
    if (typeof captionInfo.baseTitle === "string") {
      img.setAttribute("title", captionInfo.baseTitle);
    }

    // If explicit noTitle, do not render a caption element
    if (captionInfo.noTitle) {
      return;
    }

    // Avoid adding multiple captions for the same image
    if (img.getAttribute("data-docsify-caption") === "1") {
      return;
    }

    const captionText = captionInfo.baseTitle;
    if (!captionText) {
      return;
    }

    const captionEl = document.createElement("div");
    captionEl.textContent = captionText;
    captionEl.setAttribute("data-docsify-caption", "1");

    // Defaults: below, centered, italic
    const pos = captionInfo.pos || "below";
    const align = captionInfo.align || "center";
    const style = captionInfo.style || "italic";

    captionEl.style.fontSize = "0.9em";
    captionEl.style.lineHeight = "1.4";

    if (align === "left" || align === "center" || align === "right") {
      captionEl.style.textAlign = align;
    } else {
      captionEl.style.textAlign = "center";
    }

    if (style === "italic") {
      captionEl.style.fontStyle = "italic";
      captionEl.style.fontWeight = "normal";
      captionEl.style.textDecoration = "none";
    } else if (style === "bold") {
      captionEl.style.fontStyle = "normal";
      captionEl.style.fontWeight = "bold";
      captionEl.style.textDecoration = "none";
    } else if (style === "underline") {
      captionEl.style.fontStyle = "normal";
      captionEl.style.fontWeight = "normal";
      captionEl.style.textDecoration = "underline";
    } else {
      // normal
      captionEl.style.fontStyle = "normal";
      captionEl.style.fontWeight = "normal";
      captionEl.style.textDecoration = "none";
    }

    if (pos === "above") {
      captionEl.style.marginBottom = "0.25rem";
      img.insertAdjacentElement("beforebegin", captionEl);
    } else {
      // below (default)
      captionEl.style.marginTop = "0.25rem";
      img.insertAdjacentElement("afterend", captionEl);
    }

    img.setAttribute("data-docsify-caption", "1");
  }

  function imageSizePlugin(hook, vm) {
    hook.doneEach(function () {
      const container = document.querySelector(".markdown-section");
      if (!container) return;

      const imgs = container.querySelectorAll("img[alt]");
      imgs.forEach(function (img) {
        const alt = img.getAttribute("alt") || "";
        const info = parseAltDirectives(alt);
        if (info) {
          img.setAttribute("alt", info.baseAlt);

          if (info.size) {
            applySize(img, info.size);
          }

          if (info.align) {
            applyAlign(img, info.align);
          }
        }

        const title = img.getAttribute("title");
        const captionInfo = parseTitleDirectives(title);
        if (captionInfo) {
          applyCaption(img, captionInfo);
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
