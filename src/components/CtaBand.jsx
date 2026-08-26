import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { Button } from './ui/Button.jsx';

export function CtaBand() {
  const { t } = useLang();
  const reveal = useReveal();
  // Графитовая полоса (не сплошной primary-600) — заключительный акцент
  // страницы читается архитектурно, а не как ещё один залитый тилом блок;
  // сама кнопка ниже остаётся teal, это единственный акцент на графите.
  return (
    <div className="bg-[#202327] dark:bg-[#191C1F]">
      <div ref={reveal.ref} className={`${reveal.className} pm-container px-4 sm:px-6 py-[60px] grid gap-5`}>
        <p className="text-sm font-medium tracking-[0.08em] text-slate-300">{t.band.kicker}</p>
        <h2 className="font-display text-3xl sm:text-4xl text-balance text-white max-w-[40ch]">{t.band.title}</h2>
        <p className="text-base text-slate-200 max-w-[34em]">{t.band.text}</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button href="/#booking" variant="primary" size="lg">{t.band.cta}</Button>
          <a href="tel:+998951956119" className="text-white text-[15px] font-semibold py-3 px-1 border-b border-white/45 hover:border-white">
            +998 95 195 61 19
          </a>
        </div>
      </div>
    </div>
  );
}
