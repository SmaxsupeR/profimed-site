import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

export function Directions({ onPick }) {
  const { t } = useLang();
  const [openId, setOpenId] = useState(null);

  return (
    <Section id="directions" tone="raised">
      <SectionHeader eyebrow={t.dir.eyebrow} title={t.dir.title} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
        {DIRECTIONS.map(({ id, icon: Icon }, i) => {
          const n = i + 1;
          const isOpen = openId === id;
          const details = t.dir[`det${n}`] || [];
          return (
            <Card key={id} variant="solid" hoverable className="p-6">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 dark:bg-primary-950/50 dark:text-primary-400">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5 dark:text-white">{t.dir[`d${n}t`]}</h3>
              <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">{t.dir[`d${n}x`]}</p>

              {/* Список всегда в разметке — раскрытие анимирует .pm-collapse,
                  а не условный рендер (тот выпрыгивал скачком). */}
              <div className={`pm-collapse ${isOpen ? 'is-open' : ''}`}>
                <div>
                  <ul className="mt-4 grid gap-1.5">
                    {details.map((line) => (
                      <li key={line} className="text-sm text-slate-500 leading-relaxed pl-3.5 relative dark:text-slate-400">
                        <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-primary-300 dark:bg-primary-600" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => onPick(id)}
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  {t.dir.cta}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {isOpen ? t.dir.less : t.dir.more}
                  <ChevronDown size={13} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
