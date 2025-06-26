import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000, // Set a different port, e.g., 3000 (or any available port)
    proxy: {
      '/api': 'https://movieranker-vite.onrender.com', // Proxy API requests to NestJS backend
    },
  },
});