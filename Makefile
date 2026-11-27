.PHONY: web web-check web-react dev dev-react build check tools lint lint-go format format-check test

STATICCHECK_VERSION := v0.8.2
STATICCHECK := $(CURDIR)/bin/tools/$(STATICCHECK_VERSION)/staticcheck

web:
	node scripts/build-web.js

web-react:
	npm run build:react

web-check: web
	node scripts/check-web.js
	npm run check:react
	npm run test:react

dev:
	go run . -dev

dev-react:
	npm run dev:react

build: web web-react
	mkdir -p bin
	CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o bin/server .

$(STATICCHECK):
	mkdir -p "$(dir $(STATICCHECK))"
	GOBIN="$(dir $(STATICCHECK))" go install honnef.co/go/tools/cmd/staticcheck@$(STATICCHECK_VERSION)

tools: $(STATICCHECK)
	npm ci

lint-go: web web-react $(STATICCHECK)
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

test: web web-react
	go test ./...

check: web web-check lint format-check test
