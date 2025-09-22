import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'recharts',
      '@mui/icons-material',
      '@mui/material',
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
});
