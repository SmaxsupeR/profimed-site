import { useState } from 'react';
import { Check } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Button } from './ui/Button.jsx';

const MIN_PER_DIRECTION = 30;

export function VisitPlanner({ onSubmit }) {
  const { t } = useLang();
  const [plan, setPlan] = useState([]);

  const toggle = (id) => {
    setPlan((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const timeText = plan.length === 0
    ? t.plan.empty
    : `${t.plan.timePrefix} ${plan.length * MIN_PER_DIRECTION} ${t.plan.min}`;

  return (
    <Section>
      <SectionHeader eyebrow={t.plan.eyebrow} title={t.plan.title} description={t.plan.sub} />
      <div className="grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 border-t border-slate-200 dark:border-slate-800 reveal-stagger">
          {DIRECTIONS.map(({ id }, i) => {
            const on = plan.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                aria-pressed={on}
                className="w-full flex items-center justify-between gap-3 py-4 border-b border-slate-200 text-left transition-colors hover:bg-primary-50/40 dark:border-slate-800 dark:hover:bg-primary-950/20"
              >
                <span className={`text-[15px] font-medium ${on ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-300'}`}>
                  {t.dir[`d${i + 1}t`]}
                </span>
                <span
                  className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border ${
                    on
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-slate-300 text-transparent dark:border-slate-600'
                  }`}
                >
                  <Check size={14} strokeWidth={2.5} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="border border-slate-200 rounded-2xl p-6 dark:border-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2.5 dark:text-slate-500">{t.plan.summaryTitle}</p>
          <p className="font-display text-slate-900 text-[30px] leading-none mb-1 dark:text-slate-50">{plan.length}</p>
          <p className="text-sm text-slate-500 mb-1.5 dark:text-slate-400">{t.plan.countLabel}</p>
          <p className="text-sm text-slate-600 mb-[18px] dark:text-slate-300">{timeText}</p>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => onSubmit(plan[0] || '')}
          >
            {t.plan.cta}
          </Button>
          <p className="text-xs text-slate-400 mt-3 dark:text-slate-500">{t.plan.note}</p>
        </div>
      </div>
    </Section>
  );
}
