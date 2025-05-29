import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      // Use string paths for alias
      'global': 'globalThis'
    }
  },
  define: {
    global: 'globalThis',
    process: { env: {} },
    Buffer: ['buffer', 'Buffer']
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      timeout: 120000,
    },
  },
});