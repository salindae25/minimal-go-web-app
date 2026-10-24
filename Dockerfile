# syntax=docker/dockerfile:1

# Independent frontend stage: Go changes do not invalidate this bundle.
FROM --platform=$BUILDPLATFORM node:24-alpine AS frontend
WORKDIR /src
COPY package.json ./
COPY scripts/build-web.js scripts/check-web.js ./scripts/
COPY web/src/ ./web/src/
COPY web/theme-init.js ./web/
RUN node scripts/build-web.js && node scripts/check-web.js

FROM --platform=$BUILDPLATFORM golang:1.27-alpine AS backend
WORKDIR /src
# Download dependencies before copying frequently changing application sources.
# go.sum is optional while this template has no external Go dependencies.
COPY go.mod go.sum* ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY *.go ./
COPY web/index.html web/style.css web/theme-init.js ./web/
COPY web/css/ ./web/css/
COPY web/themes/ ./web/themes/
# Storyboard markup and styles exist only to exercise development routes in tests.
COPY web/components.html web/storyboard.css ./web/
COPY --from=frontend /src/web/app.js ./web/app.js
# Source modules are needed by the development-mode route tests, not the runtime.
COPY --from=frontend /src/web/src/ ./web/src/
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go vet ./... && go test ./...
ARG TARGETOS
ARG TARGETARCH
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \
    go build -trimpath -ldflags="-s -w" -o /out/server .

# BusyBox provides the HTTP health probe; no extra probe binary or package install.
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
