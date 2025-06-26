import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Use vue if it's Vue

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-importmap',
      transformIndexHtml(html) {
        // The importmap script
        const importmap = `
        <script type="importmap">
          {
            "imports": {
              "three": "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js"
            }
          }
        </script>
        `;

        // This ensures that we do not modify Vite's auto-injected scripts
        return html.replace('<head>', `<head>${importmap}`);
      },
    },
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to NestJS backend
    },
  },
});
