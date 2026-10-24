# Minimal Go server template

A small Go API and Vue 3 frontend extracted from [px0](https://github.com/px0-ai/px0). Vite builds the frontend, Vue Router handles client routes, Pinia holds shared UI state, and the production Go binary embeds the built assets. Tailwind CSS 4 and source-owned shadcn-vue components provide the client styling and controls; the existing palette files theme those components through semantic tokens.

## Develop

Requires Go 1.25+ for the application and Node.js 24.8+ for Vite and contributor tooling. Use Go 1.27 for the complete lint toolchain.

```sh
make tools
make dev
```

Open http://localhost:5173. `make dev` runs the Go API at `127.0.0.1:8080` in development mode and the Vite frontend; Vite proxies `/api` and `/healthz` to Go. `npm run dev` starts only Vite, and `make dev-api` starts only the Go API. The API-only root response points to the Vite URL. The component gallery at `/dev/components` is registered and loaded only in development.

## Build and run

```sh
make build
HOST=0.0.0.0 PORT=8080 ./bin/server
```

`make build` builds the frontend into `web/dist`, then embeds it in a CGO-disabled Go executable. The binary runs from any directory without Node.js, frontend source files, or external Go dependencies. Set `HOST` (default `127.0.0.1`) and `PORT` (default `8080`) through the environment. `.env.example` documents the values; the server does not load dotenv files. SIGINT/SIGTERM trigger graceful shutdown with a ten-second deadline.

Production serves the Vue app for frontend routes, so Vue Router handles unknown paths. `/api/*`, `/healthz`, `/assets/*`, and `/dev/*` remain server routes; missing backend/assets return 404. Hashed assets use immutable caching and the app document is revalidated. The development gallery is excluded from the production frontend bundle.

## Structure

```text
main.go                 environment configuration and server lifecycle
server.go               API routes, Vite dev mode, embedded production assets
web/index.html          Vite document shell
web/src/main.js         Vue app, Pinia, and Vue Router setup
web/src/App.vue         shared app shell and navigation
web/src/components/     reusable Vue single-file components
web/src/components/ui/  shadcn-vue primitives owned by this project
web/src/views/          route views, including API and state examples
web/src/stores/         shared counter, theme, and toast state
web/src/style.css       Tailwind 4 entry and shadcn-vue theme mapping
components.json         shadcn-vue CLI configuration
web/themes/             fourteen retained color palettes
web/dist/               generated production frontend, embedded by Go
```

`GET /api/hello` demonstrates the client/server boundary. Replace it with application endpoints. See [component conventions](docs/components.md), [UI and theme conventions](docs/ui-conventions.md), and [Go conventions](docs/go-conventions.md).

## Checks

```sh
make check
make build
```

`make check` runs the Vite build, frontend store unit tests, Go vet/Staticcheck, frontend lint, formatting checks, and Go tests. Run `make tools` once to install pinned contributor tools. See [development tooling](docs/tooling.md) for the checks and CI details.

## Extraction boundary

The template retains px0's generic palette values, now mapped to Tailwind and shadcn-vue components. px0's editor, workbench, Git, agent integrations, search UI, telemetry, updater, and product CLI are omitted. [UPSTREAM.md](UPSTREAM.md) records provenance; the upstream MIT license is retained in [LICENSE](LICENSE).

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

Compose also reads these interpolation values from a local `.env` file. The container uses `HOST=0.0.0.0` and `PORT=8080`; host publishing settings are separate. The server itself does not load dotenv files. Standalone use:

```sh
docker build -t minimal-go-server-template .
docker run --rm -p 127.0.0.1:8080:8080 minimal-go-server-template
```

The runtime uses Alpine's BusyBox HTTP client for `/healthz` and runs as numeric user `65532:65532`. Compose uses a read-only filesystem, drops capabilities, limits log rotation, and allows 15 seconds for graceful shutdown. The app writes no runtime files. Docker reports unhealthy status when the health check fails; it does not restart a running container solely for that reason. `EXPOSE 8080` is metadata; standalone containers can change `PORT` with `-e` and a matching publish mapping.

Docker runs `npm ci` in a cached Node stage, builds Vite assets, then builds and tests Go in a separate cached stage. Vue and other frontend packages are bundled into the embedded assets; Node and npm packages are absent from the Alpine runtime. BuildKit cache mounts preserve npm downloads, Go modules, and compiler output on the same builder. See the Dockerfile and [tooling notes](docs/tooling.md) for cache behavior.

## Coding practices

Read [code-quality practices](docs/code-quality.md) for structural simplicity, ownership boundaries, and review guidance. [AGENTS.md](AGENTS.md) points coding agents to the relevant conventions.
