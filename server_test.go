package main

import (
	"io/fs"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAPIAndReservedPaths(t *testing.T) {
	for _, dev := range []bool{false, true} {
		handler, err := newHandler(dev)
		if err != nil {
			t.Fatal(err)
		}
		for _, test := range []struct {
			method, path string
			status       int
			body         string
		}{
			{"GET", "/api/hello", 200, `"message":"Hello from Go."`},
			{"GET", "/healthz", 200, "ok\n"},
			{"POST", "/api/hello", 405, ""},
			{"GET", "/api/missing", 404, ""},
			{"GET", "/api", 404, ""},
			{"GET", "/dev/components", 404, ""},
			{"GET", "/src/main.js", 404, ""},
			{"GET", "/assets/missing.js", 404, ""},
		} {
			response := httptest.NewRecorder()
			handler.ServeHTTP(response, httptest.NewRequest(test.method, test.path, nil))
			if response.Code != test.status || !strings.Contains(response.Body.String(), test.body) {
				t.Errorf("dev=%v %s %s: status=%d want=%d body=%q", dev, test.method, test.path, response.Code, test.status, response.Body.String())
			}
			if strings.Contains(response.Header().Get("Cache-Control"), "immutable") {
				t.Errorf("%s: error/API marked immutable", test.path)
			}
		}
	}
}

func TestProductionHistoryFallbackAndAssets(t *testing.T) {
	handler, err := newHandler(false)
	if err != nil {
		t.Fatal(err)
	}
	for _, path := range []string{"/", "/state", "/unknown-page"} {
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest("GET", path, nil))
		if response.Code != 200 || !strings.Contains(response.Body.String(), `type="module"`) {
			t.Errorf("%s: missing SPA entry", path)
		}
		if response.Header().Get("Cache-Control") != "no-cache" {
			t.Errorf("%s: entry must revalidate", path)
		}
	}
	paths, err := fs.Glob(embedded, "web/dist/assets/*")
	if err != nil || len(paths) == 0 {
		t.Fatalf("build assets first: %v", err)
	}
	for _, path := range paths {
		route := strings.TrimPrefix(path, "web/dist")
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest("GET", route, nil))
		if response.Code != 200 || !strings.Contains(response.Header().Get("Cache-Control"), "immutable") {
			t.Errorf("%s: asset missing or uncached", route)
		}
		if strings.Contains(path, "Storyboard") || strings.Contains(path, "storyboard") {
			t.Errorf("development storyboard in production: %s", path)
		}
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
