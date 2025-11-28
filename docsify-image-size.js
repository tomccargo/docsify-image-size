(function (root, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // CommonJS / Node
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(factory);
  } else {
    // Browser global
    root.DocsifyImageSize = factory();
  }
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /**
   * Parse and apply :size=... to an <img>.
   * Supports:
   *   :size=50%      -> width 50%, height auto
   *   :size=300      -> width 300px, height auto
   *   :size=300x100  -> width 300px, height 100px
   *   :size=300x     -> width 300px, height auto
   *   :size=x100     -> height 100px, width auto
   */
  function applySize(img, sizePart) {
    if (!sizePart) return;

    // Remove any width/height attributes Docsify may have added
    img.removeAttribute("width");
    img.removeAttribute("height");

    // 1) Percentage: e.g. 50%
    if (sizePart.indexOf("%") !== -1) {
      var pm = sizePart.match(/^(\d+(?:\.\d+)?)\s*%$/);
      if (pm) {
        img.style.width = pm[1] + "%";
        img.style.height = "auto";
      }
      return;
    }

    // 2) Single pixel value: e.g. 300
    if (/^\d+$/.test(sizePart)) {
      var wOnly = parseInt(sizePart, 10);
      if (!isNaN(wOnly)) {
        img.style.width = wOnly + "px";
        img.style.height = "auto";
      }
      return;
    }

    // 3) width x height (both optional): 300x100, 300x, x100
    var parts = sizePart.split(/x/i);
    if (parts.length >= 1) {
      var rawW = (parts[0] || "").trim();
      var rawH = (parts[1] || "").trim();

      var w = rawW ? parseInt(rawW, 10) : NaN;
      var h = rawH ? parseInt(rawH, 10) : NaN;

      var hasW = !isNaN(w);
      var hasH = !isNaN(h);

      // width only (300x)
      if (hasW && !hasH) {
        img.style.width = w + "px";
        img.style.height = "auto";
        return;
      }

      // height only (x100)
      if (!hasW && hasH) {
        img.style.height = h + "px";
        img.style.width = "auto";
        return;
      }

      // both (300x100)
      if (hasW && hasH) {
        img.style.width = w + "px";
        img.style.height = h + "px";
        return;
      }
    }
  }

  /**
   * Parse and apply :align=... to an <img>.
   * Supports:
   *   :align=left
   *   :align=center
   *   :align=middle  (alias of center)
   *   :align=right
   *
   * Alignment is done with block display and margins on the image itself.
   */
  function applyAlign(img, alignPart) {
    if (!alignPart) return;

    var a = String(alignPart).toLowerCase();

    // Reset any previous alignment styles we may have set
    img.style.display = "";
    img.style.marginLeft = "";
    img.style.marginRight = "";

    if (a === "center" || a === "middle") {
      img.style.display = "block";
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
      return;
    }

    if (a === "right") {
      img.style.display = "block";
      img.style.marginLeft = "auto";
      img.style.marginRight = "0";
      return;
    }

    if (a === "left") {
      img.style.display = "block";
      img.style.marginLeft = "0";
      img.style.marginRight = "auto";
      return;
    }
  }

  function imageSizePlugin(hook, vm) {
    hook.doneEach(function () {
      var container = document.querySelector(".markdown-section");
      if (!container) return;

      var imgs = container.querySelectorAll("img[title]");
      Array.prototype.forEach.call(imgs, function (img) {
        var title = img.getAttribute("title") || "";

        // Look for :size=... and :align=... in the title.
        // They are expected to be single tokens (no spaces).
        var sizeMatch = title.match(/:size=([^\s]+)/);
        var alignMatch = title.match(/:align=([^\s]+)/);

        var sizePart = sizeMatch ? sizeMatch[1].trim() : null;
        var alignPart = alignMatch ? alignMatch[1].trim() : null;

        if (!sizePart && !alignPart) {
          return;
        }

        // Clean the title so :size=... and :align=... do not appear in tooltips
        var cleanTitle = title
          .replace(/:size=[^\s]+/g, "")
          .replace(/:align=[^\s]+/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanTitle) {
          img.setAttribute("title", cleanTitle);
        } else {
          img.removeAttribute("title");
        }

        if (sizePart) {
          applySize(img, sizePart);
        }

        if (alignPart) {
          applyAlign(img, alignPart);
        }
      });
    });
  }

  // Auto register with Docsify in browser, robust to script order
  if (typeof window !== "undefined") {
    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(
      imageSizePlugin
    );
  }

  // Export plugin function in case someone wants to register manually
  return imageSizePlugin;
}));
