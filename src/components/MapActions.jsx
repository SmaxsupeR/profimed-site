import { useEffect, useState } from 'react';
import { Navigation, CarTaxiFront } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';
import { ROUTE_URL, ROUTE_GEO_URL, TAXI_URL } from '../data/clinic.js';

// Этап 3.21 — нижняя панель общей карточки «Как нас найти» (см.
// ContactSection.jsx). Раньше это было нижней половиной самодостаточного
// Map.jsx; логика (Android → geo:, чтобы открылся установленный навигатор,
// а не веб-карта) не менялась, просто переехала в свой компонент — сам
// компонент Map.jsx теперь только iframe.
//
// border-t — единственная рамка этого блока: свою отдельную (rounded/
// border) карточку он больше не образует, нижний скруглённый угол
// принадлежит общему контейнеру-обёртке в ContactSection.jsx (overflow-
// hidden там же обрезает эту панель точно по его радиусу).
//
// Правка после ревью — раньше подпись и кнопки делили одну строку через
// justify-between начиная с sm (640px): длинная подпись («Клиника
// отмечена на карте — улица Мирабад (быв. Кунаева), дом 6.») отъедала
// часть ширины, и на промежуточных значениях (проверено на 768px — та же
// ширина map-колонки, что и на десктопе в объединённой сетке
// ContactSection) кнопкам оставалось меньше места, чем нужно двум
// side-by-side — flex-wrap сминал их в столбик РАЗНОЙ ширины (кнопки не
// матчились друг другу, sm:w-auto — по контенту у каждой свой размер):
// получалась кривая лесенка, а не пара. Теперь подпись всегда на своей
// отдельной строке (никогда не конкурирует с кнопками за ширину ряда), а
// у кнопок — либо обе на всю ширину и одного размера (mobile/узкий sm),
// либо обе рядом по содержимому (когда в самой строке кнопок реально
// достаточно места, без соседства с текстом подписи).
export function MapActions() {
  const { t } = useLang();

  // Ссылка выбирается после монтирования, а не при рендере: на сервере и в
  // первый кадр navigator недоступен/не нужен, а начальное значение —
  // обычный https, который работает везде. На Android подменяем на geo:,
  // чтобы открылся установленный навигатор, а не веб-карта.
  const [routeHref, setRouteHref] = useState(ROUTE_URL);
  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) setRouteHref(ROUTE_GEO_URL);
  }, []);

  return (
    <div className="border-t border-slate-200 bg-primary-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/60 sm:px-8 lg:px-10">
      <p className="text-sm text-slate-600 dark:text-slate-300">{t.map.note}</p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <Button href={routeHref} target="_blank" rel="noopener noreferrer" size="sm" className="w-full sm:w-auto">
          <Navigation size={15} />
          {t.map.route}
        </Button>
        <Button href={TAXI_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm" className="w-full sm:w-auto">
          <CarTaxiFront size={15} />
          {t.map.taxi}
        </Button>
      </div>
    </div>
  );
}
