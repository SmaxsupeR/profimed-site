import { useEffect, useState } from 'react';
import { Navigation, CarTaxiFront } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';
import { MAP_EMBED_URL, ROUTE_URL, ROUTE_GEO_URL, TAXI_URL } from '../data/clinic.js';

// Полноширинная карта — намеренно вне Section (тот ограничивает ширину до
// max-w-6xl), карта должна доходить до самых краёв экрана.
//
// Точка на карте — точные координаты клиники (data/clinic.js), а не рамка
// вокруг района: раньше карта показывала весь Мирабад без метки.
export function Map() {
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
    <div className="border-t border-slate-200 dark:border-slate-800">
      <iframe
        title={t.map.label}
        src={MAP_EMBED_URL}
        className="w-full h-[300px] border-0 block"
        loading="lazy"
      />
      <div className="bg-primary-50 border-t border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t.map.note}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={routeHref} target="_blank" rel="noopener noreferrer" size="md">
              <Navigation size={16} />
              {t.map.route}
            </Button>
            <Button href={TAXI_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="md">
              <CarTaxiFront size={16} />
              {t.map.taxi}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
