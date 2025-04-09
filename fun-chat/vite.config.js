import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('/src', import.meta.url)),
      '@react': fileURLToPath(new URL('/src/react/', import.meta.url)),
    },
  },
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
  },
});
