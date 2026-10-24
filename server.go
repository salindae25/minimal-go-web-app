package main

import (
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"
	"strings"
)

// Vite produces the complete public client; source and development examples stay out.
//
//go:embed all:web/dist
var embedded embed.FS

func newHandler(dev bool) (http.Handler, error) {
	assets, err := fs.Sub(embedded, "web/dist")
	if err != nil {
		return nil, err
	}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		_, _ = w.Write([]byte("ok\n"))
	})
	mux.HandleFunc("GET /api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		_ = json.NewEncoder(w).Encode(map[string]string{"message": "Hello from Go."})
	})
	// Reserve backend namespaces so a missing API or asset never returns SPA HTML.
	mux.HandleFunc("GET /api", http.NotFound)
	mux.HandleFunc("GET /api/", http.NotFound)
	mux.HandleFunc("GET /healthz/", http.NotFound)
	mux.HandleFunc("GET /dev", http.NotFound)
	mux.HandleFunc("GET /dev/", http.NotFound)
	mux.HandleFunc("GET /src/", http.NotFound)
	if dev {
		mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			_, _ = w.Write([]byte("Go API is running. Open the Vite frontend at http://localhost:5173.\n"))
		})
	} else {
		index, err := fs.ReadFile(assets, "index.html")
		if err != nil {
			return nil, err
		}
		files := http.FileServerFS(assets)
		mux.Handle("GET /assets/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only successful fingerprinted files receive immutable caching.
			path := strings.TrimPrefix(r.URL.Path, "/")
			if info, err := fs.Stat(assets, path); err != nil || info.IsDir() {
				http.NotFound(w, r)
				return
			}
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			files.ServeHTTP(w, r)
		}))
		mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
			// File-looking URLs must fail rather than silently loading the app.
			if strings.Contains(r.URL.Path, ".") {
				http.NotFound(w, r)
				return
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Header().Set("Cache-Control", "no-cache")
			_, _ = w.Write(index)
		})
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		mux.ServeHTTP(w, r)
	}), nil
}
