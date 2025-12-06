import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: for GitHub Pages change `base` to `/<REPO_NAME>/`
// or keep './' if you deploy just the `dist` folder.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
