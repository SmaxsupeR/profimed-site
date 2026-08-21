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
// Оба оттенка — вариации одного фирменного тила (не второй конкурирующий
// акцент), просто разная интенсивность.
const TINTS = [
  'from-primary-100 via-primary-50 to-white dark:from-primary-900/50 dark:via-slate-800 dark:to-slate-800',
  'from-primary-50 via-white to-white dark:from-primary-950/40 dark:via-slate-800 dark:to-slate-800',
];

export function Doctors() {
  const { t } = useLang();
  return (
    <Section id="doctors" tone="raised">
      <SectionHeader eyebrow={t.doc.eyebrow} title={t.doc.title} description={t.doc.desc} />

      {/* Две колонки, не четыре — крупнее портрет, меньше похоже на
          дашборд с плитками. */}
      <div className="grid sm:grid-cols-2 gap-6 reveal-stagger">
        {DIRECTIONS.map(({ id, icon: Icon }, i) => {
          const bg = TINTS[i % TINTS.length];
          return (
            <Card key={id} hoverable className="overflow-hidden group">
              <div className={`relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br ${bg}`}>
                <div className="relative h-full flex items-center justify-center">
                  <Icon
                    size={72}
                    strokeWidth={1.1}
                    className="text-primary-600/60 dark:text-primary-400/60 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="absolute left-4 bottom-3.5 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500/80 dark:text-slate-400/80">
                  <Camera size={12} strokeWidth={1.75} />
                  {t.doc.photo}
                </span>
              </div>
              <div className="p-5">
                <p className="font-semibold text-slate-900 dark:text-slate-50">{t.dir[`d${i + 1}t`]}</p>
                <p className="text-sm text-slate-400 mt-1 dark:text-slate-500">{t.doc.note}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
