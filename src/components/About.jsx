import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

export function About() {
  const { t } = useLang();
  const items = [1, 2, 3].map((n) => ({
    n, k: t.about[`a${n}k`], title: t.about[`a${n}t`], text: t.about[`a${n}x`],
  }));
  const equip = [t.equip.e1, t.equip.e2, t.equip.e3, t.equip.e4];

  return (
    <div className="bg-primary-50 border-y border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <PhotoPlaceholder className="aspect-[4/5] w-full" />

          <div>
            <SectionHeader eyebrow={t.about.eyebrow} title={t.about.title} />
            <p className="text-slate-600 max-w-[36em] -mt-6 mb-8 dark:text-slate-300">{t.about.sub}</p>

            <div className="border-t border-slate-200 dark:border-slate-700 reveal-stagger">
              {items.map((it) => (
                <div key={it.n} className="border-b border-slate-200 py-5 dark:border-slate-700">
                  <p className="text-xs font-medium text-primary-600 tracking-[0.08em] mb-1.5 dark:text-primary-400">{it.k}</p>
                  <h3 className="font-semibold text-slate-900 mb-1 dark:text-white">{it.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">{it.text}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-500 mt-6 dark:text-slate-400">
              <span className="text-slate-700 dark:text-slate-300">{t.equip.title}:</span> {equip.join(' · ')}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
