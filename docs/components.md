# UI component inventory

Reusable Vue components live in `web/src/components/`; route views live in `web/src/views/`. The development-only component gallery is `/dev/components` and is excluded from production builds.

## Inventory

| Component or view | File                               | Contract                                                                                                                                                   |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application shell | `web/src/App.vue`                  | Owns shared header, theme selector, responsive sidebar, navigation, toast host, and `<RouterView>`. The shared counter stays visible across route changes. |
| Button            | `web/src/components/UiButton.vue`  | Native `<button>` with `variant` (`default`, `primary`, `quiet`), `type`, disabled state, and slot content.                                                |
| Panel             | `web/src/components/UiPanel.vue`   | Section with required `title` and default slot.                                                                                                            |
| Toast host        | `web/src/components/ToastHost.vue` | Renders toast store state with live-region semantics. Trigger through the toast store.                                                                     |
| Home              | `web/src/views/HomeView.vue`       | Calls `GET /api/hello` through the API helper and demonstrates loading/error/result states.                                                                |
| Shared state      | `web/src/views/StateView.vue`      | Demonstrates counter actions backed by Pinia.                                                                                                              |
| Not found         | `web/src/views/NotFoundView.vue`   | Vue Router catch-all page with a link home.                                                                                                                |
| Component gallery | `web/src/views/StoryboardView.vue` | Development-only examples of controls, forms, tabs, native dialog/popover, toasts, and theme tokens.                                                       |

Vue views use Tailwind utility classes for local layout, alongside semantic HTML and shared component classes. Gallery-only styles are in `web/storyboard.css`, imported by the lazy gallery view. Add a reusable component when a visual or interaction pattern appears in multiple places; keep one-off composition in its view. Prefer native controls, `<dialog>`, and the Popover API where their browser behavior fits.

## Vue and state conventions

Use Vue 3 single-file components with `<script setup>` and Composition API. Keep view-specific state in `ref`/`computed`. Use Pinia for state shared across routes or for state with a clear shared lifecycle: the counter, theme, and toast stores are the examples. Put mutations and side effects in store actions. Route-specific navigable state belongs in the URL.

The router uses HTML5 history. Add routes in `web/src/main.js`; keep the catch-all route last. The `/dev/components` route is registered only inside `import.meta.env.DEV` and loaded with a dynamic import so gallery code stays out of production output. Keep its examples in `StoryboardView.vue` and gallery-only styles in `web/storyboard.css`; the view imports that stylesheet.

Do not add imperative DOM initializers for interactions already expressed by Vue. Use Vue bindings and lifecycle hooks; remove global listeners and timers when their owner is disposed. Keep styling classes separate from behavior and use semantic/ARIA state as the accessible source of truth.

When adding a component, update this inventory and include a useful example in the development gallery when the component is reusable. Check keyboard use, visible focus, narrow layouts, reduced motion, themes, and relevant loading/error/disabled states. Add store behavior tests under `web/tests/` when changing shared state. Run the repository checks and inspect the production build when changing route or gallery loading behavior.
