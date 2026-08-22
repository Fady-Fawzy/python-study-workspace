import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/python-study-workspace/' : '/',
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
