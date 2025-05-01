import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // force Vite to run on port 3000 so Spotify redirect works
    host: '127.0.0.1',
  },
});
