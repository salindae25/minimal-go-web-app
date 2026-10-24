# UI and theme conventions

## Tailwind and shadcn-vue

Use Tailwind CSS 4 utilities in Vue templates for layout, spacing, color, typography, and responsive behavior. Reusable interactive primitives live in `web/src/components/ui/` as shadcn-vue source files built on Reka UI. They are project-owned code and can be edited directly. When a suitable primitive exists, use it in views and storyboards instead of recreating its control with raw HTML and utility classes.

Add a primitive with `npx shadcn-vue@latest add <component>` from the repository root. Review every generated file and keep JavaScript output, the `@/` alias, and `components.json` paths consistent with this Vite project. Generated components use the shadcn-vue semantic color names; preserve the theme mapping in `web/src/style.css` when adding or updating components. Keep the system font mapping and remove any external font-provider import the CLI adds.

Use the components' `variant` and `size` props before adding new style branches. Use `class` for local layout and small composition adjustments. Keep repeated component-specific logic and semantics in a reusable Vue wrapper. Avoid adding new component CSS files or BEM class styles; use Tailwind utilities and the shared primitives.

## Theme palette contract

The 14 retained px0 palettes are: `catppuccin-latte`, `catppuccin-mocha`, `dark`, `dracula`, `github-dark`, `gruvbox-dark`, `gruvbox-light`, `light`, `monokai`, `nord`, `one-dark`, `rose-pine`, `solarized-dark`, and `solarized-light`.

The Pinia theme store discovers palette CSS and display names from `web/themes/*.css`. Add a file named `web/themes/<id>.css` with a root-level `[data-theme="<id>"]` selector, a human-facing `--theme-name`, and an appropriate `color-scheme`. Define the palette's existing surface, text, border, accent, syntax, and status variables. Keep `--on-accent` at a minimum 4.5:1 contrast with `--accent`.

`web/src/style.css` is the sole global stylesheet. It imports Tailwind and maps shadcn-vue semantic tokens (`background`, `foreground`, `primary`, `muted`, `border`, `ring`, and others) to the palette variables. Keep that map semantic and stable so all generated components follow the selected palette. The theme store adds the `.dark` class for palettes whose `color-scheme` is dark; Tailwind's dark variant follows that class. Do not add a separate component theme or a second dark-mode source.

## Shared state

The theme store applies `data-theme` to the document root and persists only the selected theme in localStorage. Saved IDs must match a discovered palette; invalid IDs fall back to the store default. Shared state belongs in Pinia when it must survive route navigation. Keep page-local state in Vue refs and navigable state in the URL.

## Add or extend a component

1. Read [the component inventory](components.md) and inspect existing primitives and wrappers.
2. Search `web/src/components/ui/` before adding another control. Add a missing shadcn-vue primitive with the CLI, then review its code and dependencies.
3. Compose repeated patterns in a Vue SFC under `web/src/components/`; keep one-off composition in its view. Give wrappers a small prop, slot, and event API.
4. Add or update an example in the development-only component gallery and update `docs/components.md`.
5. Check keyboard behavior, visible focus, responsive layouts, reduced motion, all palettes, and disabled/error/loading states where relevant.

The palette CSS files are design tokens, not component styles. Keep app styles in Tailwind utilities and shared primitives rather than creating CSS selectors for individual pages or controls.
