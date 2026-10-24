# UI and theme conventions

## CSS ownership

- `web/css/tokens.css` owns structural defaults and derived tokens such as spacing, radii, shell width, and status colors.
- `web/css/base.css` owns document defaults, typography, focus treatment, and reduced-motion behavior.
- `web/css/layout.css` owns shell, page, and layout utilities.
- `web/css/components.css` owns reusable component visuals. See [components.md](components.md) for the inventory and behavioral contracts.
- `web/themes/*.css` owns palette values and theme metadata. Keep palette values out of component CSS; components consume semantic custom properties.
- `web/style.css` is the aggregate stylesheet entry. Preserve the build/server ordering when changing imports or generated concatenation.

Use BEM names: `.block`, `.block__element`, `.block--modifier`. Keep elements scoped to their block. Use modifiers for visual variants, not state that already has a canonical HTML/ARIA attribute. JavaScript targets `data-*` hooks; CSS targets classes and semantic state attributes. Avoid styling based on those behavior hooks.

Component CSS must use theme variables for color, borders, shadows, and status treatment rather than literal palette colors. Structural constants belong in tokens when shared. Keep one-off layout rules with the relevant layout or page composition.

## Theme palette contract

Theme discovery scans loaded CSS rules for a root-level `[data-theme="id"]` selector. Add a file named `web/themes/<id>.css` with a selector exactly matching its kebab-case filename ID, a human-facing `--theme-name`, and `color-scheme: light` or `dark`. `web/src/theme.js` uses these fields to list and sort themes, validate selections, apply the `data-theme` value, persist it in local storage, and dispatch `theme:changed` when the selected ID changes.

Every theme must define the palette variables consumed across the UI:

- Surfaces and text: `--bg`, `--bg2`, `--bg3`, `--bg4`, `--fg`, `--dim`, `--faint`.
- Borders and accents: `--line`, `--accent`, `--accent-fg`, `--sel`, `--mark`, `--mark-active`, `--cur`, `--shadow`.
- Syntax colors: `--k`, `--kt`, `--nf`, `--nc`, `--nb`, `--nv`, `--no`, `--na`, `--nt`, `--nd`, `--np`, `--s`, `--m`, `--o`, `--p`, `--c`, `--cp`, `--err`.
- Diff/status: `--gi`, `--gd`, `--gi-bg`, `--gd-bg`.

Every theme defines `--on-accent` with at least 4.5:1 contrast against its `--accent` fill. Use this pair for primary buttons. Where selection needs a theme-specific foreground, define `--on-mark-active`; `--success`, `--warning`, `--danger`, `--on-accent`, and `--scrim` also have structural fallbacks in `tokens.css`. Keep the palette values together in a single `:root[data-theme="id"]` rule and preserve the existing comment groupings.

The current palettes are: `catppuccin-latte`, `catppuccin-mocha`, `dark`, `dracula`, `github-dark`, `gruvbox-dark`, `gruvbox-light`, `light`, `monokai`, `nord`, `one-dark`, `rose-pine`, `solarized-dark`, and `solarized-light`. Their display names and exact values live in the theme files.

## Add or extend a component

1. Search `docs/components.md`, existing markup, and component CSS for an existing pattern. Compose existing blocks before adding another variant.
2. Give a new reusable pattern a descriptive kebab-case block name. Its child classes use `block__element`; optional visual variants use `block--modifier`. Avoid generic names such as `.active` or `.blue` that can affect unrelated components.
3. Put reusable styling in `web/css/components.css`; shell geometry belongs in `layout.css`. Put demo-only styling in `web/storyboard.css`. Reuse existing spacing and color tokens; add a shared token in `tokens.css` only when the meaning is genuinely shared. Color literals belong in theme palettes.
4. Prefer semantic HTML and native behavior. Use IDs to connect labels, `aria-controls`, and panels, not for CSS specificity. Keep selectors shallow: a component class plus a state attribute is usually enough. Scope `is-*` transient state to its block (for example `.toast.is-leaving`).
5. Add behavior as an explicitly called initializer accepting a root element, or a small exported helper. Query inside that root where possible. Use `data-*` hooks for JavaScript. Define whether initialization is once-only, what markup is required, and how listeners/timers are cleaned up if the component can be removed. Existing initializers run once per page load.
6. Add an interactive example to the development storyboard and an inventory entry in `docs/components.md`. Verify keyboard operation, visible focus, narrow layout, reduced motion, light/dark palettes, and loading/error/disabled states relevant to the component.
7. Run `make check` and `make build`. Check the Node-only bundler fallback if adding imports or exports; its limitations are documented in the README. For changed asset paths or files, update `go:embed` and Docker's explicit copies so the production binary includes reusable assets and excludes gallery examples.

Example styling and behavior hooks:

```html
<section class="notice notice--compact" data-notice>
  <p class="notice__message">Saved successfully.</p>
  <button class="button button--quiet" data-notice-dismiss>Dismiss</button>
</section>
```

```css
.notice {
  padding: var(--space-4);
  border: 1px solid var(--line);
  background: var(--bg2);
}
.notice--compact {
  padding: var(--space-2);
}
.notice__message {
  color: var(--fg);
}
```

Use `element.hidden = true` when dismissing the notice. Its JavaScript should select `[data-notice-dismiss]`, not `.notice__message`. This is a naming example, not an additional built-in component.

## Add a theme

Copy an existing palette, change its filename/selector ID and `--theme-name`, and adjust its values together. `/static/themes.css` joins files in filename order; the server caches this result in production and re-reads files per request in development. Theme discovery automatically adds the new ID to the selector, so no JavaScript registry change is needed. A saved ID that no longer exists falls back to Catppuccin Mocha. `theme:changed` is a document event with `event.detail.id` and is emitted only for an actual theme change.

The palette files retain upstream syntax-color tokens for compatibility; this template does not include a code editor or syntax highlighting. New generic components should use the surface/text/status tokens rather than binding their meaning to syntax-token names.
