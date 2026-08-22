import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

// Пока нет реальной съёмки, это честный плейсхолдер (тот же компонент, что
// на Hero/About), не готовый профиль врача — направление стоит вместо имени,
// заметка прямо говорит, что имя и стаж придут из CRM. Действие записи —
// маленькая вторичная ссылка, а не кнопка: пока это плейсхолдер, а не
// законченная карточка специалиста, ей рано быть главным элементом ряда.
export function Doctors({ onPick }) {
  const { t } = useLang();
  return (
    <Section id="doctors" tone="raised">
      <SectionHeader eyebrow={t.doc.eyebrow} title={t.doc.title} description={t.doc.desc} />

      {/* Две колонки, не четыре — крупнее портрет, меньше похоже на
          дашборд с плитками. */}
      <div className="grid sm:grid-cols-2 gap-6 reveal-stagger">
        {DIRECTIONS.map(({ id }, i) => (
          <div key={id}>
            <PhotoPlaceholder label={t.doc.photo} className="aspect-[3/4] w-full mb-3.5" />
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold dark:text-slate-400">{t.dir[`d${i + 1}t`]}</p>
                <p className="text-sm text-slate-400 mt-0.5 dark:text-slate-500">{t.doc.note}</p>
              </div>
              {onPick && (
                <button
                  type="button"
                  onClick={() => onPick(id)}
                  className="shrink-0 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                >
                  {t.dir.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
