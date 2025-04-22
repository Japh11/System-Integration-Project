// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // 👈 Fix for sockjs-client
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
