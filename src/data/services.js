import { DIRECTIONS } from './directions.js';

// Демоданные прайс-листа — этап 3.13. Тот же приём, что и в data/doctors.js:
// раскладка на структурные поля (categoryId, price, sortOrder) в этом файле
// и переводимый текст (название, пояснение) в dict.js под ключом `svc`,
// один в один с будущим импортом из CRM — компоненту (Prices.jsx,
// hooks/useServices.js) всё равно, откуда взялся конкретный объект услуги,
// лишь бы форма полей совпадала.
//
// source: 'demo' — явный маркер: цифры ниже не из прайс-листа клиники, а
// приблизительные демонстрационные значения для вёрстки каталога (см. бриф
// раздела «Цены», п.9 — придумывать реальные цены запрещено, а без каких-то
// чисел нельзя показать сам макет строки услуги). Когда появится реальный
// прайс из CRM, эти записи заменяются целиком, а не правятся по одной — само
// поле source и есть отметка «это ещё не тот источник».
//
// price: null — намеренно у части услуг (не у всех сразу «столбиком»), чтобы
// с самого начала проверить, как выглядит и работает честный фолбэк
// «уточняйте у администратора» (t.price.val), а не только happy path с
// цифрой у каждой строки.
export const SERVICES = [
  { id: 'oph-consult', categoryId: 'ophthalmology', price: 250000, sortOrder: 0, source: 'demo' },
  { id: 'oph-diag', categoryId: 'ophthalmology', price: 300000, sortOrder: 1, source: 'demo' },
  { id: 'ent-consult', categoryId: 'ent', price: 220000, sortOrder: 0, source: 'demo' },
  { id: 'ent-diag', categoryId: 'ent', price: null, sortOrder: 1, source: 'demo' },
  { id: 'stom-consult', categoryId: 'stomatology', price: 200000, sortOrder: 0, source: 'demo' },
  { id: 'stom-hygiene', categoryId: 'stomatology', price: 350000, sortOrder: 1, source: 'demo' },
  { id: 'ct-scan', categoryId: 'ct', price: null, sortOrder: 0, source: 'demo' },
  { id: 'ct-review', categoryId: 'ct', price: 150000, sortOrder: 1, source: 'demo' },
];

// Категории вкладок — «Все» плюс те же четыре направления клиники, в том же
// порядке, что и everywhere else на сайте (Directions, Doctors).
// Один источник порядка (DIRECTIONS), а не отдельный список id вручную —
// порядок категорий в прайсе не может тихо разъехаться с порядком карточек
// направлений на той же странице.
export const SERVICE_CATEGORIES = ['all', ...DIRECTIONS.map((d) => d.id)];
