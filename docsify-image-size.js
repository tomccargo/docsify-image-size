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

  function imageSizeFixPlugin(hook, vm) {
    hook.doneEach(function () {
      var container = document.querySelector(".markdown-section");
      if (!container) return;

      var imgs = container.querySelectorAll("img[title]");
      Array.prototype.forEach.call(imgs, function (img) {
        var title = img.getAttribute("title") || "";
        var idx = title.indexOf(":size=");
        if (idx === -1) return;

        var sizePart = title.slice(idx + 6).trim();
        if (!sizePart) return;

        // Clean the title so :size=... is not shown as tooltip
        var cleanTitle = title.slice(0, idx).trim();
        if (cleanTitle) {
          img.setAttribute("title", cleanTitle);
        } else {
          img.removeAttribute("title");
        }

        // Remove attributes Docsify may have added
        img.removeAttribute("width");
        img.removeAttribute("height");

        // 1) Percentage: :size=50%
        if (sizePart.indexOf("%") !== -1) {
          var pm = sizePart.match(/^(\d+(?:\.\d+)?)\s*%$/);
          if (pm) {
            img.style.width = pm[1] + "%";
            img.style.height = "auto";
          }
          return;
        }

        // 2) Single pixel value: :size=200  -> width 200px, height auto
        if (/^\d+$/.test(sizePart)) {
          var wOnly = parseInt(sizePart, 10);
          if (!isNaN(wOnly)) {
            img.style.width = wOnly + "px";
            img.style.height = "auto";
          }
          return;
        }

        // 3) width x height (both optional): :size=200x100, 200x, x100
        var parts = sizePart.split(/x/i);
        if (parts.length >= 1) {
          var rawW = (parts[0] || "").trim();
          var rawH = (parts[1] || "").trim();

          var w = rawW ? parseInt(rawW, 10) : NaN;
          var h = rawH ? parseInt(rawH, 10) : NaN;

          var hasW = !isNaN(w);
          var hasH = !isNaN(h);

          // width only (200x)
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

          // both (200x100)
          if (hasW && hasH) {
            img.style.width = w + "px";
            img.style.height = h + "px";
            return;
          }
        }
      });
    });
  }

  // Auto register with Docsify in browser
  if (typeof window !== "undefined" && window.$docsify) {
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(
      imageSizeFixPlugin
    );
  }

  // Export plugin function in case someone wants to register manually
  return imageSizeFixPlugin;
}));
