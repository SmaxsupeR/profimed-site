import { CircleDollarSign, Phone } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';

// Сознательно без цифр: старый сайт как раз спалился на выдуманном/забытом
// контенте (плейсхолдер вместо отзывов). Прайс подключаем к CRM по-настоящему
// (см. бриф, раздел про интеграцию) — до этого честнее показать «уточняйте»,
// чем нарисовать цифры, которые потом разойдутся с реальностью.
export function Prices() {
  const { t } = useLang();
  return (
    <Section id="prices" tone="raised">
      <SectionHeader eyebrow={t.price.eyebrow} title={t.price.title} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="grid sm:grid-cols-2 divide-y divide-slate-100 sm:divide-y-0 dark:divide-slate-700 reveal-stagger">
          {DIRECTIONS.map(({ id }, i) => (
            <div
              key={id}
              className={`p-6 flex items-center justify-between gap-4 border-slate-100 transition-colors hover:bg-primary-50/60 dark:border-slate-700 dark:hover:bg-primary-950/30 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i < 2 ? 'sm:border-b' : ''}`}
            >
              <span className="font-medium text-slate-800 dark:text-slate-100">{t.dir[`d${i + 1}t`]}</span>
              <span className="text-sm text-slate-400 dark:text-slate-500">{t.price.val}</span>
            </div>
          ))}
        </div>
        <div className="bg-primary-50 dark:bg-primary-950/40 px-6 py-5 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5 text-primary-800 dark:text-primary-300 text-sm">
            <CircleDollarSign size={18} />
            {t.price.note}
          </div>
          <a href="tel:+998951956119" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-400">
            <Phone size={15} /> +998 95 195 61 19
          </a>
        </div>
      </div>
    </Section>
  );
}
