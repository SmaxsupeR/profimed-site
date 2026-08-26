import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const dir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Многостраничная сборка: кроме главной собирается privacy/index.html.
  // Это даёт на выходе реальный файл dist/privacy/index.html и, значит,
  // рабочий адрес /privacy/ на любом статическом хостинге без настройки
  // SPA-fallback. Клиентский роутинг по pathname такого не даёт: прямой
  // заход на /privacy вернул бы 404 везде, где сервер не переписывает
  // неизвестные пути на index.html, — а на политику ссылается форма
  // заявки, и ссылка обязана открываться из письма и из поисковика.
  build: {
    rollupOptions: {
      input: {
        main: resolve(dir, 'index.html'),
        privacy: resolve(dir, 'privacy/index.html'),
      },
    },
  },
  server: {
    port: 5175,
    // Заявка на приём уходит в CRM-сервер — тот же паттерн проксирования,
    // что и у самой CRM (vite.config.js в корне репозитория).
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
