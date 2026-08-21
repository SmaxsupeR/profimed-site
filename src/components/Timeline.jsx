import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';

const STEP_COUNT = 4;

export function Timeline() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4].map((n) => ({ n, t: t.timeline[`s${n}t`], d: t.timeline[`s${n}d`] }));

  return (
    <Section id="timeline" tone="raised">
      <SectionHeader eyebrow={t.timeline.eyebrow} title={t.timeline.title} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
        {steps.map((step) => (
          <div key={step.n} className="relative">
            {/* Отрезок до следующего шага. Не одна общая линия на весь блок, а
                свой кусок у каждого шага: тогда не нужно вычислять ширину
                колонок, а прочерчивание идёт по очереди — шаг за шагом.
                Только на lg, где шаги действительно стоят в один ряд: на
                узких экранах сетка ломается на две колонки и горизонтальная
                линия связывала бы не то с тем. */}
            {step.n < STEP_COUNT && (
              <span className="hidden lg:block absolute top-5 left-11 -right-6 h-[2px] overflow-hidden bg-slate-200 dark:bg-slate-700">
                <span
                  className="pm-track block h-full bg-primary-400 dark:bg-primary-500"
                  style={{ transitionDelay: `${(step.n - 1) * 260}ms` }}
                />
              </span>
            )}
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-300 text-primary-600 font-display text-base mb-3.5 bg-white dark:border-primary-700 dark:text-primary-400 dark:bg-slate-900">
              {step.n}
            </span>
            <h3 className="font-semibold text-slate-900 text-base mb-1.5 dark:text-white">{step.t}</h3>
            <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">{step.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
