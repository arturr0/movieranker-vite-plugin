import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Use vue if it's Vue

export default defineConfig({
  plugins: [react(),
    {
      name: 'inject-importmap',
      transformIndexHtml(html) {
        // Insert importmap for three.js
        const importmap = `
        <script type="importmap">
          {
            "imports": {
              "three": "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js"
            }
          }
        </script>
        `;

        // Add importmap just before the closing head tag
        return html.replace('</head>', `${importmap}</head>`);
      },
    },
  ],
  server: {
    proxy: {
      '/api': 'https://movieranker-react.onrender.com', // Proxy API requests to NestJS backend
    },
  },
});
