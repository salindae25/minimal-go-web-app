import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'web',
  plugins: [vue(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': process.env.API_PROXY_TARGET || `http://127.0.0.1:${process.env.PORT || 8080}`,
      '/healthz': process.env.API_PROXY_TARGET || `http://127.0.0.1:${process.env.PORT || 8080}`,
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
