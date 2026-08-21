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
        <div className="relative">
          <BeforeAfterSlider beforeLabel={t.laser.b4} afterLabel={t.laser.af} ariaLabel={t.laser.slideAria} />
          <div className="hidden sm:block absolute -right-2 -bottom-5 max-w-[230px] rounded-2xl border border-slate-200 bg-white shadow-card px-4.5 py-3.5 dark:bg-slate-800 dark:border-slate-700">
            <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1 dark:text-primary-400">{t.laser.badge}</p>
            <p className="font-display text-slate-900 text-lg dark:text-white">LASIK · LESIK · ФРК</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-3 dark:text-leaf-400">{t.laser.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-slate-900 text-balance mb-3.5 dark:text-white">{t.laser.title}</h2>
          <p className="text-slate-600 max-w-[32em] mb-6.5 dark:text-slate-300">{t.laser.text}</p>
          <div className="grid gap-4 mb-7">
            {steps.map((step) => (
              <div key={step.n} className="flex gap-3.5 items-start">
                <span className="shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-full bg-primary-50 text-primary-600 font-semibold text-[13px] dark:bg-primary-950/50 dark:text-primary-400">
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
