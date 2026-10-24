# Lightweight frontend library options

## Recommendation

**Alpine.js** is the best first fit if the goal is reactive behavior for small pieces of UI. It adds state and event bindings to existing HTML, works as a standalone script, and leaves the Go JSON API, global CSS themes, native dialogs, and popovers intact ([Alpine Start Here](https://alpinejs.dev/start-here)).

**htmx** is the conditional second choice when Go should render HTML fragments for forms, navigation, or partial updates. Its central model is HTML over the wire; it does not directly replace the template’s current JSON API pattern ([htmx docs](https://htmx.org/docs/)). The two can coexist, but using htmx with only JSON responses misses its main benefit.

Neither is a visual component library. Styling and palettes use Tailwind utilities and the template’s shadcn-vue primitives; native controls remain an option when no suitable primitive exists ([component inventory](../components.md), [UI conventions](../ui-conventions.md)).

## Project fit

This template develops with native ES modules and embeds a generated production bundle in the Go binary. Its custom Node fallback only combines local relative imports; it does not resolve npm packages or dynamic imports. The project has Node/npm development tooling, but adding a package import still requires a compatible package-aware build path and a matching development import strategy ([README](../../README.md#frontend-build)). For any candidate, a pinned local prebuilt distribution best preserves one-binary production deployment.

| Library | Fit and what it teaches | Main tradeoff for this template |
| --- | --- | --- |
| **Alpine.js** | HTML-first reactive state and event directives. Lowest-friction fit with existing CSS and browser-native dialog/popover behavior. Official docs show script-tag setup ([quick start](https://alpinejs.dev/start-here)). | Expressions are placed in HTML attributes. The standard build conflicts with strict CSP `unsafe-eval`; an official CSP build exists but supports a narrower expression subset ([CSP docs](https://alpinejs.dev/advanced/csp)). |
| **htmx** | Hypermedia: request attributes, HTML responses, and DOM swaps. Standalone JS file needs no build system and can be vendored locally ([install docs](https://htmx.org/docs/#installing)). | Using it idiomatically shifts some Go handlers from JSON to HTML fragment responses. JSON can coexist, but this means two response styles. Strict CSP needs deliberate configuration ([CSP docs](https://htmx.org/docs/#csp)). |
| **Preact** | Component functions, props/state, and virtual DOM. Makes sense when the UI grows into a stateful component application. It supports browser ESM; without a build step its guide recommends HTM instead of JSX ([getting started](https://preactjs.com/guide/v10/getting-started/)). | More concepts and a tighter build/development integration. Bare npm imports do not work with the template’s Node fallback; plan for self-contained modules or package-aware bundling. |
| **Lit** | Reactive custom elements, templates, and Web Components. Lit offers prebuilt single-file ESM bundles as well as npm installation ([getting started](https://lit.dev/docs/getting-started/)). | Lit renders into Shadow DOM by default. Global component CSS does not style its internals, so existing class-based components and themes need adaptation through scoped CSS and custom properties ([styles](https://lit.dev/docs/components/styles/), [Shadow DOM](https://lit.dev/docs/components/shadow-dom/)). |

## Learning tradeoffs

Alpine teaches reactive state scopes and directive expressions while keeping markup central. htmx teaches hypermedia and server-rendered interaction. Preact teaches component/state rendering and JSX or HTM. Lit teaches custom elements, Shadow DOM, slots, and scoped styling. For this generic starter, Alpine is useful for small local behaviors; choose htmx when the server should own updated markup. Consider Preact for substantial client-side state, or Lit for reusable Web Components.

If adopting a library, vendor a pinned standalone file/module locally rather than making production depend on a public CDN. htmx’s own docs recommend considering alternatives to CDN production use ([htmx installation](https://htmx.org/docs/#installing)).
