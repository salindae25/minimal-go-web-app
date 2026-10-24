package main

import (
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"
	"os"
	"strings"
)

// Production includes only public assets, not source modules or build scripts.
//
//go:embed web/index.html web/style.css web/app.js web/css web/themes web/theme-init.js
var embedded embed.FS

func newHandler(dev bool) (http.Handler, error) {
	assets, err := fs.Sub(embedded, "web")
	if err != nil {
		return nil, err
	}
	if dev {
		assets = os.DirFS("web")
	}
	themeCSS, err := joinThemes(assets)
	if err != nil {
		return nil, err
	}
	mux := http.NewServeMux()
	servePage := func(name string, developmentEntry bool) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			page, err := fs.ReadFile(assets, name)
			if err != nil {
				http.Error(w, "Page unavailable", http.StatusInternalServerError)
				return
			}
			if developmentEntry {
				page = []byte(strings.Replace(string(page), `<script defer src="/static/app.js"></script>`,
					`<script type="module" src="/static/src/main.js"></script>`, 1))
				page = []byte(strings.Replace(string(page), "<!-- dev-navigation -->",
					`<a class="sidebar__link" href="/dev/components">Component storyboard</a>`, 1))
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Header().Set("Cache-Control", "no-cache")
			_, _ = w.Write(page)
		}
	}
	mux.HandleFunc("GET /{$}", servePage("index.html", dev))
	if dev {
		// No storyboard page, examples, or source modules are embedded in production.
		mux.HandleFunc("GET /dev/components", servePage("components.html", false))
	}
	mux.HandleFunc("GET /static/themes.css", func(w http.ResponseWriter, r *http.Request) {
		body := themeCSS
		if dev {
			// Re-read theme files so refresh reflects edits without restarting Go.
			var err error
			body, err = joinThemes(assets)
			if err != nil {
				http.Error(w, "Themes unavailable", http.StatusInternalServerError)
				return
			}
		}
		w.Header().Set("Content-Type", "text/css; charset=utf-8")
		_, _ = w.Write([]byte(body))
	})
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServerFS(assets)))
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
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// Unhashed assets must revalidate after a new binary is deployed.
		if dev || strings.HasPrefix(r.URL.Path, "/static/") {
			w.Header().Set("Cache-Control", "no-cache")
		}
		mux.ServeHTTP(w, r)
	}), nil
}

// joinThemes follows px0's filename-ordered stylesheet concatenation pattern.
func joinThemes(assets fs.FS) (string, error) {
	paths, err := fs.Glob(assets, "themes/*.css")
	if err != nil {
		return "", err
	}
	var stylesheet strings.Builder
	for _, path := range paths {
		data, err := fs.ReadFile(assets, path)
		if err != nil {
			return "", err
		}
		stylesheet.WriteString("/* " + path + " */\n")
		stylesheet.Write(data)
		stylesheet.WriteByte('\n')
	}
	return stylesheet.String(), nil
}
