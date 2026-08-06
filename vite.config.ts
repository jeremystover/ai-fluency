import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // During `vite dev`, forward API calls to `wrangler dev` on :8787.
      '/api': 'http://localhost:8787',
    },
  },
});
