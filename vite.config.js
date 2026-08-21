import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages отдаёт проектный сайт по подпути /<repo>/, а не с корня
  // домена — без base все ссылки на JS/CSS/шрифты вели бы на несуществующий
  // /assets/... в корне и страница грузилась бы пустой.
  base: '/profimed-site/',
  server: {
    port: 5175,
    // Заявка на приём уходит в CRM-сервер — тот же паттерн проксирования,
    // что и у самой CRM (vite.config.js в корне репозитория).
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
