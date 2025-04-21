// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/redirects',
          dest: '.', // This will be renamed and copied to /dist/_redirects
          rename: '_redirects',
        }
      ]
    })
  ],
  define: {
    global: 'window', // 👈 this fixes the error
  },
});
