# Development tooling

## Setup and commands

Use Node.js 24.8+ for Vite and contributor tooling, and Go 1.27 for the complete development toolchain. The application module targets Go 1.25; the pinned Staticcheck release requires Go 1.26+ to build. Tool versions live in `package.json`/`package-lock.json` and the Makefile's `STATICCHECK_VERSION`.

```sh
make tools        # npm ci + pinned Staticcheck installation under ignored bin/tools/
make dev          # Go API + Vite frontend development servers
npm run dev       # Vite frontend only
make dev-api      # Go API only
make check        # build, validate assets, lint, formatting, and tests
make format       # write Go and Prettier formatting
make build        # Vite production assets + embedded Go executable
```

`npm run lint:js`, `npm run lint:css`, and `npm run lint:html` run individual checks. `make lint-go` runs Go vet and Staticcheck. `make check` verifies formatting without rewriting source and runs the Pinia store unit tests in `web/tests/` plus the Go tests.

Vite owns frontend transforms, Vue SFC compilation, Tailwind CSS 4 processing, dev server, and production assets. `make dev` starts Go in explicit development mode and Vite; Vite proxies `/api` and `/healthz` to the Go API. `npm run dev` serves only the frontend. `make dev-api` serves only the Go API. Vue 3, Pinia, and Vue Router are application dependencies; Vite 7, the Vue plugin, Tailwind CSS 4, and lint/format tools are development dependencies. Production `make build` runs the frontend build first, then embeds `web/dist` in a CGO-disabled Go binary. Frontend dependencies are bundled into static assets; the runtime needs no Node installation or source files.

## What is enforced

| Tool          | Purpose                                      | Configuration              |
| ------------- | -------------------------------------------- | -------------------------- |
| gofmt         | Canonical Go formatting                      | `scripts/format-go.js`     |
| go vet        | Standard-library diagnostics                 | `make lint-go`             |
| Staticcheck   | Go correctness and idiomatic simplifications | Version pinned in Makefile |
| ESLint        | JavaScript/Vue correctness                   | `eslint.config.js`         |
| Stylelint     | CSS and palette boundaries                   | `stylelint.config.js`      |
| HTML Validate | Validate the HTML document shell             | `.htmlvalidate.json`       |
| Prettier      | Consistent source/document formatting        | `.prettierrc.json`         |
| EditorConfig  | Shared editor whitespace                     | `.editorconfig`            |

## CI and Docker

CI runs repository checks, Go race tests, Compose validation, and the Docker build. Docker runs `npm ci` in a cached Node stage, builds frontend assets, then builds the Go server in a separate cached stage; the final Alpine image contains the executable and attribution only. Vue application code is bundled into static assets; Node and npm packages are not copied into the runtime. Docker cache details and CI configuration are maintained in the Dockerfile and workflow.
