import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section } from './ui/Section.jsx';

// Архитектурный мотив (этап 3.3) — тонкие вертикальные линии переменной
// высоты, отсылка к деревянным ламелям фасада ProfiMed на фото в Hero.
// Четыре линии — по числу направлений, не более (бриф прямо просит один
// сдержанный декоративный акцент, не орнамент). Только lg+: на планшете и
// мобильном разрыв между заголовком и интро и так тесный, мотив там был бы
// захламлением, а не деталью.
const SLAT_HEIGHTS = [28, 52, 36, 44];

export function Directions({ onPick }) {
  const { t } = useLang();
  const [openId, setOpenId] = useState(null);

  return (
    <Section id="directions" tone="raised">
      {/* Двухчастный редакторский заголовок (этап 3.3) — раньше был
          одноколоночный SectionHeader (max-w-xl), секция читалась пусто.
          Не трогаю сам SectionHeader — он общий для всех секций сайта,
          здесь собственная вёрстка только для Directions. */}
      <div className="mb-10 grid gap-x-8 gap-y-5 sm:mb-12 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <div>
          <p className="mb-3 text-sm font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">{t.dir.eyebrow}</p>
          <h2 className="font-display text-[32px] leading-[1.05] text-slate-900 text-balance sm:text-[42px] lg:text-[50px] dark:text-slate-50">{t.dir.title}</h2>
        </div>

        <div className="hidden items-end gap-2 lg:flex" aria-hidden="true">
          {SLAT_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className={`w-px ${i % 2 === 0 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-primary-200 dark:bg-primary-800'}`}
              style={{ height: h }}
            />
          ))}
        </div>

        <p className="text-slate-600 lg:pb-0.5 dark:text-slate-400">{t.dir.intro}</p>
      </div>

      <div className="border-t border-slate-200 reveal-stagger dark:border-slate-800">
        {DIRECTIONS.map(({ id }, i) => {
          const n = i + 1;
          const isOpen = openId === id;
          const details = t.dir[`det${n}`] || [];
          return (
            <div
              key={id}
              className="group relative border-b border-slate-200 py-5 dark:border-slate-800"
            >
              {/* Ховер-акцент (этап 3.3) — тонкая линия в поле секции слева
                  от контента, не сдвигает сам ряд (никакого layout shift,
                  просто вырастает по высоте из центра). -left подобран под
                  паддинг Section (px-4/sm:px-6) — линия садится точно в
                  этот отступ, а не поверх текста. */}
              <span
                aria-hidden="true"
                className="absolute -left-4 top-0 bottom-0 w-[3px] origin-center scale-y-0 bg-primary-500 transition-transform duration-300 group-hover:scale-y-100 sm:-left-6"
              />
              <div className="grid gap-x-5 gap-y-2 sm:grid-cols-[64px_1fr_auto] sm:items-baseline">
                {/* aria-hidden — декоративный порядковый номер (та же
                    информация уже в заголовке направления рядом), не
                    самостоятельный контент. Заодно чинит найденный
                    Lighthouse баг: dark:text-primary-800 на тёмном фоне
                    страницы (#1F2225) давал контраст 1.41:1 — число было
                    практически невидимым, а не «сдержанным водяным
                    знаком», как задумано (сравните со светлой темой, там
                    primary-200 всё же читается). primary-400/dark:hover
                    primary-300 — та же логика «тише в покое, ярче при
                    наведении», что и в светлой теме (200→400), но
                    подобранная под тёмный фон: обе ступени попадают в
                    видимый диапазон вместо почти чёрного на чёрном. */}
                <span
                  aria-hidden="true"
                  className="font-display text-4xl leading-none text-primary-200 transition-colors group-hover:text-primary-400 dark:text-primary-400 dark:group-hover:text-primary-300"
                >
                  {String(n).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary-700 dark:text-slate-50 dark:group-hover:text-primary-300">{t.dir[`d${n}t`]}</h3>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t.dir[`d${n}x`]}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-self-end">
                  <button
                    type="button"
                    onClick={() => onPick(id)}
                    className="group/cta inline-flex items-center gap-1 rounded text-sm font-medium text-primary-600 whitespace-nowrap transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    {t.dir.cta}
                    <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-1 rounded text-xs font-medium text-slate-400 whitespace-nowrap transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {isOpen ? t.dir.less : t.dir.more}
                    <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Список всегда в разметке — раскрытие анимирует .pm-collapse,
                  а не условный рендер (тот выпрыгивал скачком). */}
              <div className={`pm-collapse ${isOpen ? 'is-open' : ''}`}>
                <div>
                  <ul className="mt-4 grid gap-1.5 sm:pl-[84px]">
                    {details.map((line) => (
                      <li key={line} className="relative pl-3.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        <span className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-primary-300 dark:bg-primary-600" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
