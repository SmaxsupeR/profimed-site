import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { Button } from './ui/Button.jsx';

export function CtaBand() {
  const { t } = useLang();
  const reveal = useReveal();
  return (
    <div className="relative overflow-hidden bg-primary-600">
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0px, rgba(255,255,255,.07) 1px, transparent 1px, transparent 18px)' }}
      />
      <div className="absolute -bottom-60 -left-30 w-[520px] h-[520px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,.14),rgba(255,255,255,0)_68%)]" />
      <div ref={reveal.ref} className={`${reveal.className} relative max-w-6xl mx-auto px-4 sm:px-6 py-15 grid gap-5`}>
        <p className="text-sm font-semibold uppercase tracking-wide text-white">{t.band.kicker}</p>
        <h2 className="font-display text-3xl sm:text-4xl text-balance text-white max-w-[40ch]">{t.band.title}</h2>
        <p className="text-base text-white max-w-[34em]">{t.band.text}</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button href="#booking" variant="secondary" size="lg">{t.band.cta}</Button>
          <a href="tel:+998951956119" className="text-white text-[15px] font-semibold py-3 px-1 border-b border-white/45 hover:border-white">
            +998 95 195 61 19
          </a>
        </div>
      </div>
    </div>
  );
}
