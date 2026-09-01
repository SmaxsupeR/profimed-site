import { Star, ExternalLink } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { formatCount } from '../i18n/plural.js';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

// Названия площадок — бренды, не переводим (тот же принцип, что был в
// прежней версии этого компонента: «Яндекс Карты»/«2ГИС» одинаковы во всех
// языках интерфейса сайта). Только текстовая подпись, без логотипов —
// использовать логотип из случайного файла вместо разрешённого
// официального бейджа рискованнее, чем аккуратное название текстом (бриф).
const SOURCE_LABEL = { yandex: 'Яндекс Карты', '2gis': '2ГИС' };

// Локаль числового форматирования — только разделитель дробной части
// (4,9 у ru, 4.9 у остальных), не полноценная дата: Intl.NumberFormat для
// простого числа безопасен во всех локалях сайта (в отличие от
// Intl.DateTimeFormat, у которого для узбекских алфавитов разъезжается
// форматирование — см. комментарий у policyUpdatedLabel в data/legal.js;
// поэтому дата проверки ниже выводится как есть, без форматирования).
const NUMBER_LOCALE = { ru: 'ru-RU', uz: 'uz-UZ', uzc: 'uz-UZ', en: 'en-US' };

// Спокойные звёзды — вспомогательный элемент рядом с крупным числом, не
// самостоятельный носитель информации (бриф прямо требует текстовую
// подпись у рейтинга, не только звёзды) — здесь они aria-hidden, реальное
// число рядом уже текст. Приём с двумя рядами одинаковых иконок (тусклый
// снизу, закрашенный сверху, обрезанный по проценту) — без дробных SVG.
function RatingStars({ rating }) {
  const pct = Math.max(0, Math.min(1, rating / 5)) * 100;
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex gap-0.5 text-slate-300 dark:text-slate-600">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-primary-500 dark:text-primary-400"
        style={{ width: `${pct}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}

// Карточка одной площадки — целиком ссылка (Card/href, см. ui/Card.jsx) на
// оригинальную карточку клиники, не кнопка-огрызок внутри статичного блока
// (бриф: «карточка целиком либо её явная кнопка ведёт на площадку» — тут
// сразу и то, и другое, «Смотреть отзывы» просто визуальный акцент того же
// клика, не второй вложенный <a>).
//
// Место, куда попадает place, уже гарантированно «подтверждённая» запись —
// rating/reviewCount/checkedAt не null (см. фильтр в Reviews() ниже).
// Карточка с неполными данными сюда не доходит вовсе, а не рисуется в
// урезанном виде — так решили в этой итерации (раньше, пока не было живого
// API, показывали название+ссылку даже без цифр; теперь, когда источник —
// бэкенд, отсутствие подтверждённого значения означает «показывать пока
// нечего», а не «покажем то, что есть»).
function RatingCard({ place }) {
  const { t, lang } = useLang();
  const ratingText = new Intl.NumberFormat(NUMBER_LOCALE[lang] ?? 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(place.rating);

  return (
    <Card
      href={place.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      hoverable
      className="flex flex-col gap-3 p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-900 dark:text-slate-50">{SOURCE_LABEL[place.source]}</span>
        <ExternalLink size={15} className="shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      </div>

      <div>
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-4xl text-slate-900 dark:text-slate-50">{ratingText}</span>
          <RatingStars rating={place.rating} />
        </div>
        {/* text-slate-600/dark:slate-300, не 500/400 (тише на глаз, но
            здесь фон карточки — bg-white/dark:bg-slate-800 у Card, а не
            фон страницы секции) — на нём 500/400 дают 4,0:1/4,47:1, ниже
            порога 4.5:1 для обычного текста (проверено вручную по формуле
            WCAG; тот же класс бага уже ловили в этом проекте —
            Directions.jsx/Laser.jsx и др.). */}
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {place.reviewCount} {formatCount(place.reviewCount, t.rev.reviewWord, lang)}
        </p>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300">{t.rev.updatedOn.replace('{date}', place.checkedAt)}</p>

      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary-600 dark:text-primary-300">
        {t.rev.viewReviews}
      </span>
    </Card>
  );
}

// Этап 3.19 — данные больше не читаются из статического файла напрямую:
// useReviewRatings() — единая граница между секцией и тем, откуда
// фактически приходит список (публичный API → кэш прошлой удачной
// загрузки → временный конфиг, см. подробности в самом хуке и в
// data/reviewsRatings.js).
//
// Этап полировки 4.1 (коррект.) — хук теперь вызывается один раз в
// App.jsx, не здесь: Header.jsx нужен тот же самый отфильтрованный список
// (пункт меню «Отзывы» существует, только если здесь есть что показать),
// и раньше каждый компонент считал бы фильтр independently — реальный
// риск, что они разойдутся (секция появилась, а пункт меню — ещё нет, или
// наоборот). places приходит уже отфильтрованным (visible + подтверждённые
// rating/reviewCount/checkedAt — не «упомянуты когда-то», а именно
// зафиксированы вместе с датой проверки). Средний рейтинг между
// площадками не считаем нигде — это разные шкалы и разная выборка, а не
// одно число с двух источников.
export function Reviews({ places = [] }) {
  const { t } = useLang();
  if (places.length === 0) return null;

  return (
    <Section id="reviews">
      <SectionHeader eyebrow={t.rev.eyebrow} title={t.rev.title} description={t.rev.desc} />
      <div className="grid max-w-xl gap-5 sm:grid-cols-2">
        {places.map((place) => (
          <RatingCard key={place.source} place={place} />
        ))}
      </div>
    </Section>
  );
}
