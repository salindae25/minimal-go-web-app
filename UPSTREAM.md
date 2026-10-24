# Upstream provenance

Source: https://github.com/px0-ai/px0

Inspected commit: `c7d3f907f4ec128d2847c46fbf7ba10c56152278`

- `scripts/build-web.js`: copied and adapted; removed the workbench entry and vendor precompression because this template has neither.
- `web/src/dom.js`: selector helpers extracted from `web/src/state.js`.
- `web/src/api.js`: adapted request-helper pattern with HTTP-status checks and same-origin validation.
- `web/style.css` (now `web/src/style.css`): retains the CSS-variable approach; product-specific rules replaced with a small starter layout.
- Go embedding and static serving follow px0's architecture; template server and lifecycle code are newly written.

Upstream copyright: Copyright (c) 2026 Arpit Bhayani. MIT license reproduced in `LICENSE`.

## UI foundation extraction

The following paths describe the initial extraction. The Vue migration replaced the browser entry; the shadcn-vue migration below removed the hand-written layout and component styles. Palette provenance remains current.

- All 14 `web/themes/*.css` palettes are copied from the inspected px0 commit. Their documentation pointers point to this template's conventions, and each palette adds an accessible `--on-accent` foreground for primary buttons.
- The initial `web/src/theme.js` retained px0's CSS-rule discovery approach; that discovery and the template-specific localStorage preference now live in the Pinia theme store. The settings API and product event bus were removed.
- The initial `web/css/layout.css` and `web/css/components.css` adapted px0's sidebar, controls, tabs, modal, and toast styles into generic classes. These files were removed when the client moved to Tailwind utilities and shadcn-vue components.
- The initial `web/src/toast.js` adapted px0's toast lifecycle with safe text nodes and generic tones; toast state now lives in a Pinia store and renders through `ToastHost.vue`.
- Storyboard, generic sidebar/tab interactions, and development-only routing are template additions.

## Tooling normalization

Copied CSS palettes and adapted source have been formatted with the template's Prettier/Stylelint configuration. Legacy RGB notation is normalized to modern CSS syntax; palette values are retained. Contributor tooling and code-quality guidance are template additions.

## Vue frontend migration

- The original imperative browser entry, DOM helper, theme/toast modules, and handwritten asset bundler were replaced with Vue 3 single-file components, Vue Router, Pinia, and Vite.
- The fourteen palette files remain adapted from the inspected px0 version. The current semantic theme mapping, Tailwind CSS 4 utilities, and shadcn-vue component source are template additions.
- The component gallery is a development-only lazy route; production bundles omit its view.
- Go embeds Vite's production output. The development frontend is served by Vite and proxies API/health requests to Go.
