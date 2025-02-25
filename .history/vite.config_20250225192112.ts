import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  plugins: [
    VitePluginNode({
      adapter: 'nest', // SSR adapter for NestJS
      appPath: './src/main.ts', // Path to entry file
      exportName: 'viteNodeApp',
      tsCompiler: 'esbuild',
    }),
  ],
  define: {
    'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
    // Add more environment variables if necessary
  },
});
