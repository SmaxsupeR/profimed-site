import { CheckCircle2 } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

export function About() {
  const { t } = useLang();
  const cards = [1, 2, 3].map((n) => ({
    n, k: t.about[`a${n}k`], title: t.about[`a${n}t`], text: t.about[`a${n}x`],
  }));
  const equip = [t.equip.e1, t.equip.e2, t.equip.e3, t.equip.e4];

  return (
    <div className="relative overflow-hidden bg-primary-50 border-y border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
      <div className="pm-hatch absolute inset-0 opacity-70 pointer-events-none" />
      <div className="relative">
        <Section>
          <SectionHeader eyebrow={t.about.eyebrow} title={t.about.title} />
          <p className="text-slate-600 max-w-[36em] -mt-6 mb-10 dark:text-slate-300">{t.about.sub}</p>
          <div className="grid sm:grid-cols-3 gap-5 reveal-stagger">
            {cards.map((c) => (
              <Card key={c.n} hoverable className="p-6">
                <div className="flex items-baseline justify-between gap-3 mb-3.5">
                  <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold dark:text-primary-400">{c.k}</p>
                  <span className="font-display text-primary-400 text-[26px] leading-none dark:text-primary-600">0{c.n}</span>
                </div>
                <h3 className="font-display text-xl text-slate-900 mb-2 dark:text-white">{c.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">{c.text}</p>
              </Card>
            ))}
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold mt-10 mb-3 dark:text-slate-300">
            {t.equip.title}
          </p>
          <div className="flex flex-wrap gap-3 reveal-stagger">
            {equip.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 transition-colors hover:border-primary-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary-500"
              >
                <CheckCircle2 size={15} className="text-primary-600 dark:text-primary-400" />
                {item}
              </span>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
