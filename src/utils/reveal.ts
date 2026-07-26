/* global document, window */

/**
 * Adds `in-view` to matching elements the first time they enter the viewport.
 * CSS keyframes keyed off `.in-view` handle the actual animation, so this
 * stays a few lines of dependency-free JS.
 */
export function observeReveal(selector: string, cls = "in-view") {
  const els = document.querySelectorAll(selector);
  if (!els.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add(cls));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(cls);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => io.observe(el));
}
