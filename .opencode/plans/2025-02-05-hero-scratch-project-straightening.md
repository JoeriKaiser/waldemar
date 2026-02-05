# Interactive Hero Scratch & Project Straightening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement two interactive features: (1) scratch-to-reveal hero portrait that transitions from overlay to base image via hover/touch, and (2) project cards that straighten on hover (desktop) or scroll-into-view (mobile).

**Architecture:** The hero uses HTML5 Canvas with `destination-out` composite operation for scratch revealing, preloading both images and rendering overlay on top of base. Project cards use GSAP ScrollTrigger for mobile auto-straightening and GSAP tweening for desktop hover interactions, with viewport detection to apply appropriate behaviors.

**Tech Stack:** Astro, TypeScript, GSAP (ScrollTrigger), HTML5 Canvas, CSS transforms

---

## Task 1: Import Overlay Image Asset

**Files:**

- Modify: `src/components/Jumbo/Jumbo.astro`

**Step 1: Add import for overlay image**

Add the import alongside the existing base image import:

```astro
---
import { Image } from "astro:assets";
import base from "../../assets/images/base.png";
import overlay from "../../assets/images/overlay.png";
---
```

**Step 2: Commit**

```bash
git add src/components/Jumbo/Jumbo.astro
git commit -m "feat(hero): import overlay image for scratch reveal"
```

---

## Task 2: Update Hero Portrait HTML Structure

**Files:**

- Modify: `src/components/Jumbo/Jumbo.astro:44-61`

**Step 1: Restructure portrait to have base visible, overlay on canvas**

Replace the current portrait-inner div structure:

```astro
<div class="portrait-inner" data-portrait>
  <!-- Base image (always visible underneath) -->
  <Image
    src={base}
    alt="Portrait of Joeri"
    class="portrait-image portrait-real"
    loading="eager"
  />
  <!-- Overlay image on canvas (scratched away) -->
  <canvas class="scratch-canvas" data-scratch-canvas></canvas>
</div>
```

**Step 2: Commit**

```bash
git add src/components/Jumbo/Jumbo.astro
git commit -m "feat(hero): restructure portrait for overlay-on-base layering"
```

---

## Task 3: Preload Overlay Image

**Files:**

- Modify: `src/components/Jumbo/Jumbo.astro:74-84`

**Step 1: Add overlay image preloading in script setup**

Before the existing querySelector calls, add image preloading:

```typescript
const root = document.querySelector("[data-jumbo-root]");
if (!root) return;

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const tiltContainer = root.querySelector("[data-tilt-container]");
const portrait = root.querySelector("[data-portrait]");
const cmdk = root.querySelector("#open-cmdk");
const canvas = root.querySelector(
  "[data-scratch-canvas]"
) as HTMLCanvasElement | null;
const realImage = root.querySelector(
  ".portrait-real"
) as HTMLImageElement | null;

cmdk?.addEventListener("click", () =>
  window.dispatchEvent(new CustomEvent("open-command-palette"))
);

// Preload overlay image for scratch effect
const overlayImage = new Image();
overlayImage.src = overlay.src;
```

**Step 2: Commit**

```bash
git add src/components/Jumbo/Jumbo.astro
git commit -m "feat(hero): preload overlay image for scratch canvas"
```

---

## Task 4: Implement Scratch Canvas Rendering

**Files:**

- Modify: `src/components/Jumbo/Jumbo.astro:90-117`

**Step 1: Update canvas setup to draw overlay image**

Replace the setupCanvas function inside the scratch effect block:

```typescript
    // Scratch reveal effect
    if (canvas && realImage && portrait) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let isDrawing = false;
      let scratchedPixels = 0;
      const revealThreshold = 0.25; // Reveal fully after 25% scratched

      const setupCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Draw the overlay image (this gets scratched away)
        ctx.drawImage(overlayImage, 0, 0, rect.width, rect.height);
      };

      // Wait for both images to load
      let imagesLoaded = 0;
      const onImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded >= 2) {
          setupCanvas();
        }
      };

      if (realImage.complete) {
        onImageLoad();
      } else {
        realImage.addEventListener("load", onImageLoad);
      }

      if (overlayImage.complete) {
        onImageLoad();
      } else {
        overlayImage.addEventListener("load", onImageLoad);
      }
```

**Step 2: Commit**

```bash
git add src/components/Jumbo/Jumbo.astro
git commit -m "feat(hero): render overlay image on scratch canvas"
```

---

## Task 5: Enhance Scratch Interaction for Touch/Mouse

**Files:**

- Modify: `src/components/Jumbo/Jumbo.astro:125-162`

**Step 1: Add support for both mouse and touch events**

Update the event listeners to support both pointer and touch events:

```typescript
const scratch = (x: number, y: number) => {
  const rect = canvas.getBoundingClientRect();
  const canvasX = x - rect.left;
  const canvasY = y - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 30, 0, Math.PI * 2); // Slightly larger brush
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  scratchedPixels += Math.PI * 30 * 30;
  const totalPixels = rect.width * rect.height;

  if (scratchedPixels / totalPixels > revealThreshold) {
    portrait.classList.add("revealed");
  }
};

const onStart = (e: PointerEvent | TouchEvent) => {
  isDrawing = true;
  if (e instanceof PointerEvent) {
    scratch(e.clientX, e.clientY);
  } else if (e.touches && e.touches[0]) {
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  }
};

const onMove = (e: PointerEvent | TouchEvent) => {
  if (!isDrawing) return;
  if (e instanceof PointerEvent) {
    scratch(e.clientX, e.clientY);
  } else if (e.touches && e.touches[0]) {
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  }
};

const onEnd = () => {
  isDrawing = false;
};

// Pointer events for mouse/touch unified handling
canvas.addEventListener("pointerdown", onStart as EventListener);
canvas.addEventListener("pointermove", onMove as EventListener);
canvas.addEventListener("pointerup", onEnd);
canvas.addEventListener("pointerleave", onEnd);

// Fallback touch events for mobile
canvas.addEventListener("touchstart", onStart as EventListener, {
  passive: false,
});
canvas.addEventListener("touchmove", onMove as EventListener, {
  passive: false,
});
canvas.addEventListener("touchend", onEnd);
canvas.addEventListener("touchcancel", onEnd);
```

**Step 2: Commit**

```bash
git add src/components/Jumbo/Jumbo.astro
git commit -m "feat(hero): add touch support for scratch interaction"
```

---

## Task 6: Update Project Card ScrollTrigger for Mobile Only

**Files:**

- Modify: `src/components/ProjectTimeline/Preview.astro:182-224`

**Step 1: Move mobile scroll-straightening logic**

The current mobile scroll-straightening code exists but needs to be the ONLY auto-straightening behavior. Ensure the ScrollTrigger is mobile-only by checking viewport first:

```typescript
// On mobile, straighten card when in view
if (isMobile) {
  const cardRotation = getComputedStyle(item as Element)
    .getPropertyValue("--card-rotation")
    .trim();
  const rotationValue = parseFloat(cardRotation) || 0;

  ScrollTrigger.create({
    trigger: item,
    start: "top 70%",
    end: "bottom 30%",
    onEnter: () => {
      gsap.to(item.querySelector(".card-inner"), {
        rotation: 0,
        y: -4,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    onLeave: () => {
      gsap.to(item.querySelector(".card-inner"), {
        rotation: rotationValue,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    onEnterBack: () => {
      gsap.to(item.querySelector(".card-inner"), {
        rotation: 0,
        y: -4,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    onLeaveBack: () => {
      gsap.to(item.querySelector(".card-inner"), {
        rotation: rotationValue,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    },
  });
}
```

**Step 2: Commit**

```bash
git add src/components/ProjectTimeline/Preview.astro
git commit -m "refactor(projects): isolate mobile scroll-straightening to mobile only"
```

---

## Task 7: Add Desktop Hover Straightening Interaction

**Files:**

- Modify: `src/components/ProjectTimeline/Preview.astro:141-180`

**Step 1: Add desktop hover interaction for card straightening**

After the mobile ScrollTrigger code, add desktop hover logic:

```typescript
// Desktop: straighten on hover, rotate back on leave
if (!isMobile) {
  const cardInner = item.querySelector(".card-inner") as HTMLElement;
  if (cardInner) {
    const cardRotation = getComputedStyle(item as Element)
      .getPropertyValue("--card-rotation")
      .trim();
    const rotationValue = parseFloat(cardRotation) || 0;

    // Track if card is currently hovered
    let isHovered = false;

    cardInner.addEventListener("mouseenter", () => {
      isHovered = true;
      gsap.to(cardInner, {
        rotation: 0,
        y: -6,
        duration: 0.35,
        ease: "power2.out",
      });
    });

    cardInner.addEventListener("mouseleave", () => {
      isHovered = false;
      gsap.to(cardInner, {
        rotation: rotationValue,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    });

    // Also straighten on focus for accessibility
    cardInner.addEventListener("focusin", () => {
      gsap.to(cardInner, {
        rotation: 0,
        y: -6,
        duration: 0.35,
        ease: "power2.out",
      });
    });

    cardInner.addEventListener("focusout", () => {
      gsap.to(cardInner, {
        rotation: rotationValue,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    });
  }
}
```

**Step 2: Commit**

```bash
git add src/components/ProjectTimeline/Preview.astro
git commit -m "feat(projects): add desktop hover straightening interaction"
```

---

## Task 8: Make Card Inner Focusable for Accessibility

**Files:**

- Modify: `src/components/ProjectTimeline/Preview.astro:66-68`

**Step 1: Add tabindex to card-inner for keyboard accessibility**

Update the card-inner div to be focusable:

```astro
<div class="card-inner" tabindex="0"></div>
```

**Step 2: Update CSS for focus states**

In the style section, add focus-visible styles alongside the existing hover styles:

```css
.card-inner:hover,
.card-inner:focus-visible {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: var(--shadow-lg);
  outline: none;
}

@media (min-width: 768px) {
  .card-inner:hover,
  .card-inner:focus-visible {
    transform: rotate(0deg) translateY(-6px);
  }
}
```

**Step 3: Commit**

```bash
git add src/components/ProjectTimeline/Preview.astro
git commit -m "feat(projects): make cards focusable for keyboard accessibility"
```

---

## Task 9: Test and Verify Features

**Files:**

- Test: All modified components

**Step 1: Run dev server and test hero scratch**

```bash
bun run dev
```

**Verify:**

- [ ] Hero shows base image initially
- [ ] Hovering over portrait scratches away overlay
- [ ] Mobile touch scratching works
- [ ] 25% scratch threshold auto-reveals full image
- [ ] Reduced motion preference disables effect

**Step 2: Test project card straightening**

**Verify Desktop:**

- [ ] Cards display with rotation
- [ ] Hovering straightens card and lifts it (y: -6)
- [ ] Mouse leave returns to rotated state
- [ ] Keyboard focus also straightens card

**Verify Mobile (<768px):**

- [ ] Cards straighten automatically when scrolling into view
- [ ] Cards rotate back when scrolling out of view
- [ ] Hover also works on mobile-capable devices

**Step 3: Commit**

```bash
git commit --allow-empty -m "test: verify hero scratch and project straightening features"
```

---

## Task 10: Run Lint and Format Checks

**Files:**

- All modified files

**Step 1: Run linting**

```bash
bun run lint
```

**Expected:** No errors or warnings

**Step 2: Run format check**

```bash
bun run format:check
```

**Expected:** No formatting issues

**Step 3: Auto-fix any issues if needed**

```bash
bun run fix
```

**Step 4: Commit**

```bash
git add .
git commit -m "style: fix lint and format issues"
```

---

## Summary of Changes

**Files Modified:**

1. `src/components/Jumbo/Jumbo.astro` - Hero scratch reveal implementation
2. `src/components/ProjectTimeline/Preview.astro` - Project card straightening interactions

**New Behaviors:**

- Hero portrait transitions from overlay to base image via canvas scratch effect
- Supports both mouse hover (desktop) and touch (mobile)
- Project cards straighten on scroll (mobile) or hover/focus (desktop)
- Proper accessibility with keyboard focus support
- Respects prefers-reduced-motion

**Estimated Time:** 45-60 minutes
**Complexity:** Medium (requires canvas manipulation and GSAP animations)
