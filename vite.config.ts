import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/dashboard/',  // <-- важно!
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
