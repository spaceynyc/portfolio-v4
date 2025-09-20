# Design Tokens

This project provides a tokenized design system that is shared between Tailwind utilities and raw CSS via `src/styles/tokens.css`.

## Colors
- `ink`, `iris`, `lavender`, `slate`, `mint` each expose 50-900 shades and a `DEFAULT` accent.
- Use classes like `bg-iris-500`, `text-slate-200`, or refer to CSS variables (`--color-iris-500`) directly in shaders, canvas sketches, etc.

## Radius scale
- Rounded utilities map to the following radii: `xs` 2px, `sm` 4px, `md` 6px, `lg` 8px, `xl` 12px, `2xl` 16px, `3xl` 24px.
- CSS variables: `--radius-xs` through `--radius-3xl`.

## Shadow depth
- Depth tokens (`shadow-depth-1` through `shadow-depth-5`) add progressively larger, softer shadows tuned for dark UI.
- Raw values are also available via `--shadow-depth-*` variables.

## Opacity steps
- Semantic opacity steps (`opacity-4`, `opacity-8`, ..., `opacity-96`) support consistent overlay and tint treatments.
- In CSS, grab the matching variable (`--opacity-24`) or the Tailwind utility (`opacity-24`).

## Motion timings
- Durations: `duration-120`, `duration-160`, `duration-240`, `duration-320`, `duration-400`, plus semantic `duration-t-in`, `duration-t-out`, `duration-t-snap`.
- Easings: `ease-t-in`, `ease-t-out`, `ease-t-snap`, and the calm defaults `ease-calm` and `ease-calm-inout`.
- Tokens are mirrored in CSS as `--motion-duration-*` and `--motion-ease-*`.

## Type scale
- Fluid clamp typography is registered as Tailwind font sizes (`text-display`, `text-title`, `text-lead`, `text-body`, `text-micro`).
- Matching CSS variables (`--font-display-size`, etc.) allow use in inline styles or third-party contexts.

## Glass surfaces
- `surface-glass-100` through `surface-glass-700` create translucent, blurred layers with gradient tints and depth-aware borders.
- Classes bundle gradient background, 1px color-mixed border, blur, and an appropriate `shadow-depth-*` preset.

## Calm motion exports
- `src/styles/motion.ts` exports `calmMotion` for Framer Motion usage (quartic/quintic bezier tuples plus a spring config) and `easeCalm` for quick access to the default easing curve.

## Usage quick-reference
- Tailwind: `text-display`, `shadow-depth-3`, `rounded-2xl`, `surface-glass-300`, `ease-calm`, `duration-400`.
- CSS: `color: var(--color-iris-400);`, `border-radius: var(--radius-xl);`, `box-shadow: var(--shadow-depth-2);`.
