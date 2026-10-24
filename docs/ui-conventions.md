# UI and theme conventions

## Frontend structure and styling

Vue 3 single-file components use Composition API and `<script setup>`. `web/src/style.css` is the frontend stylesheet entry and imports Tailwind CSS 4 plus the shared CSS foundations. Use Tailwind utilities for local layout and composition in Vue templates; use shared component classes and CSS tokens for recurring patterns and semantic styling. The former `.page`, `.stack`, and `.cluster` layout patterns are expressed with utilities in the Vue views. Keep reusable Vue components in `web/src/components/`, route views in `web/src/views/`, and development gallery-only styles in `web/storyboard.css`, imported by the lazy gallery view.

BEM names follow `.block`, `.block__element`, and `.block--modifier`. Use modifiers for visual variants; use HTML/ARIA attributes for canonical interaction state. Component CSS uses semantic variables for palette colors, borders, and shadows. Structural constants belong in shared tokens when multiple components use the same meaning. Avoid direct DOM manipulation for UI state that Vue can own.

Tailwind theme aliases are declared with `@theme` in the stylesheet entry and map utility names onto the semantic palette variables. Keep aliases semantic and stable across palettes. Theme-specific values belong in `web/themes/*.css`, not component styles.

## Theme palette contract

There are 14 retained px0 palettes: `catppuccin-latte`, `catppuccin-mocha`, `dark`, `dracula`, `github-dark`, `gruvbox-dark`, `gruvbox-light`, `light`, `monokai`, `nord`, `one-dark`, `rose-pine`, `solarized-dark`, and `solarized-light`. The Pinia theme store discovers palette CSS and display names from these files. Add a file named `web/themes/<id>.css` with a root-level `[data-theme="<id>"]` selector, a human-facing `--theme-name`, and an appropriate `color-scheme`.

Every palette defines the semantic surface/text, border/accent, syntax, and diff/status variables already used by the foundation. Keep its values together in one selector and preserve the existing grouping comments. Every theme defines `--on-accent` with at least 4.5:1 contrast against `--accent`; primary controls use that pair. Structural fallbacks live in `web/css/tokens.css`.

The theme store applies `data-theme` to the document root and persists only the selected theme in localStorage. The saved ID must match a discovered palette; invalid IDs fall back to the store default. Shared state belongs in Pinia when it must survive route navigation. Keep page-local state in Vue refs and navigable state in the URL.

## Add or extend a component

1. Read [the component inventory](components.md) and inspect existing Vue components and styles. Compose existing patterns before adding another variant.
2. Put reusable behavior and markup in a Vue SFC under `web/src/components/`; keep one-off page composition in its view. Use typed-by-contract props, slots, and emitted events with a small public API.
3. Prefer native elements and browser behavior. Use Vue state and lifecycle hooks for interactions; clean up listeners and timers when their owner is removed. Keep styling in Tailwind utilities for local composition and shared classes/tokens for repeated semantics.
4. Add or update a gallery example for reusable UI and update `docs/components.md`. Keep gallery-only code behind the development route/dynamic import.
5. Run the documented checks and inspect the production output when changing lazy development code or route behavior.

## Add a theme

Copy an existing palette, change its filename/selector ID and `--theme-name`, then adjust the palette values together. Theme discovery adds it to the selector without a JavaScript registry edit. Check both light and dark palettes for readable text, focus, and status colors. Palette CSS is bundled by Vite; the Go server serves the built frontend in production.
