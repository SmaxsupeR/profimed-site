import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    // Заявка на приём уходит в CRM-сервер — тот же паттерн проксирования,
    // что и у самой CRM (vite.config.js в корне репозитория).
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
