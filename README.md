# AetherLab - Motion-led React Experience

AetherLab is a high-contrast, motion-driven single-page experience built with React, Vite, and TypeScript. It pairs a custom p5.js canvas sketch with Framer Motion interactions, a bespoke cursor, and a rounded-rectangle mask menu reveal.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS (with extended palette & typography)
- Framer Motion for interface transitions
- p5.js for the glow-grid background sketch
- React Router for `/`, `/work`, `/resume`, `/about`, and `/contact` routes

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Features

- Fixed header with custom MENU trigger and clip-path menu overlay
- Animated starfield background rendered via p5.js
- Custom cursor with hover and drag states (respecting reduced motion)
- Contact drawer bottom sheet with live character count and validation
- Tailored copy, layout, and lavender-forward palette for the AetherLab brand

## Accessibility & Notes

- Menu overlay and contact drawer include focus traps, keyboard shortcuts, and accessible labels.
- Prefers-reduced-motion is respected by the cursor and background animation.
- Selection, scrollbar, and typography are tuned for the provided design system.

> Inspired by minimalist motion sites; not a clone.

## Starfield

- Animated twinkling starfield honors `prefers-reduced-motion` by rendering a static sky without drift.
- Tweak `Starfield.tsx` for star density, twinkle amplitude, or pointer drift to match performance needs.

### Twinkling Algorithm

- 400–600 stars spawn per viewport with randomized size (0.5–2.5px), base brightness (120–200), phase, and twinkle speed (0.5–1.5x).
- Brightness follows `base + sin(frameCount * 0.02 * twinkleSpeed + phase) * 55`, mapped to the lavender alpha channel for a soft glow.
- Mouse-relative parallax nudges each star a few pixels from the canvas center while the frame rate is capped at 45 FPS for stability.

### Reduced Motion Fallback

- When `prefers-reduced-motion` is enabled the sketch pauses, locking stars to their base brightness without the sinusoidal twinkle.
- The field still resizes responsively and regenerates stars to maintain density and contrast across breakpoints.