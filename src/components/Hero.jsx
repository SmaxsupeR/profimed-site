import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { useCountUp } from '../hooks/useCountUp.js';
import { Button } from './ui/Button.jsx';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

export function Hero() {
  const { t } = useLang();
  const [lens, setLens] = useState({ x: 0, y: 0, show: false });

  const count1 = useCountUp(parseInt(t.facts.f1v, 10) || 0);
  const count2 = useCountUp(parseInt(t.facts.f2v, 10) || 0);

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, show: true });
  };

  return (
    <div
      className="relative overflow-hidden bg-white dark:bg-slate-900"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setLens((l) => ({ ...l, show: false }))}
    >
      <div className="pm-hatch absolute inset-0 opacity-80 pointer-events-none" />
      <div className="pm-blob absolute -top-[220px] -right-[160px] w-[560px] h-[560px] rounded-full pointer-events-none bg-[radial-gradient(circle,theme(colors.primary.50),transparent_70%)] dark:bg-[radial-gradient(circle,theme(colors.primary.900),transparent_70%)]" />
      <div
        className="hidden lg:block absolute w-[140px] h-[140px] rounded-full pointer-events-none border-2 border-primary-600/55 bg-primary-600/10 transition-opacity duration-200"
        style={{ transform: `translate(${lens.x}px, ${lens.y}px) translate(-50%, -50%)`, opacity: lens.show ? 1 : 0 }}
      />

      <div className="relative">
        <section id="top" className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="pm-hero-anim text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-4 dark:text-leaf-400">
                {t.hero.eyebrow}
              </p>
              <h1 className="pm-hero-anim font-display text-slate-900 text-balance mb-5 text-[44px] leading-[1.1] dark:text-white" style={{ animationDelay: '90ms' }}>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FactCard value={count1} label={t.facts.f1l} />
            <FactCard value={count2} label={t.facts.f2l} />
            <FactCard value={t.facts.f3v} label={t.facts.f3l} />
            <FactCard value={t.facts.f4v} label={t.facts.f4l} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FactCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card px-5 py-[18px] transition-all hover:border-primary-300 hover:-translate-y-0.5 dark:bg-slate-800 dark:border-slate-700">
      <p className="font-display text-primary-700 text-[26px] leading-tight mb-1 dark:text-primary-400">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
