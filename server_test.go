package main

import (
	"encoding/json"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strings"
	"testing"
	"testing/fstest"
)

func TestServingModes(t *testing.T) {
	for _, dev := range []bool{false, true} {
		name := "production"
		if dev {
			name = "development"
		}
		t.Run(name, func(t *testing.T) {
			handler, err := newHandler(dev)
			if err != nil {
				t.Fatal(err)
			}
			check := func(path string, status int, fragment string) {
				t.Helper()
				w := httptest.NewRecorder()
				handler.ServeHTTP(w, httptest.NewRequest(http.MethodGet, path, nil))
				if w.Code != status || !strings.Contains(w.Body.String(), fragment) {
					t.Fatalf("%s: status=%d (want %d), expected body fragment %q", path, w.Code, status, fragment)
				}
			}
			entry := "/static/app.js"
			if dev {
				entry = "/static/src/main.js"
			}
			check("/", 200, entry)
			check("/static/app.js", 200, "/api/hello")
			check("/static/style.css", 200, "css/tokens.css")
			check("/static/css/components.css", 200, ".dialog")
			check("/static/themes.css", 200, "--theme-name:")
			check("/static/theme-init.js", 200, "localStorage")
			check("/missing", 404, "404")
			sourceStatus := 404
			if dev {
				sourceStatus = 200
			}
			check("/static/src/main.js", sourceStatus, "")
			check("/dev/components", sourceStatus, "")
			check("/static/storyboard.css", sourceStatus, "")
			check("/static/src/storyboard.js", sourceStatus, "")
			check("/static/components.html", sourceStatus, "")
			check("/api/hello", 200, "Hello from Go.")
			check("/healthz", 200, "ok\n")
			w := httptest.NewRecorder()
			handler.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/api/hello", nil))
			if w.Code != http.StatusMethodNotAllowed {
				t.Fatalf("POST status = %d", w.Code)
			}
			w = httptest.NewRecorder()
			handler.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/api/hello", nil))
			var reply struct {
				Message string `json:"message"`
			}
			if err := json.Unmarshal(w.Body.Bytes(), &reply); err != nil || reply.Message != "Hello from Go." {
				t.Fatalf("invalid JSON reply: %s", w.Body.String())
			}
		})
	}
}

func TestConfig(t *testing.T) {
	t.Setenv("HOST", "")
	t.Setenv("PORT", "")
	cfg, err := loadConfig()
	if err != nil || cfg.host != "127.0.0.1" || cfg.port != "8080" {
		t.Fatalf("defaults: %+v, %v", cfg, err)
	}
	t.Setenv("HOST", "0.0.0.0")
	t.Setenv("PORT", "9000")
	cfg, err = loadConfig()
	if err != nil || cfg.host != "0.0.0.0" || cfg.port != "9000" {
		t.Fatalf("env: %+v, %v", cfg, err)
	}
	for _, port := range []string{"0", "65536", "abc"} {
		t.Setenv("PORT", port)
		if _, err := loadConfig(); err == nil {
			t.Fatalf("accepted invalid port %q", port)
		}
	}
}

func TestThemeStylesheet(t *testing.T) {
	assets, err := fs.Sub(embedded, "web")
	if err != nil {
		t.Fatal(err)
	}
	paths, err := fs.Glob(assets, "themes/*.css")
	if err != nil || len(paths) == 0 {
		t.Fatalf("theme files: %v, %v", paths, err)
	}
	joined, err := joinThemes(assets)
	if err != nil {
		t.Fatal(err)
	}
	required := []string{"--theme-name:", "color-scheme:", "--bg:", "--bg2:", "--bg3:", "--bg4:", "--fg:", "--dim:", "--faint:", "--line:", "--accent:", "--accent-fg:", "--on-accent:", "--sel:", "--shadow:", "--err:", "--s:", "--mark-active:"}
	for _, path := range paths {
		data, err := fs.ReadFile(assets, path)
		if err != nil {
			t.Fatal(err)
		}
		id := strings.TrimSuffix(strings.TrimPrefix(path, "themes/"), ".css")
		if !regexp.MustCompile(`:root\[data-theme=["']` + regexp.QuoteMeta(id) + `["']\]`).Match(data) {
			t.Errorf("%s: selector must match filename", path)
		}
		for _, token := range required {
			if !strings.Contains(string(data), token) {
				t.Errorf("%s missing %s", path, token)
			}
		}
		if !strings.Contains(joined, string(data)) {
			t.Errorf("%s missing from joined stylesheet", path)
		}
	}
}

func TestJoinThemesOrder(t *testing.T) {
	themes := fstest.MapFS{
		"themes/z.css": &fstest.MapFile{Data: []byte("last")},
		"themes/a.css": &fstest.MapFile{Data: []byte("first")},
	}
	body, err := joinThemes(themes)
	if err != nil || strings.Index(body, "first") > strings.Index(body, "last") {
		t.Fatalf("order: %q, %v", body, err)
	}
}
