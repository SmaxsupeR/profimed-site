import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';

export function Directions({ onPick }) {
  const { t } = useLang();
  const [openId, setOpenId] = useState(null);

  return (
    <Section id="directions" tone="raised">
      <SectionHeader eyebrow={t.dir.eyebrow} title={t.dir.title} />

      <div className="border-t border-slate-200 dark:border-slate-800 reveal-stagger">
        {DIRECTIONS.map(({ id }, i) => {
          const n = i + 1;
          const isOpen = openId === id;
          const details = t.dir[`det${n}`] || [];
          return (
            <div
              key={id}
              className="group border-b border-slate-200 py-6 transition-colors hover:bg-primary-50/40 dark:border-slate-800 dark:hover:bg-primary-950/20"
            >
              <div className="grid gap-x-5 gap-y-3 sm:grid-cols-[40px_1fr_auto] sm:items-baseline">
                <span className="font-display text-2xl text-primary-200 transition-colors group-hover:text-primary-400 dark:text-primary-800 dark:group-hover:text-primary-600">
                  {String(n).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{t.dir[`d${n}t`]}</h3>
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">{t.dir[`d${n}x`]}</p>
                </div>
                <div className="flex items-center gap-4 sm:justify-self-end">
                  <button
                    type="button"
                    onClick={() => onPick(id)}
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400 whitespace-nowrap"
                  >
                    {t.dir.cta}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 whitespace-nowrap"
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
                  <ul className="mt-4 grid gap-1.5 sm:pl-[60px]">
                    {details.map((line) => (
                      <li key={line} className="text-sm text-slate-500 leading-relaxed pl-3.5 relative dark:text-slate-400">
                        <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-primary-300 dark:bg-primary-600" />
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
