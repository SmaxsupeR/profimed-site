import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { Button } from './ui/Button.jsx';

export function CtaBand() {
  const { t } = useLang();
  const reveal = useReveal();
  return (
    <div className="bg-primary-600">
      <div ref={reveal.ref} className={`${reveal.className} max-w-6xl mx-auto px-4 sm:px-6 py-15 grid gap-5`}>
        <p className="text-sm font-medium tracking-[0.08em] text-white/80">{t.band.kicker}</p>
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
