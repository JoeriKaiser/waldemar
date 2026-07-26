/* global document */

/**
 * Subtle "magnetic" pull toward the cursor for `[data-magnetic]` elements.
 * Pure transform + CSS transition — no animation library required.
 */
export function attachMagnetic(root: ParentNode = document, strength = 10) {
  const nodes = root.querySelectorAll<HTMLElement>("[data-magnetic]");
  nodes.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / strength;
      const y = (e.clientY - (r.top + r.height / 2)) / strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}
