import { SplitSectionHeader } from 'profimed-site';

// Редакторский header «заголовок слева / описание(+действия) справа» —
// Doctors/About/Timeline. Превью проверяет: перенос длинного описания,
// поведение actions при нехватке ширины (переносятся под текст, не сжимают
// его), и что title/description принимают не только строку, а любой
// ReactNode (About передаёт массив <span> построчно).

export const Basic = () => (
  <SplitSectionHeader
    eyebrow="Врачи клиники"
    title="Команда, которой доверяют"
    description="Карточки врачей заполним из CRM — здесь появятся реальные фото, имена и стаж каждого специалиста."
  />
);

export const WithActions = () => (
  <SplitSectionHeader
    eyebrow="Врачи клиники"
    title="Команда, которой доверяют"
    description="Карточки врачей заполним из CRM — здесь появятся реальные фото, имена и стаж каждого специалиста."
    actions={
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" aria-label="Назад" style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #cbd5e1' }}>←</button>
        <button type="button" aria-label="Далее" style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #cbd5e1' }}>→</button>
      </div>
    }
  />
);

export const LongDescriptionWithActions = () => (
  <SplitSectionHeader
    eyebrow="Оториноларингология"
    title="Лечение уха, горла и носа"
    description="Длинное описание специально проверяет граничную ширину ~1024–1120px: если тексту не хватает места рядом с actions, они переносятся под него отдельной строкой, а не сжимают описание до нечитаемой колонки."
    actions={
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" aria-label="Назад" style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #cbd5e1' }}>←</button>
        <button type="button" aria-label="Далее" style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #cbd5e1' }}>→</button>
      </div>
    }
  />
);
