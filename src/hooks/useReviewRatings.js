import { useEffect, useState } from 'react';
import { REVIEWS_RATINGS_FALLBACK } from '../data/reviewsRatings.js';

// Публичный эндпоинт рейтингов площадок (Яндекс.Карты/2ГИС). Пока не
// существует на сервере — тот же случай, что и POST /api/public/
// booking-request в BookingForm.jsx (см. комментарий там): бэкенд для этого
// участка ещё не построен, здесь заранее зафиксирована только договорённость
// об адресе и форме ответа, чтобы фронтенд не пришлось переделывать, когда
// маршрут появится.
//
// Полный путь данных (описан подробно в data/reviewsRatings.js): закрытый
// Telegram-бот клиники → защищённый backend endpoint → база данных → этот
// публичный GET → сайт. Секретов/токенов бота во фронтенде нет и не будет —
// сюда попадает только уже опубликованный, читай-только результат.
const ENDPOINT = '/api/public/reviews-ratings';

// localStorage, а не sessionStorage (как у выбора услуг в
// useSelectedServices.js) — здесь ровно обратный случай: корзину нарочно не
// хотим тащить через месяцы неактивности, а «последнее успешно загруженное
// значение» рейтингов, наоборот, обязано пережить закрытие вкладки —
// бриф прямо требует использовать его при недоступном API, а не только в
// рамках одной сессии.
const CACHE_KEY = 'pm-reviews-ratings-cache-v1';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return Array.isArray(data) ? data : null;
  } catch {
    // Приватная вкладка/квота/битый JSON — не критично, просто нет кэша.
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Не удалось сохранить — не страшно, кэш это только ускоритель
    // деградации, а не единственный путь к данным.
  }
}

// Единая точка входа для Reviews.jsx: секция не должна знать, откуда взялся
// список — с живого API, из кэша прошлой удачной загрузки или из
// REVIEWS_RATINGS_FALLBACK (аварийный посевной набор на самый первый заход,
// пока не было ни одной успешной загрузки). Порядок деградации ровно тот,
// что просил бриф: 1) публичный API, 2) последнее успешно загруженное
// значение, 3) временный конфиг — и никогда техническая ошибка наружу.
export function useReviewRatings() {
  const [ratings, setRatings] = useState(() => readCache() ?? REVIEWS_RATINGS_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(ENDPOINT);
        if (!res.ok) throw new Error(`useReviewRatings: HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('useReviewRatings: ответ не массив');
        if (cancelled) return;
        setRatings(data);
        writeCache(data);
      } catch (err) {
        // Эндпоинта пока нет (см. комментарий у ENDPOINT выше) — это
        // ожидаемо, не показываем пользователю никакой технической ошибки
        // и тихо остаёмся на том, что уже показано (кэш прошлой удачной
        // загрузки или временный конфиг, см. useState выше). console.debug
        // — только для тех, кто открыл консоль сам, не для пользователя.
        console.debug('[useReviewRatings] публичный API рейтингов недоступен, используется предыдущее значение', err);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return ratings;
}
