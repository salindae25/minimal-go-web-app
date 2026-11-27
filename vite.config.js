import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: resolve(root, 'web/react'),
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': resolve(root, 'web/react/src') } },
  build: {
    outDir: resolve(root, 'web/react-dist'),
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: { output: { entryFileNames: 'app.js', assetFileNames: '[name][extname]' } },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.jsx'],
    setupFiles: ['./src/test-setup.js'],
  },
});
