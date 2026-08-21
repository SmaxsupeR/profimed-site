import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';

export function Faq() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section>
      <SectionHeader eyebrow={t.faq.eyebrow} title={t.faq.title} />
      <div className="grid gap-2.5 max-w-[46em] reveal-stagger">
        {t.faq.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-colors hover:border-primary-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-primary-500">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full text-left border-0 bg-transparent px-5 py-4 flex items-center justify-between gap-3 cursor-pointer text-slate-900 font-semibold text-[15px] dark:text-white"
              >
                {item.q}
                <ChevronDown size={16} className={`shrink-0 text-primary-600 dark:text-primary-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* Ответ всегда в разметке, раскрытие анимирует .pm-collapse —
                  раньше текст выпрыгивал мгновенно, пока стрелка ехала плавно. */}
              <div className={`pm-collapse ${isOpen ? 'is-open' : ''}`}>
                <div>
                  <p className="text-sm text-slate-600 px-5 pb-4.5 dark:text-slate-300">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
