import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        linkedin: resolve(__dirname, 'src/contentScripts/linkedin.js'),
        gmail: resolve(__dirname, 'src/contentScripts/gmail.js'),
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        dir: 'dist'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public'  // This will automatically copy public files to dist
});