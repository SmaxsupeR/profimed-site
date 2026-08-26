import { DOCTORS } from '../data/doctors.js';
import { useLang } from '../i18n/LangContext.jsx';

// Единая точка сборки записи врача из data/doctors.js (структурные поля —
// slug, directionId, category…) и dict.js (переводимый текст — имя, роль).
// Раньше это собиралось прямо внутри Doctors.jsx; вынесено в хук, как
// только у врача появилась своя страница (DoctorPage.jsx) — тот же расчёт
// нужен уже в двух местах, и держать его в одном компоненте означало бы
// либо дублировать, либо тянуть DoctorPage через пропсы Doctors.jsx.
//
// routeSlug — не то же самое, что doctor.slug из data-слоя. slug там
// осознанно пустой у неверифицированных записей (см. комментарий в
// data/doctors.js — выдумывать его нельзя, это факт из CRM). Но карточка
// всё равно должна на что-то ссылаться уже сейчас, до CRM: routeSlug
// подставляет directionId как временный сегмент адреса — это не выдуманное
// имя врача, а честная ссылка вида /doctors/ent на «карточку ЛОР-врача,
// пока без имени», и когда появится реальный slug, просто станет им.
export function useDoctors() {
  const { t } = useLang();

  return DOCTORS.map((doc, i) => {
    const factLine = [doc.category, doc.experienceYears ? `${doc.experienceYears} ${t.doc.yearsLabel ?? ''}`.trim() : null]
      .filter(Boolean)
      .join(' · ') || null;

    return {
      ...doc,
      routeSlug: doc.slug ?? doc.directionId,
      directionTitle: t.dir[`d${i + 1}t`],
      name: t.doc[`d${i + 1}Name`] ?? null,
      role: t.doc[`d${i + 1}Role`] ?? null,
      factLine,
    };
  });
}
