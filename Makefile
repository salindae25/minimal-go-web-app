.PHONY: web web-check dev build check tools lint lint-go format format-check test

STATICCHECK_VERSION := v0.8.2
STATICCHECK := $(CURDIR)/bin/tools/$(STATICCHECK_VERSION)/staticcheck

web:
	npm run build

web-check: web
	npm run check

dev:
	npm run dev:all

dev-api:
	go run . -dev

build: web
	mkdir -p bin
	CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o bin/server .

$(STATICCHECK):
	mkdir -p "$(dir $(STATICCHECK))"
	GOBIN="$(dir $(STATICCHECK))" go install honnef.co/go/tools/cmd/staticcheck@$(STATICCHECK_VERSION)

tools: $(STATICCHECK)
	npm ci

lint-go: web $(STATICCHECK)
	go vet ./...
	"$(STATICCHECK)" ./...

lint: lint-go
	npm run lint

format:
	node scripts/format-go.js --write
	npm run format

format-check:
	node scripts/format-go.js
	npm run format:check

test: web
	go test ./...

check: web web-check lint format-check test
