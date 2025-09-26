import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['unshrugging-pensively-danielle.ngrok-free.dev'], // Dangerous for production, but fine for local development
    port: 5173,
    open: false
  }
});

