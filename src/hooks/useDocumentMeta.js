import { useEffect } from 'react';

// document.title/<meta name="description"> зависят и от языка (4 словаря),
// и от маршрута (главная / страница врача / политика) — то, что при
// многостраничной сборке Vite можно было бы задать статически по одному
// разу на файл (см. index.html, privacy/index.html), для SPA-навигации
// между /doctors/:slug и переключения языка внутри одной уже загруженной
// страницы верно только на первый показ. Хук правит оба тега на каждый
// рендер, где изменились title/description — единая точка для всех трёх
// мест, которые раньше молча наследовали статичный <title> из index.html
// (главная — на любом языке, кроме русского; профиль врача — всегда).
//
// Первая отрисовка страницы (до того как этот эффект успел отработать)
// всё равно берёт статический тег из соответствующего *.html — он остаётся
// правильным дефолтом на русском для прямого захода и для поисковика,
// который не выполняет JS.
export function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
