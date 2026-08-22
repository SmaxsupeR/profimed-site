import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

export function Quote() {
  const { t } = useLang();
  const reveal = useReveal();

  // Графитовая полоса (бриф, п.6: «patient story») — фон всегда тёмный
  // независимо от темы сайта, поэтому текст ниже задан фиксированными
  // светлыми классами, а не обычной парой light/dark (см. тот же приём
  // в Laser.jsx).
  return (
    <div className="relative overflow-hidden bg-[#202327] dark:bg-[#191C1F]">
      <div ref={reveal.ref} className={`${reveal.className} relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col items-center text-center gap-5`}>
        <p className="font-display text-white text-balance text-[32px] sm:text-[38px] leading-[1.3] max-w-[44ch]">
          {t.quote.text}
        </p>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{t.quote.who}</p>
      </div>
    </div>
  );
}
