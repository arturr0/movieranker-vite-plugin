import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Use vue if it's Vue

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://movieranker-react.onrender.com', // Proxy API requests to NestJS backend
    },
  },
});
