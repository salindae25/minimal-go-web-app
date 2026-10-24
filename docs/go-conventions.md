# Go conventions

This template uses the standard library and a small `package main` server. Keep that scale: use `http.ServeMux` with explicit method-aware routes and focused handler functions. Add an `internal` package when a concern becomes independently useful or has a clear boundary, not as a default layer for every file.

## HTTP handlers

- Keep route registration visible and explicit. Return 404 for unknown routes and 405 for unsupported methods where the endpoint contract calls for it.
- Parse and validate request input at the handler boundary. Set response headers before writing, encode JSON with the standard library, and stop after writing an error response.
- Pass `r.Context()` to work that can block or be cancelled. Avoid background work detached from the request unless it has an explicit lifecycle.
- Keep handlers small by extracting meaningful operations, not generic wrappers. Use standard-library types and errors until a concrete need justifies more abstraction.

## Configuration and lifecycle

Read process configuration at startup from environment variables using the existing defaults and validation. Keep local development mode explicit through the existing development flag; avoid hidden environment-dependent behavior. Keep `.env` parsing out of the server unless the template adopts a documented dependency and contract.

Construct the handler with its asset mode explicit so disk-backed development assets and embedded production assets remain distinct. Keep startup, listener errors, signal handling, and graceful shutdown in the server lifecycle boundary. Use a bounded shutdown context and close resources owned by the process there.

## Errors and timeouts

Handle errors at the boundary that can add useful context or produce the correct HTTP response. Wrap errors with `%w` when callers need to inspect them. Configure server read/header/write/idle timeouts deliberately; use request contexts and deadlines for downstream operations. Avoid panics for runtime request or configuration errors.

Match surrounding formatting and naming: idiomatic mixed-case Go identifiers, short concrete functions, and comments that explain exported declarations or non-obvious decisions. Prefer direct code over architectural frameworks or speculative abstractions.

When adding a Go package, include its directory in Docker's explicit source-copy instructions and run the container build. Keep development-only routes conditional on the development flag, and keep their markup, example scripts, and styles outside the production embed list.
