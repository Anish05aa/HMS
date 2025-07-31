import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // Not @tailwindcss/vite
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()], // Proper Tailwind integration
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});

vite.config.js

