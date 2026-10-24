# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:24-alpine AS frontend
WORKDIR /src
# Stable dependency layer with a persistent npm download cache.
COPY package.json package-lock.json ./
COPY scripts/setup-tooling.js ./scripts/
RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline --maxsockets=5 --fetch-timeout=30000 --fetch-retries=1
COPY vite.config.js ./
COPY web/ ./web/
RUN npm run build

FROM --platform=$BUILDPLATFORM golang:1.27-alpine AS backend
WORKDIR /src
COPY go.mod go.sum* ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY *.go ./
COPY --from=frontend /src/web/dist/ ./web/dist/
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go vet ./... && go test ./...
ARG TARGETOS
ARG TARGETARCH
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \
    go build -trimpath -ldflags="-s -w" -o /out/server .

FROM alpine:3.23 AS runtime
WORKDIR /app
COPY --from=backend /out/server ./server
COPY LICENSE UPSTREAM.md ./
USER 65532:65532
ENV HOST=0.0.0.0 PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -T 2 -O /dev/null "http://127.0.0.1:${PORT}/healthz" || exit 1
STOPSIGNAL SIGTERM
ENTRYPOINT ["/app/server"]
