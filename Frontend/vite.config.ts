import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: true,
    target: 'es2020',
  },
  optimizeDeps: {
    include: [
      'recharts',
      '@mui/icons-material',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@supabase/supabase-js'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    target: 'es2020'
  }
});