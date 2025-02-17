import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://stock-pro-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Origin': 'https://stock-pro-frontend-one.vercel.app'
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
});
