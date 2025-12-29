import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: '../static',
  server: {
    port: 5173,
    // Enable HTTPS for WebXR development
    // https: true,
  },
  build: {
    target: 'ES2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  // Optimize Three.js imports
  optimizeDeps: {
    include: ['three'],
  },
});
