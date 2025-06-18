import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/authentication': {
        target: 'http://198.211.105.95:8080',
        changeOrigin: true,
      },
      '/expenses': {
        target: 'http://198.211.105.95:8080',
        changeOrigin: true,
      },
      '/goals': {
        target: 'http://198.211.105.95:8080',
        changeOrigin: true,
      },
    },
  },
});
