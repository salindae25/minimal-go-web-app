# Upstream provenance

Source: https://github.com/px0-ai/px0

Inspected commit: `c7d3f907f4ec128d2847c46fbf7ba10c56152278`

- `scripts/build-web.js`: copied and adapted; removed the workbench entry and vendor precompression because this template has neither.
- `web/src/dom.js`: selector helpers extracted from `web/src/state.js`.
- `web/src/api.js`: adapted request-helper pattern with HTTP-status checks and same-origin validation.
- `web/style.css`: retains the CSS-variable approach; product-specific rules replaced with a small starter layout.
- Go embedding and static serving follow px0's architecture; template server and lifecycle code are newly written.

Upstream copyright: Copyright (c) 2026 Arpit Bhayani. MIT license reproduced in `LICENSE`.

## UI foundation extraction

- All 14 `web/themes/*.css` palettes are copied from the inspected px0 commit. Their documentation pointers point to this template's conventions, and each palette adds an accessible `--on-accent` foreground for primary buttons.
- `web/src/theme.js` retains px0's CSS-rule discovery approach; the settings API and product event bus are removed. Theme preference uses a template-specific localStorage key.
- `web/css/layout.css` adapts px0's sidebar/resizer/status layout into reusable classes.
- `web/css/components.css` adapts px0's compact controls, tabs, modal geometry, and toast CSS, with generic class names. Native dialog/popover behavior replaces product-specific overlay code.
- `web/src/toast.js` adapts px0's toast lifecycle with safe text nodes and generic notification tones.
- Storyboard, generic sidebar/tab interactions, and development-only routing are template additions.

## Tooling normalization

Copied CSS palettes and adapted source have been formatted with the template's Prettier/Stylelint configuration. Legacy RGB notation is normalized to modern CSS syntax; palette values are retained. Contributor tooling and code-quality guidance are template additions.
