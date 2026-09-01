import { SERVICES } from '../data/services.js';
import { useLang } from '../i18n/LangContext.jsx';

// Группировка цифр пробелом (250000 → «250 000») не завязана на язык
// интерфейса — сум остаётся сумом на всех четырёх языках сайта, как и адрес
// клиники в top.address. 'ru-RU' здесь используется только за тип разбивки
// разрядов, не за перевод.
const GROUPS = new Intl.NumberFormat('ru-RU');

// Единая точка сборки услуги из data/services.js (structural-поля — id,
// categoryId, price) и dict.js (переводимый текст — название, пояснение),
// тот же приём, что и useDoctors.js для врачей. priceLabel уже готов к
// выводу (число+валюта или t.price.val), чтобы Prices.jsx не решал форматы
// — только раскладывал готовые строки по вёрстке.
export function useServices() {
  const { t } = useLang();

  return SERVICES.map((svc) => {
    const text = t.svc[svc.id] ?? {};
    return {
      ...svc,
      name: text.name ?? svc.id,
      desc: text.desc ?? null,
      priceLabel: svc.price == null ? t.price.val : `${GROUPS.format(svc.price)} ${t.price.currency}`,
    };
  });
}
