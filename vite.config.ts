import { defineConfig } from 'vite';

export default defineConfig({
  base: '/random-zotero/',
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: true,
  },
});
