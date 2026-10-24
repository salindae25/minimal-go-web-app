# Development tooling

## Setup and commands

Use Node.js 24.8+ and Go 1.27 for the full development toolchain. The application module still targets Go 1.25, but the pinned Staticcheck release requires Go 1.26+ to build. Tool versions live in `package.json` / `package-lock.json` and the Makefile's `STATICCHECK_VERSION`; production Go dependencies remain separate.

```sh
make tools        # npm ci + pinned Staticcheck installation under ignored bin/tools/
make check        # bundle, validate assets, lint, check formatting, and test
make format       # write Go and Prettier formatting
make lint         # lint without running tests
```

`npm run lint:js`, `npm run lint:css`, and `npm run lint:html` run individual frontend checks. `make lint-go` runs Go vet and Staticcheck. `make check` verifies formatting without rewriting source files; it regenerates the ignored-by-formatting production bundle as part of its asset checks.

The JavaScript build itself remains dependency-free: `make build` and Docker builds do not need to install lint packages. `make tools` is needed for full contributor checks, not for running the production binary. npm dependencies are development-only, installed reproducibly with `npm ci`. No lint package or development tool is copied into the runtime container. The npm postinstall script writes a tiny `node_modules/go.mod` boundary so Go does not treat Go examples shipped inside npm dependencies as application packages. If installing with lifecycle scripts disabled, run `node scripts/setup-tooling.js` afterward.

## What is enforced

| Tool          | Purpose                                                                        | Configuration                                                                                 |
| ------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| gofmt         | Canonical Go formatting                                                        | `scripts/format-go.js` checks Go package directories, including platform-specific `.go` files |
| go vet        | Standard-library diagnostics                                                   | `make lint-go`                                                                                |
| Staticcheck   | Go correctness, unused code, and idiomatic simplifications                     | Version pinned in `Makefile`; upstream defaults                                               |
| ESLint        | JavaScript correctness, unused bindings, strict equality, dynamic-code hazards | `eslint.config.js`, browser and Node environments kept separate                               |
| Stylelint     | Valid CSS, BEM-style names, class-based selectors, and palette boundaries      | `stylelint.config.js`                                                                         |
| HTML Validate | Semantic HTML, explicit control types, labels, and ARIA misuse                 | `.htmlvalidate.json`                                                                          |
| Prettier      | Consistent JS/CSS/HTML/JSON/YAML/Markdown formatting                           | `.prettierrc.json`, generated bundle, lockfile, and independent research notes excluded       |
| EditorConfig  | Shared editor whitespace defaults                                              | `.editorconfig`                                                                               |

ESLint also flags JavaScript files exceeding 1,000 lines, matching the decomposition trigger in [code-quality.md](code-quality.md). Any justified suppression belongs at the narrowest location with its reason. Keep generated `web/app.js` out of source linting and formatting; lint the modules and validate the generated bundle's syntax instead.

Stylelint allows hex and RGB/HSL colors inside theme palettes. Elsewhere, components use tokens, gradients/mixes of tokens, and transparent backgrounds. ID selectors are rejected. The standard config's descending-specificity rule is disabled because the component stylesheet deliberately groups base, state, and variant rules; other checks remain enabled. Naming enforcement covers each class shape, while semantic reuse and ownership still require review.

Prettier handles formatting, so ESLint rules focus on correctness rather than quote and spacing preferences. HTML Validate uses its Prettier compatibility preset. Existing imported theme CSS has been normalized to the same formatting and modern color syntax without changing its palette values.

## CI and review

`.github/workflows/check.yml` runs the same checks for pushes and pull requests, plus the Go race detector, Compose configuration validation, and the Docker build. It caches npm downloads and Go compilation/module caches. The workflow uses read-only repository permission and cancels superseded runs. Hosting must provide GitHub Actions; this local template has no configured remote yet.

Passing lint does not establish accessibility, concurrency correctness, or a good abstraction boundary. Use the development storyboard for keyboard/mobile/theme checks, behavior tests for relevant contracts, and the [code-quality practices](code-quality.md) for structural review. Tool and action upgrades should be deliberate, with lockfile updates and the full checks rerun.

## Primary references

- [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments): naming, errors, interfaces, concurrency, and review conventions.
- [Effective Go](https://go.dev/doc/effective_go): core Go idioms; use current Go documentation for newer language and library features.
- [Staticcheck documentation](https://staticcheck.dev/docs/getting-started/).
- [ESLint flat configuration](https://eslint.org/docs/latest/use/configure/configuration-files).
- [Stylelint setup](https://stylelint.io/user-guide/get-started/).
- [HTML Validate setup and Prettier integration](https://html-validate.org/usage/index.html).
