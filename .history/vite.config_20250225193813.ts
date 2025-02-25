import { defineConfig } from 'vite';
import VitePluginTs from 'vite-plugin-ts'; // TypeScript support plugin

export default defineConfig({
  plugins: [VitePluginTs()],
});
