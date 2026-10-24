# Minimal Go server template

A stripped-down foundation extracted from [px0](https://github.com/px0-ai/px0): vanilla JavaScript modules, a small custom bundler, CSS variables, and a Go server with embedded production assets.

## Develop

Requires Go 1.25+ for the application and Node.js 24.8+ for contributor tooling (Bun is optional). Use Go 1.27 for the complete lint toolchain.

```sh
make dev
```

Open http://127.0.0.1:8080. The `-dev` flag serves `web/` from disk and uses native ES modules from `web/src/main.js`. It also enables the component storyboard at http://127.0.0.1:8080/dev/components; that page is development-only. Refresh the browser after frontend changes; there is no hot reload or file watcher. Restart the command after Go changes. Run from the project root in development.

## Build and run

```sh
make build
HOST=0.0.0.0 PORT=8080 ./bin/server
```

The executable embeds HTML, CSS, and the generated JavaScript bundle. It can run from any directory without Node.js, Bun, source files, or external Go dependencies. Configuration comes from `HOST` (default `127.0.0.1`) and `PORT` (default `8080`). `.env.example` documents these settings; the server does not load dotenv files automatically. SIGINT/SIGTERM trigger graceful shutdown with a ten-second deadline.

## Structure

```text
main.go                environment configuration and server lifecycle
server.go              API routes, static files, embedded assets, development mode
web/index.html         accessible starter page
web/css/              structural tokens, base, layout, and reusable components
web/themes/           fourteen discoverable color palettes
docs/                 component inventory and UI/Go conventions
web/src/main.js        browser entry point and example interaction
web/src/dom.js         selector helpers
web/src/api.js         same-origin JSON request helper
web/app.js             generated production bundle (kept for go:embed)
scripts/build-web.js   px0 bundler adapted to one entry point
scripts/check-web.js   JavaScript syntax and local import checks
```

`GET /api/hello` demonstrates the client/server boundary. Replace it with your application endpoints. Unknown routes return 404; unsupported API methods return 405. Production source modules are not embedded.

## Frontend build

```sh
npm run build
npm run check
make check
```

`make build` always rebuilds JavaScript before embedding. Direct `go build` uses the existing `web/app.js`; rebuild it after changing frontend sources.

The build script comes from px0. If Bun is installed, it bundles and minifies the app. Otherwise its dependency-free Node fallback orders local imports and combines modules in one IIFE. This fallback is intentionally limited: use named exports and unaliased named imports, relative explicit `.js` paths, and unique top-level names across modules. It is not a complete ES-module bundler; it does not support npm dependencies, dynamic imports, or module isolation. Use Bun consistently if you need those semantics. Bundler output size differs between the two paths.

Development uses native ES modules, so always run `make check` and `make build` before shipping to catch differences from the Node fallback. The application build needs no package installation, database, or production JavaScript runtime. Contributor linting uses development-only npm dependencies; see [development tooling](docs/tooling.md).

## Extraction boundary

Retained or adapted from px0: the actual Bun/Node bundler, DOM selector helpers, the JSON request-helper pattern, CSS token styling, and the embedded-asset client/server architecture. The Go lifecycle and starter page are newly written for this template. px0's editor, workbench, Git, agent integrations, search UI, telemetry, updater, and product CLI are omitted. The generic theme palettes and reusable UI patterns are retained or adapted; see [the component inventory](docs/components.md) and [theme conventions](docs/ui-conventions.md).

[UPSTREAM.md](UPSTREAM.md) records provenance. The upstream MIT license is retained in [LICENSE](LICENSE).

## Docker and Compose

Requires Docker with BuildKit and Docker Compose. No local Go or Node installation is needed.

```sh
docker compose up --build -d --wait
curl http://127.0.0.1:8080/healthz
docker compose logs -f app
docker compose down
```

Compose publishes on localhost by default. To change the published address or port:

```sh
BIND_ADDRESS=0.0.0.0 HOST_PORT=9000 docker compose up --build -d --wait
```

Compose also reads these interpolation values from a local `.env` file. Its container environment sets `HOST=0.0.0.0` and `PORT=8080`; the host publishing settings are separate. The server itself still does not load dotenv files.

Standalone image usage:

```sh
docker build -t minimal-go-server-template .
docker run --rm -p 127.0.0.1:8080:8080 minimal-go-server-template
```

The runtime uses Alpine's BusyBox HTTP client to check `GET /healthz`, which returns 200 when the server can handle requests. It runs as numeric user `65532:65532`. Compose uses a read-only filesystem, drops capabilities, limits log rotation, and allows 15 seconds for the server's ten-second graceful shutdown. The app writes no runtime files. Docker reports an unhealthy container but does not automatically restart it solely for failing a health check; `unless-stopped` restarts exited processes. `EXPOSE 8080` is metadata; standalone containers can still change `PORT` with `-e` and the corresponding publish mapping.

### Build cache behavior

- The frontend stage copies only bundler scripts, package metadata, and JavaScript source. Go, HTML, and CSS edits reuse the frontend bundle. There are currently no npm dependencies to install.
- The Go dependency step copies only `go.mod` and optional `go.sum`. Add and commit `go.sum` when introducing dependencies. The module download cache persists across source changes.
- BuildKit cache mounts preserve `/go/pkg/mod` and `/root/.cache/go-build` across builds on the same builder. Go recompiles changed packages and reuses cached standard-library and dependency compilation.
- Go vet and tests run before producing the binary. The builder runs natively and cross-compiles the final executable for Docker's target architecture.
- The runtime contains the executable and attribution, with assets embedded. Go, Node, source modules, and build caches stay in build stages.
- `.dockerignore` excludes local environment files, generated bundles, binaries, and other irrelevant files. Docker always regenerates the frontend bundle from source.

A second unchanged `docker compose build` should show cached build steps. Local cache mounts belong to the builder; fresh CI builders do not automatically inherit them. For CI, configure Buildx `--cache-from`/`--cache-to` with a registry or CI cache backend for layer reuse. Cache-mount contents require separate persistence on ephemeral builders. Base image tags pin supported release lines, not immutable digests; use `docker compose build --pull` for updates and pin digests when deployment reproducibility requires it.

Docker caching reference: https://docs.docker.com/build/cache/optimize/

## Coding practices and linting

Read [code-quality practices](docs/code-quality.md) for structural simplicity, ownership boundaries, reusable helpers, explicit contracts, and decomposition guidance adapted from the `thermo-nuclear-code-quality-review` skill. [AGENTS.md](AGENTS.md) links these rules for coding agents.

```sh
make tools
make check
make format  # when formatting changes are needed
```

Checks include gofmt, Go vet, Staticcheck, ESLint, Stylelint, HTML Validate, Prettier, and existing asset/API tests. See [tooling.md](docs/tooling.md) for versions, individual commands, CI behavior, and primary references. Linting dependencies stay out of the production image.
