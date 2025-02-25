import { defineConfig } from 'vite';
import VitePluginNest from 'vite-plugin-nest';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [VitePluginNest()],
});
