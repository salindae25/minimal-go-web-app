# UI component inventory

The browser client uses shadcn-vue components in `web/src/components/ui/`. They are Vue source files built on Reka UI and styled with Tailwind utilities. The component gallery at `/dev/components` is development-only and excluded from production builds.

## Inventory

| Component or view     | File                               | Contract                                                                                                                                                                |
| --------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application shell     | `web/src/App.vue`                  | Tailwind grid shell, responsive sidebar, route links, theme selector, shared counter, and toast host.                                                                   |
| Button wrapper        | `web/src/components/UiButton.vue`  | Maps the template's `default`, `primary`, and `quiet` variants onto shadcn-vue Button variants.                                                                         |
| Panel wrapper         | `web/src/components/UiPanel.vue`   | Composes shadcn-vue Card primitives using the template's compact panel layout.                                                                                          |
| shadcn-vue primitives | `web/src/components/ui/`           | Source-owned Button, Card, Input, Label, Checkbox, Select, Dialog, Popover, Tabs, Badge, Alert, and Separator components. Add more with the shadcn-vue CLI when needed. |
| Toast host            | `web/src/components/ToastHost.vue` | Shows Pinia toast state through Alert and Badge components. Trigger through the toast store.                                                                            |
| Home                  | `web/src/views/HomeView.vue`       | Calls `GET /api/hello` through the API helper and demonstrates loading/error/result states.                                                                             |
| Shared state          | `web/src/views/StateView.vue`      | Demonstrates counter actions backed by Pinia.                                                                                                                           |
| Not found             | `web/src/views/NotFoundView.vue`   | Vue Router catch-all page with a shadcn-vue Button link home.                                                                                                           |
| Component gallery     | `web/src/views/StoryboardView.vue` | Development-only examples of shadcn-vue controls, forms, tabs, dialog, popover, toasts, and theme tokens.                                                               |

## Vue and state conventions

Use Vue 3 single-file components with `<script setup>` and Composition API. Keep view-specific state in `ref`/`computed`. Use Pinia for state shared across routes or with a clear shared lifecycle: the counter, theme, and toast stores are examples. Put mutations and side effects in store actions. Route-specific navigable state belongs in the URL.

The router uses HTML5 history. Add routes in `web/src/main.js`; keep the catch-all route last. `/dev/components` is registered only inside `import.meta.env.DEV` and loaded dynamically so gallery code stays out of production output. Keep its examples in `StoryboardView.vue`.

Use shadcn-vue primitives before building another control. Compose them in template-specific wrappers when the same visual pattern recurs. Keep one-off composition in its view. Prefer Vue bindings and Reka UI primitives for interactions; use native browser controls when no suitable project primitive exists and the browser control provides the needed behavior with less code.

When adding a reusable component, add a gallery example and update this inventory. Check keyboard use, visible focus, narrow layouts, reduced motion, all palettes, and relevant loading/error/disabled states. Add store behavior tests under `web/tests/` when shared state changes. Run the documented checks and inspect the production build when changing route or gallery loading behavior.
