import { Quote as QuoteIcon } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

export function Quote() {
  const { t } = useLang();
  const reveal = useReveal();

  return (
    <div className="relative overflow-hidden bg-white border-y border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div ref={reveal.ref} className={`${reveal.className} relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col items-center text-center gap-5`}>
        <QuoteIcon size={34} className="text-primary-400 dark:text-primary-500" fill="currentColor" />
        <p className="font-display text-slate-900 text-balance text-[32px] sm:text-[38px] leading-[1.3] max-w-[44ch] dark:text-white">
          {t.quote.text}
        </p>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide dark:text-slate-400">{t.quote.who}</p>
      </div>
    </div>
  );
}
