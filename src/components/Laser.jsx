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
    // Графитовая полоса (бриф, п.6: «технологический» раздел клиники) —
    // фон всегда тёмный, независимо от темы сайта, поэтому текст внутри
    // задан фиксированными светлыми классами (без dark:), а не обычной
    // парой light/dark (см. тот же приём в Quote.jsx).
    <section ref={reveal.ref} className={`${reveal.className} bg-[#202327] dark:bg-[#191C1F] py-16 sm:py-20`}>
      <div className="pm-container px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <BeforeAfterSlider beforeLabel={t.laser.b4} afterLabel={t.laser.af} ariaLabel={t.laser.slideAria} />
        <div>
          <p className="text-sm font-medium text-primary-300 tracking-[0.08em] mb-3">{t.laser.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-white text-balance mb-3.5">{t.laser.title}</h2>
          <p className="text-sm text-slate-400 mb-4">
            <span className="text-slate-200 font-medium">{t.laser.badge}:</span> LASIK · LESIK · ФРК
          </p>
          <p className="text-slate-300 max-w-[32em] mb-[26px]">{t.laser.text}</p>
          <div className="grid gap-4 mb-7">
            {steps.map((step) => (
              <div key={step.n} className="flex gap-3.5 items-start">
                <span className="shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-full border-2 border-primary-700 text-primary-300 font-semibold text-[13px] bg-white/5">
                  {step.n}
                </span>
                <div>
                  <p className="font-semibold text-white">{step.t}</p>
                  <p className="text-sm text-slate-400">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="primary" size="lg" onClick={() => onPick('ophthalmology')}>{t.laser.cta}</Button>
        </div>
      </div>
    </section>
  );
}
