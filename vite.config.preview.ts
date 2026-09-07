/**
 * Build alternativo: empaqueta toda la tienda en un único archivo HTML
 * (JS, CSS e imágenes inlineadas) para compartir una demo estática.
 *
 *   npm run build:preview   ->  dist-preview/index.html
 *
 * Usa HashRouter porque no hay servidor que reescriba las rutas.
 * El build de producción normal (`npm run build`) usa BrowserRouter.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.VITE_HASH_ROUTER': '"true"',
  },
  build: {
    outDir: 'dist-preview',
    cssCodeSplit: false,
    assetsInlineLimit: 100 * 1024 * 1024,
  },
});
