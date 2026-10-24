# Go conventions

The template uses the standard library and a small `package main` server. Keep that scale: use `http.ServeMux` with explicit method-aware routes and focused handlers. Add an `internal` package when a concern becomes independently useful or has a clear boundary.

## HTTP and frontend routing

Keep API routes explicit under `/api/`; validate inputs at the handler boundary, set headers before writing, encode JSON with the standard library, and stop after writing an error response. Pass `r.Context()` to cancellable work. Unknown API paths and unsupported methods should return the documented 404/405 responses.

Production embeds the Vite output at `web/dist`. Serve built assets with immutable caching when content-hashed, and serve the SPA entry document without caching for frontend routes so Vue Router can handle HTML5 history paths. Keep `/api/*`, `/healthz`, `/assets/*`, and `/dev/*` server-owned paths out of SPA fallback. Development mode serves API/health endpoints while Vite serves the frontend and proxies backend paths; do not duplicate the frontend development server in Go.

## Configuration and lifecycle

Read process configuration at startup from environment variables using the existing defaults and validation. Keep development mode explicit through the existing flag. Keep `.env` parsing out of the server unless the template adopts a documented dependency and contract.

Keep startup, listener errors, signal handling, and graceful shutdown in the server lifecycle boundary. Use a bounded shutdown context and close resources owned by the process there. Handle errors where useful context or the correct HTTP response can be added; wrap with `%w` when callers need to inspect an error. Configure HTTP timeouts deliberately and avoid panics for runtime request/configuration errors.

Match surrounding formatting and naming: idiomatic mixed-case Go identifiers, short concrete functions, and comments for exported declarations or non-obvious decisions. Prefer direct code over speculative abstractions. Keep gallery-only route handling conditional on development; production gallery code is excluded by the frontend build.
