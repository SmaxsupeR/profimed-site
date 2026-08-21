import { useState } from 'react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';
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
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-wrap gap-2.5 reveal-stagger">
          {DIRECTIONS.map(({ id }, i) => {
            const on = plan.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                aria-pressed={on}
                className={`rounded-full border px-[18px] py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  on
                    ? 'border-primary-600 bg-primary-600 text-white shadow-card'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-primary-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary-500'
                }`}
              >
                {t.dir[`d${i + 1}t`]}
              </button>
            );
          })}
        </div>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2.5 dark:text-slate-500">{t.plan.summaryTitle}</p>
          <p className="font-display text-primary-700 text-[30px] leading-none mb-1 dark:text-primary-400">{plan.length}</p>
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
        </Card>
      </div>
    </Section>
  );
}
