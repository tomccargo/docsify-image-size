/*
  docsify-image-size
  ==================

  A Docsify plugin providing:
    - Image sizing via ALT text
    - Image alignment via ALT text
    - Captions via TITLE text
    - Valid HTML (no <div> inside <p>)
    - No layout side effects unless explicitly requested

  ---------------------------------------------------------------------------
  INSTALLATION
  ---------------------------------------------------------------------------

  Include this script in your Docsify index.html:

      <script src="docsify-image-size.js"></script>

  No configuration is required.

  ---------------------------------------------------------------------------
  MARKDOWN SYNTAX
  ---------------------------------------------------------------------------

  The plugin extends standard Markdown image syntax.

  1) ALT-based directives (size, alignment)
     --------------------------------------
     ALT syntax uses '|' as separator:

         ![ALT TEXT | size=VALUE | align=VALUE](path/to/image.png)

     Everything before the first '|' is the real alt text.
     Directives must be the FINAL segments.

     Examples:
         ![Logo|size=64](img.png)
         ![Kafka Diagram|size=50%|align=center](img.png)
         ![Icon|align=right](img.png)
         ![Input | Output | size=80]   (pipes allowed in real alt text)

     Supported sizes:
         size=50%       → width 50%, height auto
         size=80        → width 80px, height auto
         size=80px      → width 80px, height auto
         size=80x40     → width 80px, height 40px
         size=80x       → width 80px, height auto
         size=x40       → width auto, height 40px
         size=80xauto   → width 80px, height auto

     Supported align values:
         align=left     (default)
         align=center
         align=middle   (alias of center)
         align=right

     Notes:
         - If no align= is given, the image layout is NOT changed.
         - ALT parsing scans from the end; misordered directives will be ignored.
         - A warning is printed only if a '|' appears AND 'size=' or 'align='
           appears in the text but cannot be parsed.

  2) TITLE-based captions
     ---------------------
     Captions use the TITLE attribute, with optional directives:

         ![Alt|size=80](img.png "CAPTION TEXT | pos=below | style=italic")

     Everything before the first '|' is the visible caption text.
     The same text appears in the browser tooltip unless suppressed.

     Supported caption directives:
         pos=above
         pos=below    (default)
         style=italic     (default)
         style=bold
         style=underline
         style=normal
         notitle / no-title / nocaption / no_caption
             → Do not render a visible caption.
               If used alone (e.g., title="notitle"), tooltip is removed.

     Caption alignment:
         - Always matches the image's alignment.
         - Default is left-aligned.

     Examples:
         ![Logo|size=80](img.png "Project Logo")
         ![Photo|size=200x](pic.jpg "Figure 3.1|pos=above|style=bold")
         ![Icon|size=32](ico.png "Tooltip only|notitle")

  ---------------------------------------------------------------------------
  BEHAVIOR SUMMARY
  ---------------------------------------------------------------------------

    • ALT directives control image size and alignment.
    • TITLE directives control captions.
    • Captions are rendered as <span style="display:block">, valid inside <p>.
    • The plugin never modifies parent <p> alignment.
    • If align= is missing, the image layout is untouched.
    • Idempotent: each image is processed once per page load.
    • Images without ALT or TITLE directives are left unchanged.

  ---------------------------------------------------------------------------
  REQUIREMENTS
  ---------------------------------------------------------------------------

    • Docsify (any modern version).
    • Runs in browsers supporting ES5+.

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

  // --- Helper: Parse ALT ---
  function parseAltDirectives(alt) {
    if (!alt || alt.indexOf("|") === -1) {
      return null;
    }

    const parts = alt.split("|");
    let size = null;
    let align = null;
    let cutIndex = parts.length;

    // Scan backwards. Directives must be at the very end of the string.
    for (let i = parts.length - 1; i >= 1; i--) {
      const seg = parts[i].trim();
      const lower = seg.toLowerCase();

      if (lower.indexOf("size=") === 0) {
        size = seg.slice(5).trim();
        cutIndex = i;
      } else if (lower.indexOf("align=") === 0) {
        align = seg.slice(6).trim().toLowerCase();
        cutIndex = i;
      } else {
        // We hit a non-directive segment. Stop scanning.
        break;
      }
    }

    // Diagnostic: Check for malformed/ignored directives.
    // We only warn if:
    // 1. We found no valid directives (size/align are null).
    // 2. The string actually contains a pipe '|' (signal of intent).
    // 3. The string contains "size=" or "align=" (case-insensitive).
    if (!size && !align && alt.indexOf("|") > -1) {
       const lowerAlt = alt.toLowerCase();
       if (lowerAlt.indexOf("size=") > -1 || lowerAlt.indexOf("align=") > -1) {
         if (typeof console !== "undefined" && console && console.warn) {
           console.warn(`[docsify-image-size] Ignored directives in: "${alt}". Directives must be the last segments (e.g. "Alt|size=...").`);
         }
       }
    }

    if (!size && !align) {
      return null;
    }

    const baseAlt = parts.slice(0, cutIndex).join("|").trim();
    return { baseAlt: baseAlt, size: size, align: align };
  }

  // --- Helper: Convert size string to styles ---
  function sizeToStyles(size) {
    if (!size) return { width: null, height: null, widthPercent: null };

    if (size.indexOf("%") !== -1) {
      return { width: null, height: "auto", widthPercent: size };
    }

    // Robustly strip 'px' if user added it
    const cleanSize = size.replace(/px/gi, "");

    // Single Integer
    if (/^\d+$/.test(cleanSize)) {
      return { width: cleanSize + "px", height: "auto", widthPercent: null };
    }

    // Width x Height
    const parts = cleanSize.split(/x/i);
    const w = parts[0] ? parts[0].trim() : "auto";
    const h = parts[1] ? parts[1].trim() : "auto";

    // Validate inputs. We support "auto" explicitly.
    // e.g. "80xauto" -> width: 80px, height: auto
    const finalW = (w === "auto" || /^\d+$/.test(w)) ? (w === "auto" ? "auto" : w + "px") : null;
    const finalH = (h === "auto" || /^\d+$/.test(h)) ? (h === "auto" ? "auto" : h + "px") : null;
    
    // If both invalid, return nulls to avoid breaking layout
    if (!finalW && !finalH) return { width: null, height: null, widthPercent: null };

    return { width: finalW || "auto", height: finalH || "auto", widthPercent: null };
  }

  // --- Apply Size ---
  function applySize(img, sizeToken) {
    if (!sizeToken) return;
    const s = sizeToStyles(sizeToken);

    img.removeAttribute("width");
    img.removeAttribute("height");

    if (s.widthPercent) {
      img.style.width = s.widthPercent;
      img.style.height = "auto";
    } else {
      if (s.width) img.style.width = s.width;
      if (s.height) img.style.height = s.height;
    }
  }

  // --- Apply Align ---
  function applyAlign(img, alignToken) {
    // 1. Clamp alignment to allowed values
    let a = (alignToken || "left").toLowerCase();
    if (!["left", "right", "center", "middle"].includes(a)) {
      a = "left";
    }

    // 2. Set attribute for Caption lookup
    // (Note: This DOM mutation happens even if no layout alignment is applied)
    img.setAttribute("data-img-align", a);

    if (!alignToken) return;

    // 3. Apply Layout Styles
    // We force block display to allow auto-margins for alignment.
    img.style.display = "block";
    img.style.marginLeft = "";
    img.style.marginRight = "";

    if (a === "center" || a === "middle") {
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
    } else if (a === "right") {
      img.style.marginLeft = "auto";
      img.style.marginRight = "0";
    } else if (a === "left") {
      img.style.marginLeft = "0";
      img.style.marginRight = "auto";
    }
  }

  // --- Helper: Parse Title ---
  function parseTitleDirectives(title) {
    if (!title) return null;

    const raw = title.trim();
    const lowerRaw = raw.toLowerCase();

    // Edge Case: Bare keyword "notitle"
    // Result: No visual caption, and tooltip is cleared (empty).
    if (["notitle", "no-title", "nocaption", "no_caption"].includes(lowerRaw)) {
      return { baseTitle: "", pos: "below", style: "italic", noTitle: true };
    }

    // Edge Case: Standard Title (No pipes)
    // Result: Standard tooltip, default caption style.
    if (raw.indexOf("|") === -1) {
      return { baseTitle: raw, pos: "below", style: "italic", noTitle: false };
    }

    // Directives
    const parts = raw.split("|");
    const baseTitle = parts[0].trim();

    let pos = "below";
    let style = "italic";
    let noTitle = false;

    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i].trim();
      const lower = seg.toLowerCase();

      if (["notitle", "no-title", "nocaption", "no_caption"].includes(lower)) {
        noTitle = true;
      } else if (lower.startsWith("pos=") || lower.startsWith("position=")) {
        const val = lower.split("=")[1].trim();
        if (["above", "top"].includes(val)) pos = "above";
        if (["below", "bottom"].includes(val)) pos = "below";
      } else if (lower.startsWith("style=")) {
        const val = lower.split("=")[1].trim();
        if (val === "underlined") style = "underline";
        else if (["normal", "italic", "bold", "underline"].includes(val)) style = val;
      }
    }

    return { baseTitle, pos, style, noTitle };
  }

  // --- Apply Caption ---
  function applyCaption(img, captionInfo) {
    if (!captionInfo) return;

    // 1. Set Tooltip (Title Attribute)
    if (captionInfo.baseTitle) {
      img.setAttribute("title", captionInfo.baseTitle);
    } else {
      img.removeAttribute("title");
    }

    // 2. Check Guards
    if (captionInfo.noTitle) return;
    if (!captionInfo.baseTitle) return; // Don't create empty spans
    if (img.getAttribute("data-docsify-caption-added")) return; // Prevent duplicates

    // 3. Create Caption Element
    // Use <span> with display:block because <div> cannot be inside <p>
    const captionEl = document.createElement("span");
    captionEl.textContent = captionInfo.baseTitle;
    captionEl.style.display = "block";
    captionEl.style.fontSize = "0.9em";
    captionEl.style.lineHeight = "1.4";

    // 4. Alignment & Style
    const imgAlign = img.getAttribute("data-img-align") || "left";
    captionEl.style.textAlign = (imgAlign === "middle") ? "center" : imgAlign;

    captionEl.style.fontStyle = "normal";
    captionEl.style.fontWeight = "normal";
    captionEl.style.textDecoration = "none";

    if (captionInfo.style === "bold") captionEl.style.fontWeight = "bold";
    else if (captionInfo.style === "underline") captionEl.style.textDecoration = "underline";
    else if (captionInfo.style === "italic") captionEl.style.fontStyle = "italic";

    // 5. Insert Element
    if (captionInfo.pos === "above") {
      captionEl.style.marginBottom = "0.25rem";
      img.insertAdjacentElement("beforebegin", captionEl);
    } else {
      captionEl.style.marginTop = "0.25rem";
      img.insertAdjacentElement("afterend", captionEl);
    }

    img.setAttribute("data-docsify-caption-added", "true");
  }

  // --- Main Plugin Hook ---
  function imageSizePlugin(hook, vm) {
    hook.doneEach(function () {
      const container = document.querySelector(".markdown-section");
      if (!container) return;

      const imgs = container.querySelectorAll("img[alt]");

      imgs.forEach(function (img) {
        // Idempotency: Prevent re-processing the same image
        if (img.getAttribute("data-docsify-image-size-processed")) {
            return;
        }

        const alt = img.getAttribute("alt") || "";
        const altInfo = parseAltDirectives(alt);

        if (altInfo) {
          img.setAttribute("alt", altInfo.baseAlt);
          if (altInfo.size) applySize(img, altInfo.size);
          applyAlign(img, altInfo.align);
        } else {
          // Initialize default attributes for caption alignment
          applyAlign(img, null);
        }

        const title = img.getAttribute("title");
        if (title) {
          const captionInfo = parseTitleDirectives(title);
          applyCaption(img, captionInfo);
        }

        // Mark complete
        img.setAttribute("data-docsify-image-size-processed", "true");
      });
    });
  }

  if (typeof window !== "undefined") {
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(imageSizePlugin);
  }

  return imageSizePlugin;
}));
