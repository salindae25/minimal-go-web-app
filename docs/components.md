# UI component inventory

The starter provides reusable visual patterns in `web/css/components.css` and a small set of behavior helpers in `web/src/`. The `/dev/components` storyboard demonstrates their combinations when the server runs with `-dev`; it is development-only and excluded from production embedding.

## Inventory

| Pattern                 | Classes / composition                                                        | Behavior                                                                                                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App shell               | `.app-shell`, `__header`, `__title`, `__actions`, `__content`, `__status`    | `initSidebar(shell)` initializes responsive sidebar state with `[data-sidebar-toggle]`; `[data-sidebar-resize]` adds optional resizing.                                                                                                                 |
| Sidebar                 | `.sidebar`, `__heading`, `__nav`, `__link`, `__footer`                       | Toggle sets `aria-expanded`; shell gets `.app-shell--sidebar-hidden`. Resize handle supports pointer and arrow/Home/End keys and updates `aria-valuenow` / `aria-valuemax`.                                                                             |
| Page layout             | `.page`, `.page__intro`, `.stack`, `.cluster`                                | CSS layout only.                                                                                                                                                                                                                                        |
| Buttons                 | `.button`, `--primary`, `--quiet`, `--icon`                                  | Native button/link semantics.                                                                                                                                                                                                                           |
| Panel                   | `.panel`, `__header`, `__title`, `__body`, `__footer`                        | CSS composition only.                                                                                                                                                                                                                                   |
| Fields                  | `.field`, `__label`, `__hint`, `.input`, `.select`, `.textarea`, `.checkbox` | Use native labels and controls; associate hints with `aria-describedby` when useful.                                                                                                                                                                    |
| Badge and keycap        | `.badge`, `--success`, `--warning`, `.keycap`                                | Presentational.                                                                                                                                                                                                                                         |
| Tabs                    | `.tabs`, `__tab`                                                             | `initTabs(root)` expects descendants with `role="tab"`, each with `aria-controls` pointing to a panel ID. It maintains one selected tab, roving `tabindex`, panel `hidden`, and arrow/Home/End navigation. Use the tablist/tab/tabpanel ARIA structure. |
| Dialog                  | `.dialog`, `__header`, `__title`, `__body`, `__footer`                       | Native `<dialog>`; use `showModal()` and native close/return-value behavior.                                                                                                                                                                            |
| Popover                 | `.popover`, `__item`                                                         | Native Popover API; trigger and target must be connected with `popovertarget` or equivalent behavior.                                                                                                                                                   |
| Divider and empty state | `.divider`, `.empty-state`, `__title`                                        | Presentational.                                                                                                                                                                                                                                         |
| Toast                   | `.toast`, `.toast-icon-*`, `.toast-chip`, `.toast-msg`, `--error`            | `showToast(message, { tone, duration })` writes message as text, replaces current toast, then hides it after the duration. Requires `[data-toast]`; tones are informational labels, with error styling for `tone: 'error'`.                             |
| Screen-reader utility   | `.sr-only`                                                                   | Visually hides content while keeping it available to assistive technology.                                                                                                                                                                              |

## Composition and behavior

Compose patterns with semantic HTML and native controls. Add a component when a visual or interaction pattern is reused; keep one-off page composition in the page markup. Keep visual classes separate from JavaScript hooks: use BEM classes for styling and `data-*` attributes for behavior. Use native state attributes as the canonical state where available (`aria-selected`, `aria-expanded`, `hidden`); styling should follow that state rather than a parallel state class.

Behavior helpers are explicit initializers, not a framework. Call them with the relevant root after its markup exists. `initTabs` requires at least one tab and valid panel IDs; `initSidebar` returns without setup if the shell or toggle hook is missing; resizing is optional. Toast calls safely do nothing when no `[data-toast]` target exists.

## Use the storyboard

Run `make dev`, then open http://127.0.0.1:8080/dev/components. The application sidebar links to it in development. All 14 themes, sidebar resizing, tab keyboard navigation, buttons, form controls, badges, dialogs, popovers, and notification tones can be inspected there. The root application remains the small API example.

`web/components.html`, `web/storyboard.css`, and `web/src/storyboard.js` contain only gallery examples and are never embedded into the production binary. Their routes return 404 in production. Keep new examples there rather than adding demonstration behavior to the production entry point.

The sidebar starts collapsed on small screens and expands inline above the content; it does not cover interactive content. The resize handle is a desktop enhancement. Native dialogs require modern browsers with `<dialog>` support, and popovers require the native Popover API.

## Minimal toast usage

```js
import { showToast } from './toast.js';
showToast('Changes saved.', { tone: 'success' });
```

Include one empty, hidden `.toast` element with `data-toast`, `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`. Repeated notifications replace the current one. Put actionable or persistent errors in the affected component rather than relying on an expiring toast.
