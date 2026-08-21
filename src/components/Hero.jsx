import { useLang } from '../i18n/LangContext.jsx';
import { useCountUp } from '../hooks/useCountUp.js';
import { Button } from './ui/Button.jsx';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

export function Hero() {
  const { t } = useLang();

  const count1 = useCountUp(parseInt(t.facts.f1v, 10) || 0);
  const count2 = useCountUp(parseInt(t.facts.f2v, 10) || 0);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900">
      <div className="relative">
        <section id="top" className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="pm-hero-anim text-sm font-medium text-primary-600 tracking-[0.08em] mb-4 dark:text-primary-400">
                {t.hero.eyebrow}
              </p>
              <h1 className="pm-hero-anim font-display text-slate-900 text-balance mb-5 text-[38px] sm:text-[52px] lg:text-[68px] leading-[1.02] dark:text-white" style={{ animationDelay: '90ms' }}>
                {t.hero.h1}
              </h1>
              <p className="pm-hero-anim text-lg text-slate-600 mb-8 max-w-[32em] dark:text-slate-300" style={{ animationDelay: '180ms' }}>
                {t.hero.sub}
              </p>
              <div className="pm-hero-anim flex flex-wrap gap-3" style={{ animationDelay: '270ms' }}>
                <Button href="#booking" size="lg">{t.hero.cta1}</Button>
                <Button href="tel:+998951956119" variant="secondary" size="lg">{t.hero.cta2}</Button>
              </div>
            </div>
            <div className="pm-hero-anim" style={{ animationDelay: '140ms' }}>
              <PhotoPlaceholder label={t.hero.photo} className="aspect-[4/3] w-full" />
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-200 dark:border-slate-800">
            <FactStat value={count1} label={t.facts.f1l} className="pr-4 py-5 lg:py-6 lg:pl-0 lg:pr-6" />
            <FactStat value={count2} label={t.facts.f2l} className="pl-4 py-5 border-l border-slate-200 dark:border-slate-800 lg:py-6 lg:px-6" />
            <FactStat value={t.facts.f3v} label={t.facts.f3l} small className="pr-4 py-5 border-t border-slate-200 dark:border-slate-800 lg:py-6 lg:px-6 lg:border-t-0 lg:border-l" />
            <FactStat value={t.facts.f4v} label={t.facts.f4l} className="pl-4 py-5 border-t border-l border-slate-200 dark:border-slate-800 lg:py-6 lg:px-6 lg:border-t-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FactStat({ value, label, small, className = '' }) {
  return (
    <div className={className}>
      <p className={`font-display text-primary-700 leading-tight mb-1 dark:text-primary-400 ${small ? 'text-[19px]' : 'text-[26px]'}`}>{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
