import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';

const STEP_COUNT = 4;
// Должно совпадать с длительностью transition у .pm-track в index.css.
// Раньше отрезки стартовали с шагом 260ms при transition 1.3s — то есть
// каждый следующий начинал заливаться, пока предыдущий ещё дорисовывался
// на три четверти пути, и вместо цепочки «шаг за шагом» всё заливалось
// практически одновременно. Задержка сегмента = его порядковый номер,
// умноженный на длительность одного сегмента — тогда следующий стартует
// точно в момент, когда закончился предыдущий.
const SEGMENT_MS = 500;

export function Timeline() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4].map((n) => ({ n, t: t.timeline[`s${n}t`], d: t.timeline[`s${n}d`] }));

  return (
    <Section id="timeline" tone="raised">
      <SectionHeader eyebrow={t.timeline.eyebrow} title={t.timeline.title} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
        {steps.map((step) => {
          const isLast = step.n === STEP_COUNT;
          return (
          <div key={step.n} className="relative">
            {/* Отрезок до следующего шага, а у последнего — до края секции
                (right-0 вместо -right-6, чтобы линия не обрывалась на
                последнем кружке, а доходила до правого края ряда). Свой
                кусок у каждого шага, не одна общая линия на весь блок: тогда
                не нужно вычислять ширину колонок. Только на lg, где шаги
                действительно стоят в один ряд: на узких экранах сетка
                ломается на две колонки и горизонтальная линия связывала бы
                не то с тем. */}
            <span
              className={`hidden lg:block absolute top-5 left-11 h-[2px] overflow-hidden bg-slate-200 dark:bg-slate-700 ${isLast ? 'right-0' : '-right-6'}`}
            >
              <span
                className="pm-track block h-full bg-primary-400 dark:bg-primary-500"
                style={{ transitionDelay: `${(step.n - 1) * SEGMENT_MS}ms` }}
              />
            </span>
            <span className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-300 text-primary-600 font-display text-base mb-3.5 bg-white dark:border-primary-700 dark:text-primary-400 dark:bg-slate-900">
              {step.n}
            </span>
            <h3 className="font-semibold text-slate-900 text-base mb-1.5 dark:text-white">{step.t}</h3>
            <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">{step.d}</p>
          </div>
          );
        })}
      </div>
    </Section>
  );
}
