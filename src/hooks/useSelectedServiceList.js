import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { useServices } from './useServices.js';

// Разворачивает id выбранных услуг (selectedIds — плоский массив строк,
// см. useSelectedServices.js) в то, что реально нужно отрисовать в Prices.jsx
// и BookingForm.jsx: сами услуги (в порядке добавления — так пользователь
// узнаёт свой список) и затронутые направления (в порядке DIRECTIONS, как
// везде на сайте, а не в порядке добавления — иначе «Направления: ЛОР,
// Офтальмология» и «Офтальмология, ЛОР» читались бы как разные списки в
// зависимости от того, что кликнули раньше).
//
// .find на каждый id, а не Map/Set: выбранных обычно единицы, лишняя
// структура данных здесь не окупается. Id, которого больше нет в каталоге
// (устаревшая запись из sessionStorage после правки data/services.js),
// молча выпадает из списка — не рендерится как «undefined» и не роняет
// расчёт направлений.
export function useSelectedServiceList(selectedIds) {
  const { t } = useLang();
  const services = useServices();

  const list = selectedIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean);

  const categoryIds = new Set(list.map((s) => s.categoryId));
  const categories = DIRECTIONS
    .map((d, i) => ({ id: d.id, title: t.dir[`d${i + 1}t`] }))
    .filter((d) => categoryIds.has(d.id));

  return { list, categories };
}
