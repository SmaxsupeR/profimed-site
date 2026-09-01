// Множественное число для «N услуг» в подтверждениях для скринридера
// (Prices.jsx/BookingForm.jsx, aria-live). Intl.PluralRules — платформенный
// CLDR, а не самописная арифметика: для ru он уже знает и правило
// «2–4 → few, но 12–14 всё равно many» (сам бриф просит just «1 услуга;
// 2–4 услуги; 5 услуг», но реальное правило сложнее — 22 услуги, 25 услуг —
// и переизобретать его вручную значило бы гарантированно ошибиться на
// каком-то числе). Для uz/uzc языковых форм по числу нет вообще (CLDR
// отдаёт только 'other' для любого n), для en — one/other, как и ожидается.
const PLURAL_LOCALE = { ru: 'ru', uz: 'uz', uzc: 'uz', en: 'en' };
const rulesCache = {};

function rulesFor(lang) {
  const locale = PLURAL_LOCALE[lang] ?? 'en';
  return (rulesCache[locale] ??= new Intl.PluralRules(locale));
}

// forms — словарь { one, few, many, other }, не обязательно все ключи сразу
// (см. price.unitWord в dict.js: у ru свои one/few/many, у остальных языков
// только other). Категория, которой нет в forms, откатывается на other,
// затем на любое первое имеющееся значение — так неполный набор форм не
// роняет рендер.
export function formatCount(n, forms, lang) {
  const category = rulesFor(lang).select(n);
  return forms[category] ?? forms.other ?? Object.values(forms)[0];
}
