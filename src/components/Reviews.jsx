import { MessageSquareHeart, ExternalLink } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';
import { YANDEX_REVIEWS_URL, TWOGIS_REVIEWS_URL } from '../data/clinic.js';

// Своих отзывов на сайте пока нет — и выдумывать их мы не будем (ровно на
// этом споткнулся старый сайт: незаполненный плейсхолдер вместо реальных
// цитат). Но пустая коробка тоже ничего не даёт, поэтому блок отправляет
// туда, где отзывы уже собраны — на карточки клиники в Яндексе и 2ГИС.
//
// Названия площадок не переводим: это бренды, они одинаковы во всех языках.
// Оценки (4,7 / 5,0) намеренно не выводим на сайте — цифра на карточках
// меняется, а захардкоженная тут быстро разойдётся с правдой.
const PLACES = [
  { name: 'Яндекс Карты', url: YANDEX_REVIEWS_URL },
  { name: '2ГИС', url: TWOGIS_REVIEWS_URL },
];

export function Reviews() {
  const { t } = useLang();
  return (
    <Section id="reviews">
      <SectionHeader eyebrow={t.rev.eyebrow} title={t.rev.title} />

      <Card variant="dashed" className="p-10 flex flex-col items-center text-center gap-4">
        <MessageSquareHeart size={28} className="text-primary-400 dark:text-primary-500" strokeWidth={1.5} />
        <p className="text-slate-500 max-w-md dark:text-slate-400">{t.rev.text}</p>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.rev.cta}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {PLACES.map((place) => (
            <a
              key={place.name}
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-400"
            >
              {place.name}
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      </Card>
    </Section>
  );
}
