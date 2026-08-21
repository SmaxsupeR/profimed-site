import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { Button } from './ui/Button.jsx';
import { BeforeAfterSlider } from './BeforeAfterSlider.jsx';

// Своя разметка вместо <Section>: блок двухколоночный и без общего
// заголовка секции, поэтому появление при скролле подключается вручную.
export function Laser({ onPick }) {
  const { t } = useLang();
  const reveal = useReveal();
  const steps = [1, 2, 3].map((n) => ({ n, t: t.laser[`s${n}t`], d: t.laser[`s${n}d`] }));

  return (
    <section ref={reveal.ref} className={`${reveal.className} max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20`}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <BeforeAfterSlider beforeLabel={t.laser.b4} afterLabel={t.laser.af} ariaLabel={t.laser.slideAria} />
        <div>
          <p className="text-sm font-medium text-primary-600 tracking-[0.08em] mb-3 dark:text-primary-400">{t.laser.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-slate-900 text-balance mb-3.5 dark:text-white">{t.laser.title}</h2>
          <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">
            <span className="text-slate-700 font-medium dark:text-slate-300">{t.laser.badge}:</span> LASIK · LESIK · ФРК
          </p>
          <p className="text-slate-600 max-w-[32em] mb-[26px] dark:text-slate-300">{t.laser.text}</p>
          <div className="grid gap-4 mb-7">
            {steps.map((step) => (
              <div key={step.n} className="flex gap-3.5 items-start">
                <span className="shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-full border-2 border-primary-300 text-primary-600 font-semibold text-[13px] bg-slate-50 dark:border-primary-700 dark:text-primary-400 dark:bg-slate-900">
                  {step.n}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{step.t}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="lg" onClick={() => onPick('ophthalmology')}>{t.laser.cta}</Button>
        </div>
      </div>
    </section>
  );
}
