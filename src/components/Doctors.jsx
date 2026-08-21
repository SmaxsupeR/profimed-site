import { Camera } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

// Пока нет реальной съёмки, карточка врача — не серый прямоугольник с
// фотоаппаратом (четыре одинаковых подряд превращали блок в мёртвую зону),
// а плитка направления: крупная иконка на фирменном градиенте. Честность
// сохраняется подписью «фото врача» и заметкой «имя и стаж — из CRM»:
// карточка не притворяется заполненной, но и не выглядит поломкой.
//
// Оттенки чередуют два фирменных цвета — новых в палитру не вводим.
const TINTS = [
  {
    bg: 'from-primary-100 via-primary-50 to-white dark:from-primary-900/50 dark:via-slate-800 dark:to-slate-800',
    icon: 'text-primary-600/70 dark:text-primary-400/70',
  },
  {
    bg: 'from-leaf-100 via-leaf-50 to-white dark:from-leaf-900/40 dark:via-slate-800 dark:to-slate-800',
    icon: 'text-leaf-700/70 dark:text-leaf-400/70',
  },
];

export function Doctors() {
  const { t } = useLang();
  return (
    <Section id="doctors" tone="raised">
      <SectionHeader eyebrow={t.doc.eyebrow} title={t.doc.title} description={t.doc.desc} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
        {DIRECTIONS.map(({ id, icon: Icon }, i) => {
          const tint = TINTS[i % TINTS.length];
          return (
            <Card key={id} hoverable className="overflow-hidden group">
              <div className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br ${tint.bg}`}>
                <div className="relative h-full flex items-center justify-center">
                  <Icon
                    size={72}
                    strokeWidth={1.1}
                    className={`${tint.icon} transition-transform duration-500 group-hover:scale-110`}
                  />
                </div>
                <span className="absolute left-4 bottom-3.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500/80 dark:text-slate-400/80">
                  <Camera size={12} strokeWidth={1.75} />
                  {t.doc.photo}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1 dark:text-primary-400">{t.dir[`d${i + 1}t`]}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">{t.doc.note}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
