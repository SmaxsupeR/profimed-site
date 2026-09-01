import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';

export function Faq() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section className="relative overflow-hidden">
      <div className="relative z-10">
        <SectionHeader eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="max-w-[46em] border-t border-slate-200 dark:border-slate-800 reveal-stagger">
        {t.faq.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full text-left border-0 bg-transparent py-4 flex items-center justify-between gap-3 cursor-pointer text-slate-900 font-semibold text-[15px] dark:text-slate-50"
              >
                {item.q}
                <ChevronDown size={16} className={`shrink-0 text-primary-600 dark:text-primary-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* Ответ всегда в разметке, раскрытие анимирует .pm-collapse —
                  раньше текст выпрыгивал мгновенно, пока стрелка ехала плавно. */}
              <div className={`pm-collapse ${isOpen ? 'is-open' : ''}`}>
                <div>
                  <p className="text-sm text-slate-600 pb-[18px] dark:text-slate-300">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[1%] top-1/2 hidden -translate-y-[49%] scale-x-[1.1] select-none font-question text-[clamp(560px,46vw,720px)] font-normal leading-[0.76] text-primary-600/[0.08] lg:block dark:text-primary-300/[0.11]"
      >
        ?
      </span>
    </Section>
  );
}
