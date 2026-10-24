import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const webRoot = fileURLToPath(new URL('./web', import.meta.url));

export default defineConfig({
  root: webRoot,
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': path.join(webRoot, 'src') },
  },
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
